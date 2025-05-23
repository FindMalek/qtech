"use client"

import { motion } from "motion/react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { usePricingSelection } from "@/hooks/use-pricing-selection"

import { Icons } from "@/components/shared/icons"
import { SectionHeader } from "@/components/shared/section-header"

export function MarketingPricingSection() {
  const { selectPricingTier } = usePricingSelection()

  // Update price animation
  const PriceDisplay = ({
    tier,
  }: {
    tier: (typeof siteConfig.pricing.pricingItems)[0]
  }) => {
    return (
      <motion.span
        key={tier.price}
        className="text-4xl font-semibold"
        initial={{
          opacity: 0,
          x: -10,
          filter: "blur(5px)",
        }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      >
        {tier.price}
      </motion.span>
    )
  }

  return (
    <section
      id="pricing"
      className="relative flex w-full flex-col items-center justify-center gap-10 pb-10"
    >
      <SectionHeader>
        <h2 className="text-balance text-center text-3xl font-medium tracking-tighter md:text-4xl">
          {siteConfig.pricing.title}
        </h2>
        <p className="text-muted-foreground text-balance text-center font-medium">
          {siteConfig.pricing.description}
        </p>
      </SectionHeader>
      <div className="relative h-full w-full">
        <div className="mx-auto grid w-full max-w-6xl gap-4 px-6 min-[650px]:grid-cols-2">
          {siteConfig.pricing.pricingItems.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative grid h-fit grid-rows-[180px_auto_1fr] rounded-xl min-[650px]:h-full min-[900px]:h-fit",
                tier.isPopular
                  ? "bg-accent md:shadow-[0px_61px_24px_-10px_rgba(0,0,0,0.01),0px_34px_20px_-8px_rgba(0,0,0,0.05),0px_15px_15px_-6px_rgba(0,0,0,0.09),0px_4px_8px_-2px_rgba(0,0,0,0.10),0px_0px_0px_1px_rgba(0,0,0,0.08)]"
                  : "border-border border bg-[#F3F4F6] dark:bg-[#F9FAFB]/[0.02]"
              )}
            >
              <div className="flex flex-col gap-4 p-4">
                <p className="text-sm">
                  {tier.name}
                  {tier.isPopular && (
                    <span className="from-secondary/50 to-secondary text-secondary-foreground ml-2 inline-flex h-6 w-fit items-center justify-center rounded-full bg-gradient-to-b from-[1.92%] to-[100%] px-2 text-sm shadow-[0px_6px_6px_-3px_rgba(0,0,0,0.08),0px_3px_3px_-1.5px_rgba(0,0,0,0.08),0px_1px_1px_-0.5px_rgba(0,0,0,0.08),0px_0px_0px_1px_rgba(255,255,255,0.12)_inset,0px_1px_0px_0px_rgba(255,255,255,0.12)_inset]">
                      Popular
                    </span>
                  )}
                </p>
                <div className="mt-2 flex items-baseline">
                  <PriceDisplay tier={tier} />
                </div>
                <p className="mt-2 text-sm">{tier.description}</p>
              </div>

              <div className="flex flex-col gap-2 p-4">
                <button
                  onClick={() => selectPricingTier(tier.name)}
                  className={`flex h-10 w-full cursor-pointer items-center justify-center rounded-full px-4 text-sm font-normal tracking-wide transition-all ease-out active:scale-95 ${
                    tier.isPopular
                      ? `${tier.buttonColor} shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)]`
                      : `${tier.buttonColor} shadow-[0px_1px_2px_0px_rgba(255,255,255,0.16)_inset,0px_3px_3px_-1.5px_rgba(16,24,40,0.24),0px_1px_1px_-0.5px_rgba(16,24,40,0.20)]`
                  }`}
                >
                  {tier.buttonText}
                </button>
              </div>
              <hr className="border-border dark:border-white/20" />
              <div className="p-4">
                {tier.name !== "Basic" && (
                  <p className="mb-4 text-sm">Everything in Basic +</p>
                )}
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <div
                        className={cn(
                          "border-primary/20 flex size-5 items-center justify-center rounded-full border",
                          tier.isPopular &&
                            "bg-muted-foreground/40 border-border"
                        )}
                      >
                        <Icons.check className="flex size-3 items-center justify-center stroke-[2.5px]" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
