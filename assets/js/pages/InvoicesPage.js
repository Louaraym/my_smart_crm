import React, {useEffect, useState} from 'react';
import Pagination from  '../components/Pagination';
import invoicesAPI from "../services/invoicesAPI";
import moment from 'moment';
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import ThreeDots from "../components/loaders/ThreeDots";

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger"
};

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
};

const InvoicesPage = () => {

    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

    const fetchInvoices =  async () => {
        try {
            const data = await invoicesAPI.findAll();
            setInvoices(data);
            setLoading(false);
        } catch(e){
            toast.error("Erreur lors du chargement des factures!")
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const  handlePageChange = page => setCurrentPage(page);

    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    const handleDelete = async id => {
        const originalInvoices = [...invoices];
        setInvoices(invoices.filter(customer => customer.id !== id));
        try {
            await invoicesAPI.delete(id)
            toast.success("La facture à bien été supprimée !");
        } catch (e) {
            toast.error("La suppression n'a pas pu se faite suite à une erreur !")
            setInvoices(originalInvoices);
        }
    };

    const filteredInvoices = invoices.filter(i =>
        i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
        i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
        i.amount.toString().startsWith(search.toLowerCase()) ||
        STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    );

    const formatDate = (str) => moment(str).format("DD/MM/YYYY");
    const paginatedInvoices = Pagination.getData(filteredInvoices, currentPage, itemsPerPage);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h1 className="text-center">Liste des factures</h1>
                <Link to="/invoices/new" className="btn btn-primary" >Créer une facture</Link>
            </div>
            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher ..."/>
            </div>
            <table className="table table-hover">
                <thead className="text-center">
                <tr>
                    <th>Numéro</th>
                    <th>Client</th>
                    <th>Date d'envoi</th>
                    <th>Statut</th>
                    <th>Montant</th>
                    <th>Actions</th>
                </tr>
                </thead>
                { !loading && (<tbody className="text-center">
                {paginatedInvoices.map(invoice =>
                    <tr key={invoice.id}>
                        <td>{invoice.invoiceNumber}</td>
                        <td>
                            <Link to={"/customers/" + invoice.customer.id } >
                                {invoice.customer.firstName} {invoice.customer.lastName}
                            </Link>
                        </td>
                        <td>{formatDate(invoice.sentAt)}</td>
                        <td>
                            <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>
                                {STATUS_LABELS[invoice.status]}
                            </span>
                        </td>
                        <td>{invoice.amount.toLocaleString()} €</td>
                        <td>
                            <Link to={"/invoices/" + invoice.id} className="btn btn-sm btn-primary mr-1">
                                Editer
                            </Link>
                            <button
                                onClick={() => handleDelete(invoice.id)}
                                className="btn btn-sm btn-danger"
                            >
                                Supprimer
                            </button>
                        </td>
                    </tr>
                )}
                </tbody>)}
            </table>
            { loading && <ThreeDots /> }
            {itemsPerPage < filteredInvoices.length &&
            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                length={filteredInvoices.length}
                onPageChanged={handlePageChange}
            />}
        </>
    )
};


export default InvoicesPage;