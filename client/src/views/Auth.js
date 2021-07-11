import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import Input from '../components/Input';

import { signin, signup } from '../actions/auth';

const useStyles = makeStyles((theme) => ({
    body: {
        background: '#6264a7',
        height: '100vh',
        width: '100vw',
        position: 'fixed'
    },
    paper: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(2),
    },
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: '#6264a7',
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    googleButton: {
        marginBottom: theme.spacing(2),
    }
}));

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
    const classes = useStyles();
    const [formData, setFormData] = useState(initialState);
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSignUp) {
            dispatch(signup(formData, history))
        }
        else {
            dispatch(signin(formData, history))
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    };

    const handleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const switchMode = () => {
        setIsSignUp((prevIsSignUp) => !prevIsSignUp);
    };

    return (
        <div>
            <div>
                <Container component="main" maxWidth="xs">
                    <Paper className={classes.paper} elevation={3}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography variant="h5">{isSignUp ? 'Sign Up' : 'Sign In'}</Typography>
                        <form autoComplete="off" className={classes.form} onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                {
                                    isSignUp && (
                                        <>
                                            <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus />
                                            <Input name="lastName" label="Last Name" handleChange={handleChange} />
                                        </>
                                    )
                                }
                                <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                                <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                                {isSignUp && (
                                    <Input name="confirmPassword" label="Confirm Password" handleChange={handleChange} type="password" />
                                )}
                            </Grid>
                            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                                {isSignUp ? "Sign Up" : "Sign In"}
                            </Button>
                            <Grid container justify="center">
                                <Grid item>
                                    <Button onClick={switchMode} style={{ textTransform: 'none' }}>
                                        {isSignUp ? "Already have an account? Sign in." : "Don't have an account? Sign up."}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Container>
            </div>
        </div>
    );
};

export default Auth;
