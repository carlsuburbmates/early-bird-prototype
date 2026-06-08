import { createFileRoute } from "@tanstack/react-router";
import { ProviderDashboard } from "@/components/provider/ProviderDashboard";

export const Route = createFileRoute("/provider")({
  head: () => ({ meta: [{ title: "Provider dashboard — LeaseMate" }] }),
  component: ProviderDashboard,
});
