// Company Controller: Handles company CRUD operations
const Company = require('../models/Company');

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
const getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find().sort({ name: 1 });
    res.json(companies);
  } catch (error) {
    next(error);
  }
};

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Public
const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new company
// @route   POST /api/companies
// @access  Private (Recruiter & Admin)
const createCompany = async (req, res, next) => {
  try {
    const { name, description, website, industry, location, logo } = req.body;

    if (!name || !description || !industry || !location) {
      return res.status(400).json({ message: 'Please provide name, description, industry, and location' });
    }

    const companyExists = await Company.findOne({ name });
    if (companyExists) {
      return res.status(400).json({ message: 'A company with this name already exists' });
    }

    const company = await Company.create({
      name,
      description,
      website: website || '',
      industry,
      location,
      logo: logo || '',
      createdBy: req.user._id
    });

    res.status(201).json(company);
  } catch (error) {
    next(error);
  }
};

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private (Recruiter & Admin)
const updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Check ownership if not admin
    if (
      company.createdBy &&
      company.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this company' });
    }

    delete req.body.createdBy;

    const updated = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private (Admin only)
const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
};
