import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import chat_icon from '../assets/chat_icon.png';

const useStyles = makeStyles((theme) => ({
    conversation: {
        display: 'flex',
        backgroundColor: '#eeeeee',
        alignItems: 'center',
        padding: '10px',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#ffffff'
        }
    },

    conversationImg: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        objectFit: 'cover',
        marginRight: '20px'
    },

    conversationName: {
        fontWeight: 'bold'
    }
}))

const Conversation = () => {
    const classes = useStyles();
    return (
        <div className={classes.conversation}>
            <img className={classes.conversationImg} src={chat_icon} />
            <span className={classes.conversationName}>Engage 1:1 Abhishek</span>
        </div>
    );
};

export default Conversation;
