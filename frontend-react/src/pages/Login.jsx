import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Card, Form, Button, Container, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import { LogIn, User, Lock, Dumbbell, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, user } = useAuth();
    const navigate = useNavigate();

    if (user) return <Navigate to="/" />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(credentials);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="vh-100 d-flex align-items-center" style={{ backgroundColor: '#F4F7F6' }}>
            <Container>
                <Row className="justify-content-center">
                    <Col md={10} lg={8} xl={6}>
                        <Card className="border-0 shadow-lg overflow-hidden" style={{ borderRadius: '24px' }}>
                            <Row className="g-0">
                                <Col md={5} className="d-none d-md-flex bg-primary align-items-center justify-content-center p-5 text-center text-white">
                                    <div>
                                        <div className="bg-white p-3 rounded-circle d-inline-block mb-4 shadow-sm">
                                            <Dumbbell size={48} className="text-primary" />
                                        </div>
                                        <h2 className="fw-bold mb-3">FLEX GYM</h2>
                                        <p className="opacity-75 small">Transform your body, transform your life with the most advanced gym management system.</p>
                                    </div>
                                </Col>
                                <Col md={7} className="bg-white p-5">
                                    <div className="mb-5 text-center d-md-none">
                                        <Dumbbell size={40} className="text-primary mb-2" />
                                        <h3 className="fw-bold">FLEX GYM</h3>
                                    </div>

                                    <h4 className="fw-bold mb-2">Welcome Back</h4>
                                    <p className="text-secondary small mb-4">Please enter your professional credentials.</p>

                                    {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="small fw-bold text-secondary">USERNAME</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text className="bg-light border-end-0">
                                                    <User size={18} className="text-secondary" />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter your username"
                                                    value={credentials.username}
                                                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                                    required
                                                    className="bg-light border-start-0 py-2"
                                                />
                                            </InputGroup>
                                        </Form.Group>

                                        <Form.Group className="mb-5">
                                            <Form.Label className="small fw-bold text-secondary">PASSWORD</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text className="bg-light border-end-0">
                                                    <Lock size={18} className="text-secondary" />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={credentials.password}
                                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                                    required
                                                    className="bg-light border-start-0 py-2"
                                                />
                                            </InputGroup>
                                        </Form.Group>

                                        <Button 
                                            variant="primary" 
                                            type="submit" 
                                            className="w-100 py-3 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                                            disabled={loading}
                                        >
                                            {loading ? 'AUTHENTICATING...' : (
                                                <>
                                                    <LogIn size={20} />
                                                    AUTHENTICATE
                                                </>
                                            )}
                                        </Button>

                                        <div className="text-center mt-4">
                                            <p className="text-secondary x-small d-flex align-items-center justify-content-center gap-1">
                                                <ShieldCheck size={14} className="text-success" />
                                                SECURE ENTERPRISE ACCESS
                                            </p>
                                        </div>
                                    </Form>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
