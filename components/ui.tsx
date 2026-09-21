import type { ReactNode } from "react";

/** Page gutter + max width, shared by every section. */
export function Container({
  children,
  className = "",
  width = "default",
}: {
  children: ReactNode;
  className?: string;
  width?: "default" | "narrow" | "wide";
}) {
  const max =
    width === "narrow" ? "max-w-3xl" : width === "wide" ? "max-w-[92rem]" : "max-w-6xl";
  return (
    <div className={`mx-auto w-full ${max} px-6 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}

/** Uppercase tracked-out label, e.g. "PALM JEBEL ALI · FROND A". */
export function Eyebrow({
  children,
  className = "",
  withRule = true,
}: {
  children: ReactNode;
  className?: string;
  withRule?: boolean;
}) {
  return (
    <p className={`eyebrow flex items-center gap-4 ${className}`}>
      {withRule && <span className="rule shrink-0" aria-hidden="true" />}
      <span>{children}</span>
    </p>
  );
}

/** The primary accent button. */
export function Cta({
  href,
  children,
  variant = "solid",
  className = "",
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "light";
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const styles = {
    solid:
      "bg-ink text-sand-50 hover:bg-teal-deep border border-transparent",
    outline:
      "border border-ink/25 text-ink hover:border-accent hover:text-accent-text bg-transparent",
    light:
      "border border-white/40 text-white hover:bg-white hover:text-ink bg-transparent backdrop-blur-[2px]",
  }[variant];

  return (
    <a
      href={href}
      className={`eyebrow inline-flex items-center justify-center gap-2.5 px-7 py-4 transition-colors duration-300 ${styles} ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}

/** Section wrapper with consistent vertical rhythm. */
export function Section({
  id,
  children,
  className = "",
  tone = "light",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "light" | "sand" | "dark";
}) {
  const tones = {
    light: "bg-sand-50 text-ink",
    sand: "bg-sand-100 text-ink",
    dark: "bg-stone-900 text-sand-100",
  }[tone];

  return (
    <section
      id={id}
      className={`scroll-mt-20 py-24 sm:py-32 lg:py-40 ${tones} ${className}`}
    >
      {children}
    </section>
  );
}
