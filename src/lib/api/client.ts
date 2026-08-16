import type {
  AccountClaimDraft,
  ApiErrorBody,
  Cart,
  CartLineInput,
  CheckoutDraft,
  Customer,
  Order,
  ProductListResponse,
  ProductSummary,
  ReviewDraft,
  ReviewListResponse,
  SearchResults,
} from "@/lib/api/types";

/**
 * Browser-side API client.
 *
 * Point `NEXT_PUBLIC_API_BASE_URL` at the Admin Panel’s public API to move off
 * the bundled dev backend. Nothing else changes.
 */
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

/** Errors carry the customer-facing message and any per-field messages. */
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public fields?: Record<string, string>,
    public status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const NETWORK_MESSAGE = "We couldn’t reach Slyrah. Check your connection and try again.";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE}${path}`, {
      ...init,
      headers: { "content-type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError("NETWORK", NETWORK_MESSAGE);
  }

  if (!response.ok) {
    let body: ApiErrorBody | null = null;
    try {
      body = (await response.json()) as ApiErrorBody;
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(
      body?.error.code ?? "UNKNOWN",
      body?.error.message ?? "Something went wrong on our side. Try again in a moment.",
      body?.error.fields,
      response.status,
    );
  }

  return (await response.json()) as T;
}

/* --- Cart ----------------------------------------------------------------- */

export const cartApi = {
  get: (cartId: string) => request<Cart>(`/cart?cartId=${encodeURIComponent(cartId)}`),

  setLines: (cartId: string, lines: CartLineInput[]) =>
    request<Cart>(`/cart/lines?cartId=${encodeURIComponent(cartId)}`, {
      method: "POST",
      body: JSON.stringify({ lines }),
    }),

  applyDiscount: (cartId: string, code: string) =>
    request<Cart>(`/cart/discounts?cartId=${encodeURIComponent(cartId)}`, {
      method: "POST",
      body: JSON.stringify({ code }),
    }),

  setGovernorate: (cartId: string, governorateId: string | null) =>
    request<Cart>(`/cart/shipping?cartId=${encodeURIComponent(cartId)}`, {
      method: "POST",
      body: JSON.stringify({ governorateId }),
    }),
};

/* --- Catalogue ------------------------------------------------------------ */

export const catalogApi = {
  products: (query: string) => request<ProductListResponse>(`/products?${query}`),

  /** Ordered lookup for the wishlist and recently-viewed rails. */
  bySlugs: (slugs: string[]) =>
    request<{ items: ProductSummary[] }>(`/products?slugs=${encodeURIComponent(slugs.join(","))}`),

  reviews: (slug: string, page = 1, perPage = 6) =>
    request<ReviewListResponse>(`/products/${slug}/reviews?page=${page}&perPage=${perPage}`),
  search: (q: string) => request<SearchResults>(`/search?q=${encodeURIComponent(q)}`),
};

/* --- Checkout & orders ---------------------------------------------------- */

export const checkoutApi = {
  placeOrder: (draft: CheckoutDraft) =>
    request<Order>("/checkout", { method: "POST", body: JSON.stringify(draft) }),
};

export const orderApi = {
  track: (orderNumber: string, phone: string) =>
    request<Order>(
      `/orders/${encodeURIComponent(orderNumber.trim().toUpperCase())}?phone=${encodeURIComponent(phone)}`,
    ),
};

export const accountApi = {
  claim: (draft: AccountClaimDraft) =>
    request<{ customer: Customer; order: Order }>("/account/claim", {
      method: "POST",
      body: JSON.stringify(draft),
    }),
};

/* --- Engagement ----------------------------------------------------------- */

export const engagementApi = {
  submitReview: (draft: ReviewDraft) =>
    request<{ status: string; message: string }>(`/products/${draft.productSlug}/reviews`, {
      method: "POST",
      body: JSON.stringify(draft),
    }),

  notifyMe: (productSlug: string, variantId: string, contact: string) =>
    request<{ status: string; message: string }>("/notify", {
      method: "POST",
      body: JSON.stringify({ productSlug, variantId, contact }),
    }),
};
