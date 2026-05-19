export default function EventTypesLoading() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 md:mb-8">
        <div>
          <div className="skeleton h-7 w-36 mb-2" />
          <div className="skeleton h-4 w-52" />
        </div>
        <div className="skeleton h-10 w-40 rounded-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card">
            <div className="skeleton h-1 w-full rounded-t-2xl mb-4" />
            <div className="skeleton h-5 w-2/3 mb-2" />
            <div className="skeleton h-4 w-1/3 mb-4" />
            <div className="flex gap-2 mb-4">
              <div className="skeleton h-6 w-20 rounded-md" />
              <div className="skeleton h-6 w-16 rounded-md" />
            </div>
            <div className="border-t border-[var(--border)] pt-3">
              <div className="skeleton h-8 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
