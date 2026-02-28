const Report    = require('../models/Report');
const ActionLog = require('../models/ActionLog');
const User      = require('../models/User');

// ── Helper: create action log entry ───────────────────
const createLog = async (admin, action, type, target) => {
  await ActionLog.create({ admin, action, type, target });
};
const toReport = (r) => ({
  id:             r._id,
  title:          r.title,
  type:           r.type,
  severity:       r.severity,
  status:         r.status,
  reason:         r.reason,
  details:        r.details,
  reporter:       r.reporter,
  reporterCampus: r.reporterCampus,
  target:         r.target,
  targetCampus:   r.targetCampus,
  adminNotes:     r.adminNotes,
  createdAt:      r.createdAt,
});

const toLog = (l) => ({
  id:     l._id,
  admin:  l.admin,
  action: l.action,
  type:   l.type,
  target: l.target,
  time:   l.createdAt,
});


/* ═══════════════════════════════════════════════════════
   REPORTS
═══════════════════════════════════════════════════════ */

// GET /api/admin/moderation/reports
const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reports.length, data: reports.map(toReport) });
  } catch (err) { next(err); }
};

// PATCH /api/admin/moderation/reports/:id/resolve
const resolveReport = async (req, res, next) => {
  try {
    const { adminNotes } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved', ...(adminNotes && { adminNotes }) },
      { new: true }
    );
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });
    await createLog(req.user.name, `Resolved report "${report.title}"`, 'resolve', report.target);
    res.status(200).json({ success: true, message: 'Report resolved.', data: toReport(report) });
  } catch (err) { next(err); }
};

// PATCH /api/admin/moderation/reports/:id/dismiss
const dismissReport = async (req, res, next) => {
  try {
    const { adminNotes } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: 'dismissed', ...(adminNotes && { adminNotes }) },
      { new: true }
    );
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });
    await createLog(req.user.name, `Dismissed report "${report.title}"`, 'flag', report.target);
    res.status(200).json({ success: true, message: 'Report dismissed.', data: toReport(report) });
  } catch (err) { next(err); }
};


/* ═══════════════════════════════════════════════════════
   ACTION LOGS
═══════════════════════════════════════════════════════ */

// GET /api/admin/moderation/logs
const getLogs = async (req, res, next) => {
  try {
    const logs = await ActionLog.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json({ success: true, data: logs.map(toLog) });
  } catch (err) { next(err); }
};


/* ═══════════════════════════════════════════════════════
   STATS
═══════════════════════════════════════════════════════ */

// GET /api/admin/moderation/stats
const getModerationStats = async (req, res, next) => {
  try {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // last 30 days

    const [received, resolved, dismissed, banned, warnings] = await Promise.all([
      Report.countDocuments({ createdAt: { $gte: since } }),
      Report.countDocuments({ status: 'resolved', updatedAt: { $gte: since } }),
      Report.countDocuments({ status: 'dismissed', updatedAt: { $gte: since } }),
      ActionLog.countDocuments({ type: 'ban', createdAt: { $gte: since } }),
      ActionLog.countDocuments({ type: 'warning', createdAt: { $gte: since } }),
    ]);

    res.status(200).json({
      success: true,
      data: [
        { label: 'Reports Received',   value: received,   color: 'text-indigo-600' },
        { label: 'Reports Resolved',   value: resolved,   color: 'text-green-600'  },
        { label: 'Reports Dismissed',  value: dismissed,  color: 'text-gray-500'   },
        { label: 'Users Banned',       value: banned,     color: 'text-red-600'    },
        { label: 'Warnings Issued',    value: warnings,   color: 'text-amber-600'  },
      ],
    });
  } catch (err) { next(err); }
};


/* ═══════════════════════════════════════════════════════
   ADMIN OVERRIDE ACTIONS
═══════════════════════════════════════════════════════ */

// POST /api/admin/moderation/ban
const banUser = async (req, res, next) => {
  try {
    const { target, reason } = req.body;
    if (!target) return res.status(400).json({ success: false, message: 'Target (username or email) is required.' });

    // Find by email or name (case-insensitive)
    const user = await User.findOne({
      $or: [
        { email:  { $regex: new RegExp(`^${target.trim()}$`, 'i') } },
        { name:   { $regex: new RegExp(`^${target.trim()}$`, 'i') } },
      ],
    });
    if (!user) return res.status(404).json({ success: false, message: `User "${target}" not found.` });
    if (user.type === 'admin') return res.status(403).json({ success: false, message: 'Cannot ban an admin account.' });
    if (user.status === 'suspended') return res.status(409).json({ success: false, message: `"${user.name}" is already banned.` });

    user.status = 'suspended';
    await user.save();
    await createLog(req.user.name, `Banned user "${user.name}"${reason ? ` — ${reason}` : ''}`, 'ban', user.name);

    res.status(200).json({ success: true, message: `"${user.name}" has been banned.` });
  } catch (err) { next(err); }
};

// POST /api/admin/moderation/warn
const warnUser = async (req, res, next) => {
  try {
    const { target, message, severity } = req.body;
    if (!target) return res.status(400).json({ success: false, message: 'Target is required.' });

    const label = severity === 'high' ? 'High' : severity === 'low' ? 'Low' : 'Medium';
    await createLog(
      req.user.name,
      `${label}-severity warning issued to "${target}"${message ? `: ${message}` : ''}`,
      'warning',
      target
    );
    res.status(200).json({ success: true, message: `Warning issued to "${target}".` });
  } catch (err) { next(err); }
};

// POST /api/admin/moderation/message
const messageUser = async (req, res, next) => {
  try {
    const { target, message } = req.body;
    if (!target || !message) return res.status(400).json({ success: false, message: 'Target and message are required.' });

    await createLog(req.user.name, `Message sent to "${target}"`, 'config', target);
    res.status(200).json({ success: true, message: `Message sent to "${target}".` });
  } catch (err) { next(err); }
};


module.exports = {
  getReports, resolveReport, dismissReport,
  getLogs, getModerationStats,
  banUser, warnUser, messageUser,
};
