/* Thin-line icons, 1px stroke, drawn on a 24×24 grid. */

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

export function BedIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 18V8M3 18h18M21 18v-5a3 3 0 0 0-3-3h-7v3" />
      <path d="M3 13h8" />
      <circle cx="6.75" cy="10.5" r="1.75" />
    </svg>
  );
}

export function SofaIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 11V8.5A2.5 2.5 0 0 1 6.5 6h11A2.5 2.5 0 0 1 20 8.5V11" />
      <path d="M4 11a2 2 0 0 0-2 2v4h20v-4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v1H6v-1a2 2 0 0 0-2-2Z" />
      <path d="M5 17v1.5M19 17v1.5" />
    </svg>
  );
}

export function LivingIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="2.5" y="5" width="8" height="14" />
      <rect x="13.5" y="5" width="8" height="14" />
      <path d="M2.5 15h8M13.5 15h8" />
    </svg>
  );
}

export function TerraceIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2 17h20" />
      <path d="M4 17V9h16v8" />
      <path d="M4 9 12 4l8 5" />
      <path d="M8 17v-4M12 17v-4M16 17v-4" />
    </svg>
  );
}

export function RoofIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2 12 12 5l10 7" />
      <path d="M4.5 12v7h15v-7" />
      <path d="M9.5 19v-4.5h5V19" />
    </svg>
  );
}

export function GardenIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 20v-7" />
      <path d="M12 13c0-3 2-5 5-5 0 3-2 5-5 5Z" />
      <path d="M12 15c0-3-2-5-5-5 0 3 2 5 5 5Z" />
      <path d="M4 20h16" />
    </svg>
  );
}

export function WaveIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2 9c2.2 0 2.2 2 4.4 2s2.2-2 4.4-2 2.2 2 4.4 2S17.4 9 19.6 9c1.1 0 1.65.5 2.4.5" />
      <path d="M2 14c2.2 0 2.2 2 4.4 2s2.2-2 4.4-2 2.2 2 4.4 2S17.4 14 19.6 14c1.1 0 1.65.5 2.4.5" />
    </svg>
  );
}

export function ArrowDownIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 4v16M6 14l6 6 6-6" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} strokeWidth={1.25}>
      <path d="M4 12.5 9 17.5 20 6.5" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} strokeWidth={1.25}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ChevronIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} strokeWidth={1.25}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function ExpandIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 9V4h5M20 15v5h-5M20 9V4h-5M4 15v5h5" />
    </svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 5 5.1 1.5 1.5 0 0 1 6.5 3.5Z" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="1" />
      <path d="m2.5 7 9.5 6.5L21.5 7" />
    </svg>
  );
}

export function PlanIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="3" width="18" height="18" />
      <path d="M3 10h7m0-7v18M10 15h11" />
    </svg>
  );
}

export function ZoomIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5M8.5 11h5M11 8.5v5" />
    </svg>
  );
}

export function MinusIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} strokeWidth={1.25}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} strokeWidth={1.25}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2.05 22l5.3-1.38a9.86 9.86 0 0 0 4.69 1.19h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm0 18.05h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.1.81.83-3.03-.2-.31a8.17 8.17 0 0 1-1.25-4.36c0-4.54 3.7-8.23 8.24-8.23a8.18 8.18 0 0 1 5.82 2.41 8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.21-8.26 8.21Zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.1-.5.11-.11.25-.29.37-.44.13-.14.17-.25.25-.41.09-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.02 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

export const featureIcons = {
  bed: BedIcon,
  sofa: SofaIcon,
  living: LivingIcon,
  terrace: TerraceIcon,
  roof: RoofIcon,
  garden: GardenIcon,
  wave: WaveIcon,
} as const;
