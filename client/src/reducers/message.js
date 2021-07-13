const SEND = "SEND";

// messageReducer to handle sending messages call
const messageReducer = (state = [], action) => {
    switch(action.type) {
        case SEND:
            return [...state, action.payload];
        default:
            return state;
    }
}

export default messageReducer;