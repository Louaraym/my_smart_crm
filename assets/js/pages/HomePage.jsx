import React, {useContext} from 'react';
import {Link, NavLink} from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

const HomePage = () => {
    const {isAuthenticated} = useContext(AuthContext);

    return (
        <div className="jumbotron  text-center">
            <h1 className="display-3">Bienvenue dans votre CRM</h1>
            { (!isAuthenticated && (
                <>
            <p className="lead">Vous dévez créer un compte pour pouvoir découvrir toutes les fonctionnalités offertes par ce CRM fictif.</p>
            <hr className="my-4"/>
                <p className="lead">
                    <NavLink className="btn btn-success btn-lg mr-2" to="/login">Connexion</NavLink>
                    <NavLink className="btn btn-primary btn-lg mr-2" to="/register">Inscription</NavLink>
                </p>
                </>
            )) || (
                <>
                <hr className="my-4"/>
                    <p className="lead">Ce CRM vous permet d'ajouter, modifier et supprimer des clients et aussi d'ajouter, modifier et supprime des factures pour chaque client</p>
                <p className="lead">
                    <Link to="/customers" className="btn btn-primary" >Gérer mes clients</Link>
                </p>
                </>
            )}
        </div>
    )
};

export default HomePage;