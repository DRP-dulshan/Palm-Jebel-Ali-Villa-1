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

export const featureIcons = {
  bed: BedIcon,
  sofa: SofaIcon,
  living: LivingIcon,
  terrace: TerraceIcon,
  roof: RoofIcon,
  garden: GardenIcon,
  wave: WaveIcon,
} as const;
