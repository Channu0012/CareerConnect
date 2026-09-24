// Utility Formatters: Currency, dates, salary ranges, and text transforms

export const formatSalary = (min, max, currency = 'INR') => {
  if (!min && !max) return 'Competitive';
  if (currency === 'INR') {
    const minLakhs = (min / 100000).toFixed(1);
    const maxLakhs = (max / 100000).toFixed(1);
    return `₹${minLakhs} - ${maxLakhs} LPA`;
  }
  return `$${min?.toLocaleString()} - $${max?.toLocaleString()}`;
};

export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  const defaultOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text || '';
  return `${text.substring(0, maxLength).trim()}...`;
};
