import axios from 'axios';
import jwtDecode from 'jwt-decode';
import {LOGIN_API} from "../config";

function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

function authenticate(credentials) {
    return axios
        .post(LOGIN_API, credentials)
        .then(response => response.data.token)
        .then(token => {
            window.localStorage.setItem("authToken", token);
            setAxiosToken(token);
        })
}

function logOut() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

function setUp() {
    const token =  window.localStorage.getItem("authToken");
    if (token){
        const {exp: expiration} = jwtDecode(token);
        if (expiration*1000 > new Date().getTime()){
            setAxiosToken(token)
        }
    }
}

function isAuthenticated() {
    const token =  window.localStorage.getItem("authToken");
    if (token){
        const {exp: expiration} = jwtDecode(token);
        return expiration * 1000 > new Date().getTime();
    }else {
        return false;
    }
}

export default {
    authenticate,
    logOut,
    setUp,
    isAuthenticated
}