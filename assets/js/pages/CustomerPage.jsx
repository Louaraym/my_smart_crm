import React, {useEffect, useState} from 'react';
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import customersAPI from "../services/customersAPI";
import {toast} from "react-toastify";

const CustomerPage = ({match, history}) => {

    const {id= "new"} = match.params;

    const [customer, setCustomer] = useState({
        firstName: "",
        lastName: "",
        email: "",
        company: ""
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        company: ""
    });

    const [editing, setEditing] = useState(false);

    const fetchCustomer =  async (id) => {
        try {
            const {firstName, lastName, email, company} = await customersAPI.find(id);
            setCustomer({firstName, lastName, email, company})
        }catch (e) {
            toast.error("Impossible de charger le client demandé !");
            history.replace("/customers");
        }
    };

    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);

    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setCustomer({...customer, [name]: value });
    };

    const handleSubmit = async event => {
        event.preventDefault();
        try {
            setErrors({});
            if (editing) {
                await customersAPI.update(id, customer);
                toast.success("Modification éfféctuée avec succès")
            }else {
                await customersAPI.create(customer);
                history.replace("/customers");
                toast.success("Le client a bien été ajouté !")
            }
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
            {(!editing && <h1 className="text-center">Création d'un nouveau client</h1>) ||
            (<h1 className="text-center">Modification d'un client</h1>)}
            <form className="text-center" onSubmit={handleSubmit}>
                <Field
                    label="Prénom"
                    placeholder="Prénom du client"
                    name='firstName'
                    value={customer.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                />
                <Field
                    label="Nom"
                    placeholder="Nom du client"
                    name='lastName'
                    value={customer.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                />
                <Field
                    label="Email"
                    placeholder="Email du client"
                    name='email'
                    type="email"
                    value={customer.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <Field
                    label="Entreprise"
                    placeholder="Entreprise du client"
                    name='company'
                    value={customer.company}
                    onChange={handleChange}
                    error={errors.company}
                />
                <div className="form-group">
                    {(!editing && <button type="submit" className="btn btn-success">Créer</button>) ||
                    (<button type="submit" className="btn btn-success">Editer</button>)}
                    <Link to="/customers" className="btn btn-link" >Retour à la liste</Link>
                </div>
            </form>
        </>
    )
};

export default CustomerPage;