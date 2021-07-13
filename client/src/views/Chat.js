import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Typography, Button, TextField, Grid, Paper } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { Send } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { getUserConversations, getConversation, createConversation } from '../actions/conversation';
import { sendMessage } from '../actions/message';

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
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        // check if user is logged in
        const token = user?.token;
        if (!token) {
            history.push('/auth');
            setUser(null);
        }
    }, [user?.token, history]);

    useEffect(() => {
        // get all user conversations via API call
        dispatch(getUserConversations());
        localStorage.removeItem("currentChat");
    }, [dispatch]);

    const conversations = useSelector((state) => state.conversation);

    const [currentChatId, setCurrentChatId] = useState("");  // selected conversation id
    const [flag, setFlag] = useState(false);  // keep track if currentChatId state has loaded or not

    useEffect(() => {
        // get all messages of the conversation via API
        const getMessages = async () => {
            try {
                setFlag(false);
                dispatch(getConversation(currentChatId))
                .then(() => {
                    const chat =  JSON.parse(localStorage.getItem('currentChat'));
                    if(chat.conversation){
                        setFlag(true);
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }
        getMessages();
    }, [dispatch, currentChatId]);

    const conversation = JSON.parse(localStorage.getItem('currentChat'));

    const [msg, setMsg] = useState("");

    // sending message data
    const formMsgData = {
        message: msg,
        convoId: JSON.parse(localStorage.getItem('currentChat'))?.conversation?._id
    }

    // create new conversation data
    const [formCallData, setFormCallData] = useState({
        conversationName: ""
    });

    // create new call / conversation
    const handleCallSubmit = (e) => {
        e.preventDefault();
        dispatch(createConversation(formCallData));
    }

    // send message
    const handleMessageSubmit = (e) => {
        e.preventDefault();
        dispatch(sendMessage(formMsgData));
        setMsg("");
    }

    return (
        <div className={classes.messenger}>
            <div className={classes.chatMenu}>
                <div className={classes.chatMenuTopBar}>
                    <Typography variant='h6'>Your Chats</Typography>
                </div>
                <div className={classes.conversationWrapper}>
                    {
                        !conversations.length ? (
                            <div>
                                <Typography align='center' variant='h6'>You have no chats to show</Typography>
                            </div>
                        )
                            : (
                                conversations.map((convo) => (
                                    <div onClick={() => { setCurrentChatId(convo._id); }}>
                                        <Conversation key={convo._id} conversation={convo} />
                                    </div>))
                            )
                    }
                </div>
            </div>
            <div className={classes.chatBox}>
                <div className={classes.chatBoxWrapper}>
                    {
                        !flag ? <div></div>
                            : (<ChatTopBar convoName={conversation.conversation ? conversation.conversation.conversationName : ""} chatId={currentChatId}/>)
                    }
                    <div className={classes.chatBoxTop}>
                        {
                            !currentChatId ? (
                                <div>
                                    <Typography align='center' variant='h6'>Select a Chat to view messages.</Typography>
                                    <form autoComplete="off">
                                        <Paper style={{ marginTop: '10px' }}>
                                            <Grid container spacing={2} justify="center">
                                                <Grid item xs={7}>
                                                    <TextField name="conversationName" required value={formCallData.conversationName} label="Meeting name" fullWidth onChange={(e) => setFormCallData({ ...formCallData, conversationName: e.target.value })} />
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Button type="submit" color="primary" className={classes.button} variant='contained' style={{ marginTop: '10px' }} onClick={handleCallSubmit}>Start Call</Button>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </form>
                                </div>)
                                : (
                                    <div>
                                        {
                                            (!flag || !conversation.messages || !conversation.messages.length) ? <></>
                                                : (
                                                    conversation.messages.map((msg) => (
                                                        <Message msg={msg} />
                                                    ))
                                                )
                                        }
                                    </div>
                                )
                        }
                    </div>
                    {
                        (!flag || !currentChatId) ? <div></div>
                            : (
                                <div className={classes.chatBoxBottom}>
                                    <Grid container direction='row'>
                                        <Grid item xs={9}>
                                            <TextField label="Type your message..." fullWidth value={formMsgData.message} onChange={(e) => setMsg(e.target.value)} />
                                        </Grid>
                                        <Grid item xs={1}>

                                        </Grid>
                                        <Grid item xs={2}>
                                            <Button type='submit' variant="contained" color="primary" onClick={handleMessageSubmit} startIcon={<Send fontSize="large" />} style={{ marginTop: 10 }} fullWidth>
                                                Send
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </div>
                            )
                    }
                </div>
            </div>
        </div>
    );
};

export default Chat;
