const NOISE_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>` +
      `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter>` +
      `<rect width='100%' height='100%' filter='url(#n)'/>` +
      `</svg>`,
  );

export function GrainOverlay() {
  return (
    <div
      className="grain-overlay"
      aria-hidden
      style={{ backgroundImage: `url("${NOISE_SVG}")`, backgroundSize: "200px 200px" }}
    />
  );
}
