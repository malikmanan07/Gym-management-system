import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Form, Button, Table, Badge, Modal } from 'react-bootstrap';
import { UserCheck, Clock, Calendar as CalendarIcon, Search, Trash2, ArrowRight, AlertTriangle } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';

const Attendance = () => {
    const [memberId, setMemberId] = useState('');
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // Delete Confirmation State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get(`/attendance/logs?date=${date}&search=${search}`);
            const dataArr = response.logs || response.data || [];
            setLogs(Array.isArray(dataArr) ? dataArr : []);
        } catch (err) {
            console.error('Failed to fetch logs');
            setLogs([]);
        } finally {
            setLoading(false);
        }
    }, [date, search]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handleMarkAttendance = async (e) => {
        e.preventDefault();
        if (!memberId) return;
        try {
            await api.post('/attendance/mark', { memberId });
            toast.success('Attendance recorded!');
            setMemberId('');
            fetchLogs();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Member not found or already marked');
        }
    };

    const confirmDelete = (id) => {
        setDeleteTargetId(id);
        setShowDeleteModal(true);
    };

    const handleDeleteLog = async () => {
        setDeleting(true);
        try {
            await api.delete(`/attendance/logs/${deleteTargetId}`);
            toast.success('Log entry removed.');
            setShowDeleteModal(false);
            fetchLogs();
        } catch (err) {
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="page-fade-in">
            <div className="mb-5">
                <h1 className="fw-bold m-0 text-dark">Attendance Terminal</h1>
                <p className="text-secondary m-0">Live check-in system and daily activity logs.</p>
            </div>

            <Row className="g-4">
                <Col lg={4}>
                    <Card className="glass-card border-0 shadow-sm p-4 h-100">
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <div className="bg-primary-subtle p-3 rounded-4 text-primary">
                                <UserCheck size={28} />
                            </div>
                            <h4 className="fw-bold m-0">Quick Check-in</h4>
                        </div>
                        <Form onSubmit={handleMarkAttendance}>
                            <Form.Group className="mb-4">
                                <Form.Label className="small fw-bold text-secondary">MEMBER ID / SCANNER</Form.Label>
                                <div className="position-relative">
                                    <Form.Control 
                                        size="lg" 
                                        type="text" 
                                        placeholder="Enter Member ID..." 
                                        className="py-3 ps-3 shadow-none border-light bg-light"
                                        value={memberId}
                                        onChange={(e) => setMemberId(e.target.value)}
                                        autoFocus
                                    />
                                    <Button type="submit" variant="primary" className="position-absolute end-0 top-50 translate-middle-y me-2 p-2 rounded-3 shadow-sm">
                                        <ArrowRight size={20} />
                                    </Button>
                                </div>
                                <Form.Text className="text-muted small">Type the Member ID and press Enter to mark attendance.</Form.Text>
                            </Form.Group>
                        </Form>
                    </Card>
                </Col>

                <Col lg={8}>
                    <Card className="glass-card border-0 shadow-sm overflow-hidden h-100">
                        <div className="p-4 border-bottom border-light bg-white d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <h5 className="fw-bold m-0">Daily Logs</h5>
                            <div className="d-flex gap-2">
                                <Form.Control 
                                    type="date" 
                                    className="border-light shadow-none bg-light fw-bold text-secondary"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                                <div className="position-relative">
                                    <Search className="position-absolute start-0 top-50 translate-middle-y ms-3 text-secondary" size={16} />
                                    <Form.Control 
                                        placeholder="Search logs..." 
                                        className="ps-5 border-light shadow-none bg-light"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <Table responsive borderless className="mb-0 glass-table">
                            <thead>
                                <tr className="text-secondary small border-bottom border-light">
                                    <th className="py-3 ps-4">MEMBER NAME</th>
                                    <th className="py-3">CHECK-IN</th>
                                    <th className="py-3">CHECK-OUT</th>
                                    <th className="py-3 text-center">ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i}><td colSpan="4"><Skeleton height={50} className="mb-2" /></td></tr>
                                    ))
                                ) : logs.length > 0 ? (
                                    logs.map((log) => (
                                        <tr key={log.id} className="align-middle border-bottom border-light hover-bg-surface transition-all">
                                            <td className="ps-4 py-3">
                                                <div className="fw-bold text-dark">{log.memberName || 'Member'}</div>
                                                <small className="text-secondary">ID: #{log.memberId}</small>
                                            </td>
                                            <td>
                                                <Badge bg="success-subtle" className="text-success border border-success-subtle px-3 py-2 fw-medium">
                                                    <Clock size={14} className="me-1" /> {log.checkIn}
                                                </Badge>
                                            </td>
                                            <td>
                                                {log.checkOut ? (
                                                    <Badge bg="primary-subtle" className="text-primary border border-primary-subtle px-3 py-2 fw-medium">
                                                        <Clock size={14} className="me-1" /> {log.checkOut}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-secondary small italic">Active...</span>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                <Button variant="light" size="sm" className="text-danger border shadow-sm" onClick={() => confirmDelete(log.id)}>
                                                    <Trash2 size={16} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="text-center py-5 text-secondary">No logs for this date.</td></tr>
                                )}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
            </Row>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="sm">
                <Modal.Body className="text-center p-4">
                    <div className="text-danger mb-3"><AlertTriangle size={50} /></div>
                    <h5 className="fw-bold">Delete Log?</h5>
                    <p className="text-secondary small">This will remove the record from today's history.</p>
                    <div className="d-flex gap-2 mt-4">
                        <Button variant="light" className="flex-grow-1" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                        <Button variant="danger" className="flex-grow-1" onClick={handleDeleteLog} disabled={deleting}>
                            {deleting ? '...' : 'Delete'}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Attendance;
