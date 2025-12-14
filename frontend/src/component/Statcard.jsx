import React from 'react';
import { FiUsers, FiMoreHorizontal } from 'react-icons/fi';

const StatCard = ({ item }) => {
  const value = item?.value ?? '0';
  const title = item?.title ?? '';
  const subtitle = item?.subtitle ?? '';
  const trend = item?.trend ?? '';
  const trendUp = item?.trendUp ?? item?.up ?? true;
  const icon = item?.icon ?? <FiUsers />;

  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-icon">{icon}</span>
        <FiMoreHorizontal className="more-icon"/>
      </div>
      <div className="stat-info">
        <h3>{value}</h3>
        <span className={`trend ${trendUp ? 'up' : 'down'}`}>
          {trend}
        </span>
      </div>
      <p className="stat-title">{title}</p>
      {subtitle && <p className="stat-sub">{subtitle}</p>}
    </div>
  );
};

export default StatCard;