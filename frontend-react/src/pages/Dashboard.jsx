import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import api from '../api/axios';
import Skeleton from 'react-loading-skeleton';
import { Users, DollarSign, Activity, TrendingUp, TrendingDown } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/dashboard/stats');
            // If response is null or not an object, default to empty structure
            setData(response || null);
        } catch (err) {
            console.error('Failed to fetch dashboard data');
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    const revenueData = data?.charts?.revenue || [];
    const chartData = {
        labels: Array.isArray(revenueData) ? revenueData.map(r => r?.month || 'N/A') : [],
        datasets: [{
            label: 'Monthly Revenue ($)',
            data: Array.isArray(revenueData) ? revenueData.map(r => r?.total || 0) : [],
            borderColor: '#E63946',
            backgroundColor: 'rgba(230, 57, 70, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };

    const distData = data?.charts?.membershipDistribution || [];
    const doughnutData = {
        labels: Array.isArray(distData) ? distData.map(d => d?.name || 'Unknown') : [],
        datasets: [{
            data: Array.isArray(distData) ? distData.map(d => d?.count || 0) : [],
            backgroundColor: ['#E63946', '#1D3557', '#457B9D', '#A8DADC'],
            borderWidth: 0
        }]
    };

    const recentPayments = data?.recentPayments || [];

    const StatCard = ({ title, value, growth, icon: Icon, color }) => (
        <Card className="glass-card border-0 shadow-sm p-4 h-100 hover-lift transition-all">
            <div className="d-flex justify-content-between align-items-start mb-3">
                <div className={`p-3 rounded-4 bg-${color}-subtle text-${color} shadow-sm`}>
                    <Icon size={24} />
                </div>
                {growth !== undefined && growth !== 0 ? (
                    <Badge bg={growth > 0 ? 'success-subtle' : 'danger-subtle'} className={`${growth > 0 ? 'text-success' : 'text-danger'} border ${growth > 0 ? 'border-success-subtle' : 'border-danger-subtle'}`}>
                        {growth > 0 ? <TrendingUp size={12} className="me-1" /> : <TrendingDown size={12} className="me-1" />}
                        {Math.abs(growth)}%
                    </Badge>
                ) : (
                    <Badge bg="light" className="text-secondary border">Real-time</Badge>
                )}
            </div>
            <h3 className="fw-bold mb-1 text-dark">{loading ? <Skeleton width={80} /> : (value || 0)}</h3>
            <p className="text-secondary small fw-bold text-uppercase mb-0">{title}</p>
        </Card>
    );

    return (
        <div className="page-fade-in">
            <div className="mb-5">
                <h1 className="fw-bold m-0 text-dark">Executive Dashboard</h1>
                <p className="text-secondary m-0">Welcome back, Administrator. Here's your gym's real-time performance analytics.</p>
            </div>

            <Row className="g-4 mb-5">
                <Col md={6} lg={3}>
                    <StatCard 
                        title="Total Members" 
                        value={data?.stats?.totalMembers?.value} 
                        growth={data?.stats?.totalMembers?.growth}
                        icon={Users} 
                        color="primary" 
                    />
                </Col>
                <Col md={6} lg={3}>
                    <StatCard 
                        title="Active Members" 
                        value={data?.stats?.activeMembers?.value} 
                        icon={Activity} 
                        color="success" 
                    />
                </Col>
                <Col md={6} lg={3}>
                    <StatCard 
                        title="Monthly Revenue" 
                        value={data?.stats?.monthlyRevenue?.value ? `$${(data.stats.monthlyRevenue.value).toLocaleString()}` : '$0'} 
                        growth={data?.stats?.monthlyRevenue?.growth}
                        icon={DollarSign} 
                        color="danger" 
                    />
                </Col>
                <Col md={6} lg={3}>
                    <StatCard 
                        title="Today's Attendance" 
                        value={data?.stats?.attendanceToday?.value} 
                        growth={data?.stats?.attendanceToday?.growth}
                        icon={TrendingUp} 
                        color="warning" 
                    />
                </Col>
            </Row>

            <Row className="g-4">
                <Col lg={8}>
                    <Card className="glass-card border-0 shadow-sm p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold m-0">Revenue Analytics</h5>
                            <Badge bg="light" className="text-secondary border small py-2 px-3">Last 6 Months</Badge>
                        </div>
                        <div style={{ height: '300px' }}>
                            {loading ? <Skeleton height="100%" /> : <Line data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { borderDash: [5, 5] } }, x: { grid: { display: false } } } }} />}
                        </div>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="glass-card border-0 shadow-sm p-4 h-100">
                        <h5 className="fw-bold mb-4">Plan Distribution</h5>
                        <div className="d-flex align-items-center justify-content-center" style={{ height: '250px' }}>
                            {loading ? <Skeleton circle height={200} width={200} /> : <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />}
                        </div>
                    </Card>
                </Col>

                <Col lg={12}>
                    <Card className="glass-card border-0 shadow-sm overflow-hidden">
                        <div className="p-4 border-bottom border-light d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold m-0">Recent Transactions</h5>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-borderless align-middle mb-0 glass-table">
                                <thead className="bg-light text-secondary small">
                                    <tr>
                                        <th className="ps-4 py-3">MEMBER</th>
                                        <th className="py-3">AMOUNT</th>
                                        <th className="py-3">DATE</th>
                                        <th className="py-3">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        [...Array(5)].map((_, i) => <tr key={i}><td colSpan="4"><Skeleton height={40} className="mx-4 my-2" /></td></tr>)
                                    ) : (recentPayments && recentPayments.length > 0) ? (
                                        recentPayments.map((payment) => (
                                            <tr key={payment?.id} className="border-bottom border-light">
                                                <td className="ps-4 py-3">
                                                    <div className="fw-bold text-dark">{payment?.memberName || 'System Record'}</div>
                                                </td>
                                                <td className="py-3 fw-bold text-primary">${(payment?.amount || 0).toLocaleString()}</td>
                                                <td className="py-3 text-secondary small">{payment?.date ? new Date(payment.date).toLocaleDateString() : 'N/A'}</td>
                                                <td className="py-3">
                                                    <Badge bg="success-subtle" className="px-2 py-1 border text-success border-success-subtle">
                                                        COMPLETED
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" className="text-center py-4 text-secondary italic">No recent activity.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
