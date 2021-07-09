import React, { useState, useEffect } from 'react';
import { Typography, AppBar, Grid, Toolbar, Avatar, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';

import ms_teams_logo_white from '../assets/ms_teams_logo_white.png';

const useStyles = makeStyles((theme) => ({
    appBar: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        border: '2px solid black',
        background: '#0a0a0a',
    },
    brand: {
        display: 'flex',
        alignItems: 'center'
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    profile: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '400px',
    },
    userName: {
        display: 'flex',
        alignItems: 'center',
    },
    purple: {
        color: 'black',
        backgroundColor: '#6264a7',
    },
}));

const TopBar = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const classes = useStyles();

    const logout = () => {
        dispatch({ type: "LOGOUT" });

        history.push('/auth');

        setUser(null);
    };

    useEffect(() => {
        const token = user?.token;
        if (token) {
            const decodedToken = decode(token);
            if (decodedToken.exp * 1000 < new Date().getTime()) logout();
        }
        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    return (
        <div>
            <AppBar className={classes.appBar} position="static">
                <Grid container direction="row">
                    <Grid item xs={12} md={6}>
                        <div className={classes.brand}>
                            <img src={ms_teams_logo_white} alt="icon" height="60" />
                            <Typography variant="h6" fontFamily="Open Sans">Microsoft Teams Clone</Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Toolbar className={classes.toolbar}>
                            {user?.result ? (
                                <div className={classes.profile}>
                                    <Avatar className={classes.purple} >{user?.result.name.charAt(0)}</Avatar>
                                    <Typography className={classes.userName} variant="h6">{user?.result.name}</Typography>
                                    <Button variant="contained" className={classes.logout} color="primary" onClick={logout}>Logout</Button>
                                </div>
                            ) : (
                                <Button component={Link} to="/auth" variant="contained" color="primary">Sign In</Button>
                            )}
                        </Toolbar>
                    </Grid>
                </Grid>
            </AppBar>
        </div>
    );
};

export default TopBar;
