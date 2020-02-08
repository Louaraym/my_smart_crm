import React, {useContext, useState} from 'react';
import authAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Field";
import {toast} from "react-toastify";

const LoginPage = ({ history}) => {

    const [error, setError] = useState("");
    const {setIsAuthenticated} = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "sebastien24@live.com",
        password: "password"
    });

    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setCredentials({...credentials, [name]: value });
    };

    const handleSubmit = async event => {
        event.preventDefault();
        try {
            await authAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            toast.success("Vous êtes bien connecté !");
            history.replace("/");
        } catch (error) {
            setError("Vos identifiants sont incorrects ou inexistants !")
        }
    };

    return (
        <>
            <h1 className="text-center">Connexion</h1>
            <form className="text-center" onSubmit={handleSubmit}>
                <Field
                    label="Adresse email"
                    value={credentials.username}
                    onChange={handleChange}
                    type="email"
                    name='username'
                    error={error}
                />
                <Field
                    label="Mot de passe"
                    value={credentials.password}
                    onChange={handleChange}
                    type="password"
                    name='password'
                    error={error}
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Se connecter</button>
                </div>
            </form>
        </>
    )
};

export default LoginPage;