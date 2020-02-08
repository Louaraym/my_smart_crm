import '../css/app.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from "./components/App";
import authAPI from "./services/authAPI";

authAPI.setUp();

const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);