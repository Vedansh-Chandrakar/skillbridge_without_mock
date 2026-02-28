export function SearchInput({ value, onChange, placeholder = 'Search...', className }) {
  return (
    <div className={className}>
      <div className="relative">
        <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="block w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          aria-label={placeholder}
        />
      </div>
    </div>
  );
}
