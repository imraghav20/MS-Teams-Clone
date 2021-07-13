import React, { useContext } from 'react';
import { Avatar, Paper } from '@material-ui/core';
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
        overflow: 'auto'
    },
    participant: {
        display: 'flex',
        padding: '10px',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#eeeeee'
        }
    },
    purple: {
        color: 'black',
        backgroundColor: '#6264a7'
    },
    userName: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '12px',
        fontFamily: 'sans-serif'
    }
}))

const Participants = () => {
    const { participantsRef, participantsVisible } = useContext(SocketContext);

    const classes = useStyles();

    return (
        <div>
            {
                participantsVisible && (
                    <Paper className={classes.paper}>
                        {
                            participantsRef.current.map((name) => (
                                <div className={classes.participant}>
                                    <Avatar className={classes.purple} >{name.charAt(0)}</Avatar>
                                    <p className={classes.userName} >{name}</p>
                                </div>
                            ))
                        }
                    </Paper>
                )
            }
        </div>
    )
}

export default Participants
