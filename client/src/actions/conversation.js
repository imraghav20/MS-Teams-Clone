import * as api from '../api/index.js';

const GET_ALL = "GET_ALL";
const CREATE = "CREATE";
const GET_CONVO = "GET_CONVO";

export const getUserConversations = () => async (dispatch) => {
    try {
        const { data } = await api.getConversations();
        dispatch({ type: GET_ALL, payload: data });
    } catch (error) {
        console.log(error);
    }
}

export const createConversation = (convo) => async (dispatch) => {
    try {
        const { data } = await api.createConversation(convo);
        dispatch({ type: CREATE, payload: data });
    } catch (error) {
        console.log(error);
    }
}

export const getConversation = (chatId) => async (dispatch) => {
    try {
        const { data } = await api.getUserConversation(chatId);
        dispatch({ type: GET_CONVO, payload: data });
    } catch (error) {
        console.log(error);
    }
}