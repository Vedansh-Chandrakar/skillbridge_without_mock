const User = require('../models/User');

// ── Helper: map DB user → frontend shape ──────────────
const toStudentObj = (u) => ({
  id:        u._id,
  name:      u.name,
  email:     u.email,
  mode:      u.registeredModes === 'both'
               ? 'Both'
               : u.registeredModes === 'recruiter'
               ? 'Recruiter'
               : 'Freelancer',
  skills:    [],        // skills field not in model yet
  gigs:      0,         // gigs field not in model yet
  rating:    null,
  verified:  u.isVerified,
  status:    u.status,
  joinedAt:  u.createdAt ? u.createdAt.toISOString().slice(0, 10) : '',
});

// GET /api/campus/students
// Returns all students belonging to the logged-in campus authority's campus
const getCampusStudents = async (req, res, next) => {
  try {
    const students = await User.find({
      type:   'student',
      campus: req.user.campus,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count:   students.length,
      data:    students.map(toStudentObj),
    });
  } catch (err) { next(err); }
};

// POST /api/campus/students/invite
// Creates a new student account pre-registered to this campus
const inviteStudent = async (req, res, next) => {
  try {
    const { email, mode, message } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    // Prevent duplicate emails
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists.',
      });
    }

    const modeMap = {
      Freelancer: 'freelancer',
      Recruiter:  'recruiter',
      Both:       'both',
      '':         'freelancer',
    };
    const registeredModes = modeMap[mode] || 'freelancer';
    const activeMode      = registeredModes === 'recruiter' ? 'recruiter' : 'freelancer';

    // Derive name from email (e.g. john.doe@… → "John Doe")
    const name = email
      .split('@')[0]
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const student = await User.create({
      name,
      email:          email.toLowerCase(),
      password:       'SkillBridge@2024', // temporary password
      type:           'student',
      campus:         req.user.campus,
      registeredModes,
      activeMode,
      status:         'pending',
      isVerified:     false,
    });

    res.status(201).json({
      success: true,
      message: `Student "${name}" has been added to your campus.`,
      data:    toStudentObj(student),
    });
  } catch (err) { next(err); }
};

// PATCH /api/campus/students/:id
// Update a student's name, email, mode, or verification status
const updateStudent = async (req, res, next) => {
  try {
    const student = await User.findOne({
      _id:    req.params.id,
      type:   'student',
      campus: req.user.campus,
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found in your campus.' });
    }

    const { name, email, mode, verified } = req.body;

    const modeMap = {
      Freelancer: 'freelancer',
      Recruiter:  'recruiter',
      Both:       'both',
    };

    if (name     !== undefined) student.name           = name;
    if (email    !== undefined) student.email          = email.toLowerCase();
    if (mode     !== undefined) student.registeredModes = modeMap[mode] || student.registeredModes;
    if (verified !== undefined) student.isVerified     = verified;

    await student.save();

    res.status(200).json({ success: true, data: toStudentObj(student) });
  } catch (err) { next(err); }
};

// DELETE /api/campus/students/:id
// Remove a student from this campus
const removeStudent = async (req, res, next) => {
  try {
    const student = await User.findOne({
      _id:    req.params.id,
      type:   'student',
      campus: req.user.campus,
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found in your campus.' });
    }

    await student.deleteOne();

    res.status(200).json({ success: true, message: 'Student removed successfully.' });
  } catch (err) { next(err); }
};

// ── Helper: derive verification status ────────────────
const toVerification = (u) => {
  let status = 'pending';
  if (u.status === 'active' && u.isVerified) status = 'approved';
  if (u.status === 'rejected') status = 'rejected';
  return {
    id:          u._id,
    name:        u.name,
    email:       u.email,
    mode:        u.registeredModes === 'both'
                   ? 'Both'
                   : u.registeredModes === 'recruiter'
                   ? 'Recruiter'
                   : 'Freelancer',
    campus:      u.campus || '—',
    status,
    submittedAt: u.createdAt,
  };
};

// GET /api/campus/verifications
// Returns all students of this campus, for the campus authority to approve/reject
const getCampusVerifications = async (req, res, next) => {
  try {
    const students = await User.find({
      type:   'student',
      campus: req.user.campus,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count:   students.length,
      data:    students.map(toVerification),
    });
  } catch (err) { next(err); }
};

// PATCH /api/campus/verifications/:id/approve
const approveVerification = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id:    req.params.id,
      type:   'student',
      campus: req.user.campus,
    });
    if (!user) return res.status(404).json({ success: false, message: 'Student not found in your campus.' });

    user.status     = 'active';
    user.isVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: `${user.name} has been verified.`,
      data:    toVerification(user),
    });
  } catch (err) { next(err); }
};

// PATCH /api/campus/verifications/:id/reject
const rejectVerification = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id:    req.params.id,
      type:   'student',
      campus: req.user.campus,
    });
    if (!user) return res.status(404).json({ success: false, message: 'Student not found in your campus.' });

    user.status     = 'rejected';
    user.isVerified = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: `${user.name}'s verification has been rejected.`,
      data:    toVerification(user),
    });
  } catch (err) { next(err); }
};

/* ═══════════════════════════════════════════════════════
   OPPORTUNITY ENDPOINTS
═══════════════════════════════════════════════════════ */
const Opportunity   = require('../models/Opportunity');
const Application   = require('../models/Application');

const toOpp = (o, applicantCount = 0) => ({
  id:           o._id,
  company:      o.company,
  role:         o.role,
  type:         o.type,
  location:     o.location,
  salary:       o.salary,
  description:  o.description,
  requirements: o.requirements,
  deadline:     o.deadline,
  status:       o.status,
  applicants:   applicantCount,
  postedAt:     o.createdAt ? o.createdAt.toISOString().split('T')[0] : '',
});

const toApplicant = (app) => ({
  id:             app._id,
  studentId:      app.student?._id,
  name:           app.student?.name || '—',
  email:          app.student?.email || '—',
  campus:         app.student?.campus || '—',
  major:          app.major || '—',
  year:           app.year  || '—',
  gpa:            app.gpa   || '—',
  rating:         null,
  skills:         [],
  completedGigs:  0,
  coverLetter:    app.coverLetter || '',
  resume:         false,
  status:         app.status,
  appliedAt:      app.createdAt,
});

// GET /api/campus/opportunities
const getOpportunities = async (req, res, next) => {
  try {
    const opps  = await Opportunity.find({ campus: req.user.campus }).sort({ createdAt: -1 });
    const counts = await Application.aggregate([
      { $match: { opportunity: { $in: opps.map((o) => o._id) } } },
      { $group:  { _id: '$opportunity', count: { $sum: 1 } } },
    ]);
    const countMap = {};
    counts.forEach((c) => { countMap[String(c._id)] = c.count; });

    res.status(200).json({
      success: true,
      count:   opps.length,
      data:    opps.map((o) => toOpp(o, countMap[String(o._id)] || 0)),
    });
  } catch (err) { next(err); }
};

// POST /api/campus/opportunities
const createOpportunity = async (req, res, next) => {
  try {
    const { company, role, type, location, salary, description, requirements, deadline, status } = req.body;
    if (!company || !role) return res.status(400).json({ success: false, message: 'Company and role are required.' });

    const opp = await Opportunity.create({
      campus: req.user.campus,
      company, role,
      type:         type         || 'Internship',
      location:     location     || '',
      salary:       salary       || '',
      description:  description  || '',
      requirements: Array.isArray(requirements) ? requirements : [],
      deadline:     deadline     || '',
      status:       status       || 'active',
    });

    res.status(201).json({ success: true, data: toOpp(opp, 0) });
  } catch (err) { next(err); }
};

// PATCH /api/campus/opportunities/:id
const updateOpportunity = async (req, res, next) => {
  try {
    const opp = await Opportunity.findOne({ _id: req.params.id, campus: req.user.campus });
    if (!opp) return res.status(404).json({ success: false, message: 'Opportunity not found.' });

    const fields = ['company','role','type','location','salary','description','requirements','deadline','status'];
    fields.forEach((f) => { if (req.body[f] !== undefined) opp[f] = req.body[f]; });
    await opp.save();

    const appCount = await Application.countDocuments({ opportunity: opp._id });
    res.status(200).json({ success: true, data: toOpp(opp, appCount) });
  } catch (err) { next(err); }
};

// DELETE /api/campus/opportunities/:id
const deleteOpportunity = async (req, res, next) => {
  try {
    const opp = await Opportunity.findOne({ _id: req.params.id, campus: req.user.campus });
    if (!opp) return res.status(404).json({ success: false, message: 'Opportunity not found.' });

    await Application.deleteMany({ opportunity: opp._id });
    await opp.deleteOne();

    res.status(200).json({ success: true, message: 'Opportunity deleted.' });
  } catch (err) { next(err); }
};

/* ═══════════════════════════════════════════════════════
   APPLICANT ENDPOINTS
═══════════════════════════════════════════════════════ */

// GET /api/campus/opportunities/:id — opportunity info + applicant count (for the card)
const getOpportunity = async (req, res, next) => {
  try {
    const opp = await Opportunity.findOne({ _id: req.params.id, campus: req.user.campus });
    if (!opp) return res.status(404).json({ success: false, message: 'Opportunity not found.' });
    const appCount = await Application.countDocuments({ opportunity: opp._id });
    res.status(200).json({ success: true, data: toOpp(opp, appCount) });
  } catch (err) { next(err); }
};

// GET /api/campus/opportunities/:id/applicants
const getApplicants = async (req, res, next) => {
  try {
    const opp = await Opportunity.findOne({ _id: req.params.id, campus: req.user.campus });
    if (!opp) return res.status(404).json({ success: false, message: 'Opportunity not found.' });

    const apps = await Application.find({ opportunity: opp._id })
                                  .populate('student', 'name email campus registeredModes')
                                  .sort({ createdAt: -1 });

    res.status(200).json({
      success:  true,
      role:     opp.role,
      company:  opp.company,
      oppId:    opp._id,
      count:    apps.length,
      data:     apps.map(toApplicant),
    });
  } catch (err) { next(err); }
};

// PATCH /api/campus/opportunities/:id/applicants/:appId
const updateApplicantStatus = async (req, res, next) => {
  try {
    const opp = await Opportunity.findOne({ _id: req.params.id, campus: req.user.campus });
    if (!opp) return res.status(404).json({ success: false, message: 'Opportunity not found.' });

    const app = await Application.findOne({ _id: req.params.appId, opportunity: opp._id })
                                  .populate('student', 'name email campus');
    if (!app) return res.status(404).json({ success: false, message: 'Application not found.' });

    const allowed = ['pending', 'shortlisted', 'accepted', 'rejected'];
    if (req.body.status && allowed.includes(req.body.status)) {
      app.status = req.body.status;
    }
    await app.save();

    res.status(200).json({ success: true, data: toApplicant(app) });
  } catch (err) { next(err); }
};

/* ═══════════════════════════════════════════════════════
   CAMPUS PROFILE ENDPOINTS
═══════════════════════════════════════════════════════ */
const Campus      = require('../models/Campus');

const toProfile = (c, stats = {}) => ({
  id:           c._id,
  name:         c.name,
  domain:       c.domain,
  status:       c.status,
  location:     c.location     || '',
  description:  c.description  || '',
  website:      c.website      || '',
  contactEmail: c.contactEmail || '',
  contactPhone: c.contactPhone || '',
  established:  c.established  || '',
  stats,
});

// GET /api/campus/profile
const getProfile = async (req, res, next) => {
  try {
    const campus = await Campus.findOne({ name: req.user.campus });
    if (!campus) return res.status(404).json({ success: false, message: 'Campus not found.' });

    const [studentCount, pendingVerifications, opportunityCount] = await Promise.all([
      User.countDocuments({ type: 'student', campus: campus.name }),
      User.countDocuments({ type: 'student', campus: campus.name, isVerified: false, status: 'active' }),
      Opportunity.countDocuments({ campus: campus.name }),
    ]);

    const stats = [
      { label: 'Total Students',   value: studentCount,        color: 'text-indigo-600' },
      { label: 'Pending Verif.',   value: pendingVerifications, color: 'text-amber-600'  },
      { label: 'Opportunities',    value: opportunityCount,    color: 'text-emerald-600' },
    ];

    res.status(200).json({ success: true, data: toProfile(campus, stats) });
  } catch (err) { next(err); }
};

// PATCH /api/campus/profile
const updateProfile = async (req, res, next) => {
  try {
    const campus = await Campus.findOne({ name: req.user.campus });
    if (!campus) return res.status(404).json({ success: false, message: 'Campus not found.' });

    const allowed = ['location', 'description', 'website', 'contactEmail', 'contactPhone', 'established'];
    allowed.forEach((f) => { if (req.body[f] !== undefined) campus[f] = req.body[f]; });
    await campus.save();

    res.status(200).json({ success: true, data: toProfile(campus) });
  } catch (err) { next(err); }
};

/* ═══════════════════════════════════════════════════════
   DASHBOARD ENDPOINT
═══════════════════════════════════════════════════════ */

// GET /api/campus/dashboard
const getDashboard = async (req, res, next) => {
  try {
    const campusName = req.user.campus;

    // Fetch campus opportunity IDs first so we can count applications
    const campusOppIds = await Opportunity.distinct('_id', { campus: campusName });

    const [
      totalStudents,
      verifiedStudents,
      pendingVerifications,
      totalOpportunities,
      activeOpportunities,
      totalApplications,
      acceptedApplications,
      recentStudentsRaw,
      recentOppsRaw,
    ] = await Promise.all([
      User.countDocuments({ type: 'student', campus: campusName }),
      User.countDocuments({ type: 'student', campus: campusName, isVerified: true }),
      User.countDocuments({ type: 'student', campus: campusName, isVerified: false, status: 'active' }),
      Opportunity.countDocuments({ campus: campusName }),
      Opportunity.countDocuments({ campus: campusName, status: 'active' }),
      Application.countDocuments({ opportunity: { $in: campusOppIds } }),
      Application.countDocuments({ opportunity: { $in: campusOppIds }, status: 'accepted' }),
      User.find({ type: 'student', campus: campusName }).sort({ createdAt: -1 }).limit(5),
      Opportunity.find({ campus: campusName }).sort({ createdAt: -1 }).limit(5),
    ]);

    // Applicant counts per recent opportunity
    const oppIds = recentOppsRaw.map((o) => o._id);
    const appCounts = await Application.aggregate([
      { $match: { opportunity: { $in: oppIds } } },
      { $group: { _id: '$opportunity', count: { $sum: 1 } } },
    ]);
    const countMap = {};
    appCounts.forEach((c) => { countMap[String(c._id)] = c.count; });

    res.status(200).json({
      success: true,
      data: {
        stats: [
          { label: 'Total Students',       value: totalStudents,        colorClass: 'text-indigo-600', bgClass: 'bg-indigo-50' },
          { label: 'Verified Students',    value: verifiedStudents,     colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50' },
          { label: 'Pending Verif.',       value: pendingVerifications, colorClass: 'text-amber-600',  bgClass: 'bg-amber-50'  },
          { label: 'Opportunities',        value: totalOpportunities,   colorClass: 'text-purple-600', bgClass: 'bg-purple-50' },
        ],
        quickMetrics: [
          { label: 'Active Opportunities', value: activeOpportunities,  colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50' },
          { label: 'Total Applications',   value: totalApplications,    colorClass: 'text-blue-600',    bgClass: 'bg-blue-50'   },
          { label: 'Accepted',             value: acceptedApplications, colorClass: 'text-indigo-600',  bgClass: 'bg-indigo-50' },
        ],
        recentStudents: recentStudentsRaw.map((u) => ({
          id:       u._id,
          name:     u.name,
          email:    u.email,
          mode:     u.registeredModes === 'both' ? 'Both' : u.registeredModes === 'recruiter' ? 'Recruiter' : 'Freelancer',
          verified: u.isVerified,
        })),
        recentOpportunities: recentOppsRaw.map((o) => ({
          id:           o._id,
          title:        o.role,
          postedBy:     o.company,
          applications: countMap[String(o._id)] || 0,
          status:       o.status,
          type:         o.type,
        })),
      },
    });
  } catch (err) { next(err); }
};

module.exports = {
  getCampusStudents, inviteStudent, updateStudent, removeStudent,
  getCampusVerifications, approveVerification, rejectVerification,
  getOpportunities, createOpportunity, updateOpportunity, deleteOpportunity,
  getOpportunity, getApplicants, updateApplicantStatus,
  getProfile, updateProfile,
  getDashboard,
};

