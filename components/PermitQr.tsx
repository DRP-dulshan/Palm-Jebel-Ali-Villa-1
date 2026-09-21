import { listing } from "@/content/listing";

/**
 * DLD permit QR. Always rendered on a white plate with padding so the
 * quiet zone survives on dark sections and the code stays scannable.
 * 90px is the practical floor for a phone camera, so `size` never goes below it.
 */
export default function PermitQr({
  size = 104,
  label,
  align = "start",
  className = "",
}: {
  /** Rendered edge length of the QR itself, in px. Clamped to a 90px minimum. */
  size?: number;
  label?: string;
  align?: "start" | "center";
  className?: string;
}) {
  const edge = Math.max(90, size);

  return (
    <div
      className={`flex items-center gap-4 ${
        align === "center" ? "flex-col text-center" : ""
      } ${className}`}
    >
      {/* White plate with padding — preserves the QR's quiet zone on any background */}
      <div className="shrink-0 rounded-[2px] bg-white p-2">
        <img
          src="/images/dld-permit-qr.jpeg"
          alt={listing.permit.alt}
          width={edge}
          height={edge}
          loading="lazy"
          decoding="async"
          className="block"
          style={{ width: edge, height: edge }}
        />
      </div>
      {label && (
        <p className="eyebrow leading-relaxed opacity-70">{label}</p>
      )}
    </div>
  );
}
