import type {
  Governorate,
  Money,
  Order,
  PaymentMethod,
  Promotion,
  Review,
  ShippingSettings,
} from "@/lib/api/types";
import { PRODUCTS } from "@/mocks/products";
import { seeded } from "@/mocks/seed";
import { colorById } from "@/mocks/taxonomy";

const egp = (major: number): Money => ({ amount: Math.round(major * 100), currency: "EGP" });

/**
 * Shipping is governorate-based and owned by Admin. The storefront never
 * hard-codes a fee — it reads this list and renders whatever it is given,
 * including governorates that are temporarily switched off.
 */
const GOVERNORATE_SPEC: [string, string, number, string, string[]][] = [
  ["cairo", "Cairo", 55, "Next working day", ["Nasr City", "Heliopolis", "Maadi", "Zamalek", "Downtown", "New Cairo", "Shorouk", "Obour", "Helwan", "Mokattam"]],
  ["giza", "Giza", 55, "Next working day", ["Dokki", "Mohandessin", "Agouza", "Haram", "Faisal", "6th of October", "Sheikh Zayed", "Imbaba"]],
  ["alexandria", "Alexandria", 65, "1–2 working days", ["Sidi Gaber", "Smouha", "Miami", "Montazah", "Agami", "Borg El Arab", "Gleem"]],
  ["qalyubia", "Qalyubia", 65, "1–2 working days", ["Banha", "Shubra El Kheima", "Qalyub", "Khanka"]],
  ["dakahlia", "Dakahlia", 75, "2–3 working days", ["Mansoura", "Talkha", "Mit Ghamr", "Belqas"]],
  ["sharqia", "Sharqia", 75, "2–3 working days", ["Zagazig", "10th of Ramadan", "Bilbeis", "Abu Hammad"]],
  ["gharbia", "Gharbia", 75, "2–3 working days", ["Tanta", "Mahalla El Kubra", "Kafr El Zayat", "Zefta"]],
  ["monufia", "Monufia", 75, "2–3 working days", ["Shibin El Kom", "Sadat City", "Ashmoun", "Menouf"]],
  ["beheira", "Beheira", 80, "2–3 working days", ["Damanhour", "Kafr El Dawwar", "Rashid", "Edku"]],
  ["kafr-el-sheikh", "Kafr El Sheikh", 80, "2–3 working days", ["Kafr El Sheikh", "Desouk", "Baltim"]],
  ["damietta", "Damietta", 80, "2–3 working days", ["Damietta", "New Damietta", "Ras El Bar"]],
  ["port-said", "Port Said", 80, "2–3 working days", ["Port Said", "Port Fouad"]],
  ["ismailia", "Ismailia", 80, "2–3 working days", ["Ismailia", "Fayed", "Qantara"]],
  ["suez", "Suez", 80, "2–3 working days", ["Suez", "Ain Sokhna", "Ataqa"]],
  ["fayoum", "Fayoum", 85, "3–4 working days", ["Fayoum", "Ibsheway", "Sinnuris"]],
  ["beni-suef", "Beni Suef", 85, "3–4 working days", ["Beni Suef", "New Beni Suef", "Nasser"]],
  ["minya", "Minya", 90, "3–4 working days", ["Minya", "Mallawi", "Beni Mazar"]],
  ["asyut", "Asyut", 90, "3–4 working days", ["Asyut", "New Asyut", "Abnub", "Dairut"]],
  ["sohag", "Sohag", 95, "3–4 working days", ["Sohag", "Akhmim", "Girga", "Tahta"]],
  ["qena", "Qena", 95, "3–4 working days", ["Qena", "Nag Hammadi", "Qus"]],
  ["luxor", "Luxor", 95, "3–4 working days", ["Luxor", "Armant", "Esna"]],
  ["aswan", "Aswan", 105, "4–5 working days", ["Aswan", "Kom Ombo", "Edfu"]],
  ["red-sea", "Red Sea", 110, "4–5 working days", ["Hurghada", "El Gouna", "Safaga", "Marsa Alam"]],
  ["matrouh", "Matrouh", 110, "4–5 working days", ["Marsa Matrouh", "El Alamein", "Sidi Abdel Rahman"]],
  ["north-sinai", "North Sinai", 120, "5–7 working days", ["Arish", "Bir al-Abd"]],
  ["south-sinai", "South Sinai", 120, "5–7 working days", ["Sharm El Sheikh", "Dahab", "Nuweiba", "El Tor"]],
  ["new-valley", "New Valley", 120, "5–7 working days", ["Kharga", "Dakhla", "Farafra"]],
];

const ARABIC_NAMES: Record<string, string> = {
  cairo: "القاهرة",
  giza: "الجيزة",
  alexandria: "الإسكندرية",
  qalyubia: "القليوبية",
  dakahlia: "الدقهلية",
  sharqia: "الشرقية",
  gharbia: "الغربية",
  monufia: "المنوفية",
  beheira: "البحيرة",
  "kafr-el-sheikh": "كفر الشيخ",
  damietta: "دمياط",
  "port-said": "بورسعيد",
  ismailia: "الإسماعيلية",
  suez: "السويس",
  fayoum: "الفيوم",
  "beni-suef": "بني سويف",
  minya: "المنيا",
  asyut: "أسيوط",
  sohag: "سوهاج",
  qena: "قنا",
  luxor: "الأقصر",
  aswan: "أسوان",
  "red-sea": "البحر الأحمر",
  matrouh: "مطروح",
  "north-sinai": "شمال سيناء",
  "south-sinai": "جنوب سيناء",
  "new-valley": "الوادي الجديد",
};

export const GOVERNORATES: Governorate[] = GOVERNORATE_SPEC.map(([id, name, fee, estimate, cities]) => ({
  id,
  name,
  nameAr: ARABIC_NAMES[id] ?? name,
  fee: egp(fee),
  estimate,
  active: true,
  cities: cities.map((city) => ({
    id: `${id}-${city.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name: city,
    nameAr: city,
  })),
}));

export const governorateById = new Map(GOVERNORATES.map((g) => [g.id, g]));

export const FREE_SHIPPING_THRESHOLD: Money = egp(1200);

export const SHIPPING_SETTINGS: ShippingSettings = {
  governorates: GOVERNORATES,
  freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  policyNote:
    "Orders are dispatched within one working day. Delivery is attempted twice; after a second failed attempt the order comes back to us and we refund any prepaid amount.",
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "cod",
    label: "Cash on delivery",
    description: "Pay the courier when your order arrives. Have the exact amount ready if you can.",
    available: true,
    fee: null,
  },
  {
    id: "card",
    label: "Card",
    description: "Not available yet. We’re finishing the payment integration.",
    available: false,
    fee: null,
  },
  {
    id: "wallet",
    label: "Mobile wallet",
    description: "Not available yet. We’re finishing the payment integration.",
    available: false,
    fee: null,
  },
];

/** Flash sale runs on a rolling window so the countdown is always live in dev. */
function rollingWindow(hoursAhead: number) {
  const now = Date.now();
  const period = hoursAhead * 3600_000;
  const end = Math.ceil(now / period) * period;
  return { startsAt: new Date(end - period).toISOString(), endsAt: new Date(end).toISOString() };
}

const flashWindow = rollingWindow(36);

export const PROMOTIONS: Promotion[] = [
  {
    id: "promo-flash-lace",
    type: "flash-sale",
    title: "36 hours on the Lace Archive",
    description: "20% off every cotton-backed lace piece. Ends when the clock does.",
    code: null,
    startsAt: flashWindow.startsAt,
    endsAt: flashWindow.endsAt,
    productSlugs: ["lace-high-waist-brief", "lace-thong", "lace-bralette", "lace-bodysuit"],
    collectionSlugs: ["lace-archive"],
  },
  {
    id: "promo-three-briefs",
    type: "buy-x-get-y",
    title: "Three briefs, pay for two",
    description: "Add any three briefs to your bag and the cheapest comes off at checkout.",
    code: "THREE",
    startsAt: null,
    endsAt: null,
    productSlugs: [],
    collectionSlugs: ["everyday-essentials"],
  },
  {
    id: "promo-free-shipping",
    type: "free-shipping",
    title: "Free shipping over 1,200 EGP",
    description: "Applies to every governorate. No code needed.",
    code: null,
    startsAt: null,
    endsAt: null,
    productSlugs: [],
    collectionSlugs: [],
  },
];

/** Codes Admin has issued. The storefront validates against this, never locally. */
export const DISCOUNT_CODES: Record<
  string,
  { label: string; type: Promotion["type"]; percentage?: number; fixed?: number; minSubtotal?: number }
> = {
  FIRSTLIGHT: { label: "First Light — 15% off", type: "percentage", percentage: 15 },
  THREE: { label: "Three briefs, pay for two", type: "buy-x-get-y" },
  WELCOME100: { label: "Welcome — 100 EGP off", type: "fixed", fixed: 10000, minSubtotal: 60000 },
  SHIPFREE: { label: "Free shipping", type: "free-shipping" },
};

/* -------------------------------------------------------------------------- */
/* Reviews                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * `topic` scopes a review to the kind of product it makes sense on — a note
 * about a wireless band has no business appearing under a brief. `null` means
 * it fits anything.
 */
type ReviewTopic = "bottom" | "bra" | "lace" | "mesh" | "seamless" | "rib" | null;

const REVIEW_BODIES: [number, string, string, ReviewTopic][] = [
  [5, "Finally something that doesn’t ride up", "I teach and I’m standing all day. This is the first pair I’ve genuinely forgotten I was wearing. Bought three more the same week.", "bottom"],
  [5, "The waistband is the whole thing", "It’s wide and folded rather than a thin elastic, so there’s no red line at the end of the day. Sounds small, isn’t.", "bottom"],
  [4, "Runs slightly small", "Lovely fabric but I’d size up if you’re between. I took M and it’s fine, but L would have been more relaxed.", null],
  [5, "Invisible under everything", "I have one pencil skirt that shows every single line. Nothing here. Genuinely nothing.", "seamless"],
  [4, "Good, with one note", "Colour is a touch warmer than it looks on screen. Still bought a second.", null],
  [5, "Held up after twenty washes", "Cold wash, dried in shade. Still the same shape as when it arrived, which I can’t say for anything else in the drawer.", null],
  [5, "Soft in a way I wasn’t expecting", "The rib is much finer than the photos suggest. It’s not a chunky knit at all.", "rib"],
  [3, "Fit is great, delivery was slow", "Took four days to Tanta rather than two. Product itself is exactly as described.", null],
  [5, "Wireless that actually supports", "I stopped wearing wires after my second and had given up finding anything. The wide band does the work.", "bra"],
  [4, "Lace doesn’t scratch", "This was my one worry and it’s genuinely fine. The cotton backing goes all the way where it matters.", "lace"],
  [5, "Bought it for myself on a Tuesday", "No occasion. That’s apparently the brand’s whole thing and they were right.", "lace"],
  [4, "Mesh is properly cool", "August in Cairo and this is the only thing I want. Dries in an hour on the line.", "mesh"],
  [5, "The one I reach for first", "Three washes in and it still looks new. I’ve started buying two of everything.", null],
  [4, "Straps stay put", "No sliding off the shoulder, which is the only reason I’d stopped wearing anything like this.", "bra"],
];

function topicsFor(product: (typeof PRODUCTS)[number]): ReviewTopic[] {
  const topics: ReviewTopic[] = [null];
  if (["bralette", "wireless-bra"].includes(product.cutSlug)) topics.push("bra");
  else topics.push("bottom");
  if (product.materialSlug === "cotton-lace") topics.push("lace");
  if (product.materialSlug === "airy-mesh") topics.push("mesh");
  if (product.materialSlug === "seamless-microfibre") topics.push("seamless");
  if (product.materialSlug === "ribbed-modal") topics.push("rib");
  return topics;
}

const REVIEWER_NAMES = [
  "Mariam H.", "Salma A.", "Nada E.", "Yasmin K.", "Dina M.", "Rana S.", "Aya T.", "Habiba R.",
  "Menna F.", "Sara G.", "Nourhan A.", "Doaa L.", "Reem O.", "Farah Z.", "Malak N.",
];

/** Seeded from the product’s own rating count so the numbers agree. */
export const REVIEWS: Review[] = PRODUCTS.flatMap((product) => {
  if (!product.rating) return [];
  const count = Math.min(9, Math.max(3, Math.round(product.rating.count / 22)));
  const topics = topicsFor(product);
  const pool = REVIEW_BODIES.filter((body) => topics.includes(body[3]));

  return Array.from({ length: count }, (_, i) => {
    // Each field gets its own seed. Sharing one would correlate them — sorting
    // by helpfulCount would then always surface the same review text.
    const pick = (field: string) => seeded(`${product.slug}:${field}:${i}`);

    const entry = pool[Math.floor(pick("body") * pool.length)] ?? REVIEW_BODIES[0]!;
    const variant =
      product.variants[Math.floor(pick("variant") * product.variants.length)] ?? product.variants[0];
    const size = product.sizes.find((s) => s.id === variant?.sizeId);
    const color = variant ? colorById.get(variant.colorId) : undefined;
    const daysAgo = Math.round(3 + pick("date") * 220);

    return {
      id: `rev-${product.slug}-${i}`,
      productSlug: product.slug,
      rating: entry[0],
      title: entry[1],
      body: entry[2],
      authorName: REVIEWER_NAMES[Math.floor(pick("name") * REVIEWER_NAMES.length)] ?? "Slyrah customer",
      // Verified only where a confirmed order is linked. Roughly a quarter of
      // reviews here are unverified on purpose so both states are visible.
      verifiedPurchase: pick("verified") > 0.26,
      createdAt: new Date(Date.UTC(2026, 7, 16) - daysAgo * 86400_000).toISOString(),
      purchasedSize: size?.label ?? null,
      purchasedColor: color?.name ?? null,
      images: [],
      helpfulCount: Math.round(pick("helpful") * 24),
    } satisfies Review;
  });
});

export const reviewsByProduct = REVIEWS.reduce<Record<string, Review[]>>((acc, review) => {
  (acc[review.productSlug] ??= []).push(review);
  return acc;
}, {});

/* -------------------------------------------------------------------------- */
/* Orders — an in-memory store standing in for the Admin order service         */
/* -------------------------------------------------------------------------- */

export const ORDER_STORE = new Map<string, Order>();

/** One seeded order so the tracking page is reachable without checking out. */
export const DEMO_ORDER_NUMBER = "SLY-2608-4471";

export function seedDemoOrder(): Order {
  const existing = ORDER_STORE.get(DEMO_ORDER_NUMBER);
  if (existing) return existing;

  const product = PRODUCTS[0]!;
  const second = PRODUCTS[4]!;
  const placedAt = new Date(Date.UTC(2026, 7, 13, 11, 24)).toISOString();

  const order: Order = {
    id: "ord-demo",
    orderNumber: DEMO_ORDER_NUMBER,
    status: "out-for-delivery",
    placedAt,
    lines: [
      {
        productSlug: product.slug,
        name: product.name,
        image: null,
        colorName: "Oyster",
        sizeLabel: "M",
        quantity: 2,
        unitPrice: product.price,
        lineTotal: { amount: product.price.amount * 2, currency: "EGP" },
      },
      {
        productSlug: second.slug,
        name: second.name,
        image: null,
        colorName: "Cotton White",
        sizeLabel: "S",
        quantity: 1,
        unitPrice: second.price,
        lineTotal: second.price,
      },
    ],
    totals: {
      subtotal: egp(1160),
      discount: egp(0),
      shipping: egp(55),
      total: egp(1215),
      freeShippingRemaining: egp(40),
    },
    discounts: [],
    address: {
      fullName: "Mariam Hassan",
      phone: "01001234567",
      email: "mariam@example.com",
      governorateId: "cairo",
      cityId: "cairo-maadi",
      street: "12 Road 9",
      building: "4",
      apartment: "3",
      landmark: "Above the pharmacy",
    },
    governorateName: "Cairo",
    cityName: "Maadi",
    paymentMethod: "cod",
    timeline: [
      { status: "pending", at: placedAt, note: "Order received." },
      { status: "confirmed", at: new Date(Date.UTC(2026, 7, 13, 12, 5)).toISOString(), note: "Confirmed by phone." },
      { status: "preparing", at: new Date(Date.UTC(2026, 7, 14, 9, 30)).toISOString(), note: null },
      { status: "ready-to-ship", at: new Date(Date.UTC(2026, 7, 14, 16, 0)).toISOString(), note: "Handed to the courier." },
      { status: "out-for-delivery", at: new Date(Date.UTC(2026, 7, 15, 8, 15)).toISOString(), note: "With the courier in Maadi." },
    ],
    deliveryAttempts: [
      { at: new Date(Date.UTC(2026, 7, 15, 14, 40)).toISOString(), outcome: "no-answer", note: "Courier will retry tomorrow morning." },
    ],
    estimatedDelivery: new Date(Date.UTC(2026, 7, 16, 12, 0)).toISOString(),
    isGuest: true,
  };

  ORDER_STORE.set(order.orderNumber, order);
  return order;
}

seedDemoOrder();
