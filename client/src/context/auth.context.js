import {createContext} from 'react';

function noob() {}

export const AuthContext = createContext({
    tokn: null,
    userId: null,
    login: noob,
    logout: noob,
    isAuthenticated: false
})