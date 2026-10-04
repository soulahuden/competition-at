import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/cn';

/** Kurva-S yang dilalui komet. pathLength=1 supaya animasi dash mudah dihitung. */
const PATH = 'M -80 300 C 200 620 520 660 780 470 C 1010 300 1180 170 1560 70';

/** Easing yang sama dipakai CSS (stroke) dan SMIL (kepala komet) agar tetap sinkron. */
const EASE = '0.22 0.61 0.36 1';
const DURATION = 2.4;

interface CometArcProps {
  leaving?: boolean;
  className?: string;
}

export function CometArc({ leaving = false, className }: CometArcProps) {
  const reducedMotion = usePrefersReducedMotion();

  // Tanpa animasi: busur langsung tampil utuh, komet diam di ujung lintasan.
  const strokeProps = reducedMotion
    ? { strokeDasharray: undefined, strokeDashoffset: undefined }
    : { strokeDasharray: 1, strokeDashoffset: 1 };

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        leaving && 'comet-arc-leaving',
        className,
      )}
    >
      {/* Komet kecil yang jatuh lebih dulu, lalu busur besar mulai tergambar */}
      {!reducedMotion && <span className="comet-fall" />}

      <svg
        viewBox="0 0 1440 720"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="comet-stroke" x1="0" y1="720" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#8B5CF6" stopOpacity="0" />
            <stop offset="0.18" stopColor="#8B5CF6" stopOpacity="0.85" />
            <stop offset="0.45" stopColor="#22D3EE" />
            <stop offset="0.72" stopColor="#CFFAFE" />
            <stop offset="0.9" stopColor="#FBBF24" />
            <stop offset="1" stopColor="#FBBF24" stopOpacity="0.7" />
          </linearGradient>

          <radialGradient id="comet-head-glow">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.35" stopColor="#CFFAFE" stopOpacity="0.85" />
            <stop offset="1" stopColor="#22D3EE" stopOpacity="0" />
          </radialGradient>

          <filter id="comet-blur-lg" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
          <filter id="comet-blur-sm" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="5" />
          </filter>

          <path id="comet-path" d={PATH} />
        </defs>

        {/* 1. Halo lebar — memberi kesan cahaya menyebar ke latar */}
        <path
          d={PATH}
          pathLength={1}
          fill="none"
          stroke="url(#comet-stroke)"
          strokeWidth={34}
          strokeLinecap="round"
          opacity={0.32}
          filter="url(#comet-blur-lg)"
          className={reducedMotion ? undefined : 'comet-draw'}
          {...strokeProps}
        />

        {/* 2. Badan komet berwarna */}
        <path
          d={PATH}
          pathLength={1}
          fill="none"
          stroke="url(#comet-stroke)"
          strokeWidth={9}
          strokeLinecap="round"
          opacity={0.9}
          filter="url(#comet-blur-sm)"
          className={reducedMotion ? undefined : 'comet-draw'}
          {...strokeProps}
        />

        {/* 3. Inti putih tajam */}
        <path
          d={PATH}
          pathLength={1}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={2.4}
          strokeLinecap="round"
          className={reducedMotion ? undefined : 'comet-draw'}
          {...strokeProps}
        />

        {/* 4. Kepala komet yang melesat di sepanjang lintasan.
            Tidak dirender sama sekali saat pengguna meminta animasi dikurangi. */}
        {!reducedMotion && (
          <g className="comet-head">
            <circle r={46} fill="url(#comet-head-glow)" opacity={0.75}>
              <animateMotion
                dur={`${DURATION}s`}
                fill="freeze"
                calcMode="spline"
                keyTimes="0;1"
                keySplines={EASE}
              >
                <mpath href="#comet-path" xlinkHref="#comet-path" />
              </animateMotion>
            </circle>
            <circle r={5} fill="#FFFFFF">
              <animateMotion
                dur={`${DURATION}s`}
                fill="freeze"
                calcMode="spline"
                keyTimes="0;1"
                keySplines={EASE}
              >
                <mpath href="#comet-path" xlinkHref="#comet-path" />
              </animateMotion>
            </circle>
          </g>
        )}
      </svg>
    </div>
  );
}
