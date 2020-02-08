import React, {useState} from 'react';
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import usersAPI from "../services/usersAPI";
import {toast} from "react-toastify";

const RegisterPage =({history}) => {
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setUser({...user, [name]: value });
    };

    const handleSubmit = async event => {
        event.preventDefault();

        try {
            await usersAPI.create(user);
            setErrors({});
            toast.success("Inscription éffectuée avec succès, vous pouvez vous connecté maintenant !");
            history.replace("/login");
        }catch ({response}) {
            const {violations} = response.data;
            if(violations){
                const apiErrors = {};
                violations.map(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
            }
        }
    };

    return (
        <>
            <h1 className="text-center">Inscription</h1>
            <form className="text-center" onSubmit={handleSubmit}>
                <Field
                    label="Prénom"
                    value={user.firstName}
                    onChange={handleChange}
                    name='firstName'
                    error={errors.firstName}
                />
                <Field
                    label="Nom de famille"
                    value={user.lastName}
                    onChange={handleChange}
                    name='lastName'
                    error={errors.lastName}
                />
                <Field
                    label="Adresse email"
                    value={user.email}
                    onChange={handleChange}
                    type="email"
                    name='email'
                    error={errors.email}
                />
                <Field
                    label="Mot de passe"
                    value={user.password}
                    onChange={handleChange}
                    type="password"
                    name='password'
                    error={errors.password}
                />
                <Field
                    label="Confirmation Mot de passe"
                    value={user.passwordConfirm}
                    onChange={handleChange}
                    type="password"
                    name='passwordConfirm'
                    error={errors.passwordConfirm}
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">S'inscrire</button>
                    <Link to="/login" className="btn btn-link" >J'ai déjà un compte</Link>
                </div>
            </form>
        </>
    )
};

export default RegisterPage;