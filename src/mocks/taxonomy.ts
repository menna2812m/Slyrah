import type {
  Character,
  Closure,
  ColorOption,
  Cut,
  Material,
  SizeOption,
} from "@/lib/api/types";

/**
 * Development fixtures only. Every export here is replaced 1:1 by an Admin API
 * response — the shapes are the contract, the values are placeholders.
 * Photography is deliberately `null`: the UI renders a designed textile
 * placeholder rather than a grey box, and swaps to <Image> the moment Admin
 * supplies a real URL.
 */

export const COLORS: ColorOption[] = [
  { id: "col-cotton", slug: "cotton-white", name: "Cotton White", hex: "#F5F2EE", hexShift: "#E3DCD4" },
  { id: "col-oyster", slug: "oyster", name: "Oyster", hex: "#E4DCD3", hexShift: "#CDC2B6" },
  { id: "col-rose", slug: "rose-clay", name: "Rose Clay", hex: "#C9958E", hexShift: "#AB7770" },
  { id: "col-peony", slug: "peony", name: "Peony", hex: "#D2879F", hexShift: "#B36B84" },
  { id: "col-sage", slug: "sage", name: "Sage", hex: "#96A48B", hexShift: "#78876D" },
  { id: "col-plum", slug: "deep-plum", name: "Deep Plum", hex: "#4C2F44", hexShift: "#341F2F" },
  { id: "col-espresso", slug: "espresso", name: "Espresso", hex: "#4E3A30", hexShift: "#36271F" },
  { id: "col-midnight", slug: "midnight", name: "Midnight", hex: "#23262E", hexShift: "#14161C" },
];

export const colorById = new Map(COLORS.map((color) => [color.id, color]));

/** Briefs and bottoms. */
export const SIZES_BOTTOM: SizeOption[] = [
  { id: "sz-xs", label: "XS", order: 1, measurements: [{ label: "Waist", value: "58–62 cm" }, { label: "Hip", value: "84–88 cm" }] },
  { id: "sz-s", label: "S", order: 2, measurements: [{ label: "Waist", value: "63–67 cm" }, { label: "Hip", value: "89–93 cm" }] },
  { id: "sz-m", label: "M", order: 3, measurements: [{ label: "Waist", value: "68–74 cm" }, { label: "Hip", value: "94–99 cm" }] },
  { id: "sz-l", label: "L", order: 4, measurements: [{ label: "Waist", value: "75–82 cm" }, { label: "Hip", value: "100–106 cm" }] },
  { id: "sz-xl", label: "XL", order: 5, measurements: [{ label: "Waist", value: "83–91 cm" }, { label: "Hip", value: "107–114 cm" }] },
  { id: "sz-xxl", label: "XXL", order: 6, measurements: [{ label: "Waist", value: "92–101 cm" }, { label: "Hip", value: "115–123 cm" }] },
];

/** Bras and bralettes. */
export const SIZES_BRA: SizeOption[] = [
  { id: "sz-32b", label: "32B", order: 1, measurements: [{ label: "Underbust", value: "68–72 cm" }] },
  { id: "sz-32c", label: "32C", order: 2, measurements: [{ label: "Underbust", value: "68–72 cm" }] },
  { id: "sz-34b", label: "34B", order: 3, measurements: [{ label: "Underbust", value: "73–77 cm" }] },
  { id: "sz-34c", label: "34C", order: 4, measurements: [{ label: "Underbust", value: "73–77 cm" }] },
  { id: "sz-36b", label: "36B", order: 5, measurements: [{ label: "Underbust", value: "78–82 cm" }] },
  { id: "sz-36c", label: "36C", order: 6, measurements: [{ label: "Underbust", value: "78–82 cm" }] },
  { id: "sz-38c", label: "38C", order: 7, measurements: [{ label: "Underbust", value: "83–88 cm" }] },
];

export const ALL_SIZES = [...SIZES_BOTTOM, ...SIZES_BRA];
export const sizeById = new Map(ALL_SIZES.map((size) => [size.id, size]));

export const MATERIALS: Material[] = [
  {
    id: "mat-cotton",
    slug: "egyptian-cotton",
    name: "Egyptian Cotton",
    tagline: "Grown here. Breathes like nothing else.",
    description:
      "Long-staple cotton spun in the Delta, knitted soft and left undyed at the gusset. It takes a wash without pilling and gets better around the fourth or fifth wear.",
    swatchImage: null,
    weave: "jersey",
    composition: "95% Egyptian cotton, 5% elastane",
    properties: [
      { label: "Breathability", value: 95 },
      { label: "Softness", value: 78 },
      { label: "Stretch", value: 55 },
      { label: "Stays invisible", value: 40 },
    ],
    careInstructions: ["Machine wash cold on a delicate cycle", "Do not bleach", "Line dry in shade", "Warm iron if needed"],
    productCount: 0,
  },
  {
    id: "mat-modal",
    slug: "ribbed-modal",
    name: "Ribbed Modal",
    tagline: "The rib holds its shape. The modal doesn’t fight you.",
    description:
      "A fine 2x2 rib in beech-pulp modal. It stretches four ways and springs back, so a high waist stays where you put it in the morning.",
    swatchImage: null,
    weave: "rib",
    composition: "92% modal, 8% elastane",
    properties: [
      { label: "Breathability", value: 74 },
      { label: "Softness", value: 92 },
      { label: "Stretch", value: 88 },
      { label: "Stays invisible", value: 52 },
    ],
    careInstructions: ["Machine wash cold", "Wash with like colours", "Do not tumble dry", "Reshape while damp"],
    productCount: 0,
  },
  {
    id: "mat-microfibre",
    slug: "seamless-microfibre",
    name: "Seamless Microfibre",
    tagline: "Bonded edges. Nothing prints through.",
    description:
      "Knitted in the round with laser-cut edges, so there is no seam, no hem and no line under a fitted skirt. The lightest thing we make.",
    swatchImage: null,
    weave: "microfibre",
    composition: "78% polyamide, 22% elastane",
    properties: [
      { label: "Breathability", value: 58 },
      { label: "Softness", value: 80 },
      { label: "Stretch", value: 94 },
      { label: "Stays invisible", value: 98 },
    ],
    careInstructions: ["Hand wash or delicate bag", "Cold water only", "Do not iron", "Dry flat"],
    productCount: 0,
  },
  {
    id: "mat-lace",
    slug: "cotton-lace",
    name: "Cotton Lace",
    tagline: "Lace with a cotton back. It doesn’t scratch.",
    description:
      "A soft-ground floral lace backed in cotton where it touches skin. Cut on the stretch so the scalloped edge lies flat instead of curling.",
    swatchImage: null,
    weave: "lace",
    composition: "68% cotton, 24% polyamide, 8% elastane",
    properties: [
      { label: "Breathability", value: 82 },
      { label: "Softness", value: 70 },
      { label: "Stretch", value: 62 },
      { label: "Stays invisible", value: 30 },
    ],
    careInstructions: ["Hand wash cold", "Do not wring", "Reshape and dry flat", "Store flat, not folded"],
    productCount: 0,
  },
  {
    id: "mat-mesh",
    slug: "airy-mesh",
    name: "Airy Mesh",
    tagline: "Built for a Cairo August.",
    description:
      "An open power-mesh that moves air. Made for the months when everything else feels like too much, with a cotton gusset that stays dry.",
    swatchImage: null,
    weave: "mesh",
    composition: "85% polyamide, 15% elastane, cotton gusset",
    properties: [
      { label: "Breathability", value: 99 },
      { label: "Softness", value: 62 },
      { label: "Stretch", value: 86 },
      { label: "Stays invisible", value: 66 },
    ],
    careInstructions: ["Machine wash cold in a delicate bag", "Do not bleach", "Dry flat away from sun"],
    productCount: 0,
  },
  {
    id: "mat-satin",
    slug: "washed-satin",
    name: "Washed Satin",
    tagline: "Matte, not shiny. Cool to the touch.",
    description:
      "Sand-washed so the shine drops out and only the slip remains. It reads as a soft blush of light rather than a gleam.",
    swatchImage: null,
    weave: "satin",
    composition: "94% modal satin, 6% elastane",
    properties: [
      { label: "Breathability", value: 66 },
      { label: "Softness", value: 96 },
      { label: "Stretch", value: 48 },
      { label: "Stays invisible", value: 58 },
    ],
    careInstructions: ["Hand wash cold", "Do not tumble dry", "Cool iron on reverse", "Avoid rough surfaces"],
    productCount: 0,
  },
];

export const materialById = new Map(MATERIALS.map((m) => [m.id, m]));
export const materialBySlug = new Map(MATERIALS.map((m) => [m.slug, m]));

export const CUTS: Cut[] = [
  { id: "cut-high-waist", slug: "high-waist", name: "High Waist", description: "Sits at the natural waist and stays there. Smooths without gripping.", outline: null, coverage: "high", productCount: 0 },
  { id: "cut-boyshort", slug: "boyshort", name: "Boyshort", description: "Full seat, straight leg. The one that doesn’t ride up under a dress.", outline: null, coverage: "high", productCount: 0 },
  { id: "cut-brief", slug: "classic-brief", name: "Classic Brief", description: "Mid rise, full back. The everyday shape.", outline: null, coverage: "medium", productCount: 0 },
  { id: "cut-bikini", slug: "bikini", name: "Bikini", description: "Lower on the hip, moderate back coverage.", outline: null, coverage: "medium", productCount: 0 },
  { id: "cut-thong", slug: "thong", name: "Thong", description: "No back line at all. Cut wide at the front for comfort.", outline: null, coverage: "low", productCount: 0 },
  { id: "cut-bralette", slug: "bralette", name: "Bralette", description: "Unlined, wireless, pull-on. Shape without structure.", outline: null, coverage: "medium", productCount: 0 },
  { id: "cut-wireless", slug: "wireless-bra", name: "Wireless Bra", description: "Moulded cup, no wire, wide band. Support you can wear for twelve hours.", outline: null, coverage: "high", productCount: 0 },
  { id: "cut-bodysuit", slug: "bodysuit", name: "Bodysuit", description: "One piece, snap gusset. Works as a layer or on its own.", outline: null, coverage: "high", productCount: 0 },
];

export const cutById = new Map(CUTS.map((c) => [c.id, c]));
export const cutBySlug = new Map(CUTS.map((c) => [c.slug, c]));

export const CLOSURES: Closure[] = [
  { id: "clo-pullon", slug: "pull-on", name: "Pull-on", description: "No fastening. Step in or pull over.", productCount: 0 },
  { id: "clo-back-hook", slug: "back-hook", name: "Back hook & eye", description: "Two or three rows so the band can be taken in as it relaxes.", productCount: 0 },
  { id: "clo-front-hook", slug: "front-hook", name: "Front hook", description: "Fastens at the centre front. Easier on the shoulders.", productCount: 0 },
  { id: "clo-adjustable", slug: "adjustable-straps", name: "Adjustable straps", description: "Sliders on both sides, convertible to a racerback.", productCount: 0 },
  { id: "clo-snap", slug: "snap-gusset", name: "Snap gusset", description: "Three snaps at the gusset on bodysuits.", productCount: 0 },
];

export const closureById = new Map(CLOSURES.map((c) => [c.id, c]));
export const closureBySlug = new Map(CLOSURES.map((c) => [c.slug, c]));

/* -------------------------------------------------------------------------- */
/* Characters — the site’s primary navigation, not decoration                  */
/* -------------------------------------------------------------------------- */

export const CHARACTERS: Character[] = [
  {
    id: "chr-noura",
    slug: "noura",
    name: "Noura",
    title: "On her feet since seven",
    shortDescription: "Twelve-hour shifts, one pair that never rides up.",
    portrait: null,
    accent: { from: "#8F7FA8", to: "#C9A0A8" },
    order: 1,
    story: [
      "Noura teaches thirty-two nine-year-olds and is standing for most of it. She leaves the house at six-forty and does not sit down properly until four.",
      "She does not want to think about her underwear at any point in that day. She wants to put it on and forget it, and she wants it to survive being washed twice a week for a year.",
      "Everything she buys from us is cotton or ribbed modal, cut high, with a leg opening wide enough that it doesn’t leave a mark.",
    ],
    lifestyle: [
      { label: "Out the door by 6:40", detail: "Whatever she wears has to be decided the night before, in the dark.", image: null },
      { label: "Standing 9 to 4", detail: "Leg openings that don’t dig in matter more than anything else.", image: null },
      { label: "Two washes a week", detail: "She needs the elastic to still be elastic in month eleven.", image: null },
    ],
    needs: [
      {
        problem: "It rides up by lunchtime.",
        answer: "A wider gusset and a boyshort leg stop the fabric from creeping. The high waist gives it something to anchor to.",
        productSlugs: ["everyday-high-waist-brief", "cotton-boyshort"],
      },
      {
        problem: "The waistband leaves a red line.",
        answer: "A folded self-band instead of a bonded elastic spreads the pressure over four centimetres rather than one.",
        productSlugs: ["ribbed-high-waist-brief"],
      },
      {
        problem: "It goes grey after ten washes.",
        answer: "Long-staple cotton and a cold wash. The fibre is longer, so fewer ends break and lift.",
        productSlugs: ["everyday-high-waist-brief", "cotton-classic-brief"],
      },
    ],
    video: null,
    tips: [
      { title: "Buy the leg, not the waist", body: "If it rides up, the leg opening is too tight — not the waist too loose. Size the leg first." },
      { title: "Cold water, always", body: "Hot water is what kills elastane. A cold delicate cycle adds months to a waistband." },
      { title: "Rotate five, not three", body: "Elastic needs a full day to recover its shape. Five pairs in rotation outlast eight worn back to back." },
    ],
    discovery: { materialSlugs: ["egyptian-cotton", "ribbed-modal"], cutSlugs: ["high-waist", "boyshort", "classic-brief"] },
    seo: {
      title: "Noura — underwear for a twelve-hour day",
      description: "Cotton and ribbed modal, cut high with a wide leg. Built for standing up all day without adjusting anything.",
    },
  },
  {
    id: "chr-layla",
    slug: "layla",
    name: "Layla",
    title: "Nothing under anything",
    shortDescription: "If it shows through the skirt, it doesn’t leave the drawer.",
    portrait: null,
    accent: { from: "#6D5C9B", to: "#8FA0C4" },
    order: 2,
    story: [
      "Layla owns four skirts in the same cut and one very good pair of trousers. All of them are fitted, and all of them show everything.",
      "She has thrown away more underwear than she has kept, almost always for the same reason: a hem you could see from across the room.",
      "Seamless microfibre solved it. Laser-cut edges, no hem to print through, bonded at the gusset instead of stitched.",
    ],
    lifestyle: [
      { label: "One silhouette, many days", detail: "A fitted skirt is unforgiving of a stitched hem.", image: null },
      { label: "Office to dinner", detail: "It has to work under both without a change.", image: null },
      { label: "Light luggage", detail: "Microfibre dries overnight on a hotel rail.", image: null },
    ],
    needs: [
      {
        problem: "The hem shows through everything.",
        answer: "Laser-cut edges have no hem at all. The fabric simply stops, so there is no ridge to catch light.",
        productSlugs: ["seamless-thong", "seamless-bikini"],
      },
      {
        problem: "Nude never matches my skin.",
        answer: "We match to undertone rather than to a single 'nude'. Oyster reads neutral on cool skin, rose clay on warm.",
        productSlugs: ["seamless-bikini", "seamless-high-waist"],
      },
      {
        problem: "Thongs are uncomfortable after an hour.",
        answer: "Ours is cut wide at the front and narrow only at the back, which moves the pressure off the seam.",
        productSlugs: ["seamless-thong"],
      },
    ],
    video: null,
    tips: [
      { title: "Match undertone, not shade", body: "Hold the fabric against the inside of your forearm. If it disappears there, it disappears under clothes." },
      { title: "Size up in seamless", body: "Bonded edges don’t give the way a hem does. Half a size up reads smoother, not looser." },
      { title: "Wash it in a bag", body: "Laser-cut edges catch on zips. A mesh bag is the whole maintenance routine." },
    ],
    discovery: { materialSlugs: ["seamless-microfibre"], cutSlugs: ["thong", "bikini", "high-waist"] },
    seo: {
      title: "Layla — seamless underwear that doesn’t show",
      description: "Laser-cut microfibre with no hem, no seam and no line. Made to disappear under fitted clothes.",
    },
  },
  {
    id: "chr-hana",
    slug: "hana",
    name: "Hana",
    title: "A body that changed",
    shortDescription: "Support without a wire, in a size she hasn’t worn before.",
    portrait: null,
    accent: { from: "#7E8F7A", to: "#C4B79E" },
    order: 3,
    story: [
      "Hana had a baby fourteen months ago and none of her bras fit. Not the band, not the cup, not the straps.",
      "She is not interested in being told to 'get measured'. She wants something that works across a range while things settle, and that she can put on with one hand.",
      "Wireless moulded cups, a wide band with three hook rows, and front-fastening options. Cotton where it touches skin.",
    ],
    lifestyle: [
      { label: "One hand free, at most", detail: "Front closures and pull-on shapes, not a back hook behind her.", image: null },
      { label: "Still changing", detail: "Three hook rows cover roughly one band size of movement.", image: null },
      { label: "Worn to sleep", detail: "No wire, no moulded seam, nothing that presses in when she lies down.", image: null },
    ],
    needs: [
      {
        problem: "Wires hurt now in a way they never did.",
        answer: "A moulded wireless cup with a wide underband takes the weight across the ribcage instead of along a wire.",
        productSlugs: ["wireless-support-bra", "soft-cotton-bralette"],
      },
      {
        problem: "I can’t reach behind me.",
        answer: "The front-fastening bra opens and closes at the centre with one hand.",
        productSlugs: ["front-close-wireless-bra"],
      },
      {
        problem: "My size keeps moving.",
        answer: "Three hook rows and fully adjustable straps cover about one band size of change without buying again.",
        productSlugs: ["wireless-support-bra", "front-close-wireless-bra"],
      },
    ],
    video: null,
    tips: [
      { title: "Fit the band on the loosest hook", body: "New bands relax. Starting on the outer row gives you two rows of life as it does." },
      { title: "The band does the work", body: "If the straps are carrying the weight, the band is too big — not the straps too long." },
      { title: "Two sizes is normal right now", body: "Keeping one of each while things settle costs less than replacing a whole drawer twice." },
    ],
    discovery: { materialSlugs: ["egyptian-cotton", "ribbed-modal"], cutSlugs: ["wireless-bra", "bralette", "bodysuit"] },
    seo: {
      title: "Hana — wireless support through a change in size",
      description: "Wireless moulded cups, wide bands and front closures. Built for a body that is still settling.",
    },
  },
  {
    id: "chr-farida",
    slug: "farida",
    name: "Farida",
    title: "Dressed up for no one",
    shortDescription: "Lace and washed satin on an ordinary Tuesday.",
    portrait: null,
    accent: { from: "#C86A88", to: "#7A4A63" },
    order: 4,
    story: [
      "Farida buys lace for herself and wears it to work. There is no occasion. That is the point.",
      "She does not want anything that scratches, curls at the edge, or has to be dry-cleaned. Lace should be a normal thing you can put in a wash bag.",
      "Cotton-backed lace and sand-washed satin, in plum and peony, cut so the scalloped edge lies flat.",
    ],
    lifestyle: [
      { label: "A Tuesday, mostly", detail: "Nothing here is saved for anything.", image: null },
      { label: "Under a plain shirt", detail: "The point is that only she knows.", image: null },
      { label: "Hand-washed on Sunday", detail: "Ten minutes, cold water, dried flat on a towel.", image: null },
    ],
    needs: [
      {
        problem: "Lace scratches by the afternoon.",
        answer: "Ours is backed in cotton wherever it sits against skin. The lace is on the outside only.",
        productSlugs: ["lace-bralette", "lace-high-waist-brief"],
      },
      {
        problem: "The scalloped edge curls up.",
        answer: "Cut on the stretch rather than across it, so the edge relaxes flat instead of rolling.",
        productSlugs: ["lace-high-waist-brief", "lace-bodysuit"],
      },
      {
        problem: "Satin looks cheap when it shines.",
        answer: "Sand-washing takes the gloss out and leaves the slip. It catches light as a blush rather than a flash.",
        productSlugs: ["washed-satin-slip-brief", "washed-satin-bralette"],
      },
    ],
    video: null,
    tips: [
      { title: "Cold water and ten minutes", body: "Lace does not need dry cleaning. It needs to not be wrung out." },
      { title: "Store it flat", body: "Folding a moulded lace cup creases the ground permanently. Lay it in a drawer, don’t stack it." },
      { title: "Plum over black", body: "Under a white shirt, deep plum reads softer than black, which shows as a hard shadow." },
    ],
    discovery: { materialSlugs: ["cotton-lace", "washed-satin"], cutSlugs: ["bralette", "high-waist", "bodysuit"] },
    seo: {
      title: "Farida — lace and washed satin for an ordinary day",
      description: "Cotton-backed lace and sand-washed satin in plum and peony. Nothing saved for an occasion.",
    },
  },
];

export const characterBySlug = new Map(CHARACTERS.map((c) => [c.slug, c]));

export const CHARACTER_SUMMARIES = CHARACTERS.map(
  ({ id, slug, name, title, shortDescription, portrait, accent, order }) => ({
    id,
    slug,
    name,
    title,
    shortDescription,
    portrait,
    accent,
    order,
  }),
);
