import React from 'react';
import { StatCardData } from '../types';
import { IconArrowUp, IconArrowDown } from '../constants.tsx'; 

const StatCard: React.FC<StatCardData> = ({ title, value, change, changeType, icon, details }) => {
  const changeColor = 
    changeType === 'positive' ? 'text-green-500 dark:text-green-400' : 
    changeType === 'negative' ? 'text-red-500 dark:text-red-400' : 
    'text-medium-text-light dark:text-medium-text';
  const ChangeIcon = changeType === 'positive' ? IconArrowUp : changeType === 'negative' ? IconArrowDown : null;

  return (
    <div className="bg-light-bg-card dark:bg-dark-card p-5 rounded-xl shadow-lg flex flex-col justify-between h-full">
      <div>
        <div className="text-brand-orange p-3 bg-brand-orange/10 dark:bg-brand-orange/20 rounded-full inline-block mb-3">
           {React.cloneElement(icon, { className: 'w-6 h-6' })}
        </div>
        <h3 className="text-sm font-medium text-medium-text-light dark:text-medium-text mb-1">{title}</h3>
        <p className="text-3xl font-semibold text-dark-text dark:text-light-text mb-1">{value}</p>
        {change && (
          <div className={`text-xs flex items-center ${changeColor}`}>
            {ChangeIcon && <ChangeIcon className="w-4 h-4 mr-1" />}
            <span>{change}</span>
          </div>
        )}
        {details && (
          <p className="text-xs text-medium-text-light dark:text-medium-text mt-1">{details}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;