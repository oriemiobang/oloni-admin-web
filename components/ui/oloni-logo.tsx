/**
 * Oloni Logo — SVG wordmark for the admin dashboard.
 *
 * Usage:
 *   <OloniLogo />                    → default size (140×36)
 *   <OloniLogo size="sm" />          → compact (100×26)
 *   <OloniLogo size="lg" />          → large (180×46)
 *   <OloniLogo className="..." />    → custom className override
 */

interface OloniLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** Show the tagline beneath the wordmark */
  withTagline?: boolean;
}

const SIZES = {
  sm: { width: 100, height: 26, fontSize: 18, dot: 5 },
  md: { width: 140, height: 36, fontSize: 26, dot: 7 },
  lg: { width: 180, height: 46, fontSize: 34, dot: 9 },
} as const;

export function OloniLogo({ size = 'md', className, withTagline = false }: OloniLogoProps) {
  const { width, height, fontSize, dot } = SIZES[size];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={withTagline ? width : width}
      height={withTagline ? height + 18 : height}
      viewBox={`0 0 ${width} ${withTagline ? height + 18 : height}`}
      aria-label="Oloni"
      role="img"
      className={className}
    >
      {/* ── Wordmark ── */}
      <text
        x="0"
        y={fontSize}
        fontFamily="'Inter', 'Geist', system-ui, sans-serif"
        fontWeight="700"
        fontSize={fontSize}
        letterSpacing="-0.5"
        fill="currentColor"
      >
        {/* "O" in teal */}
        <tspan fill="var(--color-primary, oklch(0.52 0.14 178))">O</tspan>
        {/* "loni" in foreground */}
        <tspan>loni</tspan>
      </text>

      {/* ── Teal accent dot ── */}
      <circle
        cx={width - dot * 0.6}
        cy={fontSize * 0.2}
        r={dot * 0.5}
        fill="var(--color-accent, oklch(0.78 0.14 85))"
      />

      {/* ── Optional tagline ── */}
      {withTagline && (
        <text
          x="1"
          y={height + 14}
          fontFamily="'Inter', 'Geist', system-ui, sans-serif"
          fontWeight="400"
          fontSize={10}
          letterSpacing="0.5"
          fill="var(--color-muted-foreground)"
          style={{ textTransform: 'uppercase' }}
        >
          Admin Dashboard
        </text>
      )}
    </svg>
  );
}

export default OloniLogo;
