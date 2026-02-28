import { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  BuildingLibraryIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  BellIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  UserCircleIcon,
  DocumentCheckIcon,
  CloudArrowUpIcon,
  FlagIcon,
  GlobeAltIcon,
  SparklesIcon,
  XMarkIcon,
  CheckCircleIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { useAuth, useRole } from '@/hooks';
import { ROLES } from '@/models';
import { Avatar, Dropdown, Badge } from '@/components/shared';
import { ModeToggle } from '@/components/shared';
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
  useSidebar,
} from '@/components/ui/sidebar';

/* ── Notifications data ─────────────────────────────────── */
const INITIAL_NOTIFICATIONS = [];

const NOTIF_ICON_COLORS = {
  campus:       'bg-blue-100 text-blue-600',
  verification: 'bg-amber-100 text-amber-600',
  gig:          'bg-emerald-100 text-emerald-600',
  user:         'bg-purple-100 text-purple-600',
  system:       'bg-gray-100 text-gray-500',
};

const NOTIF_FILTERS = ['All', 'Campus', 'Verification', 'Gig', 'User', 'System'];

function NotifIcon({ type, size = 'sm' }) {
  const cls = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  if (type === 'campus')       return <BuildingLibraryIcon className={cls} />;
  if (type === 'verification') return <ShieldCheckIcon     className={cls} />;
  if (type === 'gig')          return <BriefcaseIcon       className={cls} />;
  if (type === 'user')         return <UsersIcon           className={cls} />;
  return                              <Cog6ToothIcon       className={cls} />;
}

/* ── Compact panel (dropdown) ───────────────────────────── */
function NotificationsPanel({ notifs, markAllRead, markRead, onViewAll }) {
  const unreadCount = notifs.filter((n) => !n.read).length;
  const preview = notifs.slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="fixed right-4 top-[4.5rem] w-96 z-[200] rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-gray-200/60 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-[22rem] overflow-y-auto divide-y divide-gray-50">
        {preview.map((n) => (
          <button
            key={n.id}
            onClick={() => markRead(n.id)}
            className={`w-full flex items-start gap-3 px-5 py-3.5 text-left transition-colors hover:bg-gray-50 ${
              !n.read ? 'bg-indigo-50/40' : ''
            }`}
          >
            <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl ${NOTIF_ICON_COLORS[n.type]}`}>
              <NotifIcon type={n.type} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                  {n.title}
                </p>
                {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 flex-shrink-0" />}
              </div>
              <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{n.desc}</p>
              <p className="mt-1 text-[10px] text-gray-400">{n.time}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
        <button
          onClick={onViewAll}
          className="w-full text-center text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          View all notifications ({notifs.length})
        </button>
      </div>
    </motion.div>
  );
}

/* ── Full-screen drawer ─────────────────────────────────── */
function NotificationsDrawer({ notifs, markAllRead, markRead, onClose }) {
  const [filter, setFilter] = useState('All');
  const unreadCount = notifs.filter((n) => !n.read).length;

  const filtered = filter === 'All'
    ? notifs
    : notifs.filter((n) => n.type === filter.toLowerCase());

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[250] bg-black/25 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="fixed inset-y-0 right-0 z-[260] flex w-full max-w-md flex-col bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
              <BellIcon className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">All Notifications</h2>
              <p className="text-xs text-gray-500">{unreadCount} unread · {notifs.length} total</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <CheckCircleIcon className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 overflow-x-auto px-6 py-3 border-b border-gray-100 scrollbar-hide">
          {NOTIF_FILTERS.map((f) => {
            const count = f === 'All'
              ? notifs.filter((n) => !n.read).length
              : notifs.filter((n) => n.type === f.toLowerCase() && !n.read).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  filter === f
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f}
                {count > 0 && (
                  <span className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                    filter === f ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 mb-3">
                <BellIcon className="h-7 w-7 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-600">No notifications</p>
              <p className="text-xs text-gray-400 mt-1">Nothing in this category yet</p>
            </div>
          ) : (
            filtered.map((n) => (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`w-full flex items-start gap-4 px-6 py-4 text-left transition-colors hover:bg-gray-50 ${
                  !n.read ? 'bg-indigo-50/40' : ''
                }`}
              >
                <div className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${NOTIF_ICON_COLORS[n.type]}`}>
                  <NotifIcon type={n.type} size="md" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm leading-snug ${
                      !n.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                    }`}>
                      {n.title}
                    </p>
                    {!n.read && <span className="mt-1.5 h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />}
                  </div>
                  <p className="mt-1 text-xs text-gray-500 leading-relaxed">{n.desc}</p>
                  <p className="mt-1.5 text-[10px] font-medium text-gray-400">{n.time}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </motion.div>
    </>
  );
}

/* ── Sidebar link configs per role ─────────────────────── */
const linksByRole = {
  admin: [
    { to: '/admin', label: 'Dashboard', icon: HomeIcon },
    { to: '/admin/campuses', label: 'Campuses', icon: BuildingLibraryIcon },
    { to: '/admin/users', label: 'Users', icon: UsersIcon },
    { to: '/admin/verifications', label: 'Verifications', icon: ShieldCheckIcon },
    { to: '/admin/analytics', label: 'Analytics', icon: ChartBarIcon },
    { to: '/admin/moderation', label: 'Moderation', icon: FlagIcon },
    { to: '/admin/chat', label: 'Messages', icon: ChatBubbleLeftRightIcon },
    { to: '/admin/profile', label: 'My Profile', icon: UserCircleIcon },
  ],
  campus: [
    { to: '/campus', label: 'Dashboard', icon: HomeIcon },
    { to: '/campus/students', label: 'Students', icon: AcademicCapIcon },
    { to: '/campus/gigs', label: 'Gig Monitor', icon: BriefcaseIcon },
    { to: '/campus/activity', label: 'Activity', icon: ChartBarIcon },
    { to: '/campus/verifications', label: 'Verifications', icon: DocumentCheckIcon },
    { to: '/campus/opportunities', label: 'Opportunities', icon: BuildingLibraryIcon },
    { to: '/campus/analytics', label: 'Analytics', icon: ChartBarIcon },
    { to: '/campus/chat', label: 'Messages', icon: ChatBubbleLeftRightIcon },
    { to: '/campus/profile', label: 'Campus Profile', icon: UserCircleIcon },
  ],
  freelancer: [
    { to: '/student', label: 'Dashboard', icon: HomeIcon },
    { to: '/student/profile', label: 'My Profile', icon: UserCircleIcon },
    { to: '/student/gigs', label: 'Browse Gigs', icon: BriefcaseIcon },
    { to: '/student/applications', label: 'Applications', icon: ClipboardDocumentListIcon },
    { to: '/student/submissions', label: 'Submissions', icon: CloudArrowUpIcon },
    { to: '/student/analytics', label: 'Analytics', icon: ChartBarIcon },
    { to: '/student/advanced', label: 'AI & Reputation', icon: SparklesIcon },
    { to: '/student/chat', label: 'Messages', icon: ChatBubbleLeftRightIcon },
  ],
  recruiter: [
    { to: '/student', label: 'Dashboard', icon: HomeIcon },
    { to: '/student/profile', label: 'My Profile', icon: UserCircleIcon },
    { to: '/student/post-gig', label: 'Post a Gig', icon: BriefcaseIcon },
    { to: '/student/my-gigs', label: 'My Gigs', icon: ClipboardDocumentListIcon },
    { to: '/student/applicants', label: 'Applicants', icon: UserGroupIcon },
    { to: '/student/recruitment-status', label: 'Pipeline', icon: ChartBarIcon },
    { to: '/student/analytics', label: 'Analytics', icon: ChartBarIcon },
    { to: '/student/advanced', label: 'AI & Reputation', icon: SparklesIcon },
    { to: '/student/chat', label: 'Messages', icon: ChatBubbleLeftRightIcon },
  ],
};

const sectionDividers = {
  admin: { 4: 'Management', 0: 'Overview' },
  campus: { 3: 'Monitor', 0: 'Overview' },
  freelancer: { 2: 'Marketplace', 6: 'Advanced', 0: 'Overview' },
  recruiter: { 2: 'Hiring', 6: 'Advanced', 0: 'Overview' },
};

/* ── Brand Logo — shown inside the animated sidebar ────── */
function SidebarBrand() {
  const { open, animate } = useSidebar();
  return (
    <div className="flex h-12 items-center gap-3 mb-2 px-1">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-indigo-200">
        <BriefcaseIcon className="h-5 w-5 text-white" />
      </div>
      <motion.span
        animate={{
          display: animate ? (open ? 'inline-block' : 'none') : 'inline-block',
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        transition={{ duration: 0.15 }}
        className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-pre overflow-hidden"
      >
        SkillBridge
      </motion.span>
    </div>
  );
}

/* ── Section label — hidden when collapsed ──────────────── */
function SectionLabel({ label }) {
  const { open, animate } = useSidebar();
  return (
    <motion.p
      animate={{
        display: animate ? (open ? 'block' : 'none') : 'block',
        opacity: animate ? (open ? 1 : 0) : 1,
      }}
      transition={{ duration: 0.1 }}
      className="mb-1 mt-4 px-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 first:mt-0 overflow-hidden"
    >
      {label}
    </motion.p>
  );
}

/* ── User card at bottom of sidebar ────────────────────── */
function SidebarUserCard({ user, effectiveRole, onLogout }) {
  const { open, animate } = useSidebar();
  return (
    <div className="border-t border-gray-100 pt-3 mt-2">
      <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-2.5">
        <Avatar name={user?.name} size="sm" status="online" />
        <motion.div
          animate={{
            display: animate ? (open ? 'block' : 'none') : 'block',
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          transition={{ duration: 0.15 }}
          className="min-w-0 flex-1 overflow-hidden"
        >
          <p className="truncate text-sm font-semibold text-gray-900 whitespace-pre">
            {user?.name}
          </p>
          <p className="truncate text-xs text-gray-500 capitalize">{effectiveRole}</p>
        </motion.div>
        <motion.button
          animate={{
            display: animate ? (open ? 'flex' : 'none') : 'flex',
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          transition={{ duration: 0.1 }}
          onClick={onLogout}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 flex-shrink-0"
          aria-label="Logout"
        >
          <ArrowRightStartOnRectangleIcon className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
export function DashboardLayout() {
  const { user, logout } = useAuth();
  const { effectiveRole } = useRole();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifs, setNotifs] = useState(INITIAL_NOTIFICATIONS);
  const notifRef = useRef(null);

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const unreadCount = notifs.filter((n) => !n.read).length;

  const handleViewAll = () => {
    setNotifOpen(false);
    setDrawerOpen(true);
  };

  // Close notification panel on outside click
  useEffect(() => {
    function handleOutsideClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [notifOpen]);

  const links = linksByRole[effectiveRole] ?? [];
  const dividers = sectionDividers[effectiveRole] ?? {};
  const isStudent = user?.type === ROLES.STUDENT;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const profileItems = [
    {
      label: 'My Profile',
      icon: UserCircleIcon,
      onClick: () => {
        if (effectiveRole === 'admin')   return navigate('/admin/profile');
        if (effectiveRole === 'campus')  return navigate('/campus/profile');
        navigate('/student/profile');
      },
    },
    { divider: true, key: 'div1' },
    {
      label: 'Sign out',
      icon: ArrowRightStartOnRectangleIcon,
      onClick: handleLogout,
      danger: true,
    },
  ];

  /* Convert role links → SidebarLink items format */
  const sidebarLinkItems = links.map((l) => ({
    href: l.to,
    label: l.label,
    icon: <l.icon className="h-5 w-5 flex-shrink-0" />,
    _dividerLabel: dividers[links.indexOf(l)],
  }));

  const sidebarContent = (
    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <SidebarBrand />

      {/* Mode toggle (students only) */}
      {isStudent && (
        <div className="mb-3 rounded-xl border border-gray-100 bg-gray-50/50 px-2 py-2.5">
          <ModeToggle />
        </div>
      )}

      <nav className="flex flex-col gap-0.5 flex-1" aria-label="Main navigation">
        {sidebarLinkItems.map((item, i) => (
          <div key={item.href}>
            {item._dividerLabel && <SectionLabel label={item._dividerLabel} />}
            <SidebarLink
              link={{ href: item.href, label: item.label, icon: item.icon }}
              onClick={() => setSidebarOpen(false)}
            />
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* ── Animated Sidebar ────────────────────────────── */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} animate={true}>
        <SidebarBody className="justify-between gap-4">
          {sidebarContent}
          <SidebarUserCard
            user={user}
            effectiveRole={effectiveRole}
            onLogout={handleLogout}
          />
        </SidebarBody>
      </Sidebar>

      {/* ── Main column ─────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top Navbar — only visible md+ since MobileSidebar renders on mobile */}
        <header className="hidden md:flex h-16 items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md px-6 lg:px-8 flex-shrink-0 relative z-10">
          {/* Welcome */}
          <p className="text-sm text-gray-500">
            Welcome back,{' '}
            <span className="font-semibold text-gray-900">
              {user?.name?.split(' ')[0]}
            </span>
          </p>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className={`relative rounded-xl p-2 transition-colors ${
                  notifOpen ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'
                }`}
                aria-label="Notifications"
              >
                <BellIcon className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
                  </span>
                )}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <NotificationsPanel
                    notifs={notifs}
                    markAllRead={markAllRead}
                    markRead={markRead}
                    onViewAll={handleViewAll}
                  />
                )}
              </AnimatePresence>
            </div>

            <Dropdown
              trigger={
                <button className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-gray-100">
                  <Avatar name={user?.name} size="sm" />
                  <span className="hidden text-sm font-medium text-gray-700 sm:block">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>
              }
              items={profileItems}
            />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ── Notifications drawer ─────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <NotificationsDrawer
            notifs={notifs}
            markAllRead={markAllRead}
            markRead={markRead}
            onClose={() => setDrawerOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

