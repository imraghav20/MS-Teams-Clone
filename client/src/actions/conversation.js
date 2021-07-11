import * as api from '../api/index.js';

const GET_ALL = "GET_ALL";
const CREATE = "CREATE";

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

