import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Paper, Typography, Grid, Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { createConversation } from '../actions/conversation';

const useStyles = makeStyles((theme) => ({
    container: {
        backgroundColor: '#6264a7',
        color: '#ffffff',
        padding: '10px'
    },
    button: {
        margin: '0px 4px'
    }
}))

const ChatTopBar = ({ convoName, chatId }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formData, setFormData] = useState({
        conversationName: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createConversation(formData));
        setFormData({ ...formData, conversationName: "" });
    }

    const redirectToVideo = () => {
        const win = window.open('/video-call/' + chatId);
        win.focus();
    }

    return (
        <div>
            <div className={classes.container}>
                <Grid container>
                    <Grid item xs={7}>
                        <Typography variant='h6'>
                            {convoName}
                        </Typography>
                    </Grid>
                    <Grid item xs={1}>

                    </Grid>
                    <Grid item xs={4}>
                        <Button className={classes.button} variant='contained' onClick={redirectToVideo}>Join Call</Button>
                        <Button className={classes.button} variant='contained' onClick={() => setIsFormVisible(!isFormVisible)}>New Meeting</Button>
                    </Grid>
                </Grid>
            </div>
            {
                isFormVisible && (
                    <form autoComplete="off">
                        <Paper style={{ marginTop: '10px' }}>
                            <Grid container spacing={2} justify="center">
                                <Grid item xs={7}>
                                    <TextField name="conversationName" required value={formData.conversationName} label="Meeting name" fullWidth onChange={(e) => setFormData({ ...formData, conversationName: e.target.value })} />
                                </Grid>
                                <Grid item xs={3}>
                                    <Button type="submit" color="primary" className={classes.button} variant='contained' style={{ marginTop: '10px' }} onClick={handleSubmit}>Start Call</Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </form>
                )
            }
        </div>
    );
};

export default ChatTopBar;
