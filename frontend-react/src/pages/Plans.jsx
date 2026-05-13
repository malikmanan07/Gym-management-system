import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Nav, Tab, Badge, Button, Modal, Form, ListGroup } from 'react-bootstrap';
import { Dumbbell, Utensils, Zap, ShieldCheck, Plus, Download, Trash2, Edit3, Eye, CheckCircle2, AlertTriangle } from 'lucide-react';
import api from '../api/axios';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-hot-toast';

const PlanCard = ({ plan, type, onDelete, onEdit, onView }) => (
    <Card className="glass-card h-100 border-0 overflow-hidden shadow-sm hover-lift transition-all">
        <div className={`p-3 d-flex justify-content-between align-items-center ${type === 'workout' ? 'bg-primary-subtle' : 'bg-success-subtle'}`}>
            <h5 className="m-0 fw-bold text-dark">{plan.name || 'Unnamed Plan'}</h5>
            <div className="d-flex gap-1 align-items-center">
                <Button variant="link" className="p-1 text-primary" onClick={() => onEdit(plan, type)}>
                    <Edit3 size={16} />
                </Button>
                <Button variant="link" className="p-1 text-danger" onClick={() => onDelete(plan.id, type)}>
                    <Trash2 size={16} />
                </Button>
            </div>
        </div>
        <Card.Body className="p-4 d-flex flex-column">
            <div className="mb-3">
                <Badge bg="light" className="text-dark border text-uppercase" style={{fontSize: '0.65rem'}}>
                    {type === 'workout' ? (plan.difficulty || 'Normal') : (plan.goal || 'Maintenance')?.replace('_', ' ')}
                </Badge>
            </div>
            <p className="text-secondary small mb-4 flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {plan.description || 'No description provided.'}
            </p>
            <div className="mb-4">
                <h6 className="fw-bold small text-uppercase text-secondary mb-2">{type === 'workout' ? 'Key Exercises' : 'Meal Guide'}</h6>
                <div className="d-flex flex-wrap gap-2">
                    {((type === 'workout' ? plan.exercises : plan.meals) || [])?.slice(0, 3)?.map((item, idx) => (
                        <span key={idx} className="badge bg-light border text-secondary fw-normal">
                            {typeof item === 'string' ? item : item.name || 'Plan Item'}
                        </span>
                    ))}
                    {((type === 'workout' ? plan.exercises : plan.meals) || [])?.length > 3 && 
                        <span className="text-primary small fw-bold">+{((type === 'workout' ? plan.exercises : plan.meals) || []).length - 3} more</span>
                    }
                </div>
            </div>
            <Button 
                variant={type === 'workout' ? 'primary' : 'success'} 
                className="w-100 mt-auto fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                onClick={() => onView(plan, type)}
            >
                <Eye size={18} /> VIEW FULL DETAILS
            </Button>
        </Card.Body>
    </Card>
);

const Plans = () => {
    const [workouts, setWorkouts] = useState([]);
    const [diets, setDiets] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Create/Edit Modal State
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [planType, setPlanType] = useState('workout');
    
    // View Details Modal State
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedType, setSelectedType] = useState('workout');

    // Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState({ id: null, type: '' });
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        difficulty: 'beginner',
        goal: 'maintenance',
        items: '' // comma separated
    });

    const fetchPlans = useCallback(async () => {
        setLoading(true);
        try {
            const [wRes, dRes] = await Promise.all([
                api.get('/trainers/plans/workout'),
                api.get('/trainers/plans/diet')
            ]);
            setWorkouts(Array.isArray(wRes.data) ? wRes.data : []);
            setDiets(Array.isArray(dRes.data) ? dRes.data : []);
        } catch (err) {
            console.error('Failed to fetch plans');
            setWorkouts([]);
            setDiets([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    const handleOpenModal = (plan = null, type = 'workout') => {
        if (plan) {
            setEditId(plan.id);
            setPlanType(type);
            setFormData({
                name: plan.name || '',
                description: plan.description || '',
                difficulty: plan.difficulty || 'beginner',
                goal: plan.goal || 'maintenance',
                items: ((type === 'workout' ? plan.exercises : plan.meals) || []).join(', ')
            });
        } else {
            setEditId(null);
            setPlanType(type);
            setFormData({ name: '', description: '', difficulty: 'beginner', goal: 'maintenance', items: '' });
        }
        setShowModal(true);
    };

    const handleViewDetails = (plan, type) => {
        setSelectedPlan(plan);
        setSelectedType(type);
        setShowDetailModal(true);
    };

    const handleCreateOrUpdatePlan = async (e) => {
        e.preventDefault();
        const endpoint = planType === 'workout' ? '/trainers/plans/workout' : '/trainers/plans/diet';
        const payload = {
            name: formData.name,
            description: formData.description,
            ...(planType === 'workout' ? { 
                difficulty: formData.difficulty,
                exercises: formData.items.split(',').map(s => s.trim()).filter(s => s !== '')
            } : {
                goal: formData.goal,
                meals: formData.items.split(',').map(s => s.trim()).filter(s => s !== '')
            })
        };

        try {
            if (editId) {
                await api.put(`${endpoint}/${editId}`, payload);
                toast.success('Plan updated successfully!');
            } else {
                await api.post(endpoint, payload);
                toast.success(`${planType === 'workout' ? 'Workout' : 'Diet'} plan created!`);
            }
            setShowModal(false);
            fetchPlans();
        } catch (err) {}
    };

    const openDeleteConfirm = (id, type) => {
        setDeleteTarget({ id, type });
        setShowDeleteModal(true);
    };

    const handleDeletePlan = async () => {
        setDeleting(true);
        const { id, type } = deleteTarget;
        const endpoint = type === 'workout' ? `/trainers/plans/workout/${id}` : `/trainers/plans/diet/${id}`;
        try {
            await api.delete(endpoint);
            toast.success('Plan removed from library.');
            setShowDeleteModal(false);
            fetchPlans();
        } catch (err) {
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="page-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
                <div>
                    <h1 className="fw-bold m-0 text-dark">Training & Nutrition</h1>
                    <p className="text-secondary m-0">Enterprise-grade blueprints for athlete performance.</p>
                </div>
                <Button variant="primary" onClick={() => handleOpenModal()} className="d-flex align-items-center gap-2 fw-bold shadow-sm">
                    <Plus size={18} /> Create New Blueprint
                </Button>
            </div>

            <Tab.Container defaultActiveKey="workouts">
                <Nav variant="pills" className="glass-card p-2 mb-5 d-inline-flex border-0 shadow-sm bg-white">
                    <Nav.Item>
                        <Nav.Link eventKey="workouts" className="d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-bold">
                            <Dumbbell size={18} /> Workout Library
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="diets" className="d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-bold">
                            <Utensils size={18} /> Nutritional Guides
                        </Nav.Link>
                    </Nav.Item>
                </Nav>

                <Tab.Content>
                    <Tab.Pane eventKey="workouts">
                        <Row className="g-4">
                            {loading ? (
                                [...Array(3)].map((_, i) => (
                                    <Col key={i} md={4}><Skeleton height={350} className="rounded-4" /></Col>
                                ))
                            ) : workouts.length > 0 ? (
                                workouts.map(p => (
                                    <Col key={p.id} md={4}>
                                        <PlanCard 
                                            plan={p} 
                                            type="workout" 
                                            onDelete={openDeleteConfirm} 
                                            onEdit={handleOpenModal}
                                            onView={handleViewDetails}
                                        />
                                    </Col>
                                ))
                            ) : (
                                <Col className="text-center py-5 text-secondary italic">No workout plans available.</Col>
                            )}
                        </Row>
                    </Tab.Pane>
                    <Tab.Pane eventKey="diets">
                        <Row className="g-4">
                            {loading ? (
                                [...Array(3)].map((_, i) => (
                                    <Col key={i} md={4}><Skeleton height={350} className="rounded-4" /></Col>
                                ))
                            ) : diets.length > 0 ? (
                                diets.map(p => (
                                    <Col key={p.id} md={4}>
                                        <PlanCard 
                                            plan={p} 
                                            type="diet" 
                                            onDelete={openDeleteConfirm} 
                                            onEdit={handleOpenModal}
                                            onView={handleViewDetails}
                                        />
                                    </Col>
                                ))
                            ) : (
                                <Col className="text-center py-5 text-secondary italic">No diet plans available.</Col>
                            )}
                        </Row>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>

            {/* Create/Edit Plan Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">{editId ? 'Refine Blueprint' : 'Create New Blueprint'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form onSubmit={handleCreateOrUpdatePlan}>
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Label className="small fw-bold text-secondary">BLUEPRINT CATEGORY</Form.Label>
                                <div className="d-flex gap-4 mb-3">
                                    <Form.Check type="radio" label="Physical Training" name="planType" checked={planType === 'workout'} onChange={() => setPlanType('workout')} disabled={!!editId} />
                                    <Form.Check type="radio" label="Nutritional Guide" name="planType" checked={planType === 'diet'} onChange={() => setPlanType('diet')} disabled={!!editId} />
                                </div>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-secondary">PLAN TITLE</Form.Label>
                                    <Form.Control required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Advanced Muscle Building" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                {planType === 'workout' ? (
                                    <Form.Group>
                                        <Form.Label className="small fw-bold text-secondary">DIFFICULTY LEVEL</Form.Label>
                                        <Form.Select value={formData.difficulty} onChange={(e) => setFormData({...formData, difficulty: e.target.value})}>
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </Form.Select>
                                    </Form.Group>
                                ) : (
                                    <Form.Group>
                                        <Form.Label className="small fw-bold text-secondary">PRIMARY GOAL</Form.Label>
                                        <Form.Select value={formData.goal} onChange={(e) => setFormData({...formData, goal: e.target.value})}>
                                            <option value="weight_loss">Weight Loss</option>
                                            <option value="muscle_gain">Muscle Gain</option>
                                            <option value="maintenance">Maintenance</option>
                                        </Form.Select>
                                    </Form.Group>
                                )}
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-secondary">DESCRIPTION</Form.Label>
                                    <Form.Control as="textarea" rows={2} required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Brief overview of the objectives..." />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-secondary">{planType === 'workout' ? 'EXERCISES (Comma separated)' : 'MEAL ITEMS (Comma separated)'}</Form.Label>
                                    <Form.Control required value={formData.items} onChange={(e) => setFormData({...formData, items: e.target.value})} placeholder={planType === 'workout' ? "Bench Press, Squats, Deadlifts" : "Oatmeal, Grilled Chicken, Steamed Broccoli"} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="mt-5 d-flex gap-3">
                            <Button variant="light" className="flex-grow-1 fw-bold" onClick={() => setShowModal(false)}>CANCEL</Button>
                            <Button variant="primary" type="submit" className="flex-grow-1 fw-bold shadow-sm">{editId ? 'SAVE CHANGES' : 'PUBLISH BLUEPRINT'}</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* View Full Details Modal */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered size="md">
                <Modal.Header closeButton className="border-0 bg-light">
                    <Modal.Title className="fw-bold d-flex align-items-center gap-2">
                        {selectedType === 'workout' ? <Dumbbell className="text-primary" /> : <Utensils className="text-success" />}
                        {selectedPlan?.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                    <div className="p-4 bg-light border-bottom">
                        <h6 className="text-secondary small fw-bold text-uppercase mb-2">Description</h6>
                        <p className="text-dark mb-0">{selectedPlan?.description}</p>
                    </div>
                    <div className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-secondary small fw-bold text-uppercase mb-0">
                                {selectedType === 'workout' ? 'Training Regimen' : 'Nutritional Guide'}
                            </h6>
                            <Badge bg={selectedType === 'workout' ? 'primary-subtle' : 'success-subtle'} className={`px-3 py-2 border ${selectedType === 'workout' ? 'text-primary border-primary-subtle' : 'text-success border-success-subtle'}`}>
                                {selectedType === 'workout' ? selectedPlan?.difficulty : selectedPlan?.goal}
                            </Badge>
                        </div>
                        <ListGroup variant="flush" className="border rounded-3">
                            {((selectedType === 'workout' ? selectedPlan?.exercises : selectedPlan?.meals) || []).map((item, idx) => (
                                <ListGroup.Item key={idx} className="d-flex align-items-center gap-3 py-3">
                                    <div className="bg-light rounded-circle p-1 text-success">
                                        <CheckCircle2 size={18} />
                                    </div>
                                    <span className="fw-medium text-dark">{item}</span>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0 p-4">
                    <Button variant="outline-secondary" className="w-100 fw-bold" onClick={() => setShowDetailModal(false)}>CLOSE</Button>
                </Modal.Footer>
            </Modal>

            {/* Professional Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="sm">
                <Modal.Body className="text-center p-4">
                    <div className="text-danger mb-3">
                        <AlertTriangle size={50} />
                    </div>
                    <h5 className="fw-bold text-dark">Remove Blueprint?</h5>
                    <p className="text-secondary small">This will delete the plan from your training library permanently.</p>
                    <div className="d-flex gap-2 mt-4">
                        <Button variant="light" className="flex-grow-1 fw-bold" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                        <Button variant="danger" className="flex-grow-1 fw-bold" onClick={handleDeletePlan} disabled={deleting}>
                            {deleting ? 'Removing...' : 'Delete Plan'}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Plans;
