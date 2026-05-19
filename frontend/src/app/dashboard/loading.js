export default function DashboardLoading() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
      {/* Welcome banner skeleton */}
      <div className="card mb-8" style={{ height: 100 }}>
        <div className="flex items-center gap-4 p-2">
          <div className="skeleton w-14 h-14 rounded-full shrink-0" />
          <div className="flex-1">
            <div className="skeleton h-6 w-48 mb-2" />
            <div className="skeleton h-4 w-32" />
          </div>
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="card glass">
            <div className="flex items-center gap-3">
              <div className="skeleton w-11 h-11 rounded-xl shrink-0" />
              <div>
                <div className="skeleton h-3 w-20 mb-2" />
                <div className="skeleton h-7 w-10" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick access skeleton */}
      <div className="skeleton h-5 w-28 mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="card glass">
            <div className="skeleton w-12 h-12 rounded-xl mb-3" />
            <div className="skeleton h-4 w-24 mb-2" />
            <div className="skeleton h-3 w-36" />
          </div>
        ))}
      </div>
    </div>
  );
}
