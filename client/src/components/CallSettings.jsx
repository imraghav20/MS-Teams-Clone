import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, IconButton, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { VideocamOff, Videocam, Mic, MicOff, ScreenShare, StopScreenShare, PanTool, Chat, People, PhoneDisabled, Assignment } from '@material-ui/icons';
import PanToolOutlinedIcon from '@material-ui/icons/PanToolOutlined';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { SocketContext } from '../SocketContext';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        margin: 'auto',
        width: 'fit-content'
    },
    appBar: {
        top: 'auto',
        background: '#0a0a0a',
        width: 'fit-content',
        alignItems: 'center',
        position: 'inherit',
        border: '1px solid white',
    },
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [
            theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
}));

const CallSettings = () => {
    const classes = useStyles();
    const { callStarted, stream, leaveCall, myVideo, videoStream, connectionRef, chatVisibility, setChatVisibility, participantsVisible, setParticipantsVisible } = useContext(SocketContext);
    const [videoOn, setVideoOn] = useState(true);
    const [audioOn, setAudioOn] = useState(true);
    const [shareScreen, setShareScreen] = useState(false);
    const [shareStream, setShareStream] = useState(null);  // to keep track of screen sharing stream
    const [handRaised, setHandRaised] = useState(false);

    // turn off camera
    const offCamera = () => {
        var vidTrack = stream.getVideoTracks();
        vidTrack.forEach(track => track.enabled = false);
    }

    // turn on camera
    const onCamera = () => {
        var vidTrack = stream.getVideoTracks();
        vidTrack.forEach(track => track.enabled = true);
    }

    // turn off mic
    const offMic = () => {
        var audTrack = stream.getAudioTracks();
        audTrack.forEach(track => track.enabled = false);
    }

    // turn on mic
    const onMic = () => {
        var audTrack = stream.getAudioTracks();
        audTrack.forEach(track => track.enabled = true);
    }

    // share user screen
    const shareUserScreen = () => {
        navigator.mediaDevices.getDisplayMedia({ cursor: true })
            .then((currentStream) => {
                setShareStream(currentStream);

                // replace video track in peer stream with screen sharing stream track
                if (connectionRef.current) {
                    connectionRef.current.replaceTrack(stream.getTracks()[1], currentStream.getTracks()[0], stream);
                }

                // replace video for own user
                myVideo.current.srcObject = currentStream;
                setShareScreen(true);

                currentStream.getTracks()[0].onended = () => {
                    stopSharingScreen();
                }
            });
    }

    // stop screen sharing
    const stopSharingScreen = () => {
        if (connectionRef.current) {
            connectionRef.current.replaceTrack(stream.getTracks()[1], videoStream.getTracks()[1], stream);
        }
        myVideo.current.srcObject = videoStream;

        if (shareStream) {
            shareStream.getTracks()[0].stop();
        }

        setShareScreen(false);
    }

    const handleHand = () => {
        setHandRaised(!handRaised);
    }

    const showParticipants = () => {
        setParticipantsVisible(!participantsVisible);
        setChatVisibility(false);
    }

    const showChats = () => {
        setChatVisibility(!chatVisibility);
        setParticipantsVisible(false);
    }

    return (
        <div className={classes.wrapper}>
            <AppBar className={classes.appBar} position='fixed'>
                <Toolbar>
                    {
                        videoOn && (
                            <Tooltip title='Turn Camera Off'>
                                <IconButton onClick={() => { setVideoOn(false); offCamera(); }}>
                                    <VideocamOff fontSize="large" style={{ fill: "white" }} />
                                </IconButton>
                            </Tooltip>
                        )
                    }
                    {
                        !videoOn && (
                            <Tooltip title='Turn Camera On'>
                                <IconButton onClick={() => { setVideoOn(true); onCamera(); }}>
                                    <Videocam fontSize="large" style={{ fill: "white" }} />
                                </IconButton>
                            </Tooltip>
                        )
                    }
                    {
                        audioOn && (
                            <Tooltip title='Turn Mic Off'>
                                <IconButton onClick={() => { setAudioOn(false); offMic(); }}>
                                    <MicOff fontSize="large" style={{ fill: "white" }} />
                                </IconButton>
                            </Tooltip>
                        )
                    }
                    {
                        !audioOn && (
                            <Tooltip title='Turn Mic On'>
                                <IconButton onClick={() => { setAudioOn(true); onMic(); }}>
                                    <Mic fontSize="large" style={{ fill: "white" }} />
                                </IconButton>
                            </Tooltip>
                        )
                    }
                    {
                        callStarted && (
                            <div>
                                {
                                    !shareScreen && (
                                        <Tooltip title='Share Your Screen'>
                                            <IconButton onClick={() => { shareUserScreen(); }}>
                                                <ScreenShare fontSize="large" style={{ fill: "white" }} />
                                            </IconButton>
                                        </Tooltip>
                                    )
                                }
                                {
                                    shareScreen && (
                                        <Tooltip title='Stop Sharing'>
                                            <IconButton onClick={() => { stopSharingScreen(); }}>
                                                <StopScreenShare fontSize="large" style={{ fill: "white" }} />
                                            </IconButton>
                                        </Tooltip>
                                    )
                                }
                                <Tooltip title='Copy Meet Link'>
                                    <CopyToClipboard text={window.location.href}>
                                        <IconButton>
                                            <Assignment fontSize="large" style={{ fill: "white" }} />
                                        </IconButton>
                                    </CopyToClipboard>
                                </Tooltip>
                                {
                                    !handRaised && (
                                        <Tooltip title='Raise Hand'>
                                            <IconButton onClick={() => handleHand()}>
                                                <PanToolOutlinedIcon fontSize="large" style={{ fill: "white" }} />
                                            </IconButton>
                                        </Tooltip>
                                    )
                                }
                                {
                                    handRaised && (
                                        <Tooltip title='Lower Hand'>
                                            <IconButton onClick={() => handleHand()}>
                                                <PanTool fontSize="large" style={{ fill: "white" }} />
                                            </IconButton>
                                        </Tooltip>
                                    )
                                }
                                <Tooltip title='Show Conversation'>
                                    <IconButton onClick={() => { showChats() }}>
                                        <Chat fontSize="large" style={{ fill: "white" }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title='Show Participants'>
                                    <IconButton onClick={() => { showParticipants() }}>
                                        <People fontSize="large" style={{ fill: "white" }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title='Leave Call'>
                                    <IconButton onClick={leaveCall}>
                                        <PhoneDisabled fontSize="large" style={{ fill: "red" }} />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        )
                    }
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default CallSettings;
