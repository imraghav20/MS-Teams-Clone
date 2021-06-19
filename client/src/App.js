import React from 'react';

import Home from './views/Home';
import VideoChat from './views/VideoChat';

import { Route, Link } from 'react-router-dom';

const App = () => {
    return (
        <div>
            <Route exact path="/" component={Home} />
            <Route exact path="/video-call" component={VideoChat} />
        </div>
    );
};

export default App;
