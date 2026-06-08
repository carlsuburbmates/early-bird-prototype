import { createFileRoute } from "@tanstack/react-router";
import { MarketingShell } from "@/components/shared/MarketingShell";
import { RequestStatus } from "@/components/customer/RequestStatus";

export const Route = createFileRoute("/request/$id")({
  head: () => ({ meta: [{ title: "Your request — LeaseMate" }] }),
  component: RequestPage,
});

function RequestPage() {
  const { id } = Route.useParams();
  return (
    <MarketingShell>
      <RequestStatus id={id} />
    </MarketingShell>
  );
}
