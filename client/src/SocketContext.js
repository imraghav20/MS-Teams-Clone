import React, { createContext, useState, useRef, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

import sound from './assets/ding.mp3';

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

            socket.on('me', (id) => {
                setMe(id);
            });

            socket.on('callUser', ({ from, name: callerName, signal }) => {
                setCall({ isReceivedCall: true, from, name: callerName, signal });
            })
        }
    }, [location]);

    const answerCall = () => {
        setCallAccepted(true);

        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on('signal', (data) => {
            socket.emit('answerCall', { signal: data, to: call.from, from: name });
            messageRef.current.push(
                { message: call.name + " joined the chat.", position: "middle" }
            );
            audio.current.play();
        });

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        peer.on('data', (data) => {
            let str = new TextDecoder("utf-8").decode(data);
            messageRef.current.push(
                { message: str, position: "left" }
            );
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
            messageRef.current.push(
                { message: str, position: "left" }
            );
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

        connectionRef.current.destroy();

        window.location.reload();
    };

    return (
        <SocketContext.Provider value={{
            call,
            callAccepted,
            callStarted,
            setCallStarted,
            callJoined,
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
            callUser,
            leaveCall,
            answerCall
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export { ContextProvider, SocketContext };