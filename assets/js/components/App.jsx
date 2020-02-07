import React from 'react';
import {HashRouter, Switch, Route} from "react-router-dom";
import Navbar from "./Navbar";
import HomePage from "../pages/HomePage";

const App = () => {
    return (
            <HashRouter>
                <Navbar />
                <main className="container pt-5">
                    <Switch>
                        <Route path="/" component={HomePage} exact />
                    </Switch>
                </main>
            </HashRouter>
    )
};

export default App