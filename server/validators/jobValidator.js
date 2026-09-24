// Job Validation Middleware: Ensures job inputs are strictly validated before hitting the database
const validateJobInput = (req, res, next) => {
  const { title, description, company, location, employmentType, skills } = req.body;

  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Job title is required and must be a valid text string');
  }

  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    errors.push('Job description must be at least 10 characters long');
  }

  if (!company) {
    errors.push('Company reference is required');
  }

  if (!location || typeof location !== 'string' || location.trim().length === 0) {
    errors.push('Location is required (e.g. Remote, Bengaluru, Mumbai)');
  }

  if (employmentType) {
    const validTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
    if (!validTypes.includes(employmentType)) {
      errors.push(`Employment type must be one of: ${validTypes.join(', ')}`);
    }
  }

  if (req.body.salary) {
    const { min, max } = req.body.salary;
    if (min !== undefined && (isNaN(min) || min < 0)) {
      errors.push('Minimum salary must be a positive number');
    }
    if (max !== undefined && (isNaN(max) || max < 0)) {
      errors.push('Maximum salary must be a positive number');
    }
    if (min !== undefined && max !== undefined && Number(min) > Number(max)) {
      errors.push('Minimum salary cannot exceed maximum salary');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors
    });
  }

  next();
};

module.exports = { validateJobInput };
