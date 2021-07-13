import React, { createContext, useState, useRef, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

import sound from './assets/ding.mp3';

import { addConversation } from './api/index';

const SocketContext = createContext();

// establish socket connection
const socket = io('https://video-chat-app-imraghav20.herokuapp.com/');
// const socket = io('http://localhost:5000/');

const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));   // current logged in user

    const [stream, setStream] = useState(null);  // media stream of user
    const [videoStream, setVideoStream] = useState(null);  // video stream of user to store and replace suring screen sharing
    const [me, setMe] = useState('');  // user socket id
    const [call, setCall] = useState({});  // current call
    const [callStarted, setCallStarted] = useState(false);  // track if call has started
    const [callJoined, setCallJoined] = useState(false);  // track if 2nd user has joined the call
    const [callAccepted, setCallAccepted] = useState(false);  // track if 1st user has accepted the call
    const [callEnded, setCallEnded] = useState(false);  // track if call has ended
    const [name, setName] = useState('');  // name of current user
    const [chatVisibility, setChatVisibility] = useState(false);  // is chat visible
    const [participantsVisible, setParticipantsVisible] = useState(false);  // are all participant names visible
    const [callFull, setCallFull] = useState(false);  // track if chat has reached it capacity (i.e. 2)

    const roomId = useRef(window.location.hash.replace('#/video-call/', ''));  // store current room Id
    const myVideo = useRef();  // stores reference to user video
    const userVideo = useRef();  // stores reference to other user's video
    const connectionRef = useRef();  // stores the peer-to-peer connection
    const messageRef = useRef([]);  // stores the chat messages
    const participantsRef = useRef([]);  // stores the participants names
    const audio = useRef(new Audio(sound));  // audio that plays on chat notification

    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
        // check if user is logged in
        const token = user?.token;
        if (!token) {
            history.push('/auth');
            setUser(null);
        }
        else {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then((currentStream) => {
                    setStream(currentStream);

                    // setting media stream of user
                    myVideo.current.srcObject = currentStream;
                    setVideoStream(currentStream);
                });

            setName(user.result.name);
            participantsRef.current.push(user.result.name);

            addConversation(roomId.current);  // adding the conversationID of this room to the user's database 
            // if not already present using the API

            socket.on('me', (id) => {
                setMe(id);
            });

            // on receiving a call
            socket.on('callUser', ({ from, name: callerName, signal }) => {
                setCall({ isReceivedCall: true, from, name: callerName, signal });
            });

            // when call is ended by other user
            socket.on("callEnded", () => {
                // restore everything to default state
                connectionRef.current = null;
                if (participantsRef.current.length > 1) {
                    participantsRef.current.splice(1, 1);
                }
                setCallEnded(true);
                setCall({});
                setCallAccepted(false);
                setCallJoined(false);
                setCallStarted(true);
                setCallEnded(false);
            });
        }
    }, [location, history, user.result.name, user?.token]);

    // when user clicks on join call button
    const startCall = () => {
        socket.emit('user-wants-to-join', roomId.current);

        socket.on("join-response", num => {

            if (num === 0) {
                setCallFull(false);
                setCallStarted(true);
                socket.emit("user-joined", { userId: me, roomId: roomId.current });
            }

            if (num === 1) {
                setCallFull(false);
                socket.emit("other-user-id", roomId.current);
                socket.on("other-user", otherUserId => {
                    setCallStarted(true);
                    setCallJoined(true);
                    callUser(otherUserId);
                });
            }

            if (num >= 2) {
                console.log(num);
                setCallFull(true);
            }
        });
    }

    // answering call of other user
    const answerCall = () => {
        setCallAccepted(true);

        // establishing a peer-to-peer connection
        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on('signal', (data) => {
            socket.emit("user-joined", { userId: call.from, roomId: roomId.current });
            socket.emit('answerCall', { signal: data, to: call.from, from: name });
            messageRef.current.push(
                { text: call.name + " joined the chat." }
            );
            participantsRef.current.push(call.name);
            audio.current.play();
        });

        // getting other users video
        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        // receiving chat message
        peer.on('data', (data) => {
            let str = new TextDecoder("utf-8").decode(data);
            let obj = JSON.parse(str);
            messageRef.current.push(obj);
            setChatVisibility(false);
            setChatVisibility(true);
            audio.current.play();
        });

        peer.signal(call.signal);
        connectionRef.current = peer;
    };

    // calling other user using his socket id
    const callUser = (id) => {
        // establishing a peer-to-peer connection
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on('signal', (data) => {
            socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
        });

        // getting other users video
        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        // receiving chat message
        peer.on('data', (data) => {
            let str = new TextDecoder("utf-8").decode(data);
            let obj = JSON.parse(str);
            messageRef.current.push(obj);
            setChatVisibility(false);
            setChatVisibility(true);
            audio.current.play();
        });

        // when the 1st user accepts the call
        socket.on('callAccepted', (data) => {
            setCallAccepted(true);
            const signal = data.signal;
            const hostName = data.name;
            const from = data.from;
            setCall({ isReceivedCall: false, from, name: hostName, signal });
            participantsRef.current.push(hostName);
            peer.signal(data.signal);
        });

        connectionRef.current = peer;
    };

    // ending the call
    const leaveCall = () => {
        setCallEnded(true);

        if (connectionRef.current) {
            connectionRef.current.destroy();
        }

        window.location.reload();
    };

    // sending required states and references to various components
    return (
        <SocketContext.Provider value={{
            call,
            callAccepted,
            callStarted,
            setCallStarted,
            callJoined,
            callFull,
            setCallJoined,
            myVideo,
            userVideo,
            connectionRef,
            messageRef,
            participantsRef,
            stream,
            videoStream,
            chatVisibility,
            setChatVisibility,
            participantsVisible,
            setParticipantsVisible,
            name,
            setName,
            callEnded,
            me,
            startCall,
            callUser,
            leaveCall,
            answerCall
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export { ContextProvider, SocketContext };