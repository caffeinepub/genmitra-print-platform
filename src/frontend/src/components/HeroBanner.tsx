import { useNavigate } from "@tanstack/react-router";

export default function HeroBanner() {
  const navigate = useNavigate();

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #1a237e 0%, #2874f0 50%, #42a5f5 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-3">
              Premium Photo Printing
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
              Memories that
            </h1>
            <h1 className="text-4xl md:text-5xl font-bold text-yellow-300 mb-4 leading-tight">
              Last Forever
            </h1>
            <p className="text-blue-100 text-lg mb-8 max-w-md">
              Transform your favorite photos into stunning prints, frames, mugs,
              and more. Professional quality delivered to your door.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <button
                type="button"
                onClick={() =>
                  navigate({
                    to: "/",
                    search: { category: undefined, search: undefined },
                  })
                }
                className="px-8 py-3 bg-yellow-400 text-gray-900 font-bold rounded hover:bg-yellow-300 transition-colors text-sm"
              >
                Shop Now →
              </button>
              <button
                type="button"
                onClick={() =>
                  navigate({
                    to: "/",
                    search: { category: "Photo Frames", search: undefined },
                  })
                }
                className="px-8 py-3 bg-white/10 text-white font-semibold rounded hover:bg-white/20 transition-colors text-sm border border-white/30"
              >
                View Frames
              </button>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <img
                src="/assets/generated/hero-banner-redesign.dim_1440x600.png"
                alt="Custom print products showcase"
                className="w-full max-w-md rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
