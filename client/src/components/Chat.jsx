import React, { useContext } from 'react';
import { Tooltip, IconButton, Paper, TextField } from '@material-ui/core';
import { Send } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { SocketContext } from '../SocketContext';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: '10px',
        height: '85vh',
        width: '20vw',
        border: '1px solid black',
        zIndex: '3000',
        position: 'absolute',
        top: '10vh',
        right: '0',
    },
    messageField: {
        width: '78%'
    },
    chatContainer: {
        height: '78vh',
        overflowY: 'auto'
    },
    message: {
        width: '60%',
        padding: '5px',
        margin: '5px',
        border: '1px solid black',
        borderRadius: '5px'
    },
    left: {
        float: 'left',
        clear: 'both',
        backgroundColor: 'white',
    },
    right: {
        float: 'right',
        clear: 'both',
        backgroundColor: '#6264a7',
        color: 'white'
    },
    middle: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '5px',
        marginTop: '5px',
        textAlign: 'center',
        clear: 'both',
        backgroundColor: 'lightblue'
    }
}));

const Chat = () => {
    const { chatVisibility } = useContext(SocketContext);
    const classes = useStyles();
    return (
        <div>
            {
                chatVisibility && (
                    <Paper className={classes.paper}>
                        <div id="chat-container" className={classes.chatContainer}>
                            <div className={[classes.message, classes.middle].join(' ')}>Hi! How are you?</div>
                        </div>
                        <form action='#' autoComplete="off">
                            <TextField label="Type Message" name="messageInp" id="messageInp" className={classes.messageField} />
                            <Tooltip title='Send Message'>
                                <IconButton type='submit' color='primary' onClick={(e) => { e.preventDefault(); }}>
                                    <Send fontSize="large" />
                                </IconButton>
                            </Tooltip>
                        </form>
                    </Paper>
                )
            }
        </div>
    );
};

export default Chat;
