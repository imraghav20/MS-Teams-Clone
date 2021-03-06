import * as api from '../api/index.js';

const SEND = "SEND";
// dispatch action type and data to messageReducer
export const sendMessage = (msg) => async (dispatch) => {
    try {
        const { data } = await api.sendMessage(msg);
        dispatch({ type: SEND, payload: data });
    } catch (error) {
        console.log(error);
    }
}