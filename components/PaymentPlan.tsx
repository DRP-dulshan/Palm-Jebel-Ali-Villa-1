import Reveal from "./Reveal";
import { Container, Eyebrow, Section } from "./ui";
import { listing } from "@/content/listing";
import { CheckIcon } from "./icons";

const { paymentPlan: plan } = listing;

/** Instalments already settled, used for the progress bar and the divider. */
const paidCount = plan.schedule.filter((i) => i.paid).length;

/**
 * The developer payment plan.
 *
 * Percentages are of the ORIGINAL developer purchase price, never the asking
 * price, so no AED figure is derived or shown against an instalment.
 */
export default function PaymentPlan() {
  return (
    <Section id="payment-plan" tone="sand">
      <Container>
        <Reveal>
          <Eyebrow className="text-ink-mute">{plan.eyebrow}</Eyebrow>
          <h2 className="mt-7 max-w-3xl text-[clamp(2rem,5.5vw,3.5rem)] leading-[1.08]">
            {plan.heading}
          </h2>
          <p className="mt-7 max-w-2xl text-[1.0625rem] leading-[1.85] text-ink-soft">
            {plan.sub}
          </p>
        </Reveal>

        {/* Summary cards */}
        <ul className="mt-14 grid gap-px border border-ink/10 bg-ink/10 sm:mt-16 sm:grid-cols-3">
          {plan.cards.map((card, i) => (
            <Reveal
              as="li"
              key={card.label}
              delay={i * 90}
              className="bg-sand-50 px-7 py-9 sm:px-8 sm:py-10"
            >
              <p className="eyebrow text-ink-mute">{card.label}</p>
              <p className="mt-4 font-serif text-[clamp(2.25rem,6vw,3.25rem)] font-light leading-none text-ink lining-nums">
                {card.value}
              </p>
              {"detail" in card && card.detail && (
                <p className="mt-3 text-[0.9375rem] text-ink-soft lining-nums">
                  {card.detail}
                </p>
              )}
            </Reveal>
          ))}
        </ul>

        {/* Progress */}
        <Reveal delay={120} className="mt-16 sm:mt-20">
          <div className="flex items-baseline justify-between gap-4">
            <p className="eyebrow text-ink">{plan.progressLabel}</p>
            <p className="eyebrow text-ink-mute lining-nums tabular-nums">50 / 100</p>
          </div>
          <div
            className="mt-4 h-1.5 w-full overflow-hidden bg-ink/12"
            role="img"
            aria-label={plan.progressLabel}
          >
            <div className="h-full w-1/2 bg-accent" />
          </div>
        </Reveal>

        {/* Schedule */}
        <Reveal delay={160} className="mt-12 sm:mt-14">
          {/* Column headings, desktop only — the timeline reads fine without them */}
          <div className="hidden border-b border-ink/12 pb-3 sm:grid sm:grid-cols-[4rem_1fr_7rem_8rem] sm:gap-4">
            {[plan.columns.number, plan.columns.date, plan.columns.percent, plan.columns.status].map(
              (heading, i) => (
                <p
                  key={heading}
                  className={`eyebrow text-ink-mute ${i >= 2 ? "text-right" : ""}`}
                >
                  {heading}
                </p>
              )
            )}
          </div>

          <ol className="relative">
            {/* The timeline rail, mobile only */}
            <span
              className="absolute left-[7px] top-4 bottom-4 w-px bg-ink/15 sm:hidden"
              aria-hidden="true"
            />

            {plan.schedule.map((item, i) => (
              <li key={item.number}>
                {i === paidCount && (
                  <div className="relative flex items-center gap-4 py-7">
                    <span className="h-px flex-1 bg-accent/40" aria-hidden="true" />
                    <span className="eyebrow shrink-0 text-accent-text">
                      {plan.dividerLabel}
                    </span>
                    <span className="h-px flex-1 bg-accent/40" aria-hidden="true" />
                  </div>
                )}

                <div
                  className={`relative grid grid-cols-[1.25rem_1fr_auto] items-center gap-x-4 gap-y-1 border-b border-ink/10 py-4 sm:grid-cols-[4rem_1fr_7rem_8rem] sm:gap-4 sm:py-5 ${
                    item.paid ? "text-ink-mute" : "text-ink"
                  }`}
                >
                  {/* Marker: a rail dot on mobile, the instalment number on desktop */}
                  <span className="relative flex items-center sm:hidden" aria-hidden="true">
                    {item.paid ? (
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-sand-100 ring-1 ring-ink/20">
                        <CheckIcon className="h-2.5 w-2.5 text-ink-mute" />
                      </span>
                    ) : (
                      <span className="h-3.5 w-3.5 rounded-full bg-accent ring-4 ring-sand-100" />
                    )}
                  </span>
                  <span className="eyebrow hidden text-ink-mute lining-nums tabular-nums sm:block">
                    {String(item.number).padStart(2, "0")}
                  </span>

                  <span
                    className={`text-[0.9375rem] lining-nums sm:text-base ${
                      item.paid ? "" : "font-medium"
                    }`}
                  >
                    {item.date}
                  </span>

                  <span
                    className={`justify-self-end font-serif text-xl font-light lining-nums tabular-nums sm:text-2xl ${
                      item.paid ? "text-ink-mute" : "text-ink"
                    }`}
                  >
                    {item.percent}
                  </span>

                  <span
                    className={`col-start-2 row-start-2 eyebrow sm:col-start-auto sm:row-start-auto sm:justify-self-end ${
                      item.paid ? "text-ink-mute" : "text-accent-text"
                    }`}
                  >
                    {item.paid ? (
                      <span className="flex items-center gap-2">
                        <CheckIcon className="hidden h-3.5 w-3.5 sm:block" />
                        {plan.paidLabel}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span
                          className="hidden h-1.5 w-1.5 rounded-full bg-accent sm:block"
                          aria-hidden="true"
                        />
                        {plan.remainingLabel}
                      </span>
                    )}
                  </span>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-8 max-w-2xl text-[0.8125rem] leading-relaxed text-ink-mute">
            {plan.disclaimer}
          </p>
        </Reveal>

        <Reveal delay={200} className="mt-10">
          <a
            href="#enquire"
            className="eyebrow inline-flex items-center bg-ink px-8 py-4 text-sand-50 transition-colors duration-300 hover:bg-teal-deep"
          >
            {plan.cta}
          </a>
        </Reveal>
      </Container>
    </Section>
  );
}
