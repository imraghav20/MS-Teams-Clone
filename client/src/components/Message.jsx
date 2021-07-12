import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { format } from "timeago.js";

const useStyles = makeStyles((theme) => ({
    message: {
        maxWidth: '60%',
        padding: '10px 20px',
        margin: '5px',
        border: '1px solid black',
        borderRadius: '5px',
        fontFamily: 'sans-serif'
    },
    left: {
        float: 'left',
        clear: 'both',
        backgroundColor: '#eeeeee',
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
    },
    userName: {
        fontWeight: 'bold'
    },
    time: {
        fontSize: '12px',
        textAlign: 'right'
    }
}))

const Message = ({msg}) => {
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('profile'));
    const direction = user?.result._id === msg.senderId ? classes.right : classes.left;
    return (
        <div className={[classes.message, direction].join(' ')}>
            <div className={classes.userName}>{msg.senderName}</div>
            <p>{msg.text}</p>
            <div className={classes.time}>{format(msg.createdAt)}</div>
        </div>
    );
};

export default Message;
