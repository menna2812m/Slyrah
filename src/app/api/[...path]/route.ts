import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { parseProductQuery } from "@/lib/api/query";
import { getProductsBySlugs, queryProducts } from "@/lib/api/server/catalog";
import { getCart, isKnownDiscountCode, mutateCart, replaceCartLines } from "@/lib/api/server/cart";
import { buildHomePage, searchEverything } from "@/lib/api/server/content";
import { OrderError, claimAccount, createOrder, getOrder } from "@/lib/api/server/orders";
import type { ApiErrorBody } from "@/lib/api/types";
import {
  PAYMENT_METHODS,
  PROMOTIONS,
  SHIPPING_SETTINGS,
  reviewsByProduct,
} from "@/mocks/commerce";
import {
  BLOG_SUMMARIES,
  EDUCATION_ITEMS,
  FAQS,
  SIZE_GUIDES,
  STORE_SETTINGS,
  blogBySlug,
  staticPageBySlug,
} from "@/mocks/content";
import { COLLECTION_SUMMARIES, collectionBySlug, productBySlug } from "@/mocks/products";
import { CHARACTER_SUMMARIES, CUTS, MATERIALS, characterBySlug, materialBySlug } from "@/mocks/taxonomy";

/**
 * Development backend.
 *
 * Everything the storefront needs is served from here so client code is
 * genuinely API-driven rather than importing fixtures. When the Admin Panel’s
 * public API is ready, point `NEXT_PUBLIC_API_BASE_URL` at it and delete this
 * directory — no component changes required.
 */

export const dynamic = "force-dynamic";

function ok(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

function fail(status: number, code: string, message: string, fields?: Record<string, string>) {
  const body: ApiErrorBody = { error: { code, message, ...(fields ? { fields } : {}) } };
  return NextResponse.json(body, { status });
}

const notFound = (what: string) => fail(404, "NOT_FOUND", `We couldn’t find that ${what}.`);

/* -------------------------------------------------------------------------- */
/* Schemas                                                                     */
/* -------------------------------------------------------------------------- */

const cartLineSchema = z.object({
  productSlug: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z.number().int().min(0).max(20),
});

const addressSchema = z.object({
  fullName: z.string().min(2, "Enter the name the courier should ask for."),
  phone: z.string().regex(/^01[0125]\d{8}$/, "Enter an Egyptian mobile number, like 01012345678."),
  email: z.string().email("Check the email address.").optional().or(z.literal("")),
  governorateId: z.string().min(1, "Choose a governorate."),
  cityId: z.string().min(1, "Choose a city."),
  street: z.string().min(3, "Enter the street and number."),
  building: z.string().optional(),
  apartment: z.string().optional(),
  landmark: z.string().optional(),
  notes: z.string().max(400).optional(),
});

const checkoutSchema = z.object({
  cartId: z.string().min(1),
  address: addressSchema,
  paymentMethod: z.enum(["cod", "card", "wallet"]),
  discountCodes: z.array(z.string()).default([]),
  marketingOptIn: z.boolean().default(false),
});

const reviewSchema = z.object({
  productSlug: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(80).optional(),
  body: z.string().min(10, "Tell us at least a sentence — it helps the next person."),
  authorName: z.string().min(2, "Add a name to sign it with."),
  email: z.string().email("We need a valid email to match this to your order."),
  orderNumber: z.string().optional(),
});

const claimSchema = z.object({
  orderNumber: z.string().min(1),
  phone: z.string().regex(/^01[0125]\d{8}$/, "Enter the number you used at checkout."),
  password: z.string().min(8, "Use at least 8 characters."),
  email: z.string().email().optional().or(z.literal("")),
  firstName: z.string().min(2, "Enter your first name."),
  lastName: z.string().min(2, "Enter your last name."),
});

const notifySchema = z.object({
  productSlug: z.string().min(1),
  variantId: z.string().min(1),
  contact: z.string().min(5, "Enter a phone number or email so we can reach you."),
});

function zodFields(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.filter((p) => typeof p !== "number").join(".");
    if (key && !fields[key]) fields[key] = issue.message;
  }
  return fields;
}

/* -------------------------------------------------------------------------- */
/* GET                                                                         */
/* -------------------------------------------------------------------------- */

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const [root, a, b] = path;
  const search = request.nextUrl.searchParams;

  switch (root) {
    case "settings":
      return ok(STORE_SETTINGS);

    case "home":
      return ok(buildHomePage());

    case "products": {
      if (!a) {
        // Explicit slug list — used by the recently-viewed and wishlist rails,
        // which know exactly what they want and in what order.
        const slugs = search.get("slugs");
        if (slugs) {
          return ok({ items: getProductsBySlugs(slugs.split(",").filter(Boolean)) });
        }
        return ok(queryProducts(parseProductQuery(search)));
      }
      const product = productBySlug.get(a);
      if (!product) return notFound("product");
      if (b === "reviews") {
        const items = reviewsByProduct[a] ?? [];
        const page = Number(search.get("page") ?? 1);
        const perPage = Number(search.get("perPage") ?? 6);
        const sorted = [...items].sort((x, y) => y.createdAt.localeCompare(x.createdAt));
        return ok({
          items: sorted.slice((page - 1) * perPage, page * perPage),
          summary: product.rating ?? { average: 0, count: 0, distribution: [0, 0, 0, 0, 0] },
          total: sorted.length,
          page,
          perPage,
        });
      }
      return ok(product);
    }

    case "collections": {
      if (!a) return ok(COLLECTION_SUMMARIES);
      const collection = collectionBySlug.get(a);
      return collection ? ok(collection) : notFound("collection");
    }

    case "characters": {
      if (!a) return ok(CHARACTER_SUMMARIES);
      const character = characterBySlug.get(a);
      return character ? ok(character) : notFound("character");
    }

    case "materials": {
      if (!a) return ok(MATERIALS);
      const material = materialBySlug.get(a);
      return material ? ok(material) : notFound("fabric");
    }

    case "cuts":
      return ok(CUTS);

    case "search":
      return ok(searchEverything(search.get("q") ?? ""));

    case "cart": {
      const cartId = search.get("cartId");
      if (!cartId) return fail(400, "MISSING_CART_ID", "No bag id was sent.");
      return ok(getCart(cartId));
    }

    case "shipping":
      return ok(SHIPPING_SETTINGS);

    case "payment-methods":
      return ok(PAYMENT_METHODS);

    case "promotions":
      return ok(PROMOTIONS);

    case "education":
      return ok(EDUCATION_ITEMS);

    case "faqs":
      return ok(FAQS);

    case "blog": {
      if (!a) return ok(BLOG_SUMMARIES);
      const post = blogBySlug.get(a);
      return post ? ok(post) : notFound("article");
    }

    case "pages": {
      if (!a) return notFound("page");
      const page = staticPageBySlug.get(a);
      return page ? ok(page) : notFound("page");
    }

    case "size-guides": {
      if (!a) return ok(SIZE_GUIDES);
      const guide = SIZE_GUIDES.find((g) => g.slug === a);
      return guide ? ok(guide) : notFound("size guide");
    }

    case "orders": {
      if (!a) return notFound("order");
      const order = getOrder(a, search.get("phone") ?? undefined);
      if (!order) {
        return fail(
          404,
          "ORDER_NOT_FOUND",
          "No order matches that number and phone. Check both against your confirmation message.",
        );
      }
      return ok(order);
    }

    default:
      return notFound("endpoint");
  }
}

/* -------------------------------------------------------------------------- */
/* POST                                                                        */
/* -------------------------------------------------------------------------- */

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const [root, a, b] = path;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return fail(400, "BAD_JSON", "That request couldn’t be read. Refresh and try again.");
  }

  switch (root) {
    case "cart": {
      const cartId = request.nextUrl.searchParams.get("cartId");
      if (!cartId) return fail(400, "MISSING_CART_ID", "No bag id was sent.");

      if (a === "lines") {
        const parsed = z.object({ lines: z.array(cartLineSchema) }).safeParse(payload);
        if (!parsed.success) return fail(422, "INVALID_LINES", "That item couldn’t be added.", zodFields(parsed.error));
        return ok(replaceCartLines(cartId, parsed.data.lines));
      }

      if (a === "discounts") {
        const parsed = z.object({ code: z.string().min(1) }).safeParse(payload);
        if (!parsed.success) return fail(422, "INVALID_CODE", "Enter a discount code.");
        const code = parsed.data.code.trim().toUpperCase();
        if (!isKnownDiscountCode(code)) {
          return fail(422, "UNKNOWN_CODE", `${code} isn’t a code we recognise. Check the spelling.`, {
            code: "That code doesn’t exist.",
          });
        }
        const cart = mutateCart(cartId, (stored) => {
          if (!stored.codes.includes(code)) stored.codes.push(code);
        });
        if (!cart.discounts.some((d) => d.code === code)) {
          mutateCart(cartId, (stored) => {
            stored.codes = stored.codes.filter((c) => c !== code);
          });
          return fail(422, "CODE_NOT_APPLICABLE", `${code} doesn’t apply to what’s in your bag yet.`, {
            code: "Nothing in your bag qualifies.",
          });
        }
        return ok(cart);
      }

      if (a === "shipping") {
        const parsed = z.object({ governorateId: z.string().nullable() }).safeParse(payload);
        if (!parsed.success) return fail(422, "INVALID_GOVERNORATE", "Choose a governorate.");
        return ok(
          mutateCart(cartId, (stored) => {
            stored.governorateId = parsed.data.governorateId;
          }),
        );
      }

      return notFound("endpoint");
    }

    case "checkout": {
      const parsed = checkoutSchema.safeParse(payload);
      if (!parsed.success) {
        return fail(422, "INVALID_CHECKOUT", "Some details need fixing before we can place the order.", zodFields(parsed.error));
      }
      try {
        const order = createOrder({
          ...parsed.data,
          address: { ...parsed.data.address, email: parsed.data.address.email || undefined },
        });
        // The bag is emptied only once the order actually exists.
        replaceCartLines(parsed.data.cartId, []);
        return ok(order, { status: 201 });
      } catch (error) {
        if (error instanceof OrderError) return fail(422, error.code, error.message, error.fields);
        throw error;
      }
    }

    case "products": {
      if (b === "reviews") {
        const parsed = reviewSchema.safeParse({ ...(payload as object), productSlug: a });
        if (!parsed.success) {
          return fail(422, "INVALID_REVIEW", "Your review needs a couple of fixes.", zodFields(parsed.error));
        }
        // Verification is decided by the backend against confirmed orders —
        // never asserted by the submitter.
        return ok(
          {
            status: "pending-moderation",
            message:
              "Thanks — your review is with us. We check it against your order before publishing, usually within a day.",
          },
          { status: 202 },
        );
      }
      return notFound("endpoint");
    }

    case "account": {
      if (a === "claim") {
        const parsed = claimSchema.safeParse(payload);
        if (!parsed.success) {
          return fail(422, "INVALID_CLAIM", "Check the details below.", zodFields(parsed.error));
        }
        try {
          const { customer, order } = claimAccount({
            ...parsed.data,
            email: parsed.data.email || undefined,
          });
          return ok({ customer, order }, { status: 201 });
        } catch (error) {
          if (error instanceof OrderError) return fail(422, error.code, error.message, error.fields);
          throw error;
        }
      }
      return notFound("endpoint");
    }

    case "notify": {
      const parsed = notifySchema.safeParse(payload);
      if (!parsed.success) {
        return fail(422, "INVALID_NOTIFY", "We need a way to reach you.", zodFields(parsed.error));
      }
      return ok({
        status: "subscribed",
        message: "We’ll message you the moment that size is back. One message, then we stop.",
      });
    }

    default:
      return notFound("endpoint");
  }
}
