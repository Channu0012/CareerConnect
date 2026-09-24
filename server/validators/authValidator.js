// Authentication Validation Middleware: Input sanitization and format verification
const validateRegisterInput = (req, res, next) => {
  let { name, email, password, role } = req.body;

  if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Name, email, and password must be text strings' });
  }

  name = name.trim();
  email = email.trim().toLowerCase();

  if (!name || name.length < 2) {
    return res.status(400).json({ message: 'Name must be at least 2 characters long' });
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  if (role && !['candidate', 'recruiter'].includes(role)) {
    return res.status(400).json({ message: 'Role must be either candidate or recruiter' });
  }

  req.body.name = name;
  req.body.email = email;
  next();
};

const validateLoginInput = (req, res, next) => {
  let { email, password } = req.body;

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Invalid credentials format' });
  }

  email = email.trim().toLowerCase();

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password' });
  }

  req.body.email = email;
  next();
};

module.exports = { validateRegisterInput, validateLoginInput };
