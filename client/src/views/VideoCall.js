import React, { useContext, useEffect, useState } from 'react';
import { Button, Typography, Grid } from '@material-ui/core';
import { Phone } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles';

import CallForm from '../components/CallForm';
import CallSettings from '../components/CallSettings';
import Notifications from '../components/Notifications';
import Chat from '../components/Chat';
import Participants from '../components/Participants';

import { SocketContext } from '../SocketContext';
import { getUserConversation } from '../api/index';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    },
    video: {
        width: '50vw',
        height: '78vh',
        border: '2px solid black',
        [theme.breakpoints.down('xs')]: {
            width: '300px',
        },
    },
    typography: {
        zIndex: '1000',
        position: 'absolute',
        border: '2px solid black',
        background: '#eeeeee',
        padding: '5px 5px'
    },
    button: {
        marginTop: 10,
        marginRight: 'auto',
        marginLeft: 'auto',
        width: 'fit-content'
    },
}))

const VideoCall = () => {
    const { name, callAccepted, callStarted, startCall, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext);
    const classes = useStyles();
    const [meetingName, setMeetingName] = useState("");

    useEffect(() => {
        const getMeetName = async () => {
            const roomId = window.location.hash.replace('#/video-call/', '');
            const chat = await getUserConversation(roomId);
            setMeetingName(chat.data.conversation.conversationName);
        }

        getMeetName();
    }, []);

    return (
        <div>
            <Grid container xs={12} direction='row' justify='center'>
                <Grid container xs={6}>
                    {
                        stream && (
                            <Grid item xs={12} md={6}>
                                <Typography className={classes.typography} variant='h5' gutterBottom>{name || 'Name'}</Typography>
                                <video playsInline muted ref={myVideo} autoPlay className={classes.video} />
                            </Grid>
                        )
                    }
                </Grid>
                {
                    !callAccepted && !callStarted && (<Grid container xs={6} direction='column' justify='center' align='center'>
                        <Typography variant='h4' gutterBottom>{meetingName}</Typography>
                        <Button variant="contained" onClick={() => { startCall() }} startIcon={<Phone fontSize="large" />} className={classes.button}>
                            Join Call
                        </Button>
                    </Grid>)
                }
                {
                    callAccepted && !callEnded && (
                        <Grid item xs={12} md={6}>
                            <Typography className={classes.typography} variant='h5' gutterBottom>{call.name || 'Name'}</Typography>
                            <video playsInline ref={userVideo} autoPlay className={classes.video} />
                        </Grid>
                    )
                }
            </Grid>
            <Chat />
            <Participants />
            <CallSettings />
            <Notifications />
        </div>
    );
};

export default VideoCall;
