import { combineReducers } from 'redux';

import auth from './auth';
import conversation from './conversation';
import message from './message';

export const reducers = combineReducers({ auth, conversation, message });