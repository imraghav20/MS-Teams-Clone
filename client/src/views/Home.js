import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ms_teams_logo_white from '../assets/ms_teams_logo_white.png';

import CallForm from '../components/CallForm';

const useStyles = makeStyles((theme) => ({
    body: {
        background: '#6264a7',
        height: '100vh',
        width: '100vw',
    },
    inner: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '100%'
    },
    typography: {
        color: '#ffffff'
    }
}));

const App = () => {
    const classes = useStyles();
    return (
        <div className={classes.body}>
            <div className={classes.inner}>
                <Grid container xs={12} direction='row'>
                    <Grid container xs={6} direction='row'>
                        <Grid item xs={5}>
                            <img src={ms_teams_logo_white} />
                        </Grid>
                        <Grid container xs={7} direction='column' justify='center'>
                            <Grid>
                                <Typography variant='h3' className={classes.typography}>Microsoft Teams</Typography>
                                <Typography variant='h3' className={classes.typography}>Clone</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container xs={6} direction='column' justify='center'>
                        <CallForm/>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default App;
