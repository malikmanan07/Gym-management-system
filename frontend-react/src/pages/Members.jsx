import React, { useState, useEffect, useCallback } from 'react';
import { Table, Form, Button, Row, Col, Badge, Card, Modal } from 'react-bootstrap';
import { Search, UserPlus, Filter, MoreVertical, Edit, Trash2, Download, ClipboardList, AlertTriangle } from 'lucide-react';
import api from '../api/axios';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-hot-toast';
import Pagination from '../components/common/Pagination';

const Members = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;
    
    // Modal States
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: 'male',
        status: 'active'
    });

    const [showAssignModal, setShowAssignModal] = useState(false);
    const [assignId, setAssignId] = useState(null);
    const [workouts, setWorkouts] = useState([]);
    const [diets, setDiets] = useState([]);
    const [assignData, setAssignData] = useState({ workoutPlanId: '', dietPlanId: '' });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchMembers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get(`/members?search=${search}&status=${status}&page=${page}&limit=${limit}`);
            // Hyper-Safe Check
            const membersArr = response?.members || response?.data || [];
            setMembers(Array.isArray(membersArr) ? membersArr : []);
            setTotal(response?.total || 0);
        } catch (err) {
            console.error('Failed to fetch members');
            setMembers([]);
        } finally {
            setLoading(false);
        }
    }, [page, status, search]);

    const fetchPlans = async () => {
        try {
            const [wRes, dRes] = await Promise.all([
                api.get('/trainers/plans/workout'),
                api.get('/trainers/plans/diet')
            ]);
            setWorkouts(wRes?.data || []);
            setDiets(dRes?.data || []);
        } catch (err) {
            setWorkouts([]);
            setDiets([]);
        }
    };

    useEffect(() => {
        fetchMembers();
        fetchPlans();
    }, [fetchMembers]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchMembers();
    };

    const handleOpenModal = (member = null) => {
        if (member) {
            setEditId(member.id);
            const nameParts = (member.fullName || '').split(' ');
            setFormData({
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                email: member.email || '',
                phone: member.phone || '',
                gender: member.gender || 'male',
                status: member.status || 'active'
            });
        } else {
            setEditId(null);
            setFormData({ firstName: '', lastName: '', email: '', phone: '', gender: 'male', status: 'active' });
        }
        setShowModal(true);
    };

    const handleOpenAssignModal = (member) => {
        setAssignId(member.id);
        setAssignData({
            workoutPlanId: member.workoutPlanId || '',
            dietPlanId: member.dietPlanId || ''
        });
        setShowAssignModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await api.put(`/members/${editId}`, formData);
                toast.success('Member updated!');
            } else {
                await api.post('/members', formData);
                toast.success('Member registered!');
            }
            setShowModal(false);
            fetchMembers();
        } catch (err) {}
    };

    const handleAssignSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/members/${assignId}/assign-plans`, assignData);
            toast.success('Plans assigned!');
            setShowAssignModal(false);
            fetchMembers();
        } catch (err) {}
    };

    const confirmDelete = (id) => {
        setDeleteTargetId(id);
        setShowDeleteModal(true);
    };

    const handleDeleteMember = async () => {
        setDeleting(true);
        try {
            await api.delete(`/members/${deleteTargetId}`);
            toast.success('Member removed.');
            setShowDeleteModal(false);
            fetchMembers();
        } catch (err) {
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="page-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
                <div>
                    <h1 className="fw-bold m-0 text-dark">Member Directory</h1>
                    <p className="text-secondary m-0">Enterprise-grade management for your athlete community.</p>
                </div>
                <Button variant="primary" onClick={() => handleOpenModal()} className="d-flex align-items-center gap-2 fw-bold shadow-sm">
                    <UserPlus size={18} /> Register Member
                </Button>
            </div>

            <Card className="glass-card p-4 mb-4 border-0 shadow-sm">
                <Form onSubmit={handleSearch}>
                    <Row className="g-3 align-items-center">
                        <Col md={6} lg={4}>
                            <div className="position-relative">
                                <Search className="position-absolute start-0 top-50 translate-middle-y ms-3 text-secondary" size={18} />
                                <Form.Control 
                                    className="ps-5 py-2 border-light shadow-none bg-light" 
                                    placeholder="Search by name, email..." 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </Col>
                        <Col md={3} lg={2}>
                            <Form.Select 
                                className="py-2 border-light text-secondary fw-bold shadow-none bg-light"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Form.Select>
                        </Col>
                        <Col md={2}>
                            <Button variant="outline-primary" type="submit" className="w-100 fw-bold py-2">Filter</Button>
                        </Col>
                    </Row>
                </Form>
            </Card>

            <Card className="glass-card overflow-hidden border-0 shadow-sm">
                <Table responsive borderless className="mb-0 glass-table">
                    <thead>
                        <tr className="border-bottom border-light text-secondary small">
                            <th className="py-4 ps-4">PROFILE</th>
                            <th className="py-4">CONTACT</th>
                            <th className="py-4">BLUEPRINTS</th>
                            <th className="py-4">STATUS</th>
                            <th className="py-4 text-center">MANAGEMENT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            [...Array(limit)].map((_, i) => (
                                <tr key={i}><td colSpan="5"><Skeleton height={60} className="mb-2" /></td></tr>
                            ))
                        ) : (members && members.length > 0) ? (
                            members.map((member) => (
                                <tr key={member?.id} className="align-middle border-bottom border-light hover-bg-surface transition-all">
                                    <td className="ps-4 py-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center fw-bold text-primary shadow-sm border border-white" style={{width: 44, height: 44}}>
                                                {(member?.fullName || 'U').charAt(0)}
                                            </div>
                                            <div>
                                                <div className="fw-bold text-dark">{member?.fullName || 'Unnamed'}</div>
                                                <small className="text-secondary fw-bold">ID: #{member?.id}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="small">
                                            <div className="text-dark fw-medium">{member?.email || 'No Email'}</div>
                                            <div className="text-secondary">{member?.phone || 'No Phone'}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="small">
                                            <Badge bg="primary-subtle" className="text-primary border border-primary-subtle fw-normal me-1">W: {member?.workoutPlan || 'None'}</Badge>
                                            <Badge bg="success-subtle" className="text-success border border-success-subtle fw-normal">D: {member?.dietPlan || 'None'}</Badge>
                                        </div>
                                    </td>
                                    <td>
                                        <Badge bg={member?.status === 'active' ? 'success-subtle' : 'danger-subtle'} className={`px-3 py-2 border ${member?.status === 'active' ? 'text-success border-success-subtle' : 'text-danger border-danger-subtle'}`}>
                                            {(member?.status || 'inactive').toUpperCase()}
                                        </Badge>
                                    </td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center gap-2">
                                            <Button variant="light" size="sm" className="text-secondary border shadow-sm" onClick={() => handleOpenAssignModal(member)}><ClipboardList size={16} /></Button>
                                            <Button variant="light" size="sm" className="text-primary border shadow-sm" onClick={() => handleOpenModal(member)}><Edit size={16} /></Button>
                                            <Button variant="light" size="sm" className="text-danger border shadow-sm" onClick={() => confirmDelete(member?.id)}><Trash2 size={16} /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="text-center py-5 text-secondary">No members found.</td></tr>
                        )}
                    </tbody>
                </Table>
            </Card>

            <Pagination total={total} limit={limit} activePage={page} onPageChange={setPage} />

            {/* Modals */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">{editId ? 'Edit Profile' : 'New Registration'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-secondary">FIRST NAME</Form.Label>
                                    <Form.Control required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-secondary">LAST NAME</Form.Label>
                                    <Form.Control required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-secondary">EMAIL</Form.Label>
                                    <Form.Control type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-secondary">PHONE</Form.Label>
                                    <Form.Control required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-secondary">STATUS</Form.Label>
                                    <Form.Select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="mt-5 d-flex gap-3">
                            <Button variant="light" className="flex-grow-1" onClick={() => setShowModal(false)}>Cancel</Button>
                            <Button variant="primary" type="submit" className="flex-grow-1 fw-bold shadow-sm">Save</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">Assign Plans</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form onSubmit={handleAssignSubmit}>
                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold text-secondary">WORKOUT</Form.Label>
                            <Form.Select value={assignData.workoutPlanId} onChange={(e) => setAssignData({...assignData, workoutPlanId: e.target.value})}>
                                <option value="">None</option>
                                {workouts.map(p => <option key={p?.id} value={p?.id}>{p?.name}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold text-secondary">DIET</Form.Label>
                            <Form.Select value={assignData.dietPlanId} onChange={(e) => setAssignData({...assignData, dietPlanId: e.target.value})}>
                                <option value="">None</option>
                                {diets.map(p => <option key={p?.id} value={p?.id}>{p?.name}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100 fw-bold py-2 shadow-sm">Confirm</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="sm">
                <Modal.Body className="text-center p-4">
                    <div className="text-danger mb-3"><AlertTriangle size={50} /></div>
                    <h5 className="fw-bold">Delete Member?</h5>
                    <p className="text-secondary small">This cannot be undone.</p>
                    <div className="d-flex gap-2 mt-4">
                        <Button variant="light" className="flex-grow-1" onClick={() => setShowDeleteModal(false)}>No</Button>
                        <Button variant="danger" className="flex-grow-1" onClick={handleDeleteMember} disabled={deleting}>{deleting ? '...' : 'Yes'}</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Members;
