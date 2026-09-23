// Database Seeder Script: Populates realistic test data for internship evaluation
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const Application = require('../models/Application');

dotenv.config();

const seedData = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careerconnect');
    console.log('MongoDB connected successfully.');

    // Clear existing collections
    console.log('Clearing existing data...');
    await User.deleteMany();
    await Company.deleteMany();
    await Job.deleteMany();
    await Candidate.deleteMany();
    await Application.deleteMany();

    // 1. Create Users
    console.log('Creating users...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@careerconnect.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active'
    });

    const recruiter1 = await User.create({
      name: 'Alex Morgan',
      email: 'recruiter@techflow.com',
      password: hashedPassword,
      role: 'recruiter',
      status: 'active'
    });

    const recruiter2 = await User.create({
      name: 'Sarah Jenkins',
      email: 'recruiter@cloudpeak.com',
      password: hashedPassword,
      role: 'recruiter',
      status: 'active'
    });

    const candidate1 = await User.create({
      name: 'Rahul Sharma',
      email: 'candidate@careerconnect.com',
      password: hashedPassword,
      role: 'candidate',
      status: 'active'
    });

    const candidate2 = await User.create({
      name: 'Priya Patel',
      email: 'priya@careerconnect.com',
      password: hashedPassword,
      role: 'candidate',
      status: 'active'
    });

    // 2. Create Companies
    console.log('Creating companies...');
    const company1 = await Company.create({
      name: 'TechFlow Solutions',
      description: 'Pioneering next-generation fintech solutions and high-throughput transaction systems across Asia and Europe.',
      website: 'https://techflow.example.com',
      industry: 'FinTech & Software',
      location: 'Bangalore, Karnataka',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&q=80',
      createdBy: recruiter1._id
    });

    const company2 = await Company.create({
      name: 'CloudPeak Systems',
      description: 'Enterprise cloud infrastructure, container orchestration, and automated site-reliability engineering.',
      website: 'https://cloudpeak.example.com',
      industry: 'Cloud Infrastructure & DevOps',
      location: 'Hyderabad, Telangana',
      logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&q=80',
      createdBy: recruiter2._id
    });

    const company3 = await Company.create({
      name: 'DataNova Labs',
      description: 'Applied machine learning research lab engineering predictive business analytics and intelligent bots.',
      website: 'https://datanova.example.com',
      industry: 'Artificial Intelligence & Data',
      location: 'Pune, Maharashtra',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&q=80',
      createdBy: recruiter1._id
    });

    // 3. Create Candidate Profiles
    console.log('Creating candidate profiles...');
    await Candidate.create({
      user: candidate1._id,
      name: candidate1.name,
      email: candidate1.email,
      phone: '+91 98765 43210',
      headline: 'Full-Stack MERN Developer | React Enthusiast',
      location: 'Bangalore, India',
      skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'REST APIs', 'Git'],
      experience: [
        {
          title: 'Frontend Intern',
          company: 'WebCraft Studio',
          duration: '6 Months (2025)',
          description: 'Developed responsive user interface components in React and integrated RESTful endpoints.'
        }
      ],
      education: [
        {
          degree: 'B.Tech in Computer Science',
          institution: 'National Institute of Technology',
          year: '2022 - 2026'
        }
      ],
      resumeLink: 'https://github.com/rahul-sharma',
      bio: 'Enthusiastic computer science student passionate about building scalable web applications and intuitive user interfaces.'
    });

    await Candidate.create({
      user: candidate2._id,
      name: candidate2.name,
      email: candidate2.email,
      phone: '+91 91234 56789',
      headline: 'Backend Developer | Node.js & Cloud Practitioner',
      location: 'Hyderabad, India',
      skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS'],
      experience: [
        {
          title: 'Software Trainee',
          company: 'DataCore Labs',
          duration: '4 Months (2025)',
          description: 'Constructed microservices and database aggregations using MongoDB and Node.js.'
        }
      ],
      education: [
        {
          degree: 'B.E. in Information Technology',
          institution: 'City College of Engineering',
          year: '2022 - 2026'
        }
      ],
      resumeLink: 'https://github.com/priya-patel',
      bio: 'Junior backend engineer focused on clean architecture, API performance, and reliable database schema design.'
    });

    // 4. Create Jobs
    console.log('Creating jobs...');
    const job1 = await Job.create({
      title: 'Full Stack MERN Developer',
      description: 'We are seeking an energetic Full-Stack Developer to develop modern web applications. You will collaborate with our core product engineering team to build scalable features using MongoDB, Express, React, and Node.js.',
      company: company1._id,
      location: 'Bangalore, Karnataka',
      employmentType: 'Full-time',
      experienceLevel: 'Mid Level',
      salaryRange: { min: 800000, max: 1400000, currency: 'INR' },
      skills: ['React', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'Git'],
      status: 'Active',
      recruiter: recruiter1._id,
      applicationsCount: 1
    });

    const job2 = await Job.create({
      title: 'Frontend React Engineer',
      description: 'Looking for a talented frontend engineer who loves building smooth, accessible user interfaces with React, state management, and modern CSS.',
      company: company1._id,
      location: 'Remote',
      employmentType: 'Full-time',
      experienceLevel: 'Entry Level',
      salaryRange: { min: 500000, max: 800000, currency: 'INR' },
      skills: ['React', 'JavaScript', 'CSS3', 'HTML5', 'Redux', 'Vite'],
      status: 'Active',
      recruiter: recruiter1._id,
      applicationsCount: 1
    });

    const job3 = await Job.create({
      title: 'Cloud DevOps & Infrastructure Engineer',
      description: 'Help us scale enterprise-grade cloud systems. You will manage container deployments, build CI/CD pipelines, and monitor cluster reliability.',
      company: company2._id,
      location: 'Hyderabad, Telangana',
      employmentType: 'Full-time',
      experienceLevel: 'Senior Level',
      salaryRange: { min: 1400000, max: 2200000, currency: 'INR' },
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Terraform'],
      status: 'Active',
      recruiter: recruiter2._id,
      applicationsCount: 1
    });

    const job4 = await Job.create({
      title: 'Junior Web Developer Intern',
      description: 'Great internship opportunity for recent graduates or final-year students. Learn industry practices while working directly with senior developers on production codebases.',
      company: company3._id,
      location: 'Pune, Maharashtra',
      employmentType: 'Internship',
      experienceLevel: 'Entry Level',
      salaryRange: { min: 300000, max: 500000, currency: 'INR' },
      skills: ['JavaScript', 'HTML5', 'CSS3', 'React', 'Git'],
      status: 'Active',
      recruiter: recruiter1._id,
      applicationsCount: 0
    });

    // 5. Create Applications
    console.log('Creating initial applications...');
    await Application.create({
      candidate: candidate1._id,
      job: job1._id,
      status: 'Shortlisted',
      coverLetter: 'I have hands-on experience building full-stack MERN applications and strong proficiency in React and Express APIs. Looking forward to discussing how I can contribute!',
      resumeLink: 'https://github.com/rahul-sharma',
      recruiterNotes: 'Impressive GitHub portfolio and solid MERN fundamentals. Shortlisted for technical round.',
      appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    });

    await Application.create({
      candidate: candidate1._id,
      job: job2._id,
      status: 'Under Review',
      coverLetter: 'Passionate about frontend craft, clean component architectures, and responsive designs.',
      resumeLink: 'https://github.com/rahul-sharma',
      recruiterNotes: 'Profile looks suitable for junior frontend opening.',
      appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    });

    await Application.create({
      candidate: candidate2._id,
      job: job3._id,
      status: 'Interview',
      coverLetter: 'Strong enthusiasm for cloud architectures and containerization with Docker and AWS.',
      resumeLink: 'https://github.com/priya-patel',
      recruiterNotes: 'Interview scheduled for Friday 11:00 AM IST.',
      appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    });

    console.log('=============================================');
    console.log('Database Seeded Successfully!');
    console.log('---------------------------------------------');
    console.log('Test Accounts (Password for all: password123)');
    console.log('1. Admin:     admin@careerconnect.com');
    console.log('2. Recruiter: recruiter@techflow.com');
    console.log('3. Candidate: candidate@careerconnect.com');
    console.log('4. Candidate: priya@careerconnect.com');
    console.log('=============================================');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
