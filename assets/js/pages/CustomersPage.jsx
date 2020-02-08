import React, {useEffect, useState} from 'react';
import Pagination from  '../components/Pagination';
import customersAPI from "../services/customersAPI";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import ThreeDots from "../components/loaders/ThreeDots";

const  CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

    const fetchCustomers =  async () => {
        try {
            const data = await customersAPI.findAll();
            setCustomers(data);
            setLoading(false);
        } catch(e){
            toast.error("Impossible de charger la liste des clients !");
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleDelete = async id => {
        const originalCustomers = [...customers];
        setCustomers(customers.filter(customer => customer.id !== id));

        try {
            await customersAPI.delete(id);
            toast.success("Le client a bien été supprimé !")
        } catch (e) {
            toast.error("Impossible de supprimer le client !");
            setCustomers(originalCustomers);
        }
    };

    const  handlePageChange = page => setCurrentPage(page);

    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    const filteredCustomers = customers.filter(c =>
        c.firstName.toLowerCase().includes(search.toLowerCase()) ||
        c.lastName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.company.toLowerCase().includes(search.toLowerCase())
    );

    const paginatedCustomers = Pagination.getData(filteredCustomers, currentPage, itemsPerPage);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h1>Liste des clients</h1>
                <Link to="/customers/new" className="btn btn-primary" >Créer un client</Link>
            </div>
            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher ..."/>
            </div>
            <table className="table table-hover">
                <thead className="text-center">
                <tr>
                    <th>Id.</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th>Factures</th>
                    <th>Montant Total</th>
                    <th>Actions</th>
                </tr>
                </thead>
                {!loading && (<tbody className="text-center">
                {paginatedCustomers.map(customer =>
                    <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>
                            <Link to={"/customers/" + customer.id } >
                                {customer.firstName} {customer.lastName}
                            </Link>
                        </td>
                        <td>{customer.email}</td>
                        <td>{customer.company}</td>
                        <td>
                            <span className="badge badge-primary">{customer.invoices.length}</span>
                        </td>
                        <td>{customer.totalAmount.toLocaleString()} €</td>
                        <td>
                            <Link to={"/customers/" + customer.id } className="btn btn-sm btn-primary mr-1">
                                Editer
                            </Link>
                            <button
                                onClick={() => handleDelete(customer.id)}
                                className="btn btn-sm btn-danger"
                                disabled={customer.invoices.length >0}
                            >
                                Supprimer
                            </button>
                        </td>
                    </tr>
                )}
                </tbody> )}
            </table>
            { loading && <ThreeDots /> }
            {itemsPerPage < filteredCustomers.length &&
            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                length={filteredCustomers.length}
                onPageChanged={handlePageChange}
            />}
        </>
    )
};

export default CustomersPage;