/**
 * Smart color pairing — suggests companion colors for a primary color,
 * ordered from most dominant to backup/neutral.
 *
 * Handles achromatic colors (black, white, gray) properly by using
 * lightness-based logic instead of hue rotation.
 */

import { type RGB, type HSL, rgbToHsl, hslToRgb, bestTextOn } from "./color";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type PairRole = "dominan" | "pendukung" | "aksen" | "cadangan" | "netral" | "teks";

export const ROLE_META: Record<PairRole, { label: string; color: string; bg: string }> = {
  dominan: { label: "Dominan", color: "text-red-300", bg: "bg-red-500/15" },
  pendukung: { label: "Pendukung", color: "text-amber-300", bg: "bg-amber-500/15" },
  aksen: { label: "Aksen", color: "text-purple-300", bg: "bg-purple-500/15" },
  cadangan: { label: "Cadangan", color: "text-sky-300", bg: "bg-sky-500/15" },
  netral: { label: "Netral", color: "text-zinc-300", bg: "bg-zinc-500/15" },
  teks: { label: "Teks", color: "text-emerald-300", bg: "bg-emerald-500/15" },
};

export type ColorPair = {
  rank: number;
  role: PairRole;
  rgb: RGB;
  description: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const clampL = (l: number) => Math.max(2, Math.min(97, l));

function grey(l: number): RGB {
  return hslToRgb({ h: 0, s: 0, l: clampL(l) });
}

function tinted(h: number, s: number, l: number): RGB {
  return hslToRgb({ h, s, l: clampL(l) });
}

// Smart complementary: always produces a visually distinct, contrasty pair.
// For very dark primaries the complement is brightened; for very light, darkened.
function smartComplement(hsl: HSL): RGB {
  const compH = (hsl.h + 180) % 360;
  const compS = Math.max(hsl.s * 0.85, 45);
  // Push lightness toward mid-range from the opposite direction
  let compL: number;
  if (hsl.l < 30)
    compL = Math.max(hsl.l + 35, 52); // dark → lighten comp
  else if (hsl.l > 70)
    compL = Math.min(hsl.l - 35, 48); // light → darken comp
  else compL = hsl.l;
  return hslToRgb({ h: compH, s: compS, l: compL });
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export function getSmartPairings(primary: RGB): ColorPair[] {
  const hsl = rgbToHsl(primary);
  const isAchromatic = hsl.s < 10;
  const isDark = hsl.l < 35;
  const isLight = hsl.l > 65;
  const l = hsl.l;

  // Text color — always included, ranked last (it's a consequence, not a pair)
  const textRgb = bestTextOn(primary) === "#FFFFFF" ? grey(96) : grey(8);

  const pairs: ColorPair[] = [];

  if (isAchromatic) {
    if (isDark) {
      // ── Dark gray / black ─────────────────────────────────────────────────
      pairs.push({
        rank: 1,
        role: "dominan",
        rgb: grey(96),
        description: "Putih — kontras maksimal",
      });
      pairs.push({ rank: 2, role: "pendukung", rgb: grey(78), description: "Abu-abu terang" });
      pairs.push({
        rank: 3,
        role: "pendukung",
        rgb: tinted(210, 18, 68),
        description: "Abu-abu kebiruan",
      });
      pairs.push({
        rank: 4,
        role: "aksen",
        rgb: tinted(210, 72, 58),
        description: "Biru — aksen kuat",
      });
      pairs.push({
        rank: 5,
        role: "cadangan",
        rgb: grey(28),
        description: "Abu-abu gelap — layer sekunder",
      });
      pairs.push({
        rank: 6,
        role: "netral",
        rgb: tinted(30, 12, 22),
        description: "Hitam hangat — background dalam",
      });
    } else if (isLight) {
      // ── Light gray / white ────────────────────────────────────────────────
      pairs.push({
        rank: 1,
        role: "dominan",
        rgb: grey(8),
        description: "Hitam elegan — kontras maksimal",
      });
      pairs.push({ rank: 2, role: "pendukung", rgb: grey(28), description: "Abu-abu gelap" });
      pairs.push({
        rank: 3,
        role: "pendukung",
        rgb: tinted(215, 18, 42),
        description: "Abu-abu kebiruan",
      });
      pairs.push({
        rank: 4,
        role: "aksen",
        rgb: tinted(215, 65, 45),
        description: "Biru — aksen bersih",
      });
      pairs.push({ rank: 5, role: "cadangan", rgb: grey(72), description: "Abu-abu sedang" });
      pairs.push({
        rank: 6,
        role: "netral",
        rgb: tinted(30, 10, 92),
        description: "Putih hangat — surface lembut",
      });
    } else {
      // ── Mid-tone gray ─────────────────────────────────────────────────────
      const hi = clampL(l < 50 ? l + 55 : l - 55);
      pairs.push({ rank: 1, role: "dominan", rgb: grey(hi), description: "Kontras tinggi" });
      pairs.push({
        rank: 2,
        role: "pendukung",
        rgb: grey(clampL(l - 30)),
        description: "Lebih gelap",
      });
      pairs.push({
        rank: 3,
        role: "pendukung",
        rgb: grey(clampL(l + 30)),
        description: "Lebih terang",
      });
      pairs.push({
        rank: 4,
        role: "aksen",
        rgb: tinted(30, 45, 62),
        description: "Sentuhan hangat",
      });
      pairs.push({
        rank: 5,
        role: "cadangan",
        rgb: tinted(210, 30, 55),
        description: "Sentuhan dingin",
      });
      pairs.push({
        rank: 6,
        role: "netral",
        rgb: tinted(30, 6, l),
        description: "Versi sedikit hangat",
      });
    }
  } else {
    // ── Chromatic color ───────────────────────────────────────────────────
    const { h, s } = hsl;
    const safeS = Math.max(s * 0.85, 40);

    const dominant = smartComplement(hsl);
    const analog1 = hslToRgb({ h: (h - 30 + 360) % 360, s: safeS, l });
    const analog2 = hslToRgb({ h: (h + 30) % 360, s: safeS, l });
    const triad = hslToRgb({ h: (h + 120) % 360, s: Math.max(s * 0.8, 40), l });
    const split = hslToRgb({ h: (h + 210) % 360, s: safeS, l });

    // Neutral: desaturated version of primary, pushed toward a readable lightness
    const neutralL = isDark ? 88 : isLight ? 15 : l < 50 ? 82 : 18;
    const neutral = hslToRgb({ h, s: 8, l: neutralL });

    pairs.push({
      rank: 1,
      role: "dominan",
      rgb: dominant,
      description: "Komplementer 180° — pasangan paling kontras",
    });
    pairs.push({
      rank: 2,
      role: "pendukung",
      rgb: analog1,
      description: "Analogus −30° — harmonis berdekatan",
    });
    pairs.push({
      rank: 3,
      role: "pendukung",
      rgb: analog2,
      description: "Analogus +30° — harmonis berdekatan",
    });
    pairs.push({ rank: 4, role: "aksen", rgb: triad, description: "Triadik 120° — pop/aksen" });
    pairs.push({
      rank: 5,
      role: "cadangan",
      rgb: split,
      description: "Split komplemen 210° — alternatif lembut",
    });
    pairs.push({
      rank: 6,
      role: "netral",
      rgb: neutral,
      description: "Versi netral — cocok untuk background/teks",
    });
  }

  // Append text color last
  pairs.push({
    rank: 7,
    role: "teks",
    rgb: textRgb,
    description: "Warna teks paling terbaca di atas warna ini",
  });

  return pairs.sort((a, b) => a.rank - b.rank);
}
