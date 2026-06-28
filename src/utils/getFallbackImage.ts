import placeholder1 from "../assets/blog-placeholder-1.jpg";
import placeholder2 from "../assets/blog-placeholder-2.jpg";
import placeholder3 from "../assets/blog-placeholder-3.jpg";
import placeholder4 from "../assets/blog-placeholder-4.jpg";

const placeholders = [placeholder1, placeholder2, placeholder3, placeholder4];

// Returns a deterministic placeholder image based on the post's pubDate.
// Uses the day-of-month modulo 4 so each post gets a stable, varied image.
export function getFallbackImage(pubDate: Date) {
  const index = pubDate.getDate() % placeholders.length;
  return placeholders[index];
}
