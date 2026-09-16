import { type RGB, hexToRgb, rgbToHex } from "./color";

// ---------------------------------------------------------------------------
// Color name database — CSS named colors + popular design colors (~170 total)
// ---------------------------------------------------------------------------
type NameEntry = { name: string; hex: string };

const NAME_LIST: readonly NameEntry[] = [
  // ── Reds ────────────────────────────────────────────────────────────────
  { name: "Red", hex: "#FF0000" },
  { name: "Dark Red", hex: "#8B0000" },
  { name: "Crimson", hex: "#DC143C" },
  { name: "Firebrick", hex: "#B22222" },
  { name: "Indian Red", hex: "#CD5C5C" },
  { name: "Tomato", hex: "#FF6347" },
  { name: "Coral", hex: "#FF7F50" },
  { name: "Light Coral", hex: "#F08080" },
  { name: "Salmon", hex: "#FA8072" },
  { name: "Dark Salmon", hex: "#E9967A" },
  { name: "Light Salmon", hex: "#FFA07A" },
  { name: "Orange Red", hex: "#FF4500" },
  { name: "Scarlet", hex: "#FF2400" },
  { name: "Vermilion", hex: "#E34234" },

  // ── Oranges ─────────────────────────────────────────────────────────────
  { name: "Orange", hex: "#FFA500" },
  { name: "Dark Orange", hex: "#FF8C00" },
  { name: "Sandy Brown", hex: "#F4A460" },
  { name: "Peru", hex: "#CD853F" },
  { name: "Chocolate", hex: "#D2691E" },
  { name: "Tangerine", hex: "#F28500" },
  { name: "Burnt Orange", hex: "#CC5500" },
  { name: "Amber", hex: "#FFBF00" },

  // ── Yellows ─────────────────────────────────────────────────────────────
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Gold", hex: "#FFD700" },
  { name: "Goldenrod", hex: "#DAA520" },
  { name: "Dark Goldenrod", hex: "#B8860B" },
  { name: "Khaki", hex: "#F0E68C" },
  { name: "Dark Khaki", hex: "#BDB76B" },
  { name: "Pale Goldenrod", hex: "#EEE8AA" },
  { name: "Lemon Chiffon", hex: "#FFFACD" },
  { name: "Moccasin", hex: "#FFE4B5" },
  { name: "Navajo White", hex: "#FFDEAD" },
  { name: "Mustard", hex: "#FFDB58" },
  { name: "Cornsilk", hex: "#FFF8DC" },
  { name: "Blanched Almond", hex: "#FFEBCD" },

  // ── Greens ──────────────────────────────────────────────────────────────
  { name: "Green", hex: "#008000" },
  { name: "Lime", hex: "#00FF00" },
  { name: "Lime Green", hex: "#32CD32" },
  { name: "Forest Green", hex: "#228B22" },
  { name: "Dark Green", hex: "#006400" },
  { name: "Sea Green", hex: "#2E8B57" },
  { name: "Medium Sea Green", hex: "#3CB371" },
  { name: "Olive", hex: "#808000" },
  { name: "Olive Drab", hex: "#6B8E23" },
  { name: "Yellow Green", hex: "#9ACD32" },
  { name: "Chartreuse", hex: "#7FFF00" },
  { name: "Lawn Green", hex: "#7CFC00" },
  { name: "Spring Green", hex: "#00FF7F" },
  { name: "Medium Spring Green", hex: "#00FA9A" },
  { name: "Pale Green", hex: "#98FB98" },
  { name: "Light Green", hex: "#90EE90" },
  { name: "Aquamarine", hex: "#7FFFD4" },
  { name: "Medium Aquamarine", hex: "#66CDAA" },
  { name: "Dark Sea Green", hex: "#8FBC8F" },
  { name: "Dark Olive Green", hex: "#556B2F" },
  { name: "Emerald", hex: "#50C878" },
  { name: "Jade", hex: "#00A86B" },
  { name: "Mint", hex: "#98FF98" },
  { name: "Honeydew", hex: "#F0FFF0" },

  // ── Cyans / Teals ────────────────────────────────────────────────────────
  { name: "Cyan", hex: "#00FFFF" },
  { name: "Teal", hex: "#008080" },
  { name: "Dark Cyan", hex: "#008B8B" },
  { name: "Dark Turquoise", hex: "#00CED1" },
  { name: "Turquoise", hex: "#40E0D0" },
  { name: "Medium Turquoise", hex: "#48D1CC" },
  { name: "Light Sea Green", hex: "#20B2AA" },
  { name: "Cadet Blue", hex: "#5F9EA0" },
  { name: "Light Cyan", hex: "#E0FFFF" },
  { name: "Pale Turquoise", hex: "#AFEEEE" },
  { name: "Cerulean", hex: "#007BA7" },

  // ── Blues ────────────────────────────────────────────────────────────────
  { name: "Blue", hex: "#0000FF" },
  { name: "Navy", hex: "#000080" },
  { name: "Midnight Blue", hex: "#191970" },
  { name: "Dark Blue", hex: "#00008B" },
  { name: "Medium Blue", hex: "#0000CD" },
  { name: "Royal Blue", hex: "#4169E1" },
  { name: "Steel Blue", hex: "#4682B4" },
  { name: "Dodger Blue", hex: "#1E90FF" },
  { name: "Cornflower Blue", hex: "#6495ED" },
  { name: "Deep Sky Blue", hex: "#00BFFF" },
  { name: "Sky Blue", hex: "#87CEEB" },
  { name: "Light Sky Blue", hex: "#87CEFA" },
  { name: "Light Blue", hex: "#ADD8E6" },
  { name: "Powder Blue", hex: "#B0E0E6" },
  { name: "Light Steel Blue", hex: "#B0C4DE" },
  { name: "Alice Blue", hex: "#F0F8FF" },
  { name: "Cobalt", hex: "#0047AB" },
  { name: "Sapphire", hex: "#0F52BA" },
  { name: "Periwinkle", hex: "#CCCCFF" },
  { name: "Ghost White", hex: "#F8F8FF" },

  // ── Purples / Violets ───────────────────────────────────────────────────
  { name: "Purple", hex: "#800080" },
  { name: "Magenta", hex: "#FF00FF" },
  { name: "Dark Magenta", hex: "#8B008B" },
  { name: "Indigo", hex: "#4B0082" },
  { name: "Dark Violet", hex: "#9400D3" },
  { name: "Dark Orchid", hex: "#9932CC" },
  { name: "Blue Violet", hex: "#8A2BE2" },
  { name: "Medium Purple", hex: "#9370DB" },
  { name: "Orchid", hex: "#DA70D6" },
  { name: "Medium Orchid", hex: "#BA55D3" },
  { name: "Plum", hex: "#DDA0DD" },
  { name: "Violet", hex: "#EE82EE" },
  { name: "Thistle", hex: "#D8BFD8" },
  { name: "Lavender", hex: "#E6E6FA" },
  { name: "Slate Blue", hex: "#6A5ACD" },
  { name: "Medium Slate Blue", hex: "#7B68EE" },
  { name: "Dark Slate Blue", hex: "#483D8B" },
  { name: "Rebecca Purple", hex: "#663399" },
  { name: "Amethyst", hex: "#9966CC" },
  { name: "Mauve", hex: "#E0B0FF" },
  { name: "Lilac", hex: "#C8A2C8" },

  // ── Pinks ────────────────────────────────────────────────────────────────
  { name: "Hot Pink", hex: "#FF69B4" },
  { name: "Deep Pink", hex: "#FF1493" },
  { name: "Pink", hex: "#FFC0CB" },
  { name: "Light Pink", hex: "#FFB6C1" },
  { name: "Pale Violet Red", hex: "#DB7093" },
  { name: "Medium Violet Red", hex: "#C71585" },
  { name: "Rose", hex: "#FF007F" },
  { name: "Ruby", hex: "#E0115F" },

  // ── Browns ───────────────────────────────────────────────────────────────
  { name: "Brown", hex: "#A52A2A" },
  { name: "Saddle Brown", hex: "#8B4513" },
  { name: "Sienna", hex: "#A0522D" },
  { name: "Rosy Brown", hex: "#BC8F8F" },
  { name: "Burlywood", hex: "#DEB887" },
  { name: "Tan", hex: "#D2B48C" },
  { name: "Wheat", hex: "#F5DEB3" },
  { name: "Bisque", hex: "#FFE4C4" },
  { name: "Antique White", hex: "#FAEBD7" },
  { name: "Linen", hex: "#FAF0E6" },
  { name: "Peach Puff", hex: "#FFDAB9" },
  { name: "Old Lace", hex: "#FDF5E6" },
  { name: "Papaya Whip", hex: "#FFEFD5" },
  { name: "Misty Rose", hex: "#FFE4E1" },
  { name: "Maroon", hex: "#800000" },
  { name: "Ochre", hex: "#CC7722" },
  { name: "Peach", hex: "#FFCBA4" },
  { name: "Champagne", hex: "#FAD6A5" },
  { name: "Seashell", hex: "#FFF5EE" },

  // ── Whites ───────────────────────────────────────────────────────────────
  { name: "White", hex: "#FFFFFF" },
  { name: "Snow", hex: "#FFFAFA" },
  { name: "Ivory", hex: "#FFFFF0" },
  { name: "Floral White", hex: "#FFFAF0" },
  { name: "Mint Cream", hex: "#F5FFFA" },
  { name: "Azure", hex: "#F0FFFF" },
  { name: "Lavender Blush", hex: "#FFF0F5" },

  // ── Grays ────────────────────────────────────────────────────────────────
  { name: "White Smoke", hex: "#F5F5F5" },
  { name: "Gainsboro", hex: "#DCDCDC" },
  { name: "Light Gray", hex: "#D3D3D3" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Dark Gray", hex: "#A9A9A9" },
  { name: "Gray", hex: "#808080" },
  { name: "Dim Gray", hex: "#696969" },
  { name: "Light Slate Gray", hex: "#778899" },
  { name: "Slate Gray", hex: "#708090" },
  { name: "Dark Slate Gray", hex: "#2F4F4F" },
  { name: "Charcoal", hex: "#36454F" },
  { name: "Onyx", hex: "#353839" },

  // ── Black ────────────────────────────────────────────────────────────────
  { name: "Black", hex: "#000000" },
];

// ---------------------------------------------------------------------------
// Lazy-resolved RGB cache (computed once on first use)
// ---------------------------------------------------------------------------
let _cache: Array<{ name: string; rgb: RGB }> | null = null;

function getCache(): Array<{ name: string; rgb: RGB }> {
  if (!_cache) {
    _cache = NAME_LIST.map(({ name, hex }) => ({
      name,
      rgb: hexToRgb(hex) ?? { r: 0, g: 0, b: 0 },
    }));
  }
  return _cache;
}

// ---------------------------------------------------------------------------
// Distance (simple Euclidean — fast and sufficient for naming)
// ---------------------------------------------------------------------------
function dist(a: RGB, b: RGB): number {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

// Below this distance the color "is" the named color; above = variant of it.
const VARIANT_THRESHOLD = 25;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export type ColorNameResult = {
  /** Closest named color, e.g. "Crimson" */
  name: string;
  /** Display label: name if exact, "Varian Crimson" if variant */
  label: string;
  /** True when distance exceeds VARIANT_THRESHOLD */
  isVariant: boolean;
  /** Rounded Euclidean distance to the nearest named color (0–441) */
  distance: number;
};

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------
export type SearchResult = { name: string; hex: string; rgb: RGB };

/**
 * Filter named colors by a partial name query.
 * Empty query returns the full catalog.
 */
export function searchColorNames(query: string): SearchResult[] {
  const cache = getCache();
  const q = query.trim().toLowerCase();
  const list = q ? cache.filter(({ name }) => name.toLowerCase().includes(q)) : cache;
  return list.map(({ name, rgb }) => ({ name, hex: rgbToHex(rgb), rgb }));
}

export function getColorName(rgb: RGB): ColorNameResult {
  const cache = getCache();
  let minDist = Infinity;
  let nearest = cache[0];

  for (const entry of cache) {
    const d = dist(rgb, entry.rgb);
    if (d < minDist) {
      minDist = d;
      nearest = entry;
      if (d === 0) break; // exact hit — no need to keep searching
    }
  }

  const isVariant = minDist > VARIANT_THRESHOLD;
  return {
    name: nearest.name,
    label: isVariant ? `Varian ${nearest.name}` : nearest.name,
    isVariant,
    distance: Math.round(minDist),
  };
}
