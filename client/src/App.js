import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';

import TopBar from './components/TopBar';

import Auth from './views/Auth';
import VideoCall from './views/VideoCall';
import Chat from './views/Chat';

import { ContextProvider } from './SocketContext';

const App = () => {
    return (
        <div>
            <HashRouter>
                <TopBar />
                <Switch>
                    {/* routing to various views */}
                    <Route path='/video-call/:id' exact>
                        <ContextProvider>
                            <VideoCall />
                        </ContextProvider>
                    </Route>
                    <Route path='/auth' exact component={Auth} />
                    <Route path='/' exact component={Chat} />
                </Switch>
            </HashRouter>
        </div>
    );
};

export default App;
