import React, { useContext, useState, useEffect } from 'react';
import { Tooltip, IconButton, Paper, TextField } from '@material-ui/core';
import { Send } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { SocketContext } from '../SocketContext';
import { getUserConversation } from '../api/index';

import Message from './Message';

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
        textAlign: 'center',
        clear: 'both',
        backgroundColor: 'lightblue'
    }
}));

const Chat = () => {
    const { chatVisibility, messageRef, connectionRef, name } = useContext(SocketContext);
    const classes = useStyles();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const getMessages = async () => {
            const chatId = window.location.pathname.replace('/video-call/', '');
            const chat = await getUserConversation(chatId);
            console.log(chat.data.messages);
            messageRef.current = chat.data.messages;
        }
        getMessages();
    }, []);

    const sendMessage = () => {
        if (message) {
            const date = new Date();

            const msg =  {
                text: message,
                senderName: name,
                senderId: JSON.parse(localStorage.getItem('profile')).result._id,
                createdAt: date.toISOString()
            }
            
            messageRef.current.push(msg);

            if (connectionRef.current) {
                // connectionRef.current.send(name + ": " + message);
                connectionRef.current.send(msg);
            }

            setMessage('');
        }
    }

    return (
        <div>
            {
                chatVisibility && (
                    <Paper className={classes.paper}>
                        <div id="chat-container" className={classes.chatContainer}>
                            {
                                messageRef.current.map((msg) => <Message msg={msg} />)
                            }
                        </div>
                        <form action='#' autoComplete="off">
                            <TextField label="Type Message" value={message} name="messageInp" id="messageInp" className={classes.messageField} onChange={(e) => setMessage(e.target.value)} />
                            <Tooltip title='Send Message'>
                                <IconButton type='submit' color='primary' onClick={(e) => { e.preventDefault(); sendMessage(); }}>
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
