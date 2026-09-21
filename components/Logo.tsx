import manifest from "@/content/image-manifest.json";

const logo = (manifest as Record<string, { width: number; height: number }>)[
  "logo-nakheel-white"
];

/**
 * The Nakheel wordmark, reversed to white by the image build — the supplied
 * file is dark navy for light backgrounds. It must therefore always sit on a
 * dark background: the header keeps a scrim over the hero and turns solid
 * #2e2e2e on scroll, and the footer is #2e2e2e.
 */
export default function Logo({
  className = "",
  priority = false,
}: {
  /** Set the height here; width follows from the intrinsic ratio. */
  className?: string;
  priority?: boolean;
}) {
  return (
    <picture>
      <source type="image/webp" srcSet="/images/logo-nakheel-white.webp" />
      <img
        src="/images/logo-nakheel-white.png"
        alt="Nakheel"
        width={logo.width}
        height={logo.height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : undefined}
        className={`w-auto ${className}`}
      />
    </picture>
  );
}
