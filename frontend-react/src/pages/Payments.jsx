import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Row, Col, Card, Badge, Modal, Form } from 'react-bootstrap';
import { DollarSign, Search, Trash2, Plus, Download, TrendingUp, CreditCard, AlertTriangle, Calendar } from 'lucide-react';
import api from '../api/axios';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-hot-toast';
import Pagination from '../components/common/Pagination';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        memberId: '',
        amount: '',
        paymentMethod: 'cash',
        notes: ''
    });

    // Delete Confirmation State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchPayments = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get(`/payments?search=${search}&page=${page}&limit=${limit}`);
            const dataArr = response.data || [];
            setPayments(Array.isArray(dataArr) ? dataArr : []);
            setTotal(response.total || 0);
        } catch (err) {
            console.error('Failed to fetch payments');
            setPayments([]);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchPayments();
    };

    const handleCreatePayment = async (e) => {
        e.preventDefault();
        try {
            await api.post('/payments', formData);
            toast.success('Payment recorded!');
            setShowModal(false);
            setFormData({ memberId: '', amount: '', paymentMethod: 'cash', notes: '' });
            fetchPayments();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error recording payment');
        }
    };

    const confirmDelete = (id) => {
        setDeleteTargetId(id);
        setShowDeleteModal(true);
    };

    const handleDeletePayment = async () => {
        setDeleting(true);
        try {
            await api.delete(`/payments/${deleteTargetId}`);
            toast.success('Transaction removed.');
            setShowDeleteModal(false);
            fetchPayments();
        } catch (err) {
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="page-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
                <div>
                    <h1 className="fw-bold m-0 text-dark">Financial Ledger</h1>
                    <p className="text-secondary m-0">Track revenue and membership transactions.</p>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="primary" onClick={() => setShowModal(true)} className="d-flex align-items-center gap-2 fw-bold shadow-sm">
                        <Plus size={18} /> Record Payment
                    </Button>
                </div>
            </div>

            <Row className="g-4 mb-5">
                <Col md={4}>
                    <Card className="glass-card border-0 shadow-sm p-4 bg-primary text-white overflow-hidden position-relative">
                        <DollarSign className="position-absolute end-0 bottom-0 opacity-10 mb-n3 me-n3" size={150} />
                        <h6 className="small fw-bold text-uppercase opacity-75 mb-2">Total Ledger Value</h6>
                        <h2 className="fw-bold mb-0">${payments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0).toFixed(2)}</h2>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card className="glass-card border-0 shadow-sm p-4 h-100">
                        <Form onSubmit={handleSearch}>
                            <Row className="g-3">
                                <Col md={8}>
                                    <div className="position-relative">
                                        <Search className="position-absolute start-0 top-50 translate-middle-y ms-3 text-secondary" size={18} />
                                        <Form.Control 
                                            placeholder="Search by member..." 
                                            className="ps-5 py-2 border-light bg-light"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                </Col>
                                <Col md={4}><Button variant="outline-primary" type="submit" className="w-100 fw-bold py-2">Search</Button></Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>
            </Row>

            <Card className="glass-card overflow-hidden border-0 shadow-sm">
                <Table responsive borderless className="mb-0 glass-table">
                    <thead>
                        <tr className="text-secondary small border-bottom border-light">
                            <th className="py-4 ps-4">DATE</th>
                            <th className="py-4">MEMBER</th>
                            <th className="py-4">METHOD</th>
                            <th className="py-4">AMOUNT</th>
                            <th className="py-4 text-center">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            [...Array(limit)].map((_, i) => (
                                <tr key={i}><td colSpan="5"><Skeleton height={60} className="mb-2" /></td></tr>
                            ))
                        ) : (payments && payments.length > 0) ? (
                            payments.map((payment) => (
                                <tr key={payment.id} className="align-middle border-bottom border-light hover-bg-surface transition-all">
                                    <td className="ps-4 py-3">
                                        <div className="d-flex align-items-center gap-2">
                                            <Calendar size={14} className="text-secondary" />
                                            <span className="fw-medium text-dark">{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="fw-bold text-dark">{payment.memberName || 'Member'}</div>
                                        <small className="text-secondary">ID: #{payment.memberId}</small>
                                    </td>
                                    <td>
                                        <Badge bg="light" className="text-secondary border text-uppercase px-3 py-2 fw-normal">
                                            {payment.paymentMethod}
                                        </Badge>
                                    </td>
                                    <td>
                                        <div className="fw-bold text-success">${parseFloat(payment.amount || 0).toFixed(2)}</div>
                                    </td>
                                    <td className="text-center">
                                        <Button variant="light" size="sm" className="text-danger border shadow-sm" onClick={() => confirmDelete(payment.id)}>
                                            <Trash2 size={16} />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="text-center py-5 text-secondary">No financial records.</td></tr>
                        )}
                    </tbody>
                </Table>
            </Card>

            <Pagination total={total} limit={limit} activePage={page} onPageChange={setPage} />

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">Record Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form onSubmit={handleCreatePayment}>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-secondary">MEMBER ID</Form.Label>
                            <Form.Control required type="text" placeholder="e.g. 1" value={formData.memberId} onChange={(e) => setFormData({...formData, memberId: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-secondary">AMOUNT ($)</Form.Label>
                            <Form.Control required type="number" step="0.01" placeholder="0.00" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-secondary">PAYMENT METHOD</Form.Label>
                            <Form.Select value={formData.paymentMethod} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}>
                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                                <option value="transfer">Transfer</option>
                            </Form.Select>
                        </Form.Group>
                        <div className="mt-5 d-flex gap-3">
                            <Button variant="light" className="flex-grow-1 fw-bold" onClick={() => setShowModal(false)}>CANCEL</Button>
                            <Button variant="primary" type="submit" className="flex-grow-1 fw-bold shadow-sm">CONFIRM</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="sm">
                <Modal.Body className="text-center p-4">
                    <div className="text-danger mb-3"><AlertTriangle size={50} /></div>
                    <h5 className="fw-bold">Void Payment?</h5>
                    <p className="text-secondary small">This will remove the record from the ledger.</p>
                    <div className="d-flex gap-2 mt-4">
                        <Button variant="light" className="flex-grow-1" onClick={() => setShowDeleteModal(false)}>No</Button>
                        <Button variant="danger" className="flex-grow-1" onClick={handleDeletePayment} disabled={deleting}>
                            {deleting ? '...' : 'Yes, Delete'}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Payments;
