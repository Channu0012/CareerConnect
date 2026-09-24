// Sanitization utility: Escapes regex special characters to prevent ReDoS and regex injection attacks
const escapeRegex = (string) => {
  if (typeof string !== 'string') return '';
  return string.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

module.exports = { escapeRegex };
