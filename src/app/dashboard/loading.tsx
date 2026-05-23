export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-32 bg-warm-200 dark:bg-deep-700 rounded-lg" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white dark:bg-deep-800 rounded-2xl p-4 border border-warm-200 dark:border-deep-700">
            <div className="h-3 w-12 bg-warm-200 dark:bg-deep-700 rounded mb-2" />
            <div className="h-6 w-16 bg-warm-200 dark:bg-deep-700 rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-deep-800 rounded-2xl p-5 border border-warm-200 dark:border-deep-700">
        <div className="h-4 w-20 bg-warm-200 dark:bg-deep-700 rounded mb-4" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-14 bg-warm-100 dark:bg-deep-700 rounded-xl mb-2" />
        ))}
      </div>
    </div>
  );
}
