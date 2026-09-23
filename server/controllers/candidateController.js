// Candidate Controller: Handles candidate profile management and resume details
const Candidate = require('../models/Candidate');
const User = require('../models/User');

// @desc    Get candidate profile for current logged-in user
// @route   GET /api/candidates/me
// @access  Private (Candidate only)
const getMyCandidateProfile = async (req, res, next) => {
  try {
    let profile = await Candidate.findOne({ user: req.user._id });

    // If profile doesn't exist yet, auto-create one from user account details
    if (!profile) {
      profile = await Candidate.create({
        user: req.user._id,
        name: req.user.name,
        email: req.user.email
      });
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
};

// @desc    Update candidate profile
// @route   PUT /api/candidates/me
// @access  Private (Candidate only)
const updateMyCandidateProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      headline,
      location,
      skills,
      experience,
      education,
      resumeLink,
      bio
    } = req.body;

    let profile = await Candidate.findOne({ user: req.user._id });

    if (!profile) {
      profile = new Candidate({ user: req.user._id, email: req.user.email });
    }

    // Process skills
    let skillsArray = profile.skills;
    if (Array.isArray(skills)) {
      skillsArray = skills;
    } else if (typeof skills === 'string') {
      skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    if (name) profile.name = name;
    if (phone !== undefined) profile.phone = phone;
    if (headline !== undefined) profile.headline = headline;
    if (location !== undefined) profile.location = location;
    if (skills !== undefined) profile.skills = skillsArray;
    if (experience !== undefined) profile.experience = experience;
    if (education !== undefined) profile.education = education;
    if (resumeLink !== undefined) profile.resumeLink = resumeLink;
    if (bio !== undefined) profile.bio = bio;

    const updatedProfile = await profile.save();

    // Also keep User.name updated if name was changed
    if (name && name !== req.user.name) {
      await User.findByIdAndUpdate(req.user._id, { name });
    }

    res.json(updatedProfile);
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate profile by user ID (for recruiters/admin review)
// @route   GET /api/candidates/:userId
// @access  Private (Recruiter & Admin)
const getCandidateById = async (req, res, next) => {
  try {
    const profile = await Candidate.findOne({ user: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Candidate profile not found' });
    }
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyCandidateProfile,
  updateMyCandidateProfile,
  getCandidateById
};
