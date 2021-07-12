import React, { createContext, useState, useRef, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

import sound from './assets/ding.mp3';

import { addConversation } from './api/index';

const SocketContext = createContext();

// const socket = io('https://video-chat-app-imraghav20.herokuapp.com/');
const socket = io('http://localhost:5000/');

const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

    const [stream, setStream] = useState(null);
    const [videoStream, setVideoStream] = useState(null);
    const [me, setMe] = useState('');
    const [call, setCall] = useState({});
    const [callStarted, setCallStarted] = useState(false);
    const [callJoined, setCallJoined] = useState(false);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState('');
    const [chatVisibility, setChatVisibility] = useState(false);
    const [callFull, setCallFull] = useState(false);

    const roomId = useRef(window.location.pathname.replace('/video-call/', ''));
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    const messageRef = useRef([]);
    const audio = useRef(new Audio(sound));

    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
        const token = user?.token;
        if (!token) {
            history.push('/auth');
            setUser(null);
        }
        else {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then((currentStream) => {
                    setStream(currentStream);

                    myVideo.current.srcObject = currentStream;
                    setVideoStream(currentStream);
                });
            
            setName(user.result.name);

            const res = addConversation(roomId.current);

            socket.on('me', (id) => {
                setMe(id);
            });

            socket.on('callUser', ({ from, name: callerName, signal }) => {
                setCall({ isReceivedCall: true, from, name: callerName, signal });
            });
        }
    }, [location]);

    const startCall = () => {
        socket.emit('user-wants-to-join', roomId.current);
        
        socket.on("join-response", num => {

            if(num === 0){
                setCallFull(false);
                setCallStarted(true);
                socket.emit("user-joined", {userId: me, roomId: roomId.current});
            }

            if(num === 1){
                setCallFull(false);
                socket.emit("other-user-id", roomId.current);
                socket.on("other-user", otherUserId => {
                    setCallStarted(true);
                    setCallJoined(true);
                    callUser(otherUserId);
                });
            }

            if(num >= 2){
                console.log(num);
                setCallFull(true);
            }
        });
    }

    const answerCall = () => {
        setCallAccepted(true);

        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on('signal', (data) => {
            socket.emit("user-joined", {userId: call.from, roomId: roomId.current});
            socket.emit('answerCall', { signal: data, to: call.from, from: name });
            messageRef.current.push(
                { text: call.name + " joined the chat." }
            );
            audio.current.play();
        });

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

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

    const callUser = (id) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on('signal', (data) => {
            socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
        });

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        peer.on('data', (data) => {
            let str = new TextDecoder("utf-8").decode(data);
            let obj = JSON.parse(str);
            messageRef.current.push(obj);
            setChatVisibility(false);
            setChatVisibility(true);
            audio.current.play();
        });

        socket.on('callAccepted', (data) => {
            setCallAccepted(true);
            const signal = data.signal;
            const hostName = data.name;
            const from = data.from;
            setCall({ isReceivedCall: false, from, name: hostName, signal });
            peer.signal(data.signal);
        });

        connectionRef.current = peer;
    };

    const leaveCall = () => {
        setCallEnded(true);

        if(connectionRef.current){
            connectionRef.current.destroy();
        }

        window.location.reload();
    };

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
            stream,
            videoStream,
            chatVisibility,
            setChatVisibility,
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