import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, IconButton, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { VideocamOff, Videocam, Mic, MicOff, ScreenShare, StopScreenShare, PanTool, Chat, People, PhoneDisabled, Assignment } from '@material-ui/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { SocketContext } from '../SocketContext';

const useStyles = makeStyles((theme) => ({
    appBar: {
        top: 'auto',
        bottom: '16px',
        left: '25%',
        background: '#0a0a0a',
        width: '50%',
        alignItems: 'center',
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
    const { me, stream, leaveCall } = useContext(SocketContext);
    const [videoOn, setVideoOn] = useState(true);
    const [audioOn, setAudioOn] = useState(true);
    const [shareScreen, setShareScreen] = useState(false);

    const offCamera = () => {
        var vidTrack = stream.getVideoTracks();
        vidTrack.forEach(track => track.enabled = false);
    }

    const onCamera = () => {
        var vidTrack = stream.getVideoTracks();
        vidTrack.forEach(track => track.enabled = true);
    }

    const offMic = () => {
        var audTrack = stream.getAudioTracks();
        audTrack.forEach(track => track.enabled = false);
    }

    const onMic = () => {
        var audTrack = stream.getAudioTracks();
        audTrack.forEach(track => track.enabled = true);
    }

    return (
        <div>
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
                        !shareScreen && (
                            <Tooltip title='Share Your Screen'>
                                <IconButton onClick={() => setShareScreen(true)}>
                                    <ScreenShare fontSize="large" style={{ fill: "white" }} />
                                </IconButton>
                            </Tooltip>
                        )
                    }
                    {
                        shareScreen && (
                            <Tooltip title='Stop Sharing'>
                                <IconButton onClick={() => setShareScreen(false)}>
                                    <StopScreenShare fontSize="large" style={{ fill: "white" }} />
                                </IconButton>
                            </Tooltip>
                        )
                    }
                    <Tooltip title='Copy Meet ID'>
                        <CopyToClipboard text={me}>
                            <IconButton>
                                <Assignment fontSize="large" style={{ fill: "white" }} />
                            </IconButton>
                        </CopyToClipboard>
                    </Tooltip>
                    <Tooltip title='Raise Hand'>
                        <IconButton>
                            <PanTool fontSize="large" style={{ fill: "white" }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Show Conversation'>
                        <IconButton>
                            <Chat fontSize="large" style={{ fill: "white" }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Show Participants'>
                        <IconButton>
                            <People fontSize="large" style={{ fill: "white" }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Leave Call'>
                        <IconButton onClick={leaveCall}>
                            <PhoneDisabled fontSize="large" style={{ fill: "red" }} />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default CallSettings;
