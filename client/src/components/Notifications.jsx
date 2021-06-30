import React, { useContext } from 'react';
import { Button, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { SocketContext } from '../SocketContext';

const useStyles = makeStyles((theme) => ({
    notification: {
        zIndex: '2000',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    paper: {
        display: 'flex',
        justifyContent: 'center',
        padding: '10px'
    }
}));

const Notifications = () => {
    const { answerCall, call, callAccepted } = useContext(SocketContext);
    const classes = useStyles();
    return (
        <div className={classes.notification}>
            {call.isReceivedCall && !callAccepted && (
                <Paper className={classes.paper}>
                    <h1>{call.name} is calling: &nbsp; &nbsp; &nbsp;</h1>
                    <Button variant="contained" color="primary" onClick={answerCall}>
                        Answer
                    </Button>
                </Paper>
            )}
        </div>
    );
};

export default Notifications;
