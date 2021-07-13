const CREATE = "CREATE";
const GET_ALL = "GET_ALL";
const GET_CONVO = "GET_CONVO";

// conversationReducer to handle various conversation API calls
const conversationReducer = (state = [], action) => {
    switch(action.type){
        case CREATE:
            return [...state, action.payload];
        case GET_ALL:
            return action.payload;
        case GET_CONVO:
            localStorage.setItem('currentChat', JSON.stringify({...action?.payload}));
            return state;
        default:
            return state;
    }
}

export default conversationReducer;