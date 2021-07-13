import axios from 'axios';

const API = axios.create({baseURL: "https://video-chat-app-imraghav20.herokuapp.com/api"});

// add authentication token in request headers for the auth middleware
API.interceptors.request.use((req) => {
    if(localStorage.getItem("profile")){
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile")).token}`;
    }
    return req;
})

export const signUp = (formData) => API.post('/auth/register', formData);

export const signIn = (formData) => API.post('/auth/login', formData);

export const getConversations = () => API.get('/conversations');

export const createConversation = (newConvo) => API.post('/conversations', newConvo);

export const getUserConversation = (chatId) => API.get(`/conversations/${chatId}`);

export const sendMessage = (newMessage) => API.post('/messages', newMessage);

export const addConversation = (chatId) => API.post(`/users/${chatId}`);