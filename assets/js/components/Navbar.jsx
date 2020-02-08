import React, {useContext} from 'react';
import {NavLink} from "react-router-dom";
import authAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";
import {toast} from "react-toastify";

const Navbar = ({history}) => {

    const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);

    const handleLogout = () => {
        authAPI.logOut();
        setIsAuthenticated(false);
        toast.info("Vous êtes bien déconnecté !");
        history.replace("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="#">Mysmartcrm</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor03"
                    aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarColor03">
                <ul className="navbar-nav mr-auto">
                    { (isAuthenticated && (
                        <>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/customers">Clients</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/invoices">Factures</NavLink>
                    </li>
                        </>
                    ))}
                </ul>
                <ul className="navbar-nav ml-auto">
                    { (!isAuthenticated && (
                        <>
                    <li className="nav-item active">
                        <NavLink className="btn btn-success mr-2" to="/login">Connexion</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="btn btn-primary mr-2" to="/register">Inscription</NavLink>
                    </li>
                        </>
                    )) || (
                    <li className="nav-item">
                        <button  className="btn btn-danger" onClick={handleLogout} >
                            Déconnexion
                        </button>
                    </li>
                    )}
                </ul>
            </div>
        </nav>
    )
};

export default Navbar;