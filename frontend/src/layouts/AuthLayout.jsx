import { Outlet } from 'react-router-dom';
import { BriefcaseIcon } from '@heroicons/react/24/outline';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col justify-between gradient-primary p-12 text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 right-0 h-[500px] w-[500px] rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/3 h-64 w-64 rounded-full bg-white/5" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <BriefcaseIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">SkillBridge</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
            Connect. Create. <br />Collaborate.
          </h1>
          <p className="mt-4 text-lg text-white/80 leading-relaxed">
            The multi-campus freelancing & recruitment platform that brings students,
            recruiters, and institutions together.
          </p>
          <div className="mt-8 flex gap-8">
            <div>
              <p className="text-3xl font-bold">50+</p>
              <p className="text-sm text-white/70">Campuses</p>
            </div>
            <div>
              <p className="text-3xl font-bold">10K+</p>
              <p className="text-sm text-white/70">Students</p>
            </div>
            <div>
              <p className="text-3xl font-bold">5K+</p>
              <p className="text-sm text-white/70">Gigs Posted</p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-sm text-white/50">
          &copy; {new Date().getFullYear()} SkillBridge. All rights reserved.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-8 sm:px-8 lg:w-1/2 xl:w-[45%]">
        {/* Mobile brand */}
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-indigo-200">
            <BriefcaseIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            SkillBridge
          </span>
        </div>

        <div className="w-full max-w-[440px] animate-slide-up">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
