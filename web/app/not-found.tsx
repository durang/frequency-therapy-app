import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0f] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🔊</div>
        <h1
          className="text-3xl font-light mb-3 text-gray-900 dark:text-white/90"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Page not found
        </h1>
        <p className="text-sm text-gray-500 dark:text-white/35 mb-8 leading-relaxed">
          The frequency you&apos;re looking for doesn&apos;t exist — but we have 23 that do.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="text-sm px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium hover:bg-gray-700 dark:hover:bg-gray-100 transition-all"
          >
            Go Home
          </Link>
          <Link
            href="/frequencies"
            className="text-sm px-6 py-3 rounded-xl border border-gray-200 dark:border-white/[0.06] text-gray-600 dark:text-white/40 hover:border-gray-300 dark:hover:border-white/10 transition-all"
          >
            Browse Frequencies
          </Link>
        </div>
      </div>
    </div>
  )
}
