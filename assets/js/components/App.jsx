import React, {useState} from 'react';
import {HashRouter, Switch, Route, withRouter} from "react-router-dom";
import Navbar from "./Navbar";
import HomePage from "../pages/HomePage";
import CustomersPage from "../pages/CustomersPage";
import CustomerPage from "../pages/CustomerPage";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from "../pages/LoginPage";
import AuthContext from "../contexts/AuthContext";
import PrivateRoute from "./PrivateRoute";
import authAPI from "../services/authAPI";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(authAPI.isAuthenticated());
    const NavbarWithRouter = withRouter(Navbar);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated
        }}>
            <HashRouter>
                <NavbarWithRouter />
                <main className="container pt-5">
                    <Switch>
                        <Route path="/login" component={LoginPage} />
                        <PrivateRoute path="/customers/:id" component={CustomerPage} />
                        <PrivateRoute path="/customers" component={CustomersPage} />
                        <Route path="/" component={HomePage} exact />
                    </Switch>
                </main>
            </HashRouter>
            <ToastContainer position={ toast.POSITION.TOP_CENTER} />
        </AuthContext.Provider>
    );
};

export default App