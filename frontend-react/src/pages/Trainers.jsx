import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Badge, Button, Modal, Form } from 'react-bootstrap';
import { UserSquare2, Award, Users, Mail, Phone, Plus, Download, Trash2, Edit, AlertTriangle } from 'lucide-react';
import api from '../api/axios';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-hot-toast';

const Trainers = () => {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);

    // Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        specialization: '',
        experience_years: '',
        bio: ''
    });

    const fetchTrainers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/trainers');
            const trainerArr = response.data || [];
            setTrainers(Array.isArray(trainerArr) ? trainerArr : []);
        } catch (err) {
            console.error('Failed to fetch trainers');
            setTrainers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTrainers();
    }, [fetchTrainers]);

    const handleOpenModal = (trainer = null) => {
        if (trainer) {
            setEditId(trainer.id);
            setFormData({
                full_name: trainer.fullName || '',
                email: trainer.email || '',
                phone: trainer.phone || '',
                specialization: trainer.specialization || '',
                experience_years: trainer.experienceYears || '',
                bio: trainer.bio || ''
            });
        } else {
            setEditId(null);
            setFormData({ full_name: '', email: '', phone: '', specialization: '', experience_years: '', bio: '' });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await api.put(`/trainers/${editId}`, formData);
                toast.success('Trainer record updated!');
            } else {
                await api.post('/trainers', formData);
                toast.success('Trainer added successfully!');
            }
            setShowModal(false);
            fetchTrainers();
        } catch (err) {}
    };

    const confirmDelete = (id) => {
        setDeleteTargetId(id);
        setShowDeleteModal(true);
    };

    const handleDeleteTrainer = async () => {
        setDeleting(true);
        try {
            await api.delete(`/trainers/${deleteTargetId}`);
            toast.success('Trainer record removed.');
            setShowDeleteModal(false);
            fetchTrainers();
        } catch (err) {
        } finally {
            setDeleting(false);
        }
    };

    const exportToCSV = () => {
        if (!trainers.length) return toast.error('No trainers to export');
        const headers = ['ID', 'Name', 'Specialization', 'Experience', 'Email', 'Phone'];
        const rows = trainers.map(t => [
            t.id, 
            t.fullName || 'N/A', 
            t.specialization || 'N/A', 
            t.experienceYears || 0, 
            t.email || 'N/A',
            t.phone || 'N/A'
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "trainers_export.csv");
        document.body.appendChild(link);
        link.click();
        toast.success('Exporting Trainer Data...');
    };

    return (
        <div className="page-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
                <div>
                    <h1 className="fw-bold m-0 text-dark">Expert Trainers</h1>
                    <p className="text-secondary m-0">Manage your professional team and their expertise.</p>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="outline-secondary" onClick={exportToCSV} className="d-flex align-items-center gap-2 fw-bold">
                        <Download size={18} /> Export
                    </Button>
                    <Button variant="primary" onClick={() => handleOpenModal()} className="d-flex align-items-center gap-2 fw-bold shadow-sm">
                        <Plus size={18} /> Add New Trainer
                    </Button>
                </div>
            </div>

            <Row className="g-4">
                {loading ? (
                    [...Array(4)].map((_, i) => (
                        <Col key={i} md={6} xl={3}><Skeleton height={380} className="rounded-4" /></Col>
                    ))
                ) : (trainers && trainers.length > 0) ? (
                    trainers.map((trainer) => (
                        <Col key={trainer.id} md={6} xl={3}>
                            <Card className="glass-card p-0 overflow-hidden h-100 border-0 hover-lift transition-all shadow-sm">
                                <div className="p-4 bg-primary text-white text-center">
                                    <div className="bg-white rounded-circle d-flex align-items-center justify-content-center text-primary fw-bold mx-auto mb-3 shadow-sm" style={{width: 60, height: 60, fontSize: '1.5rem'}}>
                                        {(trainer.fullName || 'T').charAt(0)}
                                    </div>
                                    <h5 className="fw-bold mb-0">{trainer.fullName || 'Unnamed'}</h5>
                                    <small className="opacity-75 text-uppercase fw-bold" style={{fontSize: '0.7rem'}}>{trainer.specialization || 'General Expert'}</small>
                                </div>
                                <Card.Body className="p-4 d-flex flex-column">
                                    <div className="d-flex align-items-center gap-2 mb-3 text-secondary small">
                                        <Award size={16} className="text-warning" />
                                        <span className="fw-bold">{trainer.experienceYears || 0} Years Experience</span>
                                    </div>
                                    <p className="text-secondary small mb-4 flex-grow-1">{trainer.bio || 'Professional fitness expert dedicated to achieving results.'}</p>
                                    
                                    <div className="border-top border-light pt-3 mt-auto d-flex justify-content-between align-items-center">
                                        <div className="d-flex gap-2">
                                            {trainer.email && (
                                                <a href={`mailto:${trainer.email}`} className="btn btn-light btn-sm text-primary shadow-sm border">
                                                    <Mail size={16} />
                                                </a>
                                            )}
                                            {trainer.phone && (
                                                <a href={`tel:${trainer.phone}`} className="btn btn-light btn-sm text-secondary shadow-sm border">
                                                    <Phone size={16} />
                                                </a>
                                            )}
                                        </div>
                                        <div className="d-flex gap-2">
                                            <Button variant="light" size="sm" className="text-primary shadow-sm border" onClick={() => handleOpenModal(trainer)}>
                                                <Edit size={16} />
                                            </Button>
                                            <Button variant="light" size="sm" className="text-danger shadow-sm border" onClick={() => confirmDelete(trainer.id)}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col md={12} className="text-center py-5 text-secondary">No trainers available.</Col>
                )}
            </Row>

            {/* Add/Edit Trainer Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">{editId ? 'Update Trainer Profile' : 'Add New Trainer Record'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-secondary">FULL NAME</Form.Label>
                                    <Form.Control required value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} placeholder="e.g. Robert Smith" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-secondary">EMAIL ADDRESS</Form.Label>
                                    <Form.Control type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="robert@flexgym.com" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-secondary">PHONE NUMBER</Form.Label>
                                    <Form.Control required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+92 3XX XXXXXXX" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-secondary">SPECIALIZATION</Form.Label>
                                    <Form.Control required value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} placeholder="e.g. Bodybuilding, Yoga" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-secondary">EXPERIENCE (YEARS)</Form.Label>
                                    <Form.Control type="number" required value={formData.experience_years} onChange={(e) => setFormData({...formData, experience_years: e.target.value})} placeholder="5" />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-secondary">PROFESSIONAL BIO</Form.Label>
                                    <Form.Control as="textarea" rows={3} value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} placeholder="Tell us about the trainer's expertise..." />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="mt-5 d-flex gap-3">
                            <Button variant="light" className="flex-grow-1 fw-bold" onClick={() => setShowModal(false)}>CANCEL</Button>
                            <Button variant="primary" type="submit" className="flex-grow-1 fw-bold shadow-sm">{editId ? 'UPDATE RECORD' : 'SAVE TRAINER'}</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Professional Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="sm">
                <Modal.Body className="text-center p-4">
                    <div className="text-danger mb-3">
                        <AlertTriangle size={50} />
                    </div>
                    <h5 className="fw-bold text-dark">Delete Trainer?</h5>
                    <p className="text-secondary small">This will permanently remove the professional record from the active directory.</p>
                    <div className="d-flex gap-2 mt-4">
                        <Button variant="light" className="flex-grow-1 fw-bold" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                        <Button variant="danger" className="flex-grow-1 fw-bold" onClick={handleDeleteTrainer} disabled={deleting}>
                            {deleting ? 'Removing...' : 'Delete'}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Trainers;
