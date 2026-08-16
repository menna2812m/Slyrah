"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";
import { Modal } from "@/components/ui/overlay";
import { toast } from "@/components/ui/toast";
import { ApiError, engagementApi } from "@/lib/api/client";

export function NotifyMe({
  productSlug,
  variantId,
  productName,
  sizeLabel,
}: {
  productSlug: string;
  variantId: string;
  productName: string;
  sizeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [contact, setContact] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (contact.trim().length < 5) {
      setError("Enter a phone number or an email so we can reach you.");
      return;
    }

    setSaving(true);
    try {
      const result = await engagementApi.notifyMe(productSlug, variantId, contact.trim());
      toast.success("We’ll tell you when it’s back", { detail: result.message });
      setOpen(false);
      setContact("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "That didn’t send. Try again in a moment.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Button variant="secondary" size="lg" fullWidth onClick={() => setOpen(true)}>
        Tell me when it’s back
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Tell me when it’s back"
        description={`${productName}, size ${sizeLabel}. One message when it returns, then we stop.`}
        className="sm:max-w-md"
      >
        <form onSubmit={submit} className="flex flex-col gap-4">
          <TextField
            label="Phone or email"
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            error={error ?? undefined}
            placeholder="01012345678"
            autoComplete="tel"
            inputMode="text"
          />
          <Button type="submit" size="lg" loading={saving} loadingLabel="Saving">
            Notify me
          </Button>
          <p className="text-[0.8125rem] text-clay">
            We use this only for this one message. It doesn’t sign you up to anything.
          </p>
        </form>
      </Modal>
    </>
  );
}
