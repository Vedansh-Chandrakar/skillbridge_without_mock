import { useState } from 'react';
import { PageHeader, Card, CardHeader, Button, Input, Textarea } from '@/components/shared';
import { PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function PostGigPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    tags: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Gig posted successfully! (demo)');
      setForm({ title: '', description: '', budget: '', deadline: '', tags: '', category: '' });
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Post a New Gig"
        subtitle="Describe the work you need and attract talented freelancers."
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <Input
            label="Gig Title"
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Build a Portfolio Website"
            hint="Choose a clear, descriptive title"
          />

          {/* Description */}
          <Textarea
            label="Description"
            name="description"
            rows={5}
            required
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the scope, deliverables, and requirements..."
            hint="Be specific about what the freelancer will deliver"
          />

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">Select a category</option>
              <option>Web Development</option>
              <option>Mobile Development</option>
              <option>Design &amp; Creative</option>
              <option>Data &amp; Analytics</option>
              <option>Writing &amp; Content</option>
              <option>Tutoring &amp; Education</option>
              <option>Video &amp; Animation</option>
              <option>Other</option>
            </select>
          </div>

          {/* Budget & Deadline */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Budget (USD)"
              name="budget"
              type="number"
              min="1"
              required
              value={form.budget}
              onChange={handleChange}
              placeholder="150"
              hint="Set a fair budget for the work"
            />
            <Input
              label="Deadline"
              name="deadline"
              type="date"
              required
              value={form.deadline}
              onChange={handleChange}
            />
          </div>

          {/* Tags */}
          <Input
            label="Required Skills (comma-separated)"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="React, Tailwind, Frontend, TypeScript"
            hint="Help freelancers find your gig by listing relevant skills"
          />

          {/* Preview box */}
          {form.title && (
            <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-2">Preview</p>
              <h3 className="font-semibold text-gray-900">{form.title}</h3>
              {form.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{form.description}</p>
              )}
              <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                {form.budget && <span className="text-emerald-600 font-medium">${form.budget}</span>}
                {form.deadline && <span>Due {form.deadline}</span>}
                {form.category && <span className="text-indigo-600">{form.category}</span>}
              </div>
              {form.tags && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {form.tags.split(',').map((t) => t.trim()).filter(Boolean).map((t) => (
                    <span key={t} className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">{t}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <Button variant="secondary" type="button">Save Draft</Button>
            <Button type="submit" variant="gradient" loading={loading}>
              <SparklesIcon className="h-4 w-4 mr-2" />
              Publish Gig
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
