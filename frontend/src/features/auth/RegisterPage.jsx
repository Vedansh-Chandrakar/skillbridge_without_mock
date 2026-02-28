import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Select } from '@/components/shared';
import { useAuth } from '@/hooks';
import { ROLES } from '@/models';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline';

const ROLE_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'campus', label: 'Campus Authority' },
];

const STUDENT_MODE_OPTIONS = [
  { value: 'freelancer', label: 'Freelancer — I want to find work' },
  { value: 'recruiter', label: 'Recruiter — I want to hire' },
  { value: 'both', label: 'Both — I want to do both' },
];

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    studentMode: 'freelancer',
    campus: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.campus.trim()) e.campus = 'Campus is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    const isCampus = form.role === 'campus';
    const isStudent = form.role === 'student';
    const userPayload = {
      id: crypto.randomUUID(),
      name: form.fullName.trim(),
      email: form.email.trim(),
      type: isCampus ? ROLES.CAMPUS : ROLES.STUDENT,
      campusId: form.campus.trim() || undefined,
      registeredModes: isStudent ? form.studentMode : undefined,
      activeMode: isStudent
        ? (form.studentMode === 'recruiter' ? 'recruiter' : 'freelancer')
        : undefined,
    };
    login(userPayload);
    navigate(isCampus ? '/campus' : '/student');
  };

  return (
    <>
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Join the SkillBridge community
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input
          label="Full Name"
          name="fullName"
          required
          value={form.fullName}
          onChange={handleChange}
          placeholder="Jane Doe"
          icon={UserIcon}
          error={errors.fullName}
        />

        <Input
          label="Email address"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="you@university.edu"
          icon={EnvelopeIcon}
          error={errors.email}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Password"
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
            placeholder="Min 6 chars"
            icon={LockClosedIcon}
            error={errors.password}
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            required
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter"
            icon={LockClosedIcon}
            error={errors.confirmPassword}
          />
        </div>

        <Input
          label="Campus / Institution"
          name="campus"
          required
          value={form.campus}
          onChange={handleChange}
          placeholder="e.g. MIT, Stanford"
          icon={BuildingLibraryIcon}
          error={errors.campus}
        />

        <Select
          label="I am registering as"
          name="role"
          value={form.role}
          onChange={handleChange}
          options={ROLE_OPTIONS}
        />

        {form.role === 'student' && (
          <div className="animate-fade-in">
            <p className="mb-2 text-sm font-medium text-gray-700">
              What do you want to do?
            </p>
            <div className="grid gap-2">
              {STUDENT_MODE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all ${
                    form.studentMode === opt.value
                      ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="studentMode"
                    value={opt.value}
                    checked={form.studentMode === opt.value}
                    onChange={handleChange}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
          Sign in
        </Link>
      </p>
    </>
  );
}
