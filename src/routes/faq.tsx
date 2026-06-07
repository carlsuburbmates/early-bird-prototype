import { createFileRoute } from "@tanstack/react-router";
import { MarketingShell } from "@/components/shared/MarketingShell";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — LeaseMate" },
      { name: "description", content: "Common questions about LeaseMate." },
    ],
  }),
  component: FAQ,
});

const QA = [
  ["What does LeaseMate cost?", "Nothing for renters. Providers pay a small introduction fee when they accept a job."],
  ["When do providers see my details?", "Only after they accept the job and pay the introduction fee. Until then, they see only the brief."],
  ["What suburbs do you cover?", "This prototype is seeded with inner-northern and inner-eastern Melbourne suburbs."],
  ["Is this a real booking platform?", "Not yet — this is a frontend prototype. No payments, emails, or real providers are contacted."],
];

function FAQ() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Frequently asked questions</h1>
        <Accordion type="single" collapsible className="mt-8">
          {QA.map(([q, a]) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger>{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </MarketingShell>
  );
}