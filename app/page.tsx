import dynamic from 'next/dynamic'
import RecommendationEngine from '@/components/RecommendationEngine'
import Footer from '@/components/Footer'

// Three.js components must be client-only (no SSR)
const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), {
  ssr: false,
})
const WatchOrb = dynamic(() => import('@/components/WatchOrb'), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Fixed particle background */}
      <ParticleBackground />

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-12">
        {/* 3D Watch visualization */}
        <div className="w-48 h-48 md:w-64 md:h-64 mb-8">
          <WatchOrb />
        </div>

        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-4">
          <p
            className="text-xs uppercase tracking-[0.3em] text-[#00d4ff] mb-4 font-medium"
            style={{ opacity: 0, animation: 'fadeUp 0.6s ease-out 0.1s forwards' }}
          >
            AI-Powered Recommendation
          </p>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
            style={{ opacity: 0, animation: 'fadeUp 0.6s ease-out 0.25s forwards' }}
          >
            Find your perfect{' '}
            <span
              className="glow-text-cyan"
              style={{ color: '#00d4ff' }}
            >
              Garmin
            </span>
          </h1>
          <p
            className="mt-4 text-lg md:text-xl text-gray-400 max-w-xl mx-auto leading-relaxed"
            style={{ opacity: 0, animation: 'fadeUp 0.6s ease-out 0.4s forwards' }}
          >
            Tell us how you live. Our AI matches you with the right watch in seconds.
          </p>
        </div>

        {/* Recommendation engine */}
        <div
          className="w-full max-w-2xl mt-10"
          style={{ opacity: 0, animation: 'fadeUp 0.6s ease-out 0.55s forwards' }}
        >
          <RecommendationEngine />
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600"
          style={{ opacity: 0, animation: 'fadeUp 0.6s ease-out 1.2s forwards' }}
        >
          <span className="text-xs tracking-widest uppercase">Scroll to explore</span>
          <div className="w-px h-10 bg-gradient-to-b from-gray-600 to-transparent" />
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs uppercase tracking-[0.3em] text-[#00d4ff] mb-3 font-medium">
            How it works
          </p>
          <h2 className="text-center text-3xl md:text-4xl font-bold mb-16">
            Three steps to your watch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Describe your life',
                desc: 'Tell us about your activities, goals, and budget in plain English. No forms to fill out.',
                color: '#00d4ff',
              },
              {
                step: '02',
                title: 'AI analyzes',
                desc: 'Our model maps your needs against the full Garmin lineup in under 2 seconds.',
                color: '#7c3aed',
              },
              {
                step: '03',
                title: 'Get matched',
                desc: 'Receive your top 3 picks with clear explanations of why each one fits you.',
                color: '#ff6b35',
              },
            ].map(({ step, title, desc, color }) => (
              <div
                key={step}
                className="gradient-border rounded-2xl bg-[#0d0d0d] p-8 flex flex-col gap-4 hover:bg-[#111] transition-colors duration-300"
              >
                <span className="text-4xl font-bold" style={{ color, opacity: 0.8 }}>
                  {step}
                </span>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost transparency section */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="gradient-border rounded-2xl bg-[#0d0d0d] p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-[#00d4ff] mb-3 font-medium">
              Free to use
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Always free for you
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Each recommendation uses a fast, lightweight AI model that costs fractions of a cent per query.
              We cover that cost through affiliate commissions when you purchase a watch — at no extra
              cost to you. Recommendations are never influenced by commission rates.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
