import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, TextField, Typography, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Phone } from '@material-ui/icons';

import { SocketContext } from '../SocketContext';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    gridContainer: {
        width: '100%',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
        },
    },
    container: {
        width: '600px',
        margin: '35px 0',
        padding: 0,
        [theme.breakpoints.down('xs')]: {
            width: '80%',
        },
    },
    margin: {
        marginTop: 10,
    },
    padding: {
        padding: 20,
    },
    paper: {
        margin: '10px 20px',
        padding: '10px 20px',
        border: '2px solid black',
    },
    typography: {
        color: '#ffffff'
    }
}));

const CallForm = () => {
    // const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);
    // const [idToCall, setIdToCall] = useState('');
    const [hostName, setHostName] = useState('');

    const classes = useStyles();

    return (
        <div>
            <Paper elevation={10} className={classes.paper}>
                <Typography variant='h5' align='center'>
                    Start a Call
                </Typography>
                <form className={classes.root} autoComplete="off">
                    <Grid container direction='row' align='center' justify='center' alignItems='center'>
                        <Grid item xs={8}>
                            <TextField label='Name' value={hostName} required fullWidth onChange={(e) => setHostName(e.target.value)} />
                        </Grid>
                        <Grid item xs={1}>

                        </Grid>
                        <Grid item xs={3}>
                            <Link to={{
                                pathname: "/video-call",
                                state: { hostName: {hostName} }
                            }}>
                                <Button type='submit' variant="contained" color="primary" startIcon={<Phone fontSize="large" />} fullWidth className={classes.margin}>
                                    Start Call
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <Typography variant='h6' align='center' className={classes.typography}>OR</Typography>

            <Paper elevation={10} className={classes.paper}>
                <Typography variant='h5' align='center'>
                    Join a Call
                </Typography>
                <form className={classes.root} autoComplete="off">
                    <TextField label='Name' required fullWidth />
                    <Grid container direction='row' align='center' justify='center' alignItems='center'>
                        <Grid item xs={8}>
                            <TextField label='Call ID' required fullWidth />
                        </Grid>
                        <Grid item xs={1}>

                        </Grid>
                        <Grid item xs={3}>
                            <Button type='submit' variant="contained" color="primary" startIcon={<Phone fontSize="large" />} fullWidth className={classes.margin}>
                                Join Call
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </div>
    );
};

export default CallForm;
