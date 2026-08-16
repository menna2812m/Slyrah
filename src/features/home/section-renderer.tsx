import { BlogHighlightsSection } from "@/features/home/sections/blog-highlights";
import { CharactersSection } from "@/features/home/sections/characters";
import { CollectionHighlightsSection } from "@/features/home/sections/collection-highlights";
import { EducationSection } from "@/features/home/sections/education";
import { FaqPreviewSection } from "@/features/home/sections/faq-preview";
import { HeroSection } from "@/features/home/sections/hero";
import { NewDropSection } from "@/features/home/sections/new-drop";
import { PromotionSection } from "@/features/home/sections/promotion";
import { ReviewsSection } from "@/features/home/sections/reviews";
import { VideoTestimonialsSection } from "@/features/home/sections/video-testimonials";
import type { HomeSection } from "@/lib/api/types";

/**
 * Admin owns the homepage’s order and visibility. This renders whatever list
 * it is handed, and silently skips a section type it doesn’t know — so a new
 * section type added in Admin degrades to nothing rather than to a crash.
 */
export function HomeSectionRenderer({ section }: { section: HomeSection }) {
  switch (section.type) {
    case "hero":
      return <HeroSection section={section} />;
    case "characters":
      return <CharactersSection section={section} />;
    case "new-drop":
      return <NewDropSection section={section} />;
    case "collection-highlights":
      return <CollectionHighlightsSection section={section} />;
    case "education":
      return <EducationSection section={section} />;
    case "reviews":
      return <ReviewsSection section={section} />;
    case "video-testimonials":
      return <VideoTestimonialsSection section={section} />;
    case "promotion":
      return <PromotionSection section={section} />;
    case "blog-highlights":
      return <BlogHighlightsSection section={section} />;
    case "faq-preview":
      return <FaqPreviewSection section={section} />;
    default:
      return null;
  }
}
