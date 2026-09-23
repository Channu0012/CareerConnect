// StatusBadge: Visual indicator for job and application workflow stages
import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeClass = (statusStr) => {
    switch (statusStr) {
      case 'Applied':
        return 'badge-applied';
      case 'Under Review':
        return 'badge-under-review';
      case 'Shortlisted':
        return 'badge-shortlisted';
      case 'Interview':
        return 'badge-interview';
      case 'Rejected':
        return 'badge-rejected';
      case 'Selected':
        return 'badge-selected';
      case 'Active':
        return 'badge-active';
      case 'Closed':
        return 'badge-closed';
      default:
        return 'badge-applied';
    }
  };

  return <span className={`badge ${getBadgeClass(status)}`}>{status}</span>;
};

export default StatusBadge;
