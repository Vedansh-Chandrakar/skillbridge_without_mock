import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PageHeader, Card, Badge, Button, SearchInput, EmptyState,
} from '@/components/shared';
import {
  BriefcaseIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  BookmarkIcon,
  UserIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';

const CATEGORIES = [];
const ALL_GIGS = [];

export default function BrowseGigsPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [savedGigs, setSavedGigs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [budgetRange, setBudgetRange] = useState('all');
  const [campusFilter, setCampusFilter] = useState('all');
  const [showSaved, setShowSaved] = useState(false);
  const [myCampusOnly, setMyCampusOnly] = useState(false);

  const MY_CAMPUS = '';
  const campusOptions = Array.from(new Set(ALL_GIGS.map((gig) => gig.campus))).filter(Boolean);

  const toggleSave = (id) => {
    setSavedGigs((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  let filtered = ALL_GIGS.filter((g) => {
    if (showSaved) return savedGigs.includes(g.id);
    if (myCampusOnly) return g.campus === MY_CAMPUS;
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = activeCategory === 'all' || g.category === activeCategory;
    const matchCampus = campusFilter === 'all' || g.campus === campusFilter;
    let matchBudget = true;
    if (budgetRange === 'under100') matchBudget = g.budget < 100;
    else if (budgetRange === '100-200') matchBudget = g.budget >= 100 && g.budget <= 200;
    else if (budgetRange === '200-500') matchBudget = g.budget > 200 && g.budget <= 500;
    else if (budgetRange === 'over500') matchBudget = g.budget > 500;
    return matchSearch && matchCategory && matchCampus && matchBudget;
  });

  if (sortBy === 'budget-high') filtered.sort((a, b) => b.budget - a.budget);
  else if (sortBy === 'budget-low') filtered.sort((a, b) => a.budget - b.budget);

  return (
    <div>
      <PageHeader
        title="Gig Marketplace"
        subtitle="Find freelance opportunities across campuses."
        actions={
          <div className="flex items-center gap-2">
            {/* My Campus toggle */}
            <button
              onClick={() => { setMyCampusOnly(!myCampusOnly); setShowSaved(false); }}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
                myCampusOnly ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MapPinIcon className={`h-4 w-4 ${myCampusOnly ? 'text-emerald-600' : ''}`} />
              My Campus
            </button>
            {/* Saved Gigs button */}
            <button
              onClick={() => { setShowSaved(!showSaved); setMyCampusOnly(false); }}
              className={`relative flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
                showSaved ? 'border-indigo-300 bg-indigo-50 text-indigo-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {showSaved ? <BookmarkSolid className="h-4 w-4 text-indigo-500" /> : <BookmarkIcon className="h-4 w-4" />}
              Saved
              {savedGigs.length > 0 && (
                <span className={`flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                  showSaved ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'
                }`}>{savedGigs.length}</span>
              )}
            </button>
            {/* View mode toggle */}
            <div className="flex rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Squares2X2Icon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <ListBulletIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        }
      />

      {/* Category Tabs — hidden in saved/my-campus view */}
      {!showSaved && !myCampusOnly && CATEGORIES.length > 0 && (
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              activeCategory === cat.value
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.label}
            {cat.count && (
              <span className={`ml-1.5 text-xs ${activeCategory === cat.value ? 'text-indigo-200' : 'text-gray-400'}`}>
                {cat.count}
              </span>
            )}
          </button>
        ))}
      </div>
      )}

      {/* My Campus banner */}
      {myCampusOnly && (
        <div className="mb-4 flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Showing gigs from <strong>{MY_CAMPUS || 'your campus'}</strong> only</span>
          </div>
          <button onClick={() => setMyCampusOnly(false)} className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-800">
            <XMarkIcon className="h-3.5 w-3.5" /> Show all campuses
          </button>
        </div>
      )}

      {/* Saved banner */}
      {showSaved && (
        <div className="mb-4 flex items-center justify-between rounded-xl bg-indigo-50 border border-indigo-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <BookmarkSolid className="h-4 w-4 text-indigo-500" />
            <span className="text-sm font-medium text-indigo-700">Showing {savedGigs.length} saved gig{savedGigs.length !== 1 ? 's' : ''}</span>
          </div>
          <button onClick={() => setShowSaved(false)} className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700">
            <XMarkIcon className="h-3.5 w-3.5" /> Back to all gigs
          </button>
        </div>
      )}

      {/* Search & Filters */}
      {!showSaved && !myCampusOnly && (
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchInput value={search} onChange={setSearch} placeholder="Search gigs by title, skill, or keyword..." />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="newest">Newest First</option>
              <option value="budget-high">Budget: High to Low</option>
              <option value="budget-low">Budget: Low to High</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
                showFilters ? 'border-indigo-300 bg-indigo-50 text-indigo-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FunnelIcon className="h-4 w-4" /> Filters
            </button>
          </div>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Budget Range</label>
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="all">Any Budget</option>
                <option value="under100">Under $100</option>
                <option value="100-200">$100 - $200</option>
                <option value="200-500">$200 - $500</option>
                <option value="over500">$500+</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Campus</label>
              <select
                value={campusFilter}
                onChange={(e) => setCampusFilter(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="all">All Campuses</option>
                {campusOptions.map((campus) => (
                  <option key={campus} value={campus}>{campus}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="ghost" size="sm" onClick={() => { setBudgetRange('all'); setCampusFilter('all'); setSearch(''); setActiveCategory('all'); }}>
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </Card>
      )}

      <p className="text-sm text-gray-500 mb-4">{filtered.length} gig{filtered.length !== 1 ? 's' : ''} found</p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={myCampusOnly ? MapPinIcon : BookmarkIcon}
          title={showSaved ? 'No saved gigs' : myCampusOnly ? `No gigs at ${MY_CAMPUS}` : 'No gigs found'}
          description={showSaved ? 'Bookmark gigs you like to view them here.' : myCampusOnly ? 'There are no open gigs posted from your campus right now.' : 'Try adjusting your search or filters.'}
          action={
            showSaved ? (
              <Button variant="secondary" onClick={() => setShowSaved(false)}>Browse All Gigs</Button>
            ) : myCampusOnly ? (
              <Button variant="secondary" onClick={() => setMyCampusOnly(false)}>Browse All Campuses</Button>
            ) : (
              <Button variant="secondary" onClick={() => { setSearch(''); setActiveCategory('all'); setBudgetRange('all'); setCampusFilter('all'); }}>Clear Filters</Button>
            )
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((gig) => (
            <Link key={gig.id} to={`/student/gigs/${gig.id}`} className="block">
              <Card className="group hover:ring-indigo-200 transition-all h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge color="green" size="sm">{gig.status}</Badge>
                    {gig.urgent && <Badge color="red" size="sm">Urgent</Badge>}
                  </div>
                  <button
                    onClick={(e) => { e.preventDefault(); toggleSave(gig.id); }}
                    className="text-gray-300 hover:text-indigo-500 transition-colors"
                  >
                    {savedGigs.includes(gig.id) ? <BookmarkSolid className="h-5 w-5 text-indigo-500" /> : <BookmarkIcon className="h-5 w-5" />}
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {gig.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{gig.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {gig.tags.slice(0, 3).map((t) => (
                    <span key={t} className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">{t}</span>
                  ))}
                  {gig.tags.length > 3 && <span className="text-xs text-gray-400">+{gig.tags.length - 3}</span>}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <CurrencyDollarIcon className="h-4 w-4 text-emerald-500" />
                    <span className="font-semibold text-emerald-600">${gig.budget}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" /> {gig.deadline}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500">{gig.campus}</span>
                    <span className="text-xs text-gray-400">• {gig.postedAt}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <UserIcon className="h-3.5 w-3.5" /> {gig.applicants}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filtered.map((gig) => (
            <Link key={gig.id} to={`/student/gigs/${gig.id}`} className="block">
              <Card className="group hover:ring-indigo-200 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge color="green" size="sm">{gig.status}</Badge>
                      {gig.urgent && <Badge color="red" size="sm">Urgent</Badge>}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{gig.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{gig.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {gig.tags.map((t) => (
                        <span key={t} className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 shrink-0">
                    <span className="text-xl font-bold text-emerald-600">${gig.budget}</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1"><ClockIcon className="h-3.5 w-3.5" /> {gig.deadline}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><MapPinIcon className="h-3.5 w-3.5" /> {gig.campus}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><UserIcon className="h-3.5 w-3.5" /> {gig.applicants} applied</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
