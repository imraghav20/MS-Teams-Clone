import React, { useContext } from 'react';
import { Typography, AppBar, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import CallForm from './components/CallForm';
import CallSettings from './components/CallSettings';
import Notifications from './components/Notifications';
import Chat from './components/Chat';

import { SocketContext } from './SocketContext';

const useStyles = makeStyles((theme) => ({
    appBar: {
        padding: '10px',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        border: '2px solid black',
        background: '#0a0a0a',

        [theme.breakpoints.down('xs')]: {
            width: '90%',
        },
    },
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
        background: '#6264a7',
        padding: '5px 5px'
    },
}))

const App = () => {
    const classes = useStyles();
    const { name, callAccepted, callStarted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext);

    return (
        <div>
            <AppBar className={classes.appBar} position="static">
                <Typography variant="h6" align="center" fontFamily="Open Sans">Microsoft Teams Clone</Typography>
            </AppBar>
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
                    !callAccepted && !callStarted && (<Grid container xs={6} direction='column' justify='center'>
                        <CallForm />
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
            <CallSettings />
            <Notifications />
        </div>
    );
};

export default App;
