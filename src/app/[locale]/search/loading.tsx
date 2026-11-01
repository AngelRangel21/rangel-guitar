const SKELETON_ROWS = [
  'search-skeleton-1',
  'search-skeleton-2',
  'search-skeleton-3',
  'search-skeleton-4',
  'search-skeleton-5',
  'search-skeleton-6'
] as const

export default function SearchLoading() {
  return (
    <main
      className='grow container mx-auto px-4 py-8 space-y-6'
      aria-busy='true'
    >
      <div className='h-9 w-64 max-w-full rounded bg-muted animate-pulse' />
      <div className='h-10 max-w-xl rounded-lg bg-muted animate-pulse' />

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        {SKELETON_ROWS.map((row) => (
          <div
            key={row}
            className='flex items-center gap-3 rounded-xl border border-border bg-card p-3'
          >
            <div className='w-14 h-14 rounded-md bg-muted animate-pulse shrink-0' />
            <div className='flex-1 space-y-2'>
              <div className='h-3 w-3/4 rounded bg-muted animate-pulse' />
              <div className='h-3 w-1/2 rounded bg-muted animate-pulse' />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
