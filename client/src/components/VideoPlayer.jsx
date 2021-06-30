import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { SocketContext } from '../SocketContext';

const useStyles = makeStyles((theme) => ({
    video: {
        width: '100vw',
        height: '92vh',
        [theme.breakpoints.down('xs')]: {
            width: '300px',
        },
    },
    typography: {
        zIndex: '1000',
        position: 'absolute',
        left: '20vw',
        background: '#6264a7',
        padding: '5px 5px'
    },
    gridContainer: {
        justifyContent: 'center',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
        },
    },
}));

const VideoPlayer = () => {
    const { name, callAccepted, myVideo, userVideo, callEnded, stream, call, callUser } = useContext(SocketContext);
    const getState = useLocation();
    if (getState.state.joinName) {
        console.log(getState.state.joinName.joinName);
        console.log(getState.state.idToCall.idToCall);
        callUser(getState.state.idToCall.idToCall);
    }
    const classes = useStyles();
    // getState.state.hostName.hostName
    return (
        <Grid>
            {/* Our own video */}
            {
                stream && (
                    <Grid item xs={12} md={6}>
                        <Typography className={classes.typography} variant='h5' gutterBottom>{'Name'}</Typography>
                        <video playsInline muted ref={myVideo} autoPlay className={classes.video} />
                    </Grid>
                )
            }

            {/* Other user's video */}
            {
                callAccepted && !callEnded && (
                    <Grid item xs={12} md={6}>
                        <Typography className={classes.typography} variant='h5' gutterBottom>{call.name || 'Name'}</Typography>
                        <video playsInline ref={userVideo} autoPlay className={classes.video} />
                    </Grid>
                )
            }

        </Grid>
    );
};

export default VideoPlayer;
