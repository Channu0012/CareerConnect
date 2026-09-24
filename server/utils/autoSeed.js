// Auto-seeder utility for embedded database or initial bootstrap
const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const Application = require('../models/Application');

const autoSeed = async (force = false) => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0 && !force) {
      return; // Already seeded
    }

    if (force) {
      await User.deleteMany();
      await Company.deleteMany();
      await Job.deleteMany();
      await Candidate.deleteMany();
      await Application.deleteMany();
    }

    console.log('[AutoSeed] Seeding comprehensive modern tech companies, LinkedIn-calibre jobs, and pipeline applications...');
    const defaultPassword = 'password123';

    // 1. Create Core Users
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@careerconnect.com',
      password: defaultPassword,
      role: 'admin',
      status: 'active'
    });

    const recruiter1 = await User.create({
      name: 'Alex Morgan',
      email: 'recruiter@techflow.com',
      password: defaultPassword,
      role: 'recruiter',
      status: 'active'
    });

    const recruiter2 = await User.create({
      name: 'Sarah Jenkins',
      email: 'recruiter@cloudpeak.com',
      password: defaultPassword,
      role: 'recruiter',
      status: 'active'
    });

    const recruiter3 = await User.create({
      name: 'Rohan Deshmukh',
      email: 'recruiter@nexuspay.com',
      password: defaultPassword,
      role: 'recruiter',
      status: 'active'
    });

    const candidate1 = await User.create({
      name: 'Rahul Sharma',
      email: 'candidate@careerconnect.com',
      password: defaultPassword,
      role: 'candidate',
      status: 'active'
    });

    const candidate2 = await User.create({
      name: 'Priya Patel',
      email: 'priya@careerconnect.com',
      password: defaultPassword,
      role: 'candidate',
      status: 'active'
    });

    // 2. Create Realistic Tech Companies
    const company1 = await Company.create({
      name: 'TechFlow Solutions',
      description: 'Pioneering next-generation fintech solutions, AI copilot workflows, and high-throughput transaction systems across Asia and North America.',
      website: 'https://techflow.example.com',
      industry: 'FinTech & Applied AI',
      location: 'Bangalore, Karnataka',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&q=80',
      createdBy: recruiter1._id
    });

    const company2 = await Company.create({
      name: 'CloudPeak Systems',
      description: 'Enterprise cloud infrastructure, Kubernetes orchestration, zero-trust cloud security, and automated site-reliability engineering.',
      website: 'https://cloudpeak.example.com',
      industry: 'Cloud Infrastructure & DevOps',
      location: 'Hyderabad, Telangana',
      logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&q=80',
      createdBy: recruiter2._id
    });

    const company3 = await Company.create({
      name: 'DataNova Labs',
      description: 'Applied machine learning research lab engineering predictive business intelligence, autonomous data pipelines, and intelligent AI models.',
      website: 'https://datanova.example.com',
      industry: 'Artificial Intelligence & Data',
      location: 'Pune, Maharashtra',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&q=80',
      createdBy: recruiter1._id
    });

    const company4 = await Company.create({
      name: 'NexusPay Global',
      description: 'High-speed modern digital payment gateways and multi-currency checkout infrastructure powering modern global commerce.',
      website: 'https://nexuspay.example.com',
      industry: 'Payments & E-Commerce Infrastructure',
      location: 'Gurgaon, NCR',
      logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=128&q=80',
      createdBy: recruiter3._id
    });

    const company5 = await Company.create({
      name: 'Starlight Interactive',
      description: 'Consumer tech company designing hyper-scalable interactive mobile platforms and real-time streaming tools for millions of creators.',
      website: 'https://starlight.example.com',
      industry: 'Consumer Tech & Mobile Apps',
      location: 'Mumbai, Maharashtra',
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&q=80',
      createdBy: recruiter2._id
    });

    const company6 = await Company.create({
      name: 'Aether Security',
      description: 'Cybersecurity defense agency providing AI-assisted threat detection, cloud posture management, and API penetration testing.',
      website: 'https://aethersec.example.com',
      industry: 'Cybersecurity & Defense',
      location: 'Bangalore, Karnataka',
      logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=128&q=80',
      createdBy: recruiter1._id
    });

    // 3. Candidate Profiles with Skills & Experience
    await Candidate.create({
      user: candidate1._id,
      name: candidate1.name,
      email: candidate1.email,
      phone: '+91 98765 43210',
      headline: 'Full-Stack Engineer | React 19, Node.js & AI Integrations',
      location: 'Bangalore, India',
      skills: ['React.js', 'Next.js', 'Node.js', 'Express.js', 'MongoDB', 'TypeScript', 'LangChain', 'Tailwind CSS', 'REST APIs', 'Git'],
      experience: [
        {
          title: 'Full Stack Developer',
          company: 'WebCraft Innovations',
          duration: '1.5 Years (2024 - 2026)',
          description: 'Engineered responsive React dashboards and architected scalable Express microservices handling 50k+ daily transactions.'
        },
        {
          title: 'Frontend Intern',
          company: 'HyperScale Apps',
          duration: '6 Months (2023 - 2024)',
          description: 'Constructed component libraries in React with modern CSS and state management.'
        }
      ],
      education: [
        {
          degree: 'B.Tech in Computer Science & Engineering',
          institution: 'National Institute of Technology, Karnataka',
          year: '2020 - 2024'
        }
      ],
      resumeLink: 'https://github.com/rahul-sharma',
      bio: 'Energetic full-stack developer committed to crafting clean, maintainable software and building delightful user experiences.'
    });

    await Candidate.create({
      user: candidate2._id,
      name: candidate2.name,
      email: candidate2.email,
      phone: '+91 91234 56789',
      headline: 'Cloud & DevOps Practitioner | Kubernetes, Docker, AWS',
      location: 'Hyderabad, India',
      skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD Pipelines', 'Node.js', 'Linux', 'Prometheus', 'Python'],
      experience: [
        {
          title: 'DevOps Engineer',
          company: 'CloudMatrix Technologies',
          duration: '2 Years (2024 - 2026)',
          description: 'Maintained AWS container infrastructure and automated zero-downtime deployment pipelines with GitHub Actions.'
        }
      ],
      education: [
        {
          degree: 'B.E. in Information Technology',
          institution: 'Osmania University College of Engineering',
          year: '2020 - 2024'
        }
      ],
      resumeLink: 'https://github.com/priya-patel',
      bio: 'DevOps enthusiast passionate about site reliability, infrastructure-as-code, and automated cloud systems.'
    });

    // 4. Create High-Demand LinkedIn-Calibre Tech Jobs
    const job1 = await Job.create({
      title: 'Senior Full Stack AI Engineer',
      description: 'TechFlow Solutions is looking for a versatile Senior Full-Stack AI Engineer to spearhead our AI Copilot initiatives. You will design responsive user interfaces in React 19, build streaming backend APIs in Node.js and Python, and implement RAG pipelines utilizing OpenAI and vector databases. Strong architectural mindset and proficiency with cloud deployments required.',
      company: company1._id,
      location: 'Bangalore, Karnataka (Hybrid)',
      employmentType: 'Full-time',
      experienceLevel: 'Senior Level',
      salaryRange: { min: 2000000, max: 3500000, currency: 'INR' },
      skills: ['React 19', 'Next.js', 'Node.js', 'Python', 'LangChain', 'OpenAI API', 'MongoDB', 'Docker'],
      status: 'Active',
      recruiter: recruiter1._id,
      applicationsCount: 1
    });

    const job2 = await Job.create({
      title: 'Lead Cloud DevOps & Platform Architect',
      description: 'CloudPeak Systems is searching for a Lead DevOps Architect to manage our distributed container ecosystem. You will drive Kubernetes cluster automation, establish GitOps workflows with ArgoCD and Terraform, orchestrate multi-region AWS environments, and ensure high availability across tier-1 production systems.',
      company: company2._id,
      location: 'Hyderabad, Telangana',
      employmentType: 'Full-time',
      experienceLevel: 'Lead / Principal',
      salaryRange: { min: 2500000, max: 4200000, currency: 'INR' },
      skills: ['Kubernetes', 'AWS', 'Terraform', 'Docker', 'CI/CD', 'Prometheus', 'Go', 'Linux'],
      status: 'Active',
      recruiter: recruiter2._id,
      applicationsCount: 1
    });

    const job3 = await Job.create({
      title: 'Senior Frontend Engineer (Design Systems)',
      description: 'NexusPay Global is recruiting a Senior Frontend Engineer dedicated to design systems and user experience excellence. You will construct high-performance React components, craft unified design tokens, optimize core web vitals, and work directly with product designers to create fluid international checkout flows.',
      company: company4._id,
      location: 'Remote (India)',
      employmentType: 'Remote',
      experienceLevel: 'Senior Level',
      salaryRange: { min: 1800000, max: 3000000, currency: 'INR' },
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Figma', 'Storybook', 'Web Vitals', 'REST APIs'],
      status: 'Active',
      recruiter: recruiter3._id,
      applicationsCount: 1
    });

    const job4 = await Job.create({
      title: 'Principal Backend Systems Engineer',
      description: 'Starlight Interactive seeks an experienced Principal Backend Engineer to build distributed microservices supporting millions of active daily mobile users. You will write high-throughput services in Node.js and Go, leverage Kafka for event streaming, tune MongoDB aggregations, and optimize Redis caching layers.',
      company: company5._id,
      location: 'Bangalore / Remote',
      employmentType: 'Full-time',
      experienceLevel: 'Senior Level',
      salaryRange: { min: 2400000, max: 4000000, currency: 'INR' },
      skills: ['Node.js', 'Go', 'Distributed Systems', 'Kafka', 'Redis', 'MongoDB', 'gRPC', 'Docker'],
      status: 'Active',
      recruiter: recruiter2._id,
      applicationsCount: 0
    });

    const job5 = await Job.create({
      title: 'Lead Product Designer (UI/UX & Mobile)',
      description: 'DataNova Labs is seeking a Lead Product Designer to transform sophisticated machine learning capabilities into intuitive, beautiful web and mobile interfaces. You will run user research, design wireframes and production components in Figma, define design guidelines, and partner with engineers for pixel-perfect implementations.',
      company: company3._id,
      location: 'Pune, Maharashtra',
      employmentType: 'Full-time',
      experienceLevel: 'Mid Level',
      salaryRange: { min: 1500000, max: 2600000, currency: 'INR' },
      skills: ['Figma', 'UI/UX Design', 'Design Systems', 'User Research', 'Prototyping', 'Interaction Design'],
      status: 'Active',
      recruiter: recruiter1._id,
      applicationsCount: 1
    });

    const job6 = await Job.create({
      title: 'Mobile Application Engineer (React Native)',
      description: 'Join TechFlow Solutions as a Mobile Application Engineer. You will engineer fluid cross-platform iOS and Android apps using React Native, Expo, and TypeScript. You will build offline-first synchronization, secure biometric authentications, and smooth animations.',
      company: company1._id,
      location: 'Bangalore, Karnataka',
      employmentType: 'Full-time',
      experienceLevel: 'Mid Level',
      salaryRange: { min: 1300000, max: 2200000, currency: 'INR' },
      skills: ['React Native', 'Expo', 'TypeScript', 'Redux Toolkit', 'iOS', 'Android', 'REST APIs'],
      status: 'Active',
      recruiter: recruiter1._id,
      applicationsCount: 0
    });

    const job7 = await Job.create({
      title: 'Cybersecurity & Application Defense Specialist',
      description: 'Aether Security is hiring an Application Security Specialist to fortify our cloud services and enterprise endpoints. Responsibilities include threat modeling, automated vulnerability scanning, OWASP Top 10 remediation, cloud IAM policy auditing, and developer security advocacy.',
      company: company6._id,
      location: 'Remote',
      employmentType: 'Full-time',
      experienceLevel: 'Mid Level',
      salaryRange: { min: 1700000, max: 2800000, currency: 'INR' },
      skills: ['AppSec', 'Penetration Testing', 'OWASP', 'Cloud Security', 'OAuth 2.0', 'SOC 2', 'Linux'],
      status: 'Active',
      recruiter: recruiter1._id,
      applicationsCount: 0
    });

    const job8 = await Job.create({
      title: 'Junior Full-Stack Associate (Early Career)',
      description: 'Great opportunity for high-potential early career developers and fresh graduates. Learn industry standard software engineering while contributing directly to production MERN features alongside senior engineering leaders. Mentorship provided.',
      company: company2._id,
      location: 'Hyderabad, Telangana (Hybrid)',
      employmentType: 'Full-time',
      experienceLevel: 'Entry Level',
      salaryRange: { min: 600000, max: 1000000, currency: 'INR' },
      skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'HTML5', 'CSS3', 'Git'],
      status: 'Active',
      recruiter: recruiter2._id,
      applicationsCount: 0
    });

    // 5. Create Live Real-Time Multi-Stage Applications with Rich Feedback
    // Application 1: Rahul -> Senior Full Stack AI Engineer (Stage: Interview Scheduled)
    await Application.create({
      candidate: candidate1._id,
      job: job1._id,
      status: 'Interview',
      coverLetter: 'I have hands-on experience building full-stack applications with React 19, LangChain, and Express. Excited about contributing to TechFlow AI initiatives!',
      resumeLink: 'https://github.com/rahul-sharma',
      recruiterNotes: 'Technical round passed with distinction (9/10 score on React & Node.js architecture). System Design interview scheduled for Friday at 3:00 PM IST with Engineering Director.',
      appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    });

    // Application 2: Rahul -> Senior Frontend Engineer (Stage: Shortlisted)
    await Application.create({
      candidate: candidate1._id,
      job: job3._id,
      status: 'Shortlisted',
      coverLetter: 'Passionate about component design systems, accessibility, and high-performance React frontends.',
      resumeLink: 'https://github.com/rahul-sharma',
      recruiterNotes: 'Solid portfolio and design system proficiency. Shortlisted for upcoming team round.',
      appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    });

    // Application 3: Priya -> Lead Cloud DevOps (Stage: Selected / Offer Stage)
    await Application.create({
      candidate: candidate2._id,
      job: job2._id,
      status: 'Selected',
      coverLetter: 'Proven record of managing resilient Kubernetes clusters, infrastructure-as-code with Terraform, and zero-downtime CI/CD pipelines.',
      resumeLink: 'https://github.com/priya-patel',
      recruiterNotes: 'Outstanding performance across all technical rounds and leadership interviews. Formal Offer Letter extended. Onboarding scheduled for next month!',
      appliedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
    });

    // Application 4: Priya -> Lead Product Designer (Stage: Under Review)
    await Application.create({
      candidate: candidate2._id,
      job: job5._id,
      status: 'Under Review',
      coverLetter: 'Applying for cross-functional design system collaboration and product research.',
      resumeLink: 'https://github.com/priya-patel',
      recruiterNotes: 'Resume and portfolio under review by Design Hiring Committee.',
      appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    });

    console.log('[AutoSeed] Successfully populated 6 Tech Companies, 8 In-Demand Job Openings, and 4 Real-Time Pipeline Applications!');
  } catch (error) {
    console.error('[AutoSeed Error]:', error.message);
  }
};

module.exports = autoSeed;
