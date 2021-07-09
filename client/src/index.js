import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import App from './App';
import { ContextProvider } from './SocketContext';
import './styles.css';

import { reducers } from './reducers';

const store = createStore(reducers, compose(applyMiddleware(thunk)));

ReactDOM.render(
    // <ContextProvider>
    <Provider store={store}>
        <App />
    </Provider>,
    // </ContextProvider>,
    document.getElementById('root')
);

