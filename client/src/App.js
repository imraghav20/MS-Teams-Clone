import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import TopBar from './components/TopBar';

import Auth from './views/Auth';
import Home from './views/Home';
import Chat from './views/Chat';

import { ContextProvider } from './SocketContext';

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <TopBar />
                <Switch>
                    <Route path='/video-call/:id' exact>
                        <ContextProvider>
                            <Home />
                        </ContextProvider>
                    </Route>
                    <Route path='/auth' exact component={Auth} />
                    <Route path='/' exact component={Chat} />
                </Switch>
            </BrowserRouter>
        </div>
    );
};

export default App;
