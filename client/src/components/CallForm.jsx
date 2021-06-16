import React, { useContext, useState } from 'react';
import { Button, TextField, Typography, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Assignment, Phone } from '@material-ui/icons';

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
    const classes = useStyles();

    return (
        <div>
            <Paper elevation={10} className={classes.paper}>
                <form className={classes.root} noValidate autoComplete="off">
                    <Grid container direction='row' align='center' justify='center' alignItems='center'>
                        <Grid item xs={5}>
                            <TextField label='Name' required fullWidth />
                        </Grid>
                        <Grid item xs={3}>
                            <Button variant="contained" color="primary" startIcon={<Phone fontSize="large" />} className={classes.margin}>
                                Start Call
                            </Button>
                        </Grid>
                        <Grid item xs={4}>
                            <CopyToClipboard text="Hello" className={classes.margin}>
                                <Button variant='contained' color='primary' startIcon={<Assignment fontSize="large" />}>
                                    Copy Call ID
                                </Button>
                            </CopyToClipboard>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <Typography variant='h6' align='center' className={classes.typography}>OR</Typography>

            <Paper elevation={10} className={classes.paper}>
                <form className={classes.root} noValidate autoComplete="off">
                    <Grid container direction='row' align='center' justify='center' alignItems='center'>
                        <Grid item xs={8}>
                            <TextField label='Call ID' required fullWidth />
                        </Grid>
                        <Grid item xs={1}>

                        </Grid>
                        <Grid item xs={3}>
                            <Button variant="contained" color="primary" startIcon={<Phone fontSize="large" />} className={classes.margin}>
                                Start Call
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </div>
    );
};

export default CallForm;
