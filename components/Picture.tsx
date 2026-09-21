import manifest from "@/content/image-manifest.json";
import { photos } from "@/content/listing";

type Entry = {
  width: number;
  height: number;
  /** Responsive widths available; absent for single-size assets */
  widths?: number[];
  blur?: string;
  /** Set when the asset ships in a single format (e.g. "png" for plans) */
  format?: string;
};

const images = manifest as Record<string, Entry>;

type Props = {
  /** Key in the image manifest, e.g. "living-room" or "floor-plans/ground-floor" */
  slug: string;
  /** Sizes attribute — tells the browser which srcset entry to pick. */
  sizes: string;
  /** Only the hero should be priority; everything else lazy-loads. */
  priority?: boolean;
  className?: string;
  /** Applied to the <img> itself, e.g. object-position. */
  imgClassName?: string;
  /** Required unless the slug is a gallery photo, which carries its own alt. */
  alt?: string;
  /** Skip the blurred placeholder — wrong look on white line drawings. */
  noBlur?: boolean;
};

/**
 * Static responsive image: WebP with a JPEG fallback where both exist,
 * a blurred placeholder while loading, and intrinsic dimensions so nothing
 * shifts. Single-format assets (floor plans, logo) are served as-is.
 */
export default function Picture({
  slug,
  sizes,
  priority = false,
  className = "",
  imgClassName = "",
  alt,
  noBlur = false,
}: Props) {
  const meta = images[slug];
  if (!meta) throw new Error(`Unknown image: ${slug}`);

  const fallbackAlt = photos.find((p) => p.slug === slug)?.alt;
  const altText = alt ?? fallbackAlt;
  if (altText === undefined) throw new Error(`Missing alt text for image: ${slug}`);

  const responsive = meta.widths && meta.widths.length > 0;
  const srcset = (ext: string) =>
    responsive
      ? meta.widths!.map((w) => `/images/${slug}-${w}.${ext} ${w}w`).join(", ")
      : undefined;

  const ext = meta.format ?? "jpg";
  const src = responsive
    ? `/images/${slug}-1200.${ext}`
    : `/images/${slug}.${ext}`;

  const placeholder =
    meta.blur && !noBlur
      ? {
          backgroundImage: `url(${meta.blur})`,
          backgroundSize: "cover" as const,
          backgroundPosition: "center" as const,
        }
      : undefined;

  return (
    <picture className={className}>
      {responsive && !meta.format && (
        <source type="image/webp" srcSet={srcset("webp")} sizes={sizes} />
      )}
      <img
        src={src}
        srcSet={srcset(ext)}
        sizes={sizes}
        alt={altText}
        width={meta.width}
        height={meta.height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : undefined}
        className={`h-full w-full object-cover ${imgClassName}`}
        style={placeholder}
      />
    </picture>
  );
}

export { images as imageMeta };
