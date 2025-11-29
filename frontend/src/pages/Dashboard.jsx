import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { FiSearch, FiSettings, FiBell, FiMoreHorizontal, FiGrid } from 'react-icons/fi';

// Import Components
import Sidebar from '../component/Sidebar';
import StatCard from '../component/StatCard';
import DoctorRow from '../component/DoctorRow';
import RightPanel from '../component/RightPanel';

// Import Data
import { dataStats, dataPatientOverview, dataRevenue, dataDepartment } from '../data/mockdata';

// Import CSS
import '../styles/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        {/* Header Section */}
        <header className="top-bar">
          <div className="search-bar">
            <FiSearch />
            <input type="text" placeholder="Search anything" />
          </div>
          <div className="user-tools">
            <FiSettings />
            <FiBell />
            <div className="user-profile">
              <img src="https://via.placeholder.com/30" alt="User" />
              <span>Alfredo Westervelt</span>
            </div>
          </div>
        </header>

        <div className="content-grid-wrapper">
          <div className="center-panel">
            
            {/* Stats Row */}
            <div className="stats-grid">
              {dataStats.map((item, index) => (
                <StatCard key={index} item={item} />
              ))}
            </div>

            {/* Charts Row 1 */}
            <div className="charts-row">
              {/* Bar Chart */}
              <div className="chart-card large">
                <div className="chart-header">
                  <h3>Patient Overview</h3>
                  <select><option>Last 8 Days</option></select>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dataPatientOverview}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="Child" stackId="a" fill="#bbf7d0" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="Adult" stackId="a" fill="#1f2937" />
                    <Bar dataKey="Elderly" stackId="a" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
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
                  <AreaChart data={dataRevenue}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1f2937" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#1f2937" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" hide />
                    <Tooltip />
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
                <h3>Patient Overview</h3>
                <div className="pie-container">
                  <div className="pie-center-text">
                    <h2>1,890</h2>
                    <p>This Week</p>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={dataDepartment} innerRadius={60} outerRadius={80} dataKey="value">
                        {dataDepartment.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="legend-list">
                  {dataDepartment.map((d, i) => (
                    <li key={i}><span className="dot" style={{background: d.color}}></span> {d.name} <span className="pct">{d.value}%</span></li>
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
                  <DoctorRow name="Dr. Petra Winsburry" role="General Medicine" status="Available" />
                  <DoctorRow name="Dr. Ameena Karim" role="Orthopedics" status="Unavailable" />
                  <DoctorRow name="Dr. Olivia Martinez" role="Cardiology" status="Available" />
                </div>
              </div>
              
               {/* Reports */}
               <div className="chart-card">
                <div className="chart-header">
                  <h3>Report</h3>
                  <FiMoreHorizontal />
                </div>
                <ul className="report-list">
                    <li><div className="icon-box teal"><FiGrid/></div> Room Cleaning Needed</li>
                    <li><div className="icon-box gray"><FiSettings/></div> Equipment Maintenance</li>
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