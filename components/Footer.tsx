export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 mt-16 px-4 py-12">
      <div className="max-w-3xl mx-auto text-center flex flex-col gap-4">
        <p className="text-sm font-semibold text-gray-500">WatchAdvisor</p>

        {/* Affiliate disclosure */}
        <p className="text-xs text-gray-700 leading-relaxed max-w-xl mx-auto">
          <span className="text-gray-500 font-medium">Affiliate disclosure:</span>{' '}
          WatchAdvisor participates in the Amazon Associates Program and other affiliate
          programs. When you click a link and make a purchase, we may earn a small commission
          at no extra cost to you. Our AI recommendations are generated solely based on
          matching your needs to watch specifications — affiliate rates never influence rankings.
        </p>

        <div className="flex justify-center gap-6 text-xs text-gray-800">
          <span>© {new Date().getFullYear()} WatchAdvisor</span>
          <span>·</span>
          <span>Not affiliated with Garmin Ltd.</span>
        </div>
      </div>
    </footer>
  )
}
