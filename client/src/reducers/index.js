import { combineReducers } from 'redux';

import auth from './auth';
import conversation from './conversation';

export const reducers = combineReducers({ auth, conversation });