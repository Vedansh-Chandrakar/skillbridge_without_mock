/**
 * @typedef {'admin' | 'campus' | 'student'} UserType
 * @typedef {'freelancer' | 'recruiter'} StudentMode
 *
 * @typedef {Object} User
 * @property {string}      id
 * @property {string}      name
 * @property {string}      email
 * @property {string}      avatar
 * @property {UserType}    type        - admin | campus | student
 * @property {StudentMode} [activeMode]- only for students
 * @property {string}      [campusId]  - campus the user belongs to
 *
 * @typedef {Object} Campus
 * @property {string}   id
 * @property {string}   name
 * @property {string}   logo
 * @property {string}   domain
 * @property {boolean}  isActive
 * @property {string}   createdAt
 *
 * @typedef {'open' | 'in_progress' | 'completed' | 'cancelled'} GigStatus
 *
 * @typedef {Object} Gig
 * @property {string}    id
 * @property {string}    title
 * @property {string}    description
 * @property {number}    budget
 * @property {string}    currency
 * @property {string[]}  tags
 * @property {GigStatus} status
 * @property {string}    postedBy      - userId of recruiter
 * @property {string}    campusId
 * @property {string}    createdAt
 * @property {string}    deadline
 *
 * @typedef {'pending' | 'accepted' | 'rejected' | 'withdrawn'} ApplicationStatus
 *
 * @typedef {Object} Application
 * @property {string}            id
 * @property {string}            gigId
 * @property {string}            applicantId
 * @property {string}            coverLetter
 * @property {number}            proposedBudget
 * @property {ApplicationStatus} status
 * @property {string}            createdAt
 */

export const ROLES = Object.freeze({
  ADMIN: 'admin',
  CAMPUS: 'campus',
  STUDENT: 'student',
});

export const STUDENT_MODES = Object.freeze({
  FREELANCER: 'freelancer',
  RECRUITER: 'recruiter',
});

export const GIG_STATUSES = Object.freeze({
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
});

export const APPLICATION_STATUSES = Object.freeze({
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
});
