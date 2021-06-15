import React from 'react';
import { Typography, AppBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import VideoPlayer from './components/VideoPlayer';
import Notifications from './components/Notifications';
import Options from './components/Options';
import CallSettings from './components/CallSettings';

const useStyles = makeStyles((theme) => ({
    appBar: {
        padding: '10px',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        border: '2px solid black',
        background: '#0a0a0a',

        [theme.breakpoints.down('xs')]: {
            width: '90%',
        },
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    },
}))

const App = () => {
    const classes = useStyles();

    return (
        <div className={classes.wrapper}>
            <AppBar className={classes.appBar} position="static">
                <Typography variant="h6" align="center" fontFamily="Open Sans">Microsoft Teams Clone</Typography>
            </AppBar>
            <VideoPlayer />
            <CallSettings />
            <Options>
                <Notifications />
            </Options>
        </div>
    );
};

export default App;
