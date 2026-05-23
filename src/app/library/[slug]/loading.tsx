export default function JournalDetailLoading() {
  return (
    <div className="max-w-reading mx-auto space-y-6 animate-pulse">
      <div className="h-4 w-24 bg-warm-200 dark:bg-deep-700 rounded" />
      <div className="space-y-3">
        <div className="h-4 w-32 bg-warm-200 dark:bg-deep-700 rounded" />
        <div className="h-8 w-64 bg-warm-200 dark:bg-deep-700 rounded-lg" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-warm-200 dark:bg-deep-700 rounded-full" />
          <div className="h-6 w-20 bg-warm-200 dark:bg-deep-700 rounded-full" />
        </div>
      </div>
      <hr className="border-warm-200 dark:border-deep-700" />
      <div className="space-y-2">
        <div className="h-4 w-full bg-warm-200 dark:bg-deep-700 rounded" />
        <div className="h-4 w-5/6 bg-warm-200 dark:bg-deep-700 rounded" />
        <div className="h-4 w-4/6 bg-warm-200 dark:bg-deep-700 rounded" />
        <div className="h-4 w-full bg-warm-200 dark:bg-deep-700 rounded" />
        <div className="h-4 w-3/4 bg-warm-200 dark:bg-deep-700 rounded" />
      </div>
    </div>
  );
}
