import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  PageHeader, Card, CardHeader, Badge, Avatar, Button, Modal, Input, Textarea, EmptyState,
} from '@/components/shared';
import {
  CurrencyDollarIcon,
  ClockIcon,
  MapPinIcon,
  CalendarDaysIcon,
  UserIcon,
  TagIcon,
  BookmarkIcon,
  ShareIcon,
  FlagIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  BriefcaseIcon,
  StarIcon,
  ClipboardDocumentIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';

const GIGS_DB = {};
const DEFAULT_GIG = {
  id: '',
  title: '',
  description: '',
  budget: 0,
  tags: [],
  status: '',
  campus: '',
  category: '',
  postedBy: { name: '', avatar: null, rating: 0, gigsPosted: 0 },
  deadline: '',
  createdAt: '',
  applicants: 0,
  views: 0,
  deliverables: [],
  requirements: [],
};

const similarGigs = [];

export default function GigDetailsPage() {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const gig = GIGS_DB[gigId] || DEFAULT_GIG;

  const [saved, setSaved] = useState(false);
  const [showApply, setShowApply] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyForm, setApplyForm] = useState({ budget: '', coverLetter: '', timeline: '' });
  const [applyLoading, setApplyLoading] = useState(false);

  // Share
  const [copied, setCopied] = useState(false);
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Report
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSent, setReportSent] = useState(false);
  const handleReport = (e) => {
    e.preventDefault();
    setReportSent(true);
    setTimeout(() => { setShowReport(false); setReportSent(false); setReportReason(''); setReportDetails(''); }, 1500);
  };

  // Message Recruiter
  const [showMessage, setShowMessage] = useState(false);
  const [msgText, setMsgText] = useState('');
  const [msgSent, setMsgSent] = useState(false);
  const handleMessage = (e) => {
    e.preventDefault();
    setMsgSent(true);
    setTimeout(() => { setShowMessage(false); setMsgSent(false); setMsgText(''); }, 1500);
  };

  // View Profile
  const [showProfile, setShowProfile] = useState(false);

  const handleApply = (e) => {
    e.preventDefault();
    setApplyLoading(true);
    setTimeout(() => {
      setApplyLoading(false);
      setShowApply(false);
      setApplied(true);
    }, 1200);
  };

  const daysLeft = gig.deadline
    ? Math.max(0, Math.ceil((new Date(gig.deadline) - new Date()) / 86400000))
    : 0;

  return (
    <>
      {/* Back nav */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4" /> Back to Gigs
      </button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Main Content ────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Badge color="green" dot>{gig.status}</Badge>
                <Badge color="blue" size="sm">{gig.category}</Badge>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSaved(!saved)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  title={saved ? 'Unsave' : 'Save gig'}
                >
                  {saved ? <BookmarkSolid className="h-5 w-5 text-indigo-500" /> : <BookmarkIcon className="h-5 w-5" />}
                </button>
                <button onClick={handleShare} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" title={copied ? 'Copied!' : 'Copy link'}>
                  {copied ? <CheckIcon className="h-5 w-5 text-emerald-500" /> : <ShareIcon className="h-5 w-5" />}
                </button>
                <button onClick={() => setShowReport(true)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Report">
                  <FlagIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900">{gig.title}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <CurrencyDollarIcon className="h-4 w-4 text-emerald-500" />
                <span className="text-lg font-bold text-emerald-600">${gig.budget}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPinIcon className="h-4 w-4" /> {gig.campus}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDaysIcon className="h-4 w-4" /> Due {gig.deadline || '—'}
              </span>
              <span className="flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4" />
                <span className={daysLeft <= 3 ? 'text-red-600 font-medium' : ''}>{daysLeft} days left</span>
              </span>
              <span className="flex items-center gap-1.5">
                <EyeIcon className="h-4 w-4" /> {gig.views} views
              </span>
              <span className="flex items-center gap-1.5">
                <UserIcon className="h-4 w-4" /> {gig.applicants} applicants
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {gig.tags.map((t) => (
                <span key={t} className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 ring-1 ring-inset ring-indigo-200/50">
                  {t}
                </span>
              ))}
            </div>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader title="Description" />
            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
              {gig.description}
            </div>
          </Card>

          {/* Deliverables */}
          {gig.deliverables && (
            <Card>
              <CardHeader title="Deliverables" />
              <ul className="space-y-2">
                {gig.deliverables.map((d, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-700">{d}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Requirements */}
          {gig.requirements && (
            <Card>
              <CardHeader title="Requirements" />
              <ul className="space-y-2">
                {gig.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-2 h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                    <span className="text-sm text-gray-700">{r}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Similar Gigs */}
          <Card>
            <CardHeader title="Similar Gigs" />
            {similarGigs.length === 0 ? (
              <EmptyState
                title="No similar gigs"
                description="Similar gigs will appear here once available."
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-3">
                {similarGigs.map((sg) => (
                  <Link
                    key={sg.id}
                    to={`/student/gigs/${sg.id}`}
                    className="rounded-xl border border-gray-100 p-4 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
                  >
                    <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors text-sm">{sg.title}</h4>
                    <p className="text-sm text-emerald-600 font-medium mt-1">${sg.budget}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {sg.tags.map((t) => (
                        <span key={t} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">{t}</span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{sg.campus}</p>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* ── Sidebar ────────────────── */}
        <div className="space-y-6">
          {/* Apply Card */}
          <Card>
            {applied ? (
              <div className="text-center py-4">
                <div className="mx-auto h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                  <CheckCircleIcon className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Application Submitted!</h3>
                <p className="text-sm text-gray-500 mt-1">The recruiter will review your application.</p>
                <Link to="/student/applications">
                  <Button variant="secondary" size="sm" className="mt-3">View My Applications</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-gray-900">${gig.budget}</p>
                  <p className="text-sm text-gray-500">Fixed Price</p>
                </div>
                <Button
                  variant="gradient"
                  className="w-full"
                  size="lg"
                  onClick={() => setShowApply(true)}
                >
                  Apply Now
                </Button>
                <Button variant="secondary" className="w-full mt-2" onClick={() => setShowMessage(true)}>
                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                  Message Recruiter
                </Button>
                <div className="mt-4 space-y-2 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Applicants</span>
                    <span className="font-medium text-gray-900">{gig.applicants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Posted</span>
                    <span className="font-medium text-gray-900">
                      {gig.createdAt ? new Date(gig.createdAt).toLocaleDateString() : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deadline</span>
                    <span className={`font-medium ${daysLeft <= 3 ? 'text-red-600' : 'text-gray-900'}`}>
                      {gig.deadline || '—'}
                    </span>
                  </div>
                </div>
              </>
            )}
          </Card>

          {/* Recruiter Card */}
          <Card>
            <CardHeader title="Posted By" />
            <div className="flex items-center gap-3 mb-3">
              <Avatar name={gig.postedBy.name} size="md" color="indigo" />
              <div>
                <p className="font-semibold text-gray-900">{gig.postedBy.name}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1 text-amber-600">
                    <StarIcon className="h-3.5 w-3.5" /> {gig.postedBy.rating}
                  </span>
                  <span>•</span>
                  <span>{gig.postedBy.gigsPosted} gigs</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full" onClick={() => setShowProfile(true)}>View Profile</Button>
          </Card>

          {/* Safety Tips */}
          <Card className="bg-amber-50/50 ring-amber-200/50">
            <h4 className="text-sm font-semibold text-amber-800 mb-2">Safety Tips</h4>
            <ul className="space-y-1.5 text-xs text-amber-700">
              <li>• Never share personal financial information.</li>
              <li>• Use the platform's payment system.</li>
              <li>• Report suspicious activity immediately.</li>
              <li>• Verify the recruiter's campus affiliation.</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* ── Apply Modal ───────────── */}
      <Modal open={showApply} onClose={() => setShowApply(false)} title="Apply for Gig" size="lg">
        <form onSubmit={handleApply} className="space-y-5">
          <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
            <h4 className="font-semibold text-gray-900">{gig.title}</h4>
            <p className="text-sm text-gray-500 mt-1">Budget: <span className="text-emerald-600 font-medium">${gig.budget}</span></p>
          </div>

          <Input
            label="Your Proposed Budget (USD)"
            type="number"
            min="1"
            required
            value={applyForm.budget}
            onChange={(e) => setApplyForm((p) => ({ ...p, budget: e.target.value }))}
            placeholder={`Suggested: $${gig.budget}`}
            hint="You can propose a different amount"
          />

          <Input
            label="Estimated Timeline"
            required
            value={applyForm.timeline}
            onChange={(e) => setApplyForm((p) => ({ ...p, timeline: e.target.value }))}
            placeholder="e.g. 2 weeks"
          />

          <Textarea
            label="Cover Letter"
            rows={5}
            required
            value={applyForm.coverLetter}
            onChange={(e) => setApplyForm((p) => ({ ...p, coverLetter: e.target.value }))}
            placeholder="Explain why you're the best fit for this gig. Mention relevant experience, skills, and your approach..."
            hint="A strong cover letter increases your chances of being accepted"
          />

          <div className="rounded-xl bg-indigo-50 p-3 text-xs text-indigo-700">
            <strong>Tip:</strong> Include links to your portfolio or relevant work samples to stand out!
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => setShowApply(false)}>Cancel</Button>
            <Button type="submit" variant="gradient" loading={applyLoading}>
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Report Modal ─────────────── */}
      <Modal open={showReport} onClose={() => setShowReport(false)} title="Report Gig" size="md">
        {reportSent ? (
          <div className="text-center py-6">
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
              <CheckCircleIcon className="h-7 w-7 text-emerald-600" />
            </div>
            <p className="font-semibold text-gray-900">Report Submitted</p>
            <p className="text-sm text-gray-500 mt-1">Our team will review this gig.</p>
          </div>
        ) : (
          <form onSubmit={handleReport} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <select
                required
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select a reason...</option>
                <option>Spam or misleading</option>
                <option>Inappropriate content</option>
                <option>Fraudulent gig</option>
                <option>Outside platform rules</option>
                <option>Other</option>
              </select>
            </div>
            <Textarea
              label="Additional Details (optional)"
              rows={3}
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder="Any additional context..."
            />
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <Button variant="secondary" type="button" onClick={() => setShowReport(false)}>Cancel</Button>
              <Button variant="danger" type="submit">Submit Report</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* ── Message Recruiter Modal ───── */}
      <Modal open={showMessage} onClose={() => setShowMessage(false)} title={`Message ${gig.postedBy.name}`} size="md">
        {msgSent ? (
          <div className="text-center py-6">
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
              <CheckCircleIcon className="h-7 w-7 text-emerald-600" />
            </div>
            <p className="font-semibold text-gray-900">Message Sent!</p>
            <p className="text-sm text-gray-500 mt-1">{gig.postedBy.name} will reply soon.</p>
          </div>
        ) : (
          <form onSubmit={handleMessage} className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
              <Avatar name={gig.postedBy.name} size="sm" color="indigo" />
              <div>
                <p className="text-sm font-semibold text-gray-900">{gig.postedBy.name}</p>
                <p className="text-xs text-gray-500">Re: {gig.title}</p>
              </div>
            </div>
            <Textarea
              label="Your Message"
              rows={4}
              required
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              placeholder={`Hi ${gig.postedBy.name.split(' ')[0]}, I'm interested in your gig...`}
            />
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <Button variant="secondary" type="button" onClick={() => setShowMessage(false)}>Cancel</Button>
              <Button variant="gradient" type="submit">Send Message</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* ── Recruiter Profile Modal ───── */}
      <Modal open={showProfile} onClose={() => setShowProfile(false)} title="Recruiter Profile" size="md">
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar name={gig.postedBy.name} size="lg" color="indigo" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">{gig.postedBy.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                <MapPinIcon className="h-3.5 w-3.5" /> {gig.campus}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className={`h-3.5 w-3.5 ${i < Math.floor(gig.postedBy.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                ))}
                <span className="text-sm font-medium text-gray-700 ml-1">{gig.postedBy.rating}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-indigo-50 p-4 text-center">
              <p className="text-2xl font-bold text-indigo-700">{gig.postedBy.gigsPosted}</p>
              <p className="text-xs text-indigo-500 mt-0.5">Gigs Posted</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4 text-center">
              <p className="text-2xl font-bold text-emerald-700">{gig.postedBy.rating}</p>
              <p className="text-xs text-emerald-500 mt-0.5">Avg. Rating</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="gradient" className="flex-1" onClick={() => { setShowProfile(false); setShowMessage(true); }}>
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" /> Send Message
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => setShowProfile(false)}>Close</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
