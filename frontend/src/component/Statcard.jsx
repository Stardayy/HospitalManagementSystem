import React from 'react';
import { FiUsers, FiMoreHorizontal } from 'react-icons/fi';

const StatCard = ({ item }) => (
  <div className="stat-card">
    <div className="stat-header">
      <span className="stat-icon"><FiUsers /></span>
      <FiMoreHorizontal className="more-icon"/>
    </div>
    <div className="stat-info">
      <h3>{item.value}</h3>
      <span className={`trend ${item.up ? 'up' : 'down'}`}>
        {item.trend}
      </span>
    </div>
    <p className="stat-title">{item.title}</p>
    <p className="stat-sub">{item.subtitle}</p>
  </div>
);

export default StatCard;