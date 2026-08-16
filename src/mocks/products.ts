import type {
  Collection,
  Money,
  Product,
  ProductBadge,
  ProductVariant,
  StockStatus,
} from "@/lib/api/types";
import { seeded } from "@/mocks/seed";
import {
  CLOSURES,
  COLORS,
  CUTS,
  MATERIALS,
  SIZES_BOTTOM,
  SIZES_BRA,
  colorById,
  cutById,
  materialById,
} from "@/mocks/taxonomy";

const egp = (major: number): Money => ({ amount: Math.round(major * 100), currency: "EGP" });

interface ProductSpec {
  slug: string;
  name: string;
  subtitle: string;
  material: string;
  cut: string;
  closure: string | null;
  price: number;
  compareAt?: number;
  badges: ProductBadge[];
  colors: string[];
  sizeSet: "bottom" | "bra";
  collections: string[];
  characters: string[];
  description: string;
  features: string[];
  rating: { average: number; count: number } | null;
  soldOutColors?: string[];
  video?: boolean;
  spin?: boolean;
}

const SPECS: ProductSpec[] = [
  {
    slug: "everyday-high-waist-brief",
    name: "Everyday High Waist Brief",
    subtitle: "Egyptian cotton · High waist",
    material: "mat-cotton",
    cut: "cut-high-waist",
    closure: "clo-pullon",
    price: 420,
    badges: ["bestseller"],
    colors: ["col-cotton", "col-oyster", "col-espresso", "col-midnight", "col-sage"],
    sizeSet: "bottom",
    collections: ["everyday-essentials", "first-light"],
    characters: ["noura"],
    description:
      "The pair most people buy five of. Long-staple Delta cotton, a folded self-band at the waist instead of a bonded elastic, and a leg opening cut wide enough to leave no mark after a twelve-hour day.",
    features: [
      "Folded 4 cm self-band spreads pressure across the waist",
      "Wide leg opening that doesn’t crease the thigh",
      "Undyed cotton gusset, double-layered",
      "Flatlock seams throughout — no stitched ridge",
    ],
    rating: { average: 4.8, count: 214 },
    spin: true,
  },
  {
    slug: "ribbed-high-waist-brief",
    name: "Ribbed High Waist Brief",
    subtitle: "Ribbed modal · High waist",
    material: "mat-modal",
    cut: "cut-high-waist",
    closure: "clo-pullon",
    price: 480,
    compareAt: 620,
    badges: ["sale", "bestseller"],
    colors: ["col-oyster", "col-rose", "col-plum", "col-midnight"],
    sizeSet: "bottom",
    collections: ["everyday-essentials"],
    characters: ["noura", "farida"],
    description:
      "A fine 2x2 rib that stretches four ways and springs back. It sits at the natural waist and stays there, which is the entire brief.",
    features: [
      "2x2 rib knit with four-way recovery",
      "Sits at the natural waist, no roll-down",
      "Modal from beech pulp — softer after washing, not rougher",
      "Cotton gusset",
    ],
    rating: { average: 4.7, count: 168 },
  },
  {
    slug: "cotton-boyshort",
    name: "Cotton Boyshort",
    subtitle: "Egyptian cotton · Boyshort",
    material: "mat-cotton",
    cut: "cut-boyshort",
    closure: "clo-pullon",
    price: 395,
    badges: [],
    colors: ["col-cotton", "col-oyster", "col-sage", "col-espresso"],
    sizeSet: "bottom",
    collections: ["everyday-essentials"],
    characters: ["noura"],
    description:
      "Full seat, straight leg, no ride-up. The shape to reach for under anything that skims rather than hangs.",
    features: ["Straight-cut leg with a bonded finish", "Full rear coverage", "Sits just below the natural waist", "Cotton gusset"],
    rating: { average: 4.6, count: 97 },
  },
  {
    slug: "cotton-classic-brief",
    name: "Cotton Classic Brief",
    subtitle: "Egyptian cotton · Mid rise",
    material: "mat-cotton",
    cut: "cut-brief",
    closure: "clo-pullon",
    price: 340,
    badges: [],
    colors: ["col-cotton", "col-oyster", "col-rose", "col-midnight", "col-sage", "col-espresso"],
    sizeSet: "bottom",
    collections: ["everyday-essentials"],
    characters: ["noura"],
    description: "Mid rise, full back, nothing clever. The one that quietly outlives everything else in the drawer.",
    features: ["Mid-rise waist", "Full rear coverage", "Soft picot trim at the leg", "Cotton gusset"],
    rating: { average: 4.5, count: 143 },
  },
  {
    slug: "seamless-thong",
    name: "Seamless Thong",
    subtitle: "Seamless microfibre · Thong",
    material: "mat-microfibre",
    cut: "cut-thong",
    closure: "clo-pullon",
    price: 320,
    badges: ["bestseller"],
    colors: ["col-cotton", "col-oyster", "col-rose", "col-espresso", "col-midnight"],
    sizeSet: "bottom",
    collections: ["everyday-essentials", "first-light"],
    characters: ["layla"],
    description:
      "Cut wide at the front and narrow only at the back, so the pressure sits where you don’t feel it. Laser-cut edges leave nothing to print through.",
    features: ["Laser-cut edges — no hem, no seam", "Wide front panel", "Bonded cotton gusset", "Weighs 18 g"],
    rating: { average: 4.7, count: 302 },
  },
  {
    slug: "seamless-bikini",
    name: "Seamless Bikini",
    subtitle: "Seamless microfibre · Bikini",
    material: "mat-microfibre",
    cut: "cut-bikini",
    closure: "clo-pullon",
    price: 350,
    badges: ["new"],
    colors: ["col-cotton", "col-oyster", "col-rose", "col-peony", "col-midnight"],
    sizeSet: "bottom",
    collections: ["first-light"],
    characters: ["layla"],
    description: "The invisible everyday. Knitted in the round with no side seam at all.",
    features: ["Knitted in the round — no side seams", "Laser-cut leg and waist", "Moderate rear coverage", "Dries overnight"],
    rating: { average: 4.6, count: 121 },
  },
  {
    slug: "seamless-high-waist",
    name: "Seamless High Waist",
    subtitle: "Seamless microfibre · High waist",
    material: "mat-microfibre",
    cut: "cut-high-waist",
    closure: "clo-pullon",
    price: 430,
    badges: [],
    colors: ["col-oyster", "col-rose", "col-espresso", "col-midnight"],
    sizeSet: "bottom",
    collections: ["everyday-essentials"],
    characters: ["layla"],
    description: "Smoothing through the waist without compression. It holds a line rather than squeezing one.",
    features: ["Graduated knit — firmer at the waist, lighter at the leg", "Laser-cut edges", "No roll-down band", "Bonded gusset"],
    rating: { average: 4.4, count: 88 },
  },
  {
    slug: "mesh-bikini",
    name: "Airy Mesh Bikini",
    subtitle: "Airy mesh · Bikini",
    material: "mat-mesh",
    cut: "cut-bikini",
    closure: "clo-pullon",
    price: 365,
    compareAt: 450,
    badges: ["sale", "new"],
    colors: ["col-cotton", "col-sage", "col-peony", "col-midnight"],
    sizeSet: "bottom",
    collections: ["forty-degrees"],
    characters: ["layla"],
    description: "An open power-mesh that actually moves air, with a cotton gusset that stays dry. Made for the months when everything else is too much.",
    features: ["Open power-mesh body", "Double cotton gusset", "Flat bonded edges", "Dries in under an hour"],
    rating: { average: 4.5, count: 64 },
  },
  {
    slug: "mesh-high-waist-brief",
    name: "Airy Mesh High Waist Brief",
    subtitle: "Airy mesh · High waist",
    material: "mat-mesh",
    cut: "cut-high-waist",
    closure: "clo-pullon",
    price: 410,
    badges: ["new"],
    colors: ["col-cotton", "col-sage", "col-midnight"],
    sizeSet: "bottom",
    collections: ["forty-degrees"],
    characters: ["noura"],
    description: "High coverage that still breathes. The compromise most summer underwear refuses to make.",
    features: ["Full mesh body with a solid waistband", "Cotton gusset", "Sits at the natural waist", "Machine washable"],
    rating: { average: 4.3, count: 41 },
    soldOutColors: ["col-sage"],
  },
  {
    slug: "lace-high-waist-brief",
    name: "Cotton Lace High Waist Brief",
    subtitle: "Cotton lace · High waist",
    material: "mat-lace",
    cut: "cut-high-waist",
    closure: "clo-pullon",
    price: 545,
    badges: ["bestseller"],
    colors: ["col-plum", "col-peony", "col-espresso", "col-cotton"],
    sizeSet: "bottom",
    collections: ["lace-archive", "first-light"],
    characters: ["farida"],
    description: "Floral ground lace backed in cotton wherever it touches skin, cut on the stretch so the scalloped edge lies flat.",
    features: ["Cotton-backed at every contact point", "Scalloped edge cut on the stretch", "Sits at the natural waist", "Hand wash, dry flat"],
    rating: { average: 4.8, count: 156 },
  },
  {
    slug: "lace-thong",
    name: "Cotton Lace Thong",
    subtitle: "Cotton lace · Thong",
    material: "mat-lace",
    cut: "cut-thong",
    closure: "clo-pullon",
    price: 385,
    badges: [],
    colors: ["col-plum", "col-peony", "col-cotton"],
    sizeSet: "bottom",
    collections: ["lace-archive"],
    characters: ["farida"],
    description: "The lace version of the shape that already works. Same wide front panel, same soft ground.",
    features: ["Soft-ground floral lace", "Wide front panel", "Cotton gusset", "Flat scalloped edge"],
    rating: { average: 4.4, count: 73 },
  },
  {
    slug: "washed-satin-slip-brief",
    name: "Washed Satin Slip Brief",
    subtitle: "Washed satin · Classic brief",
    material: "mat-satin",
    cut: "cut-brief",
    closure: "clo-pullon",
    price: 495,
    badges: ["new"],
    colors: ["col-plum", "col-oyster", "col-peony", "col-midnight"],
    sizeSet: "bottom",
    collections: ["lace-archive", "first-light"],
    characters: ["farida"],
    description: "Sand-washed so the shine drops out and only the slip remains. Cool against skin in a way cotton never is.",
    features: ["Sand-washed matte finish", "Bias-cut side panels", "Cotton gusset", "Cool iron on reverse"],
    rating: { average: 4.6, count: 52 },
  },
  {
    slug: "wireless-support-bra",
    name: "Wireless Support Bra",
    subtitle: "Ribbed modal · Wireless",
    material: "mat-modal",
    cut: "cut-wireless",
    closure: "clo-back-hook",
    price: 1180,
    badges: ["bestseller"],
    colors: ["col-oyster", "col-rose", "col-espresso", "col-midnight"],
    sizeSet: "bra",
    collections: ["everyday-essentials", "first-light"],
    characters: ["hana"],
    description:
      "A moulded wireless cup with a 5 cm underband, so the weight sits across the ribcage instead of along a wire. Three hook rows cover roughly one band size of change.",
    features: [
      "Moulded cup, no wire, no seam through the cup",
      "5 cm underband with three hook rows",
      "Fully adjustable straps, convertible to racerback",
      "Cotton-lined cup",
    ],
    rating: { average: 4.7, count: 189 },
    video: true,
  },
  {
    slug: "front-close-wireless-bra",
    name: "Front-Close Wireless Bra",
    subtitle: "Egyptian cotton · Wireless",
    material: "mat-cotton",
    cut: "cut-wireless",
    closure: "clo-front-hook",
    price: 1240,
    badges: ["new"],
    colors: ["col-cotton", "col-oyster", "col-espresso"],
    sizeSet: "bra",
    collections: ["first-light"],
    characters: ["hana"],
    description: "Opens and closes at the centre front with one hand. The band is wide, the cup is soft, and nothing goes behind your back.",
    features: ["Centre-front hook closure", "Wide back wing, no dig", "Cotton-lined throughout", "Adjustable straps"],
    rating: { average: 4.5, count: 61 },
  },
  {
    slug: "soft-cotton-bralette",
    name: "Soft Cotton Bralette",
    subtitle: "Egyptian cotton · Bralette",
    material: "mat-cotton",
    cut: "cut-bralette",
    closure: "clo-pullon",
    price: 640,
    badges: [],
    colors: ["col-cotton", "col-oyster", "col-sage", "col-midnight", "col-espresso"],
    sizeSet: "bra",
    collections: ["everyday-essentials"],
    characters: ["hana", "noura"],
    description: "Pull-on, unlined, wide-banded. Enough shape to leave the house in, soft enough to sleep in.",
    features: ["Unlined double-layer cotton", "4 cm elastic-free underband", "Pull-on — no fastening", "Removable pads"],
    rating: { average: 4.4, count: 118 },
  },
  {
    slug: "lace-bralette",
    name: "Cotton Lace Bralette",
    subtitle: "Cotton lace · Bralette",
    material: "mat-lace",
    cut: "cut-bralette",
    closure: "clo-adjustable",
    price: 720,
    compareAt: 900,
    badges: ["sale"],
    colors: ["col-plum", "col-peony", "col-cotton"],
    sizeSet: "bra",
    collections: ["lace-archive"],
    characters: ["farida"],
    description: "Lace on the outside, cotton against the skin. Adjustable at both straps so the neckline sits where you want it.",
    features: ["Cotton-backed lace cup", "Adjustable straps with metal sliders", "Scalloped underband", "Hand wash"],
    rating: { average: 4.6, count: 84 },
  },
  {
    slug: "washed-satin-bralette",
    name: "Washed Satin Bralette",
    subtitle: "Washed satin · Bralette",
    material: "mat-satin",
    cut: "cut-bralette",
    closure: "clo-adjustable",
    price: 760,
    badges: ["new"],
    colors: ["col-plum", "col-oyster", "col-peony"],
    sizeSet: "bra",
    collections: ["lace-archive", "first-light"],
    characters: ["farida"],
    description: "A bias-cut satin cup with a matte finish. It catches light as a blush rather than a flash.",
    features: ["Bias-cut cup", "Sand-washed matte satin", "Adjustable straps", "Modal-lined"],
    rating: { average: 4.3, count: 37 },
  },
  {
    slug: "ribbed-bodysuit",
    name: "Ribbed Modal Bodysuit",
    subtitle: "Ribbed modal · Bodysuit",
    material: "mat-modal",
    cut: "cut-bodysuit",
    closure: "clo-snap",
    price: 1420,
    badges: ["bestseller"],
    colors: ["col-oyster", "col-espresso", "col-midnight", "col-plum"],
    sizeSet: "bottom",
    collections: ["everyday-essentials", "first-light"],
    characters: ["hana", "layla"],
    description: "One piece, three snaps, no untucking. The rib holds a line through the torso without compressing it.",
    features: ["2x2 rib with four-way stretch", "Three-snap gusset", "Scoop back", "Cotton-lined gusset"],
    rating: { average: 4.7, count: 96 },
    video: true,
  },
  {
    slug: "lace-bodysuit",
    name: "Cotton Lace Bodysuit",
    subtitle: "Cotton lace · Bodysuit",
    material: "mat-lace",
    cut: "cut-bodysuit",
    closure: "clo-snap",
    price: 1680,
    badges: [],
    colors: ["col-plum", "col-cotton"],
    sizeSet: "bottom",
    collections: ["lace-archive"],
    characters: ["farida"],
    description: "The lace archive’s one piece. Cotton-backed through the body, sheer only where it is meant to be.",
    features: ["Cotton-backed body panel", "Sheer lace side panels", "Three-snap gusset", "Hand wash, dry flat"],
    rating: { average: 4.5, count: 29 },
    soldOutColors: ["col-cotton"],
  },
  {
    slug: "mesh-bralette",
    name: "Airy Mesh Bralette",
    subtitle: "Airy mesh · Bralette",
    material: "mat-mesh",
    cut: "cut-bralette",
    closure: "clo-pullon",
    price: 590,
    badges: ["new"],
    colors: ["col-cotton", "col-sage", "col-midnight"],
    sizeSet: "bra",
    collections: ["forty-degrees"],
    characters: ["layla", "hana"],
    description: "The lightest thing in the drawer. Two layers of mesh, a soft band, and nothing else.",
    features: ["Double-layer power mesh", "Soft pull-on band", "No hardware", "Dries in minutes"],
    rating: { average: 4.2, count: 44 },
  },
  {
    slug: "ribbed-bikini",
    name: "Ribbed Modal Bikini",
    subtitle: "Ribbed modal · Bikini",
    material: "mat-modal",
    cut: "cut-bikini",
    closure: "clo-pullon",
    price: 355,
    badges: [],
    colors: ["col-oyster", "col-rose", "col-sage", "col-plum", "col-midnight"],
    sizeSet: "bottom",
    collections: ["everyday-essentials"],
    characters: ["layla", "noura"],
    description: "The rib in its simplest shape. Low on the hip, soft at every edge.",
    features: ["2x2 rib knit", "Self-band leg and waist", "Cotton gusset", "Machine washable cold"],
    rating: { average: 4.5, count: 132 },
  },
  {
    slug: "cotton-lace-trim-brief",
    name: "Cotton Brief with Lace Trim",
    subtitle: "Egyptian cotton · Classic brief",
    material: "mat-cotton",
    cut: "cut-brief",
    closure: "clo-pullon",
    price: 380,
    badges: [],
    colors: ["col-cotton", "col-rose", "col-peony", "col-plum"],
    sizeSet: "bottom",
    collections: ["everyday-essentials", "lace-archive"],
    characters: ["farida", "noura"],
    description: "A plain cotton brief with a narrow lace edge at the leg. The middle ground, for the days that need one.",
    features: ["Cotton body, lace leg trim", "Mid rise", "Cotton gusset", "Machine washable"],
    rating: { average: 4.4, count: 67 },
  },
];

export const COLLECTIONS: Collection[] = [
  {
    id: "cl-first-light",
    slug: "first-light",
    title: "First Light",
    shortDescription: "The August drop. Cotton, mesh and washed satin in early-morning tones.",
    description:
      "First Light is what we reach for before the day starts — the pale end of the palette, in the three fabrics that handle an Egyptian summer. Sixteen pieces, cut from the shapes that already sell out, in oyster, cotton white and peony.",
    heroImage: null,
    heroVideo: null,
    productCount: 0,
    isDrop: true,
    releasedAt: "2026-08-05T09:00:00.000Z",
    seo: {
      title: "First Light — the August drop",
      description: "Cotton, mesh and washed satin in early-morning tones. Sixteen pieces, new for August.",
    },
  },
  {
    id: "cl-essentials",
    slug: "everyday-essentials",
    title: "Everyday Essentials",
    shortDescription: "The shapes we restock forever. Cotton and ribbed modal, in the colours that go with everything.",
    description:
      "Nothing here is seasonal. These are the pieces we keep in stock in every size, every colour, permanently — because the point of an essential is that it is there when you need it again.",
    heroImage: null,
    heroVideo: null,
    productCount: 0,
    isDrop: false,
    releasedAt: null,
    seo: {
      title: "Everyday Essentials",
      description: "Cotton and ribbed modal in the shapes we restock permanently. Always in stock, always the same fit.",
    },
  },
  {
    id: "cl-forty",
    slug: "forty-degrees",
    title: "Forty Degrees",
    shortDescription: "Built for a Cairo August. Open mesh, cotton gussets, nothing heavier than it needs to be.",
    description:
      "Named for the temperature it was designed against. Every piece in Forty Degrees is an open power-mesh with a double cotton gusset, and every one of them dries in under an hour.",
    heroImage: null,
    heroVideo: null,
    productCount: 0,
    isDrop: false,
    releasedAt: "2026-06-01T09:00:00.000Z",
    seo: {
      title: "Forty Degrees — mesh underwear for Egyptian summer",
      description: "Open power-mesh with cotton gussets. Designed for the months when everything else feels like too much.",
    },
  },
  {
    id: "cl-lace",
    slug: "lace-archive",
    title: "The Lace Archive",
    shortDescription: "Cotton-backed lace and sand-washed satin. Not saved for anything.",
    description:
      "Lace that you can put in a wash bag. Every piece in the Archive is backed in cotton where it meets skin, and cut on the stretch so the scalloped edge lies flat instead of curling.",
    heroImage: null,
    heroVideo: null,
    productCount: 0,
    isDrop: false,
    releasedAt: null,
    seo: {
      title: "The Lace Archive",
      description: "Cotton-backed lace and sand-washed satin in plum and peony. Machine-bag washable, not dry clean only.",
    },
  },
];

function buildVariants(spec: ProductSpec): ProductVariant[] {
  const sizes = spec.sizeSet === "bra" ? SIZES_BRA : SIZES_BOTTOM;
  const variants: ProductVariant[] = [];

  for (const colorId of spec.colors) {
    const colorSoldOut = spec.soldOutColors?.includes(colorId) ?? false;
    for (const size of sizes) {
      const seed = seeded(`${spec.slug}:${colorId}:${size.id}`);
      let stockStatus: StockStatus = "in-stock";
      let stockQuantity: number | null = Math.round(6 + seed * 40);

      if (colorSoldOut) {
        stockStatus = "out-of-stock";
        stockQuantity = 0;
      } else if (seed < 0.07) {
        stockStatus = "out-of-stock";
        stockQuantity = 0;
      } else if (seed < 0.2) {
        stockStatus = "low-stock";
        stockQuantity = Math.round(1 + seed * 12);
      }

      variants.push({
        id: `${spec.slug}--${colorId}--${size.id}`,
        sku: `SLY-${spec.slug.slice(0, 3).toUpperCase()}-${colorId.replace("col-", "").slice(0, 3).toUpperCase()}-${size.label}`,
        colorId,
        sizeId: size.id,
        price: egp(spec.price),
        compareAtPrice: spec.compareAt ? egp(spec.compareAt) : null,
        stockStatus,
        stockQuantity,
      });
    }
  }

  return variants;
}

function buildProduct(spec: ProductSpec): Product {
  const material = materialById.get(spec.material)!;
  const cut = cutById.get(spec.cut)!;
  const closure = spec.closure ? CLOSURES.find((c) => c.id === spec.closure) ?? null : null;
  const variants = buildVariants(spec);
  const colors = spec.colors.map((id) => colorById.get(id)!).filter(Boolean);

  const unavailableColorIds = colors
    .filter((color) => variants.filter((v) => v.colorId === color.id).every((v) => v.stockStatus === "out-of-stock"))
    .map((color) => color.id);

  const anyInStock = variants.some((v) => v.stockStatus !== "out-of-stock");
  const mostlyLow = variants.filter((v) => v.stockStatus === "in-stock").length <= 2;

  const related = SPECS.filter(
    (other) => other.slug !== spec.slug && (other.material === spec.material || other.cut === spec.cut),
  )
    .slice(0, 6)
    .map((other) => other.slug);

  const rating = spec.rating
    ? {
        average: spec.rating.average,
        count: spec.rating.count,
        distribution: (() => {
          const c = spec.rating.count;
          const five = Math.round(c * 0.68);
          const four = Math.round(c * 0.21);
          const three = Math.round(c * 0.07);
          const two = Math.round(c * 0.02);
          return [Math.max(0, c - five - four - three - two), two, three, four, five] as [
            number,
            number,
            number,
            number,
            number,
          ];
        })(),
      }
    : null;

  return {
    id: `prd-${spec.slug}`,
    slug: spec.slug,
    name: spec.name,
    subtitle: spec.subtitle,
    sku: `SLY-${spec.slug.toUpperCase().replace(/-/g, "")}`.slice(0, 22),
    price: egp(spec.price),
    compareAtPrice: spec.compareAt ? egp(spec.compareAt) : null,
    badges: spec.badges,
    primaryImage: null,
    secondaryImage: null,
    colors,
    unavailableColorIds,
    rating,
    materialSlug: material.slug,
    materialWeave: material.weave,
    cutSlug: cut.slug,
    stockStatus: !anyInStock ? "out-of-stock" : mostlyLow ? "low-stock" : "in-stock",

    description: spec.description,
    features: spec.features,
    fabricComposition: material.composition,
    careInstructions: material.careInstructions,
    materialId: material.id,
    cutId: cut.id,
    closureId: closure?.id ?? null,
    collectionSlugs: spec.collections,
    characterSlugs: spec.characters,
    sizes: spec.sizeSet === "bra" ? SIZES_BRA : SIZES_BOTTOM,
    variants,
    images: [],
    video: spec.video
      ? {
          url: "",
          poster: { url: "", alt: `${spec.name} on the body`, width: 1080, height: 1350 },
          durationSeconds: 42,
          title: `${spec.name} — how it fits`,
        }
      : null,
    // A spin is only offered when the frames genuinely exist. In development
    // that is a generated placeholder set, clearly labelled as one.
    spin: spec.spin
      ? {
          frames: Array.from({ length: 24 }, (_, i) => `/media/spin/${spec.slug}/${i}`),
          alt: `${spec.name}, rotating view (placeholder frames — replace with photographed spin)`,
          width: 900,
          height: 1125,
        }
      : null,
    sizeGuideSlug: spec.sizeSet === "bra" ? "bras" : "briefs",
    faqs: [
      {
        id: `${spec.slug}-faq-1`,
        question: "Between two sizes — which one?",
        answer:
          spec.material === "mat-microfibre"
            ? "Take the larger. Bonded edges don’t give the way a stitched hem does, so the bigger size reads smoother rather than looser."
            : "Take the smaller. This fabric relaxes about half a size in the first few wears and then holds.",
        category: "Fit",
      },
      {
        id: `${spec.slug}-faq-2`,
        question: "Will it survive a machine wash?",
        answer: material.careInstructions[0]?.startsWith("Hand")
          ? "It is safer by hand — ten minutes in cold water. If you must machine wash, use a mesh bag on the coldest delicate cycle."
          : "Yes. Cold delicate cycle, mesh bag if you have one, line dry in shade. Heat is what kills elastane, not water.",
        category: "Care",
      },
      {
        id: `${spec.slug}-faq-3`,
        question: "How does the colour hold up?",
        answer: "Wash with like colours for the first three washes. After that it is stable — we pre-wash every dye lot before cutting.",
        category: "Care",
      },
    ],
    deliveryNote:
      "Dispatched within one working day. Cairo and Giza usually arrive next day; other governorates take two to four working days.",
    returnsNote:
      "Unworn and unopened items can be exchanged within 14 days. For hygiene reasons we can’t accept returns on opened underwear — check the size guide first, and message us if you’re between sizes.",
    relatedProductSlugs: related,
    bundles:
      spec.sizeSet === "bottom"
        ? [
            {
              id: `${spec.slug}-bundle-3`,
              title: "Take three",
              description: "Any three briefs in this fabric, one of them free.",
              productSlugs: [spec.slug, ...related.slice(0, 2)],
              saving: egp(Math.round(spec.price * 0.33)),
            },
          ]
        : [],
    seo: {
      title: `${spec.name} — ${material.name}`,
      description: spec.description.slice(0, 158),
    },
  };
}

export const PRODUCTS: Product[] = SPECS.map(buildProduct);
export const productBySlug = new Map(PRODUCTS.map((p) => [p.slug, p]));

/* Counts are derived, never hand-maintained. */
for (const material of MATERIALS) {
  material.productCount = PRODUCTS.filter((p) => p.materialId === material.id).length;
}
for (const cut of CUTS) {
  cut.productCount = PRODUCTS.filter((p) => p.cutId === cut.id).length;
}
for (const closure of CLOSURES) {
  closure.productCount = PRODUCTS.filter((p) => p.closureId === closure.id).length;
}
for (const collection of COLLECTIONS) {
  collection.productCount = PRODUCTS.filter((p) => p.collectionSlugs.includes(collection.slug)).length;
}

export const collectionBySlug = new Map(COLLECTIONS.map((c) => [c.slug, c]));

export const COLLECTION_SUMMARIES = COLLECTIONS.map(
  ({ id, slug, title, shortDescription, heroImage, productCount, isDrop, releasedAt }) => ({
    id,
    slug,
    title,
    shortDescription,
    heroImage,
    productCount,
    isDrop,
    releasedAt,
  }),
);

export function toSummary(product: Product) {
  const {
    id,
    slug,
    name,
    subtitle,
    price,
    compareAtPrice,
    badges,
    primaryImage,
    secondaryImage,
    colors,
    unavailableColorIds,
    rating,
    materialSlug,
    materialWeave,
    cutSlug,
    stockStatus,
  } = product;
  return {
    id,
    slug,
    name,
    subtitle,
    price,
    compareAtPrice,
    badges,
    primaryImage,
    secondaryImage,
    colors,
    unavailableColorIds,
    rating,
    materialSlug,
    materialWeave,
    cutSlug,
    stockStatus,
  };
}

export { COLORS, SIZES_BOTTOM, SIZES_BRA };
