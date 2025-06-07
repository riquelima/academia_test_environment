import React from 'react';
import { ScheduledClass } from '../types';

interface ScheduledClassItemProps {
  sClass: ScheduledClass;
}

const ScheduledClassItem: React.FC<ScheduledClassItemProps> = ({ sClass }) => {
  const spotRatio = sClass.spotsFilled / sClass.totalSpots;
  let progressBarColor = 'bg-green-500 dark:bg-green-600'; 
  if (spotRatio >= 0.8 && spotRatio < 1) progressBarColor = 'bg-yellow-500 dark:bg-yellow-600';
  if (spotRatio === 1) progressBarColor = 'bg-red-500 dark:bg-red-600';


  return (
    <div className="bg-light-bg-card dark:bg-dark-card p-4 rounded-xl shadow flex justify-between items-center mb-3 border border-light-border dark:border-dark-border">
      <div>
        <h4 className="font-semibold text-brand-orange">{sClass.name}</h4>
        <p className="text-sm text-medium-text-light dark:text-medium-text">{sClass.teacher} - {sClass.dayOfWeek} às {sClass.classTime}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-dark-text dark:text-light-text">{sClass.spotsFilled}/{sClass.totalSpots} vagas</p>
        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
          <div 
            className={`h-full rounded-full ${progressBarColor}`} 
            style={{ width: `${(sClass.spotsFilled / sClass.totalSpots) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ScheduledClassItem;