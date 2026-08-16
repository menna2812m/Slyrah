import { NextResponse } from "next/server";

/**
 * Placeholder spin frames.
 *
 * The 360° viewer only ever renders frames that genuinely exist — it never
 * fakes rotation by transforming a single still. Until the product is
 * photographed on a turntable, this route stands in for the frame set so the
 * viewer can be built and tested, and every frame says on its face that it is
 * a placeholder. Delete this route once real frames are uploaded.
 */

const FRAME_COUNT = 24;

export async function GET(_request: Request, context: { params: Promise<{ slug: string; frame: string }> }) {
  const { slug, frame } = await context.params;
  const index = Math.max(0, Math.min(FRAME_COUNT - 1, Number.parseInt(frame, 10) || 0));
  const angle = (index / FRAME_COUNT) * Math.PI * 2;

  // Width narrows as the garment turns edge-on, so the sequence reads as one
  // object rotating rather than a slideshow.
  const width = 210 + Math.abs(Math.cos(angle)) * 150;
  const seamOffset = Math.sin(angle) * 90;
  const shade = 0.12 + Math.abs(Math.sin(angle)) * 0.16;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1125" width="900" height="1125">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#c9bfc6"/>
      <stop offset="45%" stop-color="#e6dee3"/>
      <stop offset="100%" stop-color="#b3a7b0"/>
    </linearGradient>
  </defs>
  <rect width="900" height="1125" fill="#EAE5E9"/>
  <g transform="translate(450 560)">
    <path d="M ${-width / 2} -230 C ${-width / 2} 60, ${-width / 3} 230, 0 250 C ${width / 3} 230, ${width / 2} 60, ${width / 2} -230 C ${width / 4} -280, ${-width / 4} -280, ${-width / 2} -230 Z" fill="url(#g)"/>
    <path d="M ${seamOffset} -250 C ${seamOffset - 12} 0, ${seamOffset - 6} 180, ${seamOffset} 250" fill="none" stroke="rgba(34,29,35,${shade.toFixed(2)})" stroke-width="2"/>
  </g>
  <text x="450" y="1055" text-anchor="middle" font-family="monospace" font-size="26" fill="#8A818A" letter-spacing="3">PLACEHOLDER SPIN</text>
  <text x="450" y="1090" text-anchor="middle" font-family="monospace" font-size="20" fill="#B0A7AE" letter-spacing="2">${slug} · frame ${index + 1}/${FRAME_COUNT}</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "content-type": "image/svg+xml",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
