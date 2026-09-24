// Job Service: Encapsulates search, multi-attribute filtering, and pagination query logic
const Job = require('../models/Job');
const { escapeRegex } = require('../utils/sanitize');

const buildJobQuery = (queryParams) => {
  const query = {};

  // Status Filter (Default: Active)
  if (queryParams.status) {
    query.status = queryParams.status;
  } else {
    query.status = 'Active';
  }

  // Text Search across title, description, skills
  if (queryParams.search) {
    const sanitizedSearch = escapeRegex(queryParams.search);
    if (sanitizedSearch) {
      const searchRegex = new RegExp(sanitizedSearch, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { skills: searchRegex }
      ];
    }
  }

  // Location filter
  if (queryParams.location) {
    const sanitizedLocation = escapeRegex(queryParams.location);
    if (sanitizedLocation) {
      query.location = new RegExp(sanitizedLocation, 'i');
    }
  }

  // Employment Type filter
  if (queryParams.employmentType) {
    query.employmentType = queryParams.employmentType;
  }

  // Experience Level filter
  if (queryParams.experienceLevel) {
    query.experienceLevel = queryParams.experienceLevel;
  }

  // Minimum Salary filter
  if (queryParams.minSalary) {
    const min = Number(queryParams.minSalary);
    if (!isNaN(min)) {
      query['salary.min'] = { $gte: min };
    }
  }

  return query;
};

module.exports = { buildJobQuery };
