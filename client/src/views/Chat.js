import React, { useEffect } from 'react';
import { Typography, Button, TextField, Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { Send } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { getUserConversations } from '../actions/conversation';

import Conversation from '../components/Conversation';
import Message from '../components/Message';
import ChatTopBar from '../components/ChatTopBar';

const useStyles = makeStyles((theme) => ({
    messenger: {
        height: 'calc(100vh - 68px)',
        display: 'flex',
    },

    chatMenu: {
        flex: '2.5',
        backgroundColor: '#eeeeee'
    },

    chatMenuTopBar: {
        backgroundColor: '#6264a7',
        padding: '12px',
        color: '#eeeeee',
        borderRight: '1px solid white'
    },

    conversationWrapper: {
        overflowY: 'auto',
        height: '80vh'
    },

    chatBox: {
        flex: '5.5',
        backgroundColor: '#ffffff'
    },

    chatBoxWrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        height: '100 %',
    },

    chatBoxTop: {
        height: '68vh',
        overflowY: 'auto',
        padding: '10px'
    },

    chatBoxBottom: {
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    }

}))

const Chat = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUserConversations());
    }, [dispatch]);

    const conversations = useSelector((state) => state.conversation);
    console.log(conversations);

    return (
        <div className={classes.messenger}>
            <div className={classes.chatMenu}>
                <div className={classes.chatMenuTopBar}>
                    <Typography variant='h6'>Your Chats</Typography>
                </div>
                <div className={classes.conversationWrapper}>
                </div>
            </div>
            <div className={classes.chatBox}>
                <div className={classes.chatBoxWrapper}>
                    <ChatTopBar />
                    <div className={classes.chatBoxTop}>
                    </div>
                    <div className={classes.chatBoxBottom}>
                        <Grid container direction='row'>
                            <Grid item xs={9}>
                                <TextField label="Type your message..." fullWidth />
                            </Grid>
                            <Grid item xs={1}>

                            </Grid>
                            <Grid item xs={2}>
                                <Button type='submit' variant="contained" color="primary" onClick={(e) => { e.preventDefault(); }} startIcon={<Send fontSize="large" />} style={{ marginTop: 10 }} fullWidth>
                                    Send
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
