"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import type { CourseFaq } from "@/lib/course-catalog";
import { cn } from "@/lib/utils";

export function FAQAccordion({ faqs }: { faqs: CourseFaq[] }) {
  const uid = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
      {faqs.map((faq, index) => {
        const isOpen = open === index;
        const panelId = `${uid}-faq-${index}`;
        const buttonId = `${uid}-faq-button-${index}`;
        return (
          <div key={faq.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                onClick={() => setOpen(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-ink hover:bg-mist/60"
              >
                {faq.question}
                <Plus className={cn("size-5 shrink-0 text-azure transition", isOpen && "rotate-45")} aria-hidden />
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen} className="px-5 pb-5 text-sm leading-7 text-ink-soft">
              {faq.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
