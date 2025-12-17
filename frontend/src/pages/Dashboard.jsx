import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { FiMoreHorizontal, FiGrid, FiUsers, FiCalendar, FiDollarSign, FiActivity } from 'react-icons/fi';
import { FiSettings } from 'react-icons/fi';

// Import Components
import Sidebar from '../component/Sidebar';
import Header from '../component/Header';
import StatCard from '../component/Statcard';
import DoctorRow from '../component/DoctorRow';
import RightPanel from '../component/RightPanel';

// Import API
import api from '../api/api';

// Import CSS
import '../styles/Dashboard.css';

// Colors for pie chart
const DEPARTMENT_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await api.get('/dashboard/stats');
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Transform data for charts
  const getPatientOverviewData = () => {
    if (!stats?.patientOverview) return [];
    const data = stats.patientOverview;
    return [
      { name: 'Total', value: data.totalPatients || 0 },
      { name: 'New Today', value: data.newPatientsToday || 0 },
      { name: 'This Week', value: data.newPatientsThisWeek || 0 },
      { name: 'This Month', value: data.newPatientsThisMonth || 0 }
    ];
  };

  const getRevenueData = () => {
    if (!stats?.revenue) return [];
    const data = stats.revenue;
    return [
      { name: 'Mon', Income: data.totalRevenue / 7 || 0, Expense: (data.totalRevenue / 7) * 0.3 || 0 },
      { name: 'Tue', Income: data.totalRevenue / 6 || 0, Expense: (data.totalRevenue / 6) * 0.25 || 0 },
      { name: 'Wed', Income: data.totalRevenue / 5 || 0, Expense: (data.totalRevenue / 5) * 0.35 || 0 },
      { name: 'Thu', Income: data.totalRevenueThisMonth / 4 || 0, Expense: (data.totalRevenueThisMonth / 4) * 0.3 || 0 },
      { name: 'Fri', Income: data.totalRevenueThisMonth / 3 || 0, Expense: (data.totalRevenueThisMonth / 3) * 0.28 || 0 },
      { name: 'Sat', Income: data.pendingPayments || 0, Expense: (data.pendingPayments) * 0.2 || 0 },
      { name: 'Sun', Income: data.totalRevenue / 8 || 0, Expense: (data.totalRevenue / 8) * 0.32 || 0 }
    ];
  };

  const getDepartmentData = () => {
    if (!stats?.departmentDistribution) return [];
    return stats.departmentDistribution.map((dept, index) => ({
      name: dept.departmentName || 'Unknown',
      value: Number(dept.doctorCount) || 0,
      color: DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length]
    }));
  };

  const getStatsCards = () => {
    if (!stats) return [];
    return [
      {
        title: 'Total Patients',
        value: stats.patientOverview?.totalPatients?.toLocaleString() || '0',
        icon: <FiUsers />,
        trend: '+12%',
        trendUp: true
      },
      {
        title: 'Total Doctors',
        value: stats.totalDoctors?.toString() || '0',
        icon: <FiActivity />,
        trend: '+3%',
        trendUp: true
      },
      {
        title: "Today's Appointments",
        value: stats.todaysAppointments?.toString() || '0',
        icon: <FiCalendar />,
        trend: stats.appointmentStatus?.scheduledCount > 0 ? `${stats.appointmentStatus?.scheduledCount} scheduled` : '0',
        trendUp: true
      },
      {
        title: 'Total Revenue',
        value: `$${(stats.revenue?.totalRevenue || 0).toLocaleString()}`,
        icon: <FiDollarSign />,
        trend: `$${(stats.revenue?.pendingPayments || 0).toLocaleString()} pending`,
        trendUp: false
      }
    ];
  };

  const getDoctorSchedules = () => {
    if (!stats?.doctorSchedules) return [];
    return stats.doctorSchedules.slice(0, 3);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content">
          <Header placeholder="Search anything" />
          <div className="loading-container">
            <div className="loading-spinner">Loading dashboard...</div>
          </div>
        </main>
      </div>
    );
  }

  const statsCards = getStatsCards();
  const departmentData = getDepartmentData();
  const doctorSchedules = getDoctorSchedules();
  const totalDepartmentValue = departmentData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        {/* Header Section */}
        <Header placeholder="Search anything" />

        <div className="content-grid-wrapper">
          <div className="center-panel">
            
            {/* Stats Row */}
            <div className="stats-grid">
              {statsCards.map((item, index) => (
                <StatCard key={index} item={item} />
              ))}
            </div>

            {/* Charts Row 1 */}
            <div className="charts-row">
              {/* Bar Chart */}
              <div className="chart-card large">
                <div className="chart-header">
                  <h3>Patient Overview</h3>
                  <button className="refresh-btn" onClick={fetchDashboardData}>Refresh</button>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={getPatientOverviewData()}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#1f2937" radius={[4, 4, 4, 4]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Area Chart */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Revenue</h3>
                  <div className="tabs">
                    <span className="active">Week</span>
                    <span>Month</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={getRevenueData()}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1f2937" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#1f2937" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" hide />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Area type="monotone" dataKey="Income" stroke="#1f2937" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                    <Area type="monotone" dataKey="Expense" stroke="#6ee7b7" fill="transparent" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="bottom-row">
              {/* Pie Chart */}
              <div className="chart-card">
                <h3>Department Distribution</h3>
                <div className="pie-container">
                  <div className="pie-center-text">
                    <h2>{totalDepartmentValue}</h2>
                    <p>Total Doctors</p>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={departmentData} innerRadius={60} outerRadius={80} dataKey="value">
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="legend-list">
                  {departmentData.map((d, i) => (
                    <li key={i}>
                      <span className="dot" style={{background: d.color}}></span> 
                      {d.name} 
                      <span className="pct">{d.value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Doctor List */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Doctors' Schedule</h3>
                  <FiMoreHorizontal />
                </div>
                <div className="doctor-list">
                  {doctorSchedules.length > 0 ? (
                    doctorSchedules.map((doc, i) => (
                      <DoctorRow 
                        key={i}
                        name={doc.name} 
                        role={doc.specialization} 
                        status={doc.appointmentsToday > 0 ? `${doc.appointmentsToday} appointments` : 'Available'} 
                      />
                    ))
                  ) : (
                    <DoctorRow name="No doctors available" role="" status="N/A" />
                  )}
                </div>
              </div>
              
               {/* Appointment Status */}
               <div className="chart-card">
                <div className="chart-header">
                  <h3>Appointment Status</h3>
                  <FiMoreHorizontal />
                </div>
                <ul className="report-list">
                  <li>
                    <div className="icon-box teal"><FiCalendar/></div> 
                    Scheduled: {stats?.appointmentStatus?.scheduledCount || 0}
                  </li>
                  <li>
                    <div className="icon-box green"><FiGrid/></div> 
                    Completed: {stats?.appointmentStatus?.completedCount || 0}
                  </li>
                  <li>
                    <div className="icon-box gray"><FiSettings/></div> 
                    Cancelled: {stats?.appointmentStatus?.cancelledCount || 0}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Panel Component */}
          <RightPanel />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;