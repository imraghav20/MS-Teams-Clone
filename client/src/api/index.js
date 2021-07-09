import axios from 'axios';

const API = axios.create({baseURL: "http://localhost:5000/api"});

export const signUp = (formData) => API.post('/auth/register', formData);

export const signIn = (formData) => API.post('/auth/login', formData);
