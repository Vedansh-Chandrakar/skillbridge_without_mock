import { useState } from 'react';
import {
  PageHeader, Card, CardHeader, Badge, Button, Modal, Textarea, EmptyState,
} from '@/components/shared';
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  PaperClipIcon,
  ChatBubbleLeftRightIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

const SUBMISSIONS = [];
const AVAILABLE_GIGS = [];

const statusConfig = {
  approved: { color: 'green', label: 'Approved', icon: CheckCircleIcon },
  under_review: { color: 'yellow', label: 'Under Review', icon: ClockIcon },
  revision_requested: { color: 'red', label: 'Revision Requested', icon: ExclamationCircleIcon },
  submitted: { color: 'blue', label: 'Submitted', icon: CloudArrowUpIcon },
};

export default function WorkSubmissionsPage() {
  const [submissions, setSubmissions] = useState(SUBMISSIONS);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [submitForm, setSubmitForm] = useState({ notes: '', files: [] });

  return (
    <div>
      <PageHeader
        title="Work Submissions"
        subtitle="Submit deliverables and track approval status."
        actions={
          <Button variant="gradient" onClick={() => setShowSubmitModal(true)}>
            <CloudArrowUpIcon className="h-4 w-4 mr-2" /> New Submission
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: 'Total Submitted', value: submissions.length, cls: 'text-gray-900', bg: 'bg-gray-50', Icon: DocumentTextIcon },
          { label: 'Approved', value: submissions.filter((s) => s.status === 'approved').length, cls: 'text-emerald-600', bg: 'bg-emerald-50', Icon: CheckCircleIcon },
          { label: 'Under Review', value: submissions.filter((s) => s.status === 'under_review').length, cls: 'text-amber-600', bg: 'bg-amber-50', Icon: ClockIcon },
          { label: 'Needs Revision', value: submissions.filter((s) => s.status === 'revision_requested').length, cls: 'text-red-600', bg: 'bg-red-50', Icon: ExclamationCircleIcon },
        ].map((c) => (
          <Card key={c.label}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                <c.Icon className={`h-5 w-5 ${c.cls}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{c.label}</p>
                <p className={`text-2xl font-bold ${c.cls}`}>{c.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <EmptyState
          icon={CloudArrowUpIcon}
          title="No submissions yet"
          description="Submit your first deliverable after being accepted for a gig."
        />
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => {
            const config = statusConfig[sub.status];
            const StatusIcon = config.icon;
            return (
              <Card key={sub.id} className="hover:ring-indigo-200 transition-all cursor-pointer" onClick={() => setSelectedSub(sub)}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${sub.status === 'approved' ? 'bg-emerald-50' : sub.status === 'revision_requested' ? 'bg-red-50' : 'bg-amber-50'} flex items-center justify-center shrink-0`}>
                    <StatusIcon className={`h-6 w-6 ${sub.status === 'approved' ? 'text-emerald-600' : sub.status === 'revision_requested' ? 'text-red-600' : 'text-amber-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{sub.gigTitle}</h3>
                      <Badge color={config.color} size="sm">{config.label}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">For {sub.recruiter} • Submitted {new Date(sub.submittedAt).toLocaleDateString()}</p>
                    {sub.notes && <p className="text-sm text-gray-600 mt-1 line-clamp-1">{sub.notes}</p>}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <PaperClipIcon className="h-3.5 w-3.5" /> {sub.files.length} files
                    </div>
                    {sub.status === 'revision_requested' && (
                      <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); setShowSubmitModal(true); }}>
                        <ArrowPathIcon className="h-3.5 w-3.5 mr-1" /> Resubmit
                      </Button>
                    )}
                  </div>
                </div>

                {/* Feedback (if any) */}
                {sub.feedback && (
                  <div className={`mt-3 rounded-xl p-3 ${sub.status === 'approved' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                    <p className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <ChatBubbleLeftRightIcon className="h-3.5 w-3.5" /> Recruiter Feedback
                    </p>
                    <p className={`text-sm ${sub.status === 'approved' ? 'text-emerald-700' : 'text-red-700'}`}>{sub.feedback}</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Submission Detail Modal ── */}
      <Modal open={!!selectedSub} onClose={() => setSelectedSub(null)} title="Submission Details" size="md">
        {selectedSub && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{selectedSub.gigTitle}</h3>
              <p className="text-sm text-gray-500 mt-1">For {selectedSub.recruiter}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge color={statusConfig[selectedSub.status].color} size="lg">{statusConfig[selectedSub.status].label}</Badge>
                <span className="text-xs text-gray-400">Submitted {new Date(selectedSub.submittedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {selectedSub.notes && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Your Notes</h4>
                <p className="text-sm text-gray-600">{selectedSub.notes}</p>
              </div>
            )}

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Attached Files</h4>
              <div className="space-y-2">
                {selectedSub.files.map((file, i) => {
                  const ext = file.split('.').pop();
                  const colors = { pdf: 'bg-red-50 text-red-600', csv: 'bg-green-50 text-green-600', zip: 'bg-purple-50 text-purple-600', fig: 'bg-pink-50 text-pink-600', md: 'bg-gray-50 text-gray-600', txt: 'bg-blue-50 text-blue-600' };
                  return (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                      <div className={`w-9 h-9 rounded-lg ${colors[ext] || 'bg-gray-50 text-gray-600'} flex items-center justify-center`}>
                        <span className="text-[10px] font-bold uppercase">{ext}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 flex-1">{file}</span>
                      <button className="text-gray-400 hover:text-indigo-600"><EyeIcon className="h-4 w-4" /></button>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedSub.feedback && (
              <div className={`rounded-xl p-4 ${selectedSub.status === 'approved' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Recruiter Feedback</h4>
                <p className={`text-sm ${selectedSub.status === 'approved' ? 'text-emerald-700' : 'text-red-700'}`}>{selectedSub.feedback}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2 border-t border-gray-100">
              {selectedSub.status === 'revision_requested' && (
                <Button variant="gradient" className="flex-1" onClick={() => { setSelectedSub(null); setShowSubmitModal(true); }}>
                  <ArrowPathIcon className="h-4 w-4 mr-2" /> Resubmit
                </Button>
              )}
              <Button variant="secondary" className="flex-1" onClick={() => setSelectedSub(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── New Submission Modal ── */}
      <Modal open={showSubmitModal} onClose={() => setShowSubmitModal(false)} title="Submit Deliverables" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Gig</label>
            <select className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 focus:outline-none">
              {AVAILABLE_GIGS.length === 0 ? (
                <option disabled>No gigs available</option>
              ) : (
                AVAILABLE_GIGS.map((gig) => (
                  <option key={gig.id} value={gig.id}>{gig.label}</option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Files</label>
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-center">
              <CloudArrowUpIcon className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-2 text-sm font-medium text-gray-700">Drag & drop files here</p>
              <p className="text-xs text-gray-400 mt-1">ZIP, PDF, DOC, FIG, PSD up to 25MB each</p>
              <Button variant="secondary" size="sm" className="mt-3">Browse Files</Button>
            </div>
          </div>

          <Textarea
            label="Notes for Recruiter"
            placeholder="Describe what you've delivered, any special instructions..."
            rows={3}
            value={submitForm.notes}
            onChange={(e) => setSubmitForm((p) => ({ ...p, notes: e.target.value }))}
          />

          <div className="flex gap-3 pt-2">
            <Button variant="gradient" className="flex-1">
              <CloudArrowUpIcon className="h-4 w-4 mr-2" /> Submit
            </Button>
            <Button variant="secondary" onClick={() => setShowSubmitModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
