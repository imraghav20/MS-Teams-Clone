import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, IconButton, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { VideocamOff, Videocam, Mic, MicOff, ScreenShare, StopScreenShare, Info, PanTool, Chat, People, PhoneDisabled } from '@material-ui/icons';

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
    const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);
    const [videoOn, setVideoOn] = useState(false);
    const [audioOn, setAudioOn] = useState(false);
    const [shareScreen, setShareScreen] = useState(false);
    return (
        <div>
            <AppBar className={classes.appBar} position='fixed'>
                <Toolbar>
                    {
                        videoOn && (
                            <Tooltip title='Turn Camera Off'>
                                <IconButton onClick={() => setVideoOn(false)}>
                                    <VideocamOff fontSize="large" style={{ fill: "white" }} />
                                </IconButton>
                            </Tooltip>
                        )
                    }
                    {
                        !videoOn && (
                            <Tooltip title='Turn Camera On'>
                                <IconButton onClick={() => setVideoOn(true)}>
                                    <Videocam fontSize="large" style={{ fill: "white" }} />
                                </IconButton>
                            </Tooltip>
                        )
                    }
                    {
                        audioOn && (
                            <Tooltip title='Turn Mic Off'>
                                <IconButton onClick={() => setAudioOn(false)}>
                                    <MicOff fontSize="large" style={{ fill: "white" }} />
                                </IconButton>
                            </Tooltip>
                        )
                    }
                    {
                        !audioOn && (
                            <Tooltip title='Turn Mic On'>
                                <IconButton onClick={() => setAudioOn(true)}>
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
                    <Tooltip title='Show Meet Info'>
                        <IconButton>
                            <Info fontSize="large" style={{ fill: "white" }} />
                        </IconButton>
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
