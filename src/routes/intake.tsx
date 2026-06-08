import { createFileRoute } from "@tanstack/react-router";
import { MarketingShell } from "@/components/shared/MarketingShell";
import { IntakeFlow } from "@/components/customer/IntakeFlow";

export const Route = createFileRoute("/intake")({
  head: () => ({
    meta: [
      { title: "Start your move — LeaseMate" },
      { name: "description", content: "Tell us about your move and we'll line up the right providers." },
    ],
  }),
  component: IntakePage,
});

function IntakePage() {
  return (
    <MarketingShell>
      <IntakeFlow />
    </MarketingShell>
  );
}
