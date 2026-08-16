# Slyrah — storefront

The customer-facing website for Slyrah, a women's underwear brand in Egypt.
Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4.

**This application contains no admin functionality.** The Admin Panel is a
separate application with its own authentication and authorisation. Everything
this storefront displays — products, collections, characters, promotions,
shipping rates, page content, homepage section order — arrives over an API and
is rendered as given.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run typecheck
npm run lint
```

---

## Design direction

**Structural colour.** A butterfly's colour comes from how the wing bends
light, not from pigment. Fabric behaves the same way. So the palette is built
from one duochrome pair — iris `#6D5C9B` and peony `#C86A88` — that appears
**only on edges**: 1–2px rules, focus rings, the selected-swatch ring, the mark
itself. Never as a background wash. Surfaces stay quiet so photography and type
carry the page.

| Token | Value | Role |
| --- | --- | --- |
| `oyster` | `#F2F0F1` | Page ground — pale and cool, deliberately not cream |
| `chalk` | `#FCFBFC` | Cards, sheets, inputs |
| `aubergine` | `#2B1F2E` | Editorial dark panels: the drop, character heroes, the footer |
| `ink` | `#221D23` | Plum-black — headings, primary button |
| `iris` / `peony` | `#6D5C9B` / `#C86A88` | The duochrome. Edges only |
| `sale` | `#B0324F` | Discounts, kept distinct from peony so it reads as urgency |

**Type.** Fraunces for display, with its `SOFT` and `WONK` axes engaged so
headings read as hand-cut rather than neutrally luxurious. Hanken Grotesk for
body. DM Mono, at caption size only, for everything that gets compared to
something else — prices, sizes, SKUs, counters, countdowns. That is why a size
grid reads like a spec table.

**The signature is the butterfly**, and it does three jobs and no others: the
colour swatch, the wishlist toggle, and the loading state. As a swatch its two
wings carry the same colour at two light angles — the flat face and the shadow
side — so the mark previews the thing it is naming.

**The hero is the four characters.** They are navigation, not decoration:
each panel is labelled with the specific problem that woman has with underwear,
and clicking one lands on a discovery view pre-filtered to the fabrics and cuts
that answer it. Pointing at a panel opens it and settles the others (pure CSS,
so it works under keyboard focus too).

---

## Architecture

```
src/
  app/                     routes only — every page is thin
    api/[...path]/         development backend (delete when Admin's API is live)
    media/spin/            generated placeholder frames for the 360° viewer
  components/
    ui/                    primitives: Button, Media, Overlay, Toast, Butterfly…
    layout/                header, footer, announcement bar, page header
    content/               Admin content-block renderer
    seo/                   JSON-LD
  features/                one folder per domain area
    catalog/ cart/ checkout/ orders/ product/ reviews/ wishlist/
    account/ search/ promotions/ home/
  lib/
    api/types.ts           the contract with Admin — the single source of truth
    api/server-data.ts     server-side reads (Server Components)
    api/client.ts          browser-side reads/writes (Client Components)
    api/query.ts           URL ⇄ ProductQuery, shared by both
    api/server/            the mock implementation behind the dev backend
  mocks/                   development fixtures, shaped exactly like API responses
  styles/globals.css       design tokens and the few named classes
```

### Swapping in the real API

1. Set `NEXT_PUBLIC_API_BASE_URL` to the Admin Panel's public API.
   `src/lib/api/client.ts` immediately talks to it instead of `/api`.
2. Replace the bodies in `src/lib/api/server-data.ts` with `fetch` calls. The
   signatures don't change, so no page or component is touched.
3. Delete `src/app/api/`, `src/lib/api/server/` and `src/mocks/`.

`src/lib/api/types.ts` is the contract. If a screen needs a new field it is
added there first, so Admin has one explicit thing to satisfy. Nothing in
`app/` or `features/` invents its own shape, and no product, price, order,
collection, promotion or shipping value is hard-coded anywhere.

### Server vs client

Server Components read through `server-data.ts` — one less hop than fetching
the app's own HTTP routes, and pages stay statically renderable (69 routes
prerender today). Client Components use `client.ts` over HTTP: the bag, search,
checkout, reviews and quick-add.

Money is stored in **minor units** (piastres) throughout, so arithmetic is
exact. `formatMoney` renders it. The client never computes a total and sends it
back — the server prices every cart, and the checkout endpoint recalculates
shipping against the chosen governorate rather than trusting the request.

### CMS-driven homepage

`GET /home` returns an ordered list of sections. `HomeSectionRenderer` renders
whatever it is handed and **skips section types it doesn't recognise**, so
Admin can reorder, hide, or introduce a section without a deploy — and an
unknown type degrades to nothing rather than to a crash.

---

## Notable decisions

**Photography doesn't exist yet, and the site says so.** `ImageAsset` is
`null` across the fixtures. Rather than grey boxes, `<Media>` renders the
fabric itself as a CSS weave in the garment's own colour, and character
portraits get a two-stop field in their accent pair. Aspect ratios are
identical either way, so when Admin supplies a real URL `<Image>` takes over
with zero layout shift and no other code changes.

**The 360° viewer only ever renders frames that exist.** A single still is
never transformed to imply a spin that wasn't photographed. In development,
`/media/spin/…` generates a labelled placeholder frame set so the viewer can be
built and tested; delete that route once real turntable frames are uploaded.
Products without frames simply don't offer the tab.

**"Verified purchase" is decided by the backend**, never by the storefront and
never asserted by the submitter. Reviews that can't be matched to a confirmed
order stay published and are labelled *Not matched to an order* — quietly
dropping them would make every remaining review look verified.

**Guest checkout is the only checkout.** No sign-in wall, no password, no step
that exists to collect something we don't need to deliver a parcel. The account
offer comes *after* the order is confirmed, says what it actually does for her,
and the backend attaches the guest order to the new account.

**Filter state lives in the URL.** A filtered view is shareable, linkable and
back-button-safe. Filtered listing pages are `noindex` so they don't compete
with the canonical one.

**Egypt-specific throughout.** All 27 governorates with per-governorate fees
and delivery estimates from the API, Egyptian mobile validation, cash on
delivery, EGP formatting, and delivery-attempt tracking on the order timeline.

---

## Quality floor

- **Responsive**: mobile-first with dedicated mobile UX — bottom sheets for
  filters and quick-add, a snap-scrolling gallery, a hamburger nav, and a
  checkout laid out for one thumb. Not a shrunken desktop.
- **Accessibility**: visible focus rings, focus trapping and scroll locking in
  every overlay, a skip link, `aria-live` on toasts and result counts, disabled
  (not hidden) unavailable sizes and colours, and `prefers-reduced-motion`
  honoured. Logical properties (`padding-inline`, `start`/`end`) are used
  throughout, so an Arabic RTL locale is a `dir` switch rather than a rewrite.
- **Every async action** has loading, success, error and empty states. There
  are no browser `alert`s anywhere — feedback is a toast, a sheet, or inline
  field text, and error messages say what to do next.
- **Performance**: static prerendering with ISR, `next/font` self-hosting,
  AVIF/WebP with explicit `sizes`, code-split overlays, no animation library,
  no layout shift from placeholder media.
- **SEO**: per-page metadata from the API's `seo` block (never hard-coded),
  canonical URLs, Open Graph, `sitemap.xml`, `robots.txt`, and structured data
  for Product (live price, availability and ratings), CollectionPage, Article,
  FAQPage, BreadcrumbList, Organization and WebSite.

### CSS layering

Named classes (`.shell`, `.rail`, `.edge-iris`, `.text-eyebrow`, `.wing-panel`)
live in `@layer components`, **not** `@layer utilities`. A class in the
utilities layer that sets `display` or `padding` will out-order a utility like
`lg:hidden` or `lg:px-0` on the same element and silently win. Keep them where
they are.

---

## Not built here

Admin functionality of any kind. Also deliberately left to the backend:
authenticated sessions (accounts begin at the confirmation screen and the
account page is useful without one), payment gateways (the checkout is
structured for them — `PaymentMethod` already carries `available` and `fee`,
and card and wallet render as unavailable), and review moderation.
