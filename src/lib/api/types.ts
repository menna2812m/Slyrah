/**
 * Slyrah storefront domain contract.
 *
 * Every shape here is what the storefront expects to receive from the Admin
 * Panel’s public API. Nothing in `src/features` or `src/app` may invent its own
 * shape — if a screen needs a new field, it is added here first so the Admin
 * side has a single, explicit contract to satisfy.
 *
 * Money is always in MINOR units (piastres for EGP) to keep arithmetic exact.
 * Use `formatMoney` from `@/lib/format` to render it.
 */

export type Currency = "EGP";

export interface Money {
  /** Minor units. 129900 = 1,299.00 EGP */
  amount: number;
  currency: Currency;
}

export interface SeoMeta {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: ImageAsset | null;
  noIndex?: boolean;
  keywords?: string[];
}

export interface ImageAsset {
  url: string;
  alt: string;
  width: number;
  height: number;
  /** Base64 or data-URI placeholder used to avoid layout shift. */
  blurDataUrl?: string;
}

export interface VideoAsset {
  url: string;
  poster: ImageAsset;
  /** Seconds. Rendered as a duration chip so people know what they’re starting. */
  durationSeconds?: number;
  captionsUrl?: string;
  title: string;
}

/** A 360° spin is only real when the frames exist. Never faked client-side. */
export interface SpinAsset {
  frames: string[];
  alt: string;
  width: number;
  height: number;
}

/* -------------------------------------------------------------------------- */
/* Taxonomy — the discovery hierarchy: material → cut → closure → size → color */
/* -------------------------------------------------------------------------- */

export interface Material {
  id: string;
  slug: string;
  name: string;
  /** One line a customer would actually say about how it feels. */
  tagline: string;
  description: string;
  /** Macro photograph of the weave. Drives the material selector. */
  swatchImage: ImageAsset | null;
  /** Fallback weave rendered in CSS when no macro shot has been uploaded. */
  weave: WeavePattern;
  composition: string;
  properties: MaterialProperty[];
  careInstructions: string[];
  productCount: number;
}

export type WeavePattern = "rib" | "jersey" | "lace" | "microfibre" | "mesh" | "satin";

export interface MaterialProperty {
  label: string;
  /** 0–100. Rendered as a comparative bar, not a star rating. */
  value: number;
}

export interface Cut {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** Line drawing of the silhouette. */
  outline: ImageAsset | null;
  coverage: "low" | "medium" | "high";
  productCount: number;
}

export interface Closure {
  id: string;
  slug: string;
  name: string;
  description: string;
  productCount: number;
}

export interface SizeOption {
  id: string;
  /** "S", "M", "34B" */
  label: string;
  /** Sort key from Admin — never sort sizes alphabetically. */
  order: number;
  measurements?: SizeMeasurement[];
}

export interface SizeMeasurement {
  label: string;
  value: string;
}

export interface ColorOption {
  id: string;
  slug: string;
  name: string;
  /** Flat face of the wing. */
  hex: string;
  /**
   * The same colour under a lower light angle. The butterfly swatch shows both
   * wings so the customer sees how the fabric shifts — that is the whole point
   * of the mark. Admin can leave it null and we derive it.
   */
  hexShift?: string | null;
}

/* -------------------------------------------------------------------------- */
/* Brand characters                                                            */
/* -------------------------------------------------------------------------- */

export interface CharacterSummary {
  id: string;
  slug: string;
  name: string;
  /** "The one who’s on her feet all day" */
  title: string;
  shortDescription: string;
  portrait: ImageAsset | null;
  /** Two-stop tint used when photography is missing, and for her page’s tone. */
  accent: { from: string; to: string };
  order: number;
}

export interface Character extends CharacterSummary {
  story: string[];
  lifestyle: CharacterLifestyle[];
  /** What she came to the site to solve. Drives the recommended products. */
  needs: CharacterNeed[];
  video: VideoAsset | null;
  tips: CharacterTip[];
  /** Pre-applied discovery filters. Clicking her portrait lands here. */
  discovery: DiscoveryPreset;
  seo: SeoMeta;
}

export interface CharacterLifestyle {
  label: string;
  detail: string;
  image: ImageAsset | null;
}

export interface CharacterNeed {
  problem: string;
  answer: string;
  /** Product slugs that answer it. */
  productSlugs: string[];
}

export interface CharacterTip {
  title: string;
  body: string;
}

export interface DiscoveryPreset {
  materialSlugs?: string[];
  cutSlugs?: string[];
  closureSlugs?: string[];
  collectionSlug?: string;
}

/* -------------------------------------------------------------------------- */
/* Products                                                                    */
/* -------------------------------------------------------------------------- */

export type ProductBadge = "new" | "bestseller" | "sale" | "low-stock" | "back-in-stock";

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock" | "preorder";

export interface ProductVariant {
  id: string;
  sku: string;
  colorId: string;
  sizeId: string;
  price: Money;
  compareAtPrice: Money | null;
  stockStatus: StockStatus;
  /** Null when Admin hides exact counts. */
  stockQuantity: number | null;
}

export interface ProductImage extends ImageAsset {
  id: string;
  /** Lets the gallery pick the right shot per colour and per view. */
  colorId: string | null;
  view: ProductView;
  order: number;
}

export type ProductView = "front" | "back" | "detail" | "closure-open" | "closure-closed" | "worn" | "flat";

export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  /** Short descriptor under the name in the grid: "Ribbed modal · High waist" */
  subtitle: string;
  price: Money;
  compareAtPrice: Money | null;
  badges: ProductBadge[];
  primaryImage: ImageAsset | null;
  /** Revealed on hover / second tap. */
  secondaryImage: ImageAsset | null;
  colors: ColorOption[];
  /** Colours with no sellable variant, so the card can dim them. */
  unavailableColorIds: string[];
  rating: RatingSummary | null;
  materialSlug: string;
  /** Lets a card render the fabric before photography exists. */
  materialWeave: WeavePattern;
  cutSlug: string;
  stockStatus: StockStatus;
}

export interface Product extends ProductSummary {
  sku: string;
  description: string;
  features: string[];
  fabricComposition: string;
  careInstructions: string[];
  materialId: string;
  cutId: string;
  closureId: string | null;
  collectionSlugs: string[];
  characterSlugs: string[];
  sizes: SizeOption[];
  variants: ProductVariant[];
  images: ProductImage[];
  video: VideoAsset | null;
  spin: SpinAsset | null;
  sizeGuideSlug: string;
  faqs: FaqItem[];
  deliveryNote: string;
  returnsNote: string;
  relatedProductSlugs: string[];
  bundles: BundleOffer[];
  seo: SeoMeta;
}

export interface RatingSummary {
  average: number;
  count: number;
  /** Index 0 = 1 star. */
  distribution: [number, number, number, number, number];
}

export interface BundleOffer {
  id: string;
  title: string;
  description: string;
  productSlugs: string[];
  /** Saving applied when the whole bundle is in the cart. */
  saving: Money;
}

/* -------------------------------------------------------------------------- */
/* Collections                                                                 */
/* -------------------------------------------------------------------------- */

export interface CollectionSummary {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  heroImage: ImageAsset | null;
  productCount: number;
  isDrop: boolean;
  /** ISO date. Present for drops so we can show "Dropped 12 Aug". */
  releasedAt: string | null;
}

export interface Collection extends CollectionSummary {
  description: string;
  heroVideo: VideoAsset | null;
  seo: SeoMeta;
}

/* -------------------------------------------------------------------------- */
/* Product listing / filtering                                                 */
/* -------------------------------------------------------------------------- */

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "rating" | "bestselling";

export interface ProductQuery {
  collection?: string;
  character?: string;
  materials?: string[];
  cuts?: string[];
  closures?: string[];
  sizes?: string[];
  colors?: string[];
  /** Minor units. */
  priceMin?: number;
  priceMax?: number;
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  search?: string;
  sort?: SortKey;
  page?: number;
  perPage?: number;
}

export interface FacetValue {
  id: string;
  slug: string;
  label: string;
  count: number;
  /** Zero-count values stay visible but disabled so the list doesn’t jump. */
  disabled: boolean;
  swatchHex?: string;
  swatchHexShift?: string | null;
}

export interface ProductFacets {
  materials: FacetValue[];
  cuts: FacetValue[];
  closures: FacetValue[];
  sizes: FacetValue[];
  colors: FacetValue[];
  priceRange: { min: number; max: number };
}

export interface ProductListResponse {
  items: ProductSummary[];
  facets: ProductFacets;
  total: number;
  page: number;
  perPage: number;
  appliedSort: SortKey;
}

/* -------------------------------------------------------------------------- */
/* Reviews                                                                     */
/* -------------------------------------------------------------------------- */

export interface Review {
  id: string;
  productSlug: string;
  rating: number;
  title: string | null;
  body: string;
  authorName: string;
  /**
   * Set by the backend ONLY when a confirmed order containing this product is
   * linked to the reviewer. The storefront never derives it.
   */
  verifiedPurchase: boolean;
  createdAt: string;
  /** What she bought, so the review reads in context. */
  purchasedSize: string | null;
  purchasedColor: string | null;
  images: ImageAsset[];
  helpfulCount: number;
}

export interface ReviewListResponse {
  items: Review[];
  summary: RatingSummary;
  total: number;
  page: number;
  perPage: number;
}

export interface ReviewDraft {
  productSlug: string;
  rating: number;
  title?: string;
  body: string;
  authorName: string;
  email: string;
  orderNumber?: string;
}

/* -------------------------------------------------------------------------- */
/* Cart                                                                        */
/* -------------------------------------------------------------------------- */

export interface CartLineInput {
  productSlug: string;
  variantId: string;
  quantity: number;
}

export interface CartLine {
  id: string;
  productSlug: string;
  variantId: string;
  name: string;
  subtitle: string;
  sku: string;
  image: ImageAsset | null;
  colorName: string;
  colorHex: string;
  sizeLabel: string;
  quantity: number;
  unitPrice: Money;
  unitCompareAtPrice: Money | null;
  lineTotal: Money;
  stockStatus: StockStatus;
  /** Set when Admin stock dropped below the quantity in the cart. */
  maxQuantity: number | null;
}

export interface CartTotals {
  subtotal: Money;
  discount: Money;
  shipping: Money | null;
  total: Money;
  /** Remaining spend to reach free shipping, null once qualified. */
  freeShippingRemaining: Money | null;
}

export interface AppliedDiscount {
  code: string;
  label: string;
  amount: Money;
  type: PromotionType;
}

export interface Cart {
  id: string;
  lines: CartLine[];
  totals: CartTotals;
  discounts: AppliedDiscount[];
  /** Governorate used for the shipping estimate, if chosen. */
  shippingGovernorateId: string | null;
  currency: Currency;
}

/* -------------------------------------------------------------------------- */
/* Promotions                                                                  */
/* -------------------------------------------------------------------------- */

export type PromotionType =
  | "percentage"
  | "fixed"
  | "buy-x-get-y"
  | "free-shipping"
  | "voucher"
  | "flash-sale";

export interface Promotion {
  id: string;
  type: PromotionType;
  title: string;
  description: string;
  code: string | null;
  /** ISO. Drives the countdown on flash sales. */
  startsAt: string | null;
  endsAt: string | null;
  productSlugs: string[];
  collectionSlugs: string[];
}

/* -------------------------------------------------------------------------- */
/* Shipping                                                                    */
/* -------------------------------------------------------------------------- */

export interface Governorate {
  id: string;
  name: string;
  nameAr: string;
  fee: Money;
  /** "2–4 working days" — copy owned by Admin, not the storefront. */
  estimate: string;
  cities: City[];
  active: boolean;
}

export interface City {
  id: string;
  name: string;
  nameAr: string;
}

export interface ShippingSettings {
  governorates: Governorate[];
  freeShippingThreshold: Money | null;
  /** Shown on the cart and checkout. */
  policyNote: string;
}

/* -------------------------------------------------------------------------- */
/* Checkout & orders                                                           */
/* -------------------------------------------------------------------------- */

export type PaymentMethodId = "cod" | "card" | "wallet";

export interface PaymentMethod {
  id: PaymentMethodId;
  label: string;
  description: string;
  available: boolean;
  /** Some methods add a handling fee. Null when none. */
  fee: Money | null;
}

export interface CheckoutAddress {
  fullName: string;
  phone: string;
  email?: string;
  governorateId: string;
  cityId: string;
  street: string;
  building?: string;
  apartment?: string;
  landmark?: string;
  notes?: string;
}

export interface CheckoutDraft {
  cartId: string;
  address: CheckoutAddress;
  paymentMethod: PaymentMethodId;
  discountCodes: string[];
  /** Opt-in, unticked by default. */
  marketingOptIn: boolean;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready-to-ship"
  | "out-for-delivery"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded";

export interface OrderEvent {
  status: OrderStatus;
  at: string;
  note: string | null;
}

export interface OrderLine {
  productSlug: string;
  name: string;
  image: ImageAsset | null;
  colorName: string;
  sizeLabel: string;
  quantity: number;
  unitPrice: Money;
  lineTotal: Money;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  placedAt: string;
  lines: OrderLine[];
  totals: CartTotals;
  discounts: AppliedDiscount[];
  address: CheckoutAddress;
  governorateName: string;
  cityName: string;
  paymentMethod: PaymentMethodId;
  timeline: OrderEvent[];
  deliveryAttempts: DeliveryAttempt[];
  estimatedDelivery: string | null;
  /** True until the guest converts to an account. */
  isGuest: boolean;
}

export interface DeliveryAttempt {
  at: string;
  outcome: "delivered" | "no-answer" | "rescheduled" | "refused";
  note: string | null;
}

/* -------------------------------------------------------------------------- */
/* Customer account                                                            */
/* -------------------------------------------------------------------------- */

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  savedSizes: SavedSizes;
  addresses: SavedAddress[];
  createdAt: string;
}

export interface SavedSizes {
  /** Keyed by cut slug so "briefs: M, bras: 34B" both fit. */
  [cutSlug: string]: string;
}

export interface SavedAddress extends CheckoutAddress {
  id: string;
  label: string;
  isDefault: boolean;
}

export interface AccountClaimDraft {
  orderNumber: string;
  phone: string;
  password: string;
  email?: string;
  firstName: string;
  lastName: string;
}

/* -------------------------------------------------------------------------- */
/* Content: homepage, education, blog, static pages                            */
/* -------------------------------------------------------------------------- */

/**
 * The homepage is a list of sections returned by Admin, in order. The
 * storefront renders whatever it is given and skips section types it does not
 * know — so Admin can reorder, hide or add sections without a deploy.
 */
export type HomeSectionType =
  | "hero"
  | "characters"
  | "new-drop"
  | "collection-highlights"
  | "education"
  | "reviews"
  | "video-testimonials"
  | "promotion"
  | "blog-highlights"
  | "faq-preview";

export interface HomeSectionBase {
  id: string;
  type: HomeSectionType;
  order: number;
  visible: boolean;
  eyebrow?: string;
  title?: string;
  description?: string;
  cta?: { label: string; href: string } | null;
}

export interface HeroSection extends HomeSectionBase {
  type: "hero";
  headline: string;
  sublines: string[];
  characters: CharacterSummary[];
}

export interface CharactersSection extends HomeSectionBase {
  type: "characters";
  characters: CharacterSummary[];
}

export interface NewDropSection extends HomeSectionBase {
  type: "new-drop";
  collection: CollectionSummary;
  products: ProductSummary[];
}

export interface CollectionHighlightsSection extends HomeSectionBase {
  type: "collection-highlights";
  collections: CollectionSummary[];
}

export interface EducationSection extends HomeSectionBase {
  type: "education";
  items: EducationItem[];
}

export interface EducationItem {
  id: string;
  question: string;
  answer: string;
  image: ImageAsset | null;
  video: VideoAsset | null;
  /** Groups items into tabs: "Fabric", "Fit", "Care". */
  topic: string;
}

export interface ReviewsSection extends HomeSectionBase {
  type: "reviews";
  reviews: Review[];
  summary: RatingSummary;
}

export interface VideoTestimonialsSection extends HomeSectionBase {
  type: "video-testimonials";
  testimonials: VideoTestimonial[];
}

export interface VideoTestimonial {
  id: string;
  authorName: string;
  quote: string;
  video: VideoAsset;
  productSlug: string | null;
}

export interface PromotionSection extends HomeSectionBase {
  type: "promotion";
  promotion: Promotion;
  products: ProductSummary[];
}

export interface BlogHighlightsSection extends HomeSectionBase {
  type: "blog-highlights";
  posts: BlogPostSummary[];
}

export interface FaqPreviewSection extends HomeSectionBase {
  type: "faq-preview";
  faqs: FaqItem[];
}

export type HomeSection =
  | HeroSection
  | CharactersSection
  | NewDropSection
  | CollectionHighlightsSection
  | EducationSection
  | ReviewsSection
  | VideoTestimonialsSection
  | PromotionSection
  | BlogHighlightsSection
  | FaqPreviewSection;

export interface HomePage {
  sections: HomeSection[];
  seo: SeoMeta;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: ImageAsset | null;
  publishedAt: string;
  readingMinutes: number;
  characterSlug: string | null;
  tags: string[];
}

export interface BlogPost extends BlogPostSummary {
  /** Ordered blocks so Admin controls layout without HTML injection. */
  body: ContentBlock[];
  relatedProductSlugs: string[];
  tips: CharacterTip[];
  seo: SeoMeta;
}

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; attribution: string | null }
  | { type: "image"; image: ImageAsset }
  | { type: "video"; video: VideoAsset }
  | { type: "product"; productSlug: string };

export interface StaticPage {
  id: string;
  slug: string;
  title: string;
  lede: string | null;
  updatedAt: string;
  /** Renders as an in-page table of contents when there is more than one. */
  sections: StaticPageSection[];
  seo: SeoMeta;
}

export interface StaticPageSection {
  id: string;
  heading: string;
  blocks: ContentBlock[];
}

export interface SizeGuide {
  slug: string;
  title: string;
  intro: string;
  /** Each table is one cut family: briefs, bras, sets. */
  tables: SizeGuideTable[];
  howToMeasure: { step: string; detail: string }[];
}

export interface SizeGuideTable {
  id: string;
  title: string;
  columns: string[];
  rows: string[][];
  note: string | null;
}

/* -------------------------------------------------------------------------- */
/* Global settings & navigation                                                */
/* -------------------------------------------------------------------------- */

export interface AnnouncementItem {
  id: string;
  text: string;
  href: string | null;
}

export interface NavLink {
  label: string;
  href: string;
  description?: string;
  image?: ImageAsset | null;
}

export interface NavGroup {
  label: string;
  href: string;
  /** Rendered as a mega-menu column. */
  columns: { heading: string; links: NavLink[] }[];
  featured: NavLink[];
}

export interface StoreSettings {
  brandName: string;
  currency: Currency;
  announcements: AnnouncementItem[];
  announcementIntervalMs: number;
  navigation: NavGroup[];
  footerColumns: { heading: string; links: NavLink[] }[];
  social: { platform: string; href: string }[];
  contact: { whatsapp: string; phone: string; email: string; hours: string };
  freeShippingThreshold: Money | null;
}

/* -------------------------------------------------------------------------- */
/* Search                                                                      */
/* -------------------------------------------------------------------------- */

export interface SearchResults {
  query: string;
  products: ProductSummary[];
  collections: CollectionSummary[];
  characters: CharacterSummary[];
  materials: Material[];
  posts: BlogPostSummary[];
  suggestions: string[];
  total: number;
}

/* -------------------------------------------------------------------------- */
/* Transport                                                                   */
/* -------------------------------------------------------------------------- */

export interface ApiErrorBody {
  error: {
    code: string;
    /** Written for the customer, not the developer. Rendered as-is. */
    message: string;
    fields?: Record<string, string>;
  };
}
