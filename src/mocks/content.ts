import type {
  BlogPost,
  EducationItem,
  FaqItem,
  SizeGuide,
  StaticPage,
  StoreSettings,
  VideoTestimonial,
} from "@/lib/api/types";
import { FREE_SHIPPING_THRESHOLD } from "@/mocks/commerce";
import { COLLECTIONS } from "@/mocks/products";
import { CHARACTERS, CUTS, MATERIALS } from "@/mocks/taxonomy";

export const STORE_SETTINGS: StoreSettings = {
  brandName: "Slyrah",
  currency: "EGP",
  announcements: [
    { id: "ann-1", text: "Free shipping over 1,200 EGP", href: "/pages/shipping-policy" },
    { id: "ann-2", text: "First Light is here — the August drop", href: "/collections/first-light" },
    { id: "ann-3", text: "14-day exchange on anything unopened", href: "/pages/returns-policy" },
  ],
  announcementIntervalMs: 5000,
  navigation: [
    {
      label: "Shop",
      href: "/shop",
      columns: [
        {
          heading: "By fabric",
          links: MATERIALS.map((m) => ({
            label: m.name,
            href: `/shop?materials=${m.slug}`,
            description: m.tagline,
          })),
        },
        {
          heading: "By cut",
          links: CUTS.map((c) => ({ label: c.name, href: `/shop?cuts=${c.slug}` })),
        },
        {
          heading: "Collections",
          links: COLLECTIONS.map((c) => ({
            label: c.title,
            href: `/collections/${c.slug}`,
            description: c.shortDescription,
          })),
        },
      ],
      featured: [
        { label: "New in", href: "/shop?sort=newest" },
        { label: "On sale", href: "/shop?onSale=1" },
        { label: "Everything", href: "/shop" },
      ],
    },
    {
      label: "Who you are",
      href: "/characters",
      columns: [
        {
          heading: "Start with a person, not a category",
          links: CHARACTERS.map((c) => ({
            label: c.name,
            href: `/characters/${c.slug}`,
            description: c.title,
          })),
        },
      ],
      featured: [{ label: "See all four", href: "/characters" }],
    },
    {
      label: "Fabrics",
      href: "/fabrics",
      columns: [
        {
          heading: "What we make things from",
          links: MATERIALS.map((m) => ({
            label: m.name,
            href: `/fabrics/${m.slug}`,
            description: m.composition,
          })),
        },
      ],
      featured: [{ label: "Size guide", href: "/pages/size-guide" }],
    },
    {
      label: "Journal",
      href: "/journal",
      columns: [],
      featured: [],
    },
  ],
  footerColumns: [
    {
      heading: "Shop",
      links: [
        { label: "All products", href: "/shop" },
        { label: "First Light", href: "/collections/first-light" },
        { label: "Everyday Essentials", href: "/collections/everyday-essentials" },
        { label: "Forty Degrees", href: "/collections/forty-degrees" },
        { label: "The Lace Archive", href: "/collections/lace-archive" },
      ],
    },
    {
      heading: "Know before you buy",
      links: [
        { label: "Size guide", href: "/pages/size-guide" },
        { label: "Fabric information", href: "/fabrics" },
        { label: "How it works", href: "/pages/how-it-works" },
        { label: "Reviews", href: "/pages/reviews" },
        { label: "FAQs", href: "/pages/faqs" },
      ],
    },
    {
      heading: "Orders",
      links: [
        { label: "Track your order", href: "/track" },
        { label: "Shipping policy", href: "/pages/shipping-policy" },
        { label: "Returns & exchanges", href: "/pages/returns-policy" },
        { label: "Contact us", href: "/pages/contact" },
      ],
    },
    {
      heading: "Slyrah",
      links: [
        { label: "About", href: "/pages/about" },
        { label: "Our story", href: "/pages/story" },
        { label: "Vision & mission", href: "/pages/vision-mission" },
        { label: "Privacy policy", href: "/pages/privacy-policy" },
        { label: "Terms & conditions", href: "/pages/terms" },
      ],
    },
  ],
  social: [
    { platform: "Instagram", href: "https://instagram.com/slyrah" },
    { platform: "TikTok", href: "https://tiktok.com/@slyrah" },
    { platform: "Facebook", href: "https://facebook.com/slyrah" },
  ],
  contact: {
    whatsapp: "+201000000000",
    phone: "16123",
    email: "hello@slyrah.com",
    hours: "Sunday to Thursday, 10:00–18:00",
  },
  freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
};

/* -------------------------------------------------------------------------- */

export const EDUCATION_ITEMS: EducationItem[] = [
  {
    id: "edu-1",
    topic: "Fabric",
    question: "Why does Egyptian cotton cost more?",
    answer:
      "The fibre is longer. A long staple means fewer loose ends to break off and lift, which is why it doesn’t pill and doesn’t go grey at the seams. You pay for the ninth month rather than the third.",
    image: null,
    video: null,
  },
  {
    id: "edu-2",
    topic: "Fabric",
    question: "What actually makes something 'seamless'?",
    answer:
      "It’s knitted as a tube rather than cut and sewn, so there are no side seams, and the edges are cut with a laser that melts them closed instead of being folded and stitched. No hem means nothing to print through a fitted skirt.",
    image: null,
    video: null,
  },
  {
    id: "edu-3",
    topic: "Fabric",
    question: "Is modal better than cotton?",
    answer:
      "Neither is better. Cotton breathes more and handles heat; modal is softer, stretches four ways and holds its shape. If you’re standing all day in August, cotton. If you want something that stays exactly where you put it, modal.",
    image: null,
    video: null,
  },
  {
    id: "edu-4",
    topic: "Fit",
    question: "It rides up. Am I wearing the wrong size?",
    answer:
      "Almost always the leg opening is too tight rather than the waist too loose. Fabric creeps upward when the thigh squeezes it. Size for the leg first and the waist will follow.",
    image: null,
    video: null,
  },
  {
    id: "edu-5",
    topic: "Fit",
    question: "How do I know if a bra band fits?",
    answer:
      "Fasten it on the loosest hook. You should get two fingers under the band at the back and no more. If you’re pulling the straps tighter to get support, the band is too big — bands carry about 80% of the weight.",
    image: null,
    video: null,
  },
  {
    id: "edu-6",
    topic: "Fit",
    question: "I’m between two sizes.",
    answer:
      "In cotton and modal, take the smaller — both relax about half a size in the first few wears. In seamless microfibre, take the larger, because bonded edges don’t give at all.",
    image: null,
    video: null,
  },
  {
    id: "edu-7",
    topic: "Care",
    question: "What actually kills underwear?",
    answer:
      "Heat. Hot water and a tumble dryer break elastane far faster than wear does. A cold delicate cycle and a shaded line will roughly double how long a waistband stays a waistband.",
    image: null,
    video: null,
  },
  {
    id: "edu-8",
    topic: "Care",
    question: "Do I really have to hand wash lace?",
    answer:
      "Not really. Ten minutes in cold water is easiest, but a mesh bag on the coldest delicate cycle is fine. What you must not do is wring it out — that’s what distorts the ground.",
    image: null,
    video: null,
  },
  {
    id: "edu-9",
    topic: "Care",
    question: "How many pairs should be in rotation?",
    answer:
      "Five, not three. Elastic needs about a day to recover its shape. Five pairs worn in rotation will outlast eight worn back to back, which is a strange but consistent thing about elastane.",
    image: null,
    video: null,
  },
];

export const FAQS: FaqItem[] = [
  { id: "faq-1", category: "Delivery", question: "How long does delivery take?", answer: "Cairo and Giza are usually next working day. Everywhere else is two to five working days depending on governorate — the exact estimate shows at checkout once you pick yours." },
  { id: "faq-2", category: "Delivery", question: "Do you deliver everywhere in Egypt?", answer: "All 27 governorates. Fees range from 55 EGP in Cairo to 120 EGP in Sinai and the New Valley, and shipping is free over 1,200 EGP." },
  { id: "faq-3", category: "Payment", question: "How can I pay?", answer: "Cash on delivery, for now. Card and mobile wallet are coming — we’d rather launch them properly than half-working." },
  { id: "faq-4", category: "Returns", question: "Can I return underwear?", answer: "Unopened and unworn, yes — 14 days for an exchange or a refund. Once the hygiene seal is broken we can’t take it back, which is why the size guide is as detailed as it is." },
  { id: "faq-5", category: "Returns", question: "What if the size is wrong?", answer: "Message us on WhatsApp before you open it and we’ll swap it. If you’ve already opened it, tell us anyway — we’d rather help you get the size right next time." },
  { id: "faq-6", category: "Orders", question: "Can I order without an account?", answer: "Yes. Guest checkout is the normal way to order here. You can create an account afterwards if you want to track things, and we’ll attach the order you just placed to it." },
  { id: "faq-7", category: "Orders", question: "Can I change my order after placing it?", answer: "If it hasn’t shipped, yes. Call or WhatsApp us with your order number — once it’s with the courier we can’t change the contents." },
  { id: "faq-8", category: "Fit", question: "What if I’m between sizes?", answer: "Cotton and modal: size down, they relax. Seamless: size up, they don’t. Lace: take your usual size." },
  { id: "faq-9", category: "Products", question: "Will the colour match the photos?", answer: "Close, but screens vary. Every dye lot is pre-washed before cutting so the colour is stable after you buy it — the risk is your screen, not the fabric." },
  { id: "faq-10", category: "Products", question: "Is anything restocked?", answer: "Everything in Everyday Essentials, permanently. Drops like First Light are made once. Tap 'Tell me when it’s back' on a sold-out size and we’ll message you if it returns." },
];

export const VIDEO_TESTIMONIALS: VideoTestimonial[] = [
  {
    id: "vt-1",
    authorName: "Salma, Alexandria",
    quote: "I bought one pair to test it. Three weeks later I’d replaced the whole drawer.",
    video: { url: "", poster: { url: "", alt: "Salma talking to camera at home", width: 720, height: 1280 }, durationSeconds: 38, title: "Salma on replacing the whole drawer" },
    productSlug: "everyday-high-waist-brief",
  },
  {
    id: "vt-2",
    authorName: "Hana, Cairo",
    quote: "The front closure is the reason. I can put it on with one hand while holding a baby.",
    video: { url: "", poster: { url: "", alt: "Hana holding the front-close bra", width: 720, height: 1280 }, durationSeconds: 51, title: "Hana on the front-close bra" },
    productSlug: "front-close-wireless-bra",
  },
  {
    id: "vt-3",
    authorName: "Nourhan, Mansoura",
    quote: "I’ve worn the mesh every day since June. It’s the only thing that works in this heat.",
    video: { url: "", poster: { url: "", alt: "Nourhan on a balcony", width: 720, height: 1280 }, durationSeconds: 29, title: "Nourhan on Forty Degrees" },
    productSlug: "mesh-bikini",
  },
];

/* -------------------------------------------------------------------------- */

export const SIZE_GUIDES: SizeGuide[] = [
  {
    slug: "briefs",
    title: "Briefs, boyshorts and bodysuits",
    intro:
      "Measure over bare skin, standing, with the tape flat but not pulled. If you land between two rows, size down in cotton and modal — both relax about half a size — and size up in seamless microfibre, which doesn’t.",
    tables: [
      {
        id: "briefs-table",
        title: "Bottoms",
        columns: ["Size", "Waist", "Hip", "EU", "UK"],
        rows: [
          ["XS", "58–62 cm", "84–88 cm", "32", "6"],
          ["S", "63–67 cm", "89–93 cm", "34–36", "8"],
          ["M", "68–74 cm", "94–99 cm", "38", "10–12"],
          ["L", "75–82 cm", "100–106 cm", "40–42", "14"],
          ["XL", "83–91 cm", "107–114 cm", "44", "16"],
          ["XXL", "92–101 cm", "115–123 cm", "46–48", "18–20"],
        ],
        note: "Bodysuits follow the same chart. If your waist and hip land in different rows, go with the hip.",
      },
    ],
    howToMeasure: [
      { step: "Waist", detail: "The narrowest part of your torso, usually just above the navel. Breathe out normally — don’t hold it in." },
      { step: "Hip", detail: "The fullest part, usually 20 cm below the waist. Keep the tape parallel to the floor." },
      { step: "If you’re between rows", detail: "Cotton and modal: take the smaller. Seamless: take the larger. Lace: your usual size." },
    ],
  },
  {
    slug: "bras",
    title: "Bras and bralettes",
    intro:
      "Band size first, cup second. Fasten a new band on the loosest hook — bands relax, and starting on the outer row buys you two rows of life as it does.",
    tables: [
      {
        id: "bras-table",
        title: "Band and cup",
        columns: ["Size", "Underbust", "Bust", "EU"],
        rows: [
          ["32B", "68–72 cm", "83–85 cm", "70B"],
          ["32C", "68–72 cm", "85–87 cm", "70C"],
          ["34B", "73–77 cm", "88–90 cm", "75B"],
          ["34C", "73–77 cm", "90–92 cm", "75C"],
          ["36B", "78–82 cm", "93–95 cm", "80B"],
          ["36C", "78–82 cm", "95–97 cm", "80C"],
          ["38C", "83–88 cm", "100–103 cm", "85C"],
        ],
        note: "Bralettes are sold in the same sizes but run softer. If you’re between, take the smaller — the band is unstructured.",
      },
    ],
    howToMeasure: [
      { step: "Underbust", detail: "Directly under the bust, tape firm and level. This is the band." },
      { step: "Bust", detail: "The fullest point, tape loose. The difference between this and the underbust is the cup." },
      { step: "Check the fit", detail: "Two fingers under the band, no more. If the straps are carrying the weight, the band is too big." },
    ],
  },
];

/* -------------------------------------------------------------------------- */

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    slug: "why-it-rides-up",
    title: "Why it rides up, and what to actually do about it",
    excerpt: "It’s almost never the waist. Here’s the two-minute version of what’s going on and how to fix it when you buy.",
    featuredImage: null,
    publishedAt: "2026-08-11T08:00:00.000Z",
    readingMinutes: 4,
    characterSlug: "noura",
    tags: ["Fit", "Briefs"],
    body: [
      { type: "paragraph", text: "The most common complaint we get is that a pair rides up by lunchtime. Nearly everyone who says it assumes the waistband is too loose. It usually isn’t." },
      { type: "heading", text: "The leg does it, not the waist" },
      { type: "paragraph", text: "When a leg opening is tight, it grips the thigh. Every step then drags the fabric a few millimetres upward, and because the waistband has nothing to grip against, the whole garment migrates. By the fourth hour it has bunched." },
      { type: "paragraph", text: "Loosening the waist makes this worse, not better. What you want is a wider leg opening and a waistband with enough surface area to hold a position." },
      { type: "heading", text: "What to look for" },
      { type: "list", items: [
        "A leg opening finished flat — bonded or self-banded, not a narrow elastic",
        "A folded self-band at the waist, three centimetres or wider",
        "A boyshort or high-waist cut if you’re standing for long stretches",
        "Cotton or ribbed modal, which grip skin slightly and resist migrating",
      ] },
      { type: "quote", text: "Size for the leg first. The waist will follow.", attribution: "Noura" },
      { type: "paragraph", text: "If you already own a pair that rides up, there’s no fix — the geometry is set. But it tells you exactly what to change next time." },
    ],
    relatedProductSlugs: ["everyday-high-waist-brief", "cotton-boyshort", "ribbed-high-waist-brief"],
    tips: [
      { title: "Check the leg finish", body: "Run a finger around the leg opening. If you can feel a raised cord, that’s a narrow elastic and it will grip." },
      { title: "Stand up in the fitting", body: "Everything fits sitting down. Stand and take four steps before deciding." },
    ],
    seo: {
      title: "Why underwear rides up — and how to stop it",
      description: "It’s the leg opening, not the waistband. What’s actually happening, and what to look for when you buy.",
    },
  },
  {
    id: "post-2",
    slug: "washing-underwear-properly",
    title: "The only laundry advice that changes anything",
    excerpt: "Heat kills elastane. Everything else is detail. A short piece on making underwear last past month four.",
    featuredImage: null,
    publishedAt: "2026-07-28T08:00:00.000Z",
    readingMinutes: 3,
    characterSlug: "farida",
    tags: ["Care"],
    body: [
      { type: "paragraph", text: "Underwear rarely wears out. It gets cooked." },
      { type: "heading", text: "What heat does" },
      { type: "paragraph", text: "Elastane is a set of coiled polymer chains. Heat relaxes the coils permanently. A hot wash and a tumble dry will take a waistband from springy to slack in a couple of months, regardless of how good the fabric was." },
      { type: "list", items: [
        "Cold water, always — 30°C or below",
        "Delicate cycle, and a mesh bag for anything with lace or a hook",
        "No tumble dryer, ever",
        "Line dry in shade; direct sun fades dye and stiffens elastic",
      ] },
      { type: "heading", text: "The rotation thing" },
      { type: "paragraph", text: "Elastic needs roughly a day to recover after being worn. Five pairs in rotation genuinely outlast eight worn back to back. It sounds like folklore and it isn’t." },
      { type: "quote", text: "Ten minutes, cold water, dried flat on a towel. That’s the whole routine.", attribution: "Farida" },
    ],
    relatedProductSlugs: ["lace-high-waist-brief", "washed-satin-slip-brief", "lace-bralette"],
    tips: [
      { title: "Never wring lace", body: "Press it between a folded towel instead. Wringing distorts the ground and it doesn’t come back." },
      { title: "Store flat", body: "Folding a moulded cup creases it permanently. Lay them in a drawer rather than stacking." },
    ],
    seo: {
      title: "How to wash underwear so it lasts",
      description: "Heat is what kills elastane. Cold water, no dryer, five in rotation — the short version of laundry that actually matters.",
    },
  },
  {
    id: "post-3",
    slug: "dressing-a-body-that-changed",
    title: "Dressing a body that changed",
    excerpt: "Hana on fourteen months of nothing fitting, and the three things that made it manageable.",
    featuredImage: null,
    publishedAt: "2026-07-09T08:00:00.000Z",
    readingMinutes: 5,
    characterSlug: "hana",
    tags: ["Fit", "Bras"],
    body: [
      { type: "paragraph", text: "Nobody tells you that the size you settle at might not be the size you were, and that it takes about a year to find out what it is." },
      { type: "heading", text: "Buy for the range, not the number" },
      { type: "paragraph", text: "Three hook rows cover roughly one band size of movement. Fully adjustable straps cover a good deal of the rest. Between them, one bra can be right across most of a year of change instead of two months of it." },
      { type: "heading", text: "Wireless is not the same as unsupportive" },
      { type: "paragraph", text: "A wire concentrates the load along a thin line. A wide moulded band spreads it across the ribcage. For most people the second is more comfortable and just as supportive — the myth that wires are required is a manufacturing convenience, not a fact about bodies." },
      { type: "list", items: [
        "Fasten a new band on the loosest hook",
        "Two fingers under the band at the back, no more",
        "If the straps are digging, the band is too big",
        "Front closures if you’re often holding something",
      ] },
      { type: "quote", text: "Keeping one of each size while things settle costs less than replacing a whole drawer twice.", attribution: "Hana" },
    ],
    relatedProductSlugs: ["wireless-support-bra", "front-close-wireless-bra", "soft-cotton-bralette"],
    tips: [
      { title: "Measure in the evening", body: "Ribcages swell slightly through the day. An evening measurement is the one you’ll live in." },
      { title: "Don’t throw the old ones out", body: "Sizes move back as often as they move on. Keep one set boxed." },
    ],
    seo: {
      title: "Dressing a body that changed — wireless bras and fit",
      description: "Fourteen months of nothing fitting, and the three things that made it manageable: hook rows, wide bands and front closures.",
    },
  },
  {
    id: "post-4",
    slug: "what-nude-means",
    title: "There is no such colour as nude",
    excerpt: "Why we match to undertone instead, and how to find the shade that actually disappears on you.",
    featuredImage: null,
    publishedAt: "2026-06-22T08:00:00.000Z",
    readingMinutes: 3,
    characterSlug: "layla",
    tags: ["Colour", "Seamless"],
    body: [
      { type: "paragraph", text: "'Nude' was standardised against one skin tone about eighty years ago and never revisited. It is not a colour so much as an oversight." },
      { type: "heading", text: "Undertone, not shade" },
      { type: "paragraph", text: "What makes a colour disappear against skin is matching the undertone — the cool or warm cast underneath — rather than matching the depth. A shade two steps lighter with the right undertone vanishes more completely than an exact depth match with the wrong one." },
      { type: "list", items: [
        "Oyster reads neutral-to-cool. It disappears on cool and olive undertones.",
        "Rose Clay is warm. It disappears on warm and golden undertones.",
        "Espresso is deep and warm-neutral.",
        "Cotton White is not a skin match — it’s a white shirt match.",
      ] },
      { type: "heading", text: "The forearm test" },
      { type: "paragraph", text: "Hold the fabric against the inside of your forearm, in daylight, not under a bulb. If it disappears there it will disappear under clothes." },
    ],
    relatedProductSlugs: ["seamless-bikini", "seamless-thong", "seamless-high-waist"],
    tips: [
      { title: "Daylight only", body: "Warm indoor bulbs make everything look like it matches. Take it to a window." },
      { title: "Under white, go darker", body: "A deep plum reads softer under a white shirt than black does. Black shows as a hard shadow." },
    ],
    seo: {
      title: "There is no such colour as nude",
      description: "Matching underwear to undertone rather than to a single shade — and the forearm test that settles it.",
    },
  },
];

export const blogBySlug = new Map(BLOG_POSTS.map((p) => [p.slug, p]));

export const BLOG_SUMMARIES = BLOG_POSTS.map(
  ({ id, slug, title, excerpt, featuredImage, publishedAt, readingMinutes, characterSlug, tags }) => ({
    id,
    slug,
    title,
    excerpt,
    featuredImage,
    publishedAt,
    readingMinutes,
    characterSlug,
    tags,
  }),
);

/* -------------------------------------------------------------------------- */

const UPDATED = "2026-08-01T00:00:00.000Z";

export const STATIC_PAGES: StaticPage[] = [
  {
    id: "pg-about",
    slug: "about",
    title: "About Slyrah",
    lede: "We make underwear in Egypt, for the way women here actually spend a day.",
    updatedAt: UPDATED,
    sections: [
      {
        id: "about-1",
        heading: "What we make",
        blocks: [
          { type: "paragraph", text: "Six fabrics, eight cuts, and a short list of colours we keep permanently in stock. We would rather make a small number of things properly than a large number of things approximately." },
          { type: "paragraph", text: "Everything is cut and sewn in Egypt. The cotton is grown here too, which is not a marketing line — long-staple Delta cotton is genuinely one of the best fibres in the world for this, and it is on our doorstep." },
        ],
      },
      {
        id: "about-2",
        heading: "Why characters",
        blocks: [
          { type: "paragraph", text: "Most underwear sites ask you to shop by category. That assumes you already know that you want a ribbed modal high-waist brief, which almost nobody does." },
          { type: "paragraph", text: "We start with four women instead. Pick the one whose day looks like yours and the fabric and cut follow from it. It is a faster route to the right thing than a filter list." },
        ],
      },
    ],
    seo: { title: "About Slyrah", description: "Underwear made in Egypt from long-staple Delta cotton, ribbed modal, seamless microfibre and cotton-backed lace." },
  },
  {
    id: "pg-story",
    slug: "story",
    title: "Our story",
    lede: "It started with a drawer full of things that almost worked.",
    updatedAt: UPDATED,
    sections: [
      {
        id: "story-1",
        heading: "The drawer",
        blocks: [
          { type: "paragraph", text: "Every one of us had the same drawer: eleven pairs, three of which actually got worn. The other eight had a leg that dug in, a waistband that rolled, a lace edge that curled, or a colour that showed through everything." },
          { type: "paragraph", text: "The frustrating part was that nothing was badly made. Each piece failed on one specific, fixable detail." },
        ],
      },
      {
        id: "story-2",
        heading: "The fix list",
        blocks: [
          { type: "list", items: [
            "Wide, flat leg openings instead of narrow elastic cord",
            "Folded self-bands at least three centimetres deep",
            "Lace backed in cotton wherever it touches skin",
            "Scalloped edges cut on the stretch so they lie flat",
            "Colours matched to undertone rather than one 'nude'",
          ] },
          { type: "paragraph", text: "That list is still the brief for everything we make. When a sample fails one of those points it does not go into production, however good it looks flat." },
        ],
      },
    ],
    seo: { title: "Our story — Slyrah", description: "How a drawer full of things that almost worked turned into a five-point brief for everything we make." },
  },
  {
    id: "pg-vision",
    slug: "vision-mission",
    title: "Vision, mission and values",
    lede: null,
    updatedAt: UPDATED,
    sections: [
      { id: "vm-1", heading: "Vision", blocks: [{ type: "paragraph", text: "That choosing underwear in Egypt stops being a compromise between comfort, price and how it looks under clothes." }] },
      { id: "vm-2", heading: "Mission", blocks: [{ type: "paragraph", text: "To make a small, permanent range of well-detailed pieces from fibres that suit this climate, and to explain them honestly enough that you can buy the right one the first time." }] },
      {
        id: "vm-3",
        heading: "Values",
        blocks: [
          { type: "list", items: [
            "Say what the fabric is and what it does, including what it doesn’t do",
            "Keep essentials permanently in stock rather than manufacturing scarcity",
            "Price the ninth month, not the third",
            "Make the size guide detailed enough that returns are rare",
            "Answer messages the same day",
          ] },
        ],
      },
    ],
    seo: { title: "Vision, mission and values — Slyrah", description: "What we’re for, what we do, and the five rules we hold ourselves to." },
  },
  {
    id: "pg-how",
    slug: "how-it-works",
    title: "How it works",
    lede: "From picking a character to the courier at your door.",
    updatedAt: UPDATED,
    sections: [
      {
        id: "how-1",
        heading: "Finding your size",
        blocks: [
          { type: "paragraph", text: "Start with a character, narrow by fabric, then cut. Every product page carries the full measurement chart for its family and a straight answer about which way to go if you’re between sizes." },
        ],
      },
      {
        id: "how-2",
        heading: "Ordering",
        blocks: [
          { type: "paragraph", text: "You do not need an account. Enter a name, a phone number and an address, choose cash on delivery, and you’re done. We call to confirm before dispatch." },
          { type: "paragraph", text: "After the order is confirmed you can create an account in one step, and we’ll attach the order you just placed to it." },
        ],
      },
      {
        id: "how-3",
        heading: "Delivery",
        blocks: [
          { type: "paragraph", text: "Dispatched within one working day. Cairo and Giza usually arrive the next day. The courier attempts delivery twice; after a second failed attempt the parcel comes back to us and we’ll message you to rebook." },
        ],
      },
    ],
    seo: { title: "How it works — Slyrah", description: "Finding your size, ordering as a guest, and how delivery works across Egypt." },
  },
  {
    id: "pg-shipping",
    slug: "shipping-policy",
    title: "Shipping policy",
    lede: "Fees are set by governorate and shown before you pay.",
    updatedAt: UPDATED,
    sections: [
      {
        id: "ship-1",
        heading: "Fees and timing",
        blocks: [
          { type: "paragraph", text: "Shipping starts at 55 EGP for Cairo and Giza and rises to 120 EGP for Sinai and the New Valley. The exact fee and estimate appear as soon as you choose your governorate at checkout." },
          { type: "paragraph", text: "Orders over 1,200 EGP ship free to every governorate." },
        ],
      },
      {
        id: "ship-2",
        heading: "Delivery attempts",
        blocks: [
          { type: "paragraph", text: "The courier will attempt delivery twice. If both attempts fail the parcel returns to us and we’ll contact you to rebook. There is no charge for a second attempt." },
        ],
      },
    ],
    seo: { title: "Shipping policy — Slyrah", description: "Governorate-based shipping fees across Egypt, free over 1,200 EGP, two delivery attempts." },
  },
  {
    id: "pg-returns",
    slug: "returns-policy",
    title: "Returns and exchanges",
    lede: "Fourteen days on anything unopened.",
    updatedAt: UPDATED,
    sections: [
      {
        id: "ret-1",
        heading: "What we can take back",
        blocks: [
          { type: "paragraph", text: "Anything unworn with the hygiene seal intact, within 14 days of delivery. We’ll exchange it or refund it, whichever you prefer." },
          { type: "paragraph", text: "Once the seal is broken we can’t accept it back. This is a hygiene rule rather than a preference, and it’s why the size guide is as detailed as it is." },
        ],
      },
      {
        id: "ret-2",
        heading: "If something is faulty",
        blocks: [
          { type: "paragraph", text: "A fault is a fault whether or not the seal is broken. Send us a photo on WhatsApp with your order number and we’ll replace it." },
        ],
      },
      {
        id: "ret-3",
        heading: "How to start",
        blocks: [
          { type: "paragraph", text: "Message us on WhatsApp with your order number. We’ll arrange a pickup from the same address, usually within two working days." },
        ],
      },
    ],
    seo: { title: "Returns and exchanges — Slyrah", description: "14-day exchange or refund on unopened items. Faulty items replaced regardless of seal." },
  },
  {
    id: "pg-privacy",
    slug: "privacy-policy",
    title: "Privacy policy",
    lede: "What we collect, why, and how to get rid of it.",
    updatedAt: UPDATED,
    sections: [
      {
        id: "priv-1",
        heading: "What we collect",
        blocks: [
          { type: "list", items: [
            "Your name, phone number and address — to deliver the order",
            "Your email, if you give it — to send the confirmation and, only if you tick the box, occasional emails",
            "What you looked at on the site — to make the recently-viewed row work and to fix what’s broken",
          ] },
          { type: "paragraph", text: "We do not sell any of it. We do not share it beyond the courier who is delivering your parcel." },
        ],
      },
      {
        id: "priv-2",
        heading: "Getting rid of it",
        blocks: [{ type: "paragraph", text: "Email hello@slyrah.com and ask. We’ll delete your account and personal details within seven days and confirm when it’s done. We keep order records where the law requires it, with your personal details stripped." }],
      },
    ],
    seo: { title: "Privacy policy — Slyrah", description: "What Slyrah collects, why, who sees it, and how to have it deleted.", noIndex: false },
  },
  {
    id: "pg-terms",
    slug: "terms",
    title: "Terms and conditions",
    lede: null,
    updatedAt: UPDATED,
    sections: [
      { id: "terms-1", heading: "Orders", blocks: [{ type: "paragraph", text: "An order is an offer to buy. It becomes a contract when we confirm it, which we do by phone or message before dispatch. We may decline an order if a product is out of stock or the address is outside our delivery area." }] },
      { id: "terms-2", heading: "Prices", blocks: [{ type: "paragraph", text: "Prices are in Egyptian pounds and include VAT. Shipping is added at checkout and shown before you confirm. If a price is listed in error we will contact you before dispatching rather than charging the wrong amount." }] },
      { id: "terms-3", heading: "Governing law", blocks: [{ type: "paragraph", text: "These terms are governed by the laws of the Arab Republic of Egypt." }] },
    ],
    seo: { title: "Terms and conditions — Slyrah", description: "Order terms, pricing, and governing law for slyrah.com." },
  },
  {
    id: "pg-contact",
    slug: "contact",
    title: "Contact us",
    lede: "WhatsApp is fastest. We answer the same day, Sunday to Thursday.",
    updatedAt: UPDATED,
    sections: [
      {
        id: "contact-1",
        heading: "Reach us",
        blocks: [
          { type: "list", items: [
            "WhatsApp: +20 100 000 0000",
            "Phone: 16123, Sunday to Thursday, 10:00–18:00",
            "Email: hello@slyrah.com",
            "Instagram: @slyrah",
          ] },
        ],
      },
      {
        id: "contact-2",
        heading: "Before you write",
        blocks: [
          { type: "paragraph", text: "If it’s about an order, have the order number ready — it starts with SLY and is in your confirmation message. If it’s about sizing, tell us your usual size in another brand and what went wrong with it. That’s usually enough for us to get it right." },
        ],
      },
    ],
    seo: { title: "Contact Slyrah", description: "WhatsApp, phone and email. Same-day answers Sunday to Thursday." },
  },
];

export const staticPageBySlug = new Map(STATIC_PAGES.map((p) => [p.slug, p]));
