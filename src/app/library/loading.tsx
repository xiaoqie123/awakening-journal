export default function LibraryLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-40 bg-warm-200 dark:bg-deep-700 rounded-lg" />
      <div className="h-10 bg-white dark:bg-deep-800 rounded-xl border border-warm-200 dark:border-deep-700" />
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-16 bg-white dark:bg-deep-800 rounded-xl border border-warm-200 dark:border-deep-700" />
        ))}
      </div>
    </div>
  );
}
