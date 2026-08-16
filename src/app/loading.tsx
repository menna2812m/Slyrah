import { ButterflyLoader } from "@/components/ui/butterfly";

export default function Loading() {
  return (
    <div className="shell grid min-h-[50vh] place-items-center py-24">
      <ButterflyLoader />
    </div>
  );
}
