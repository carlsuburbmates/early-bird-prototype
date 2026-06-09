import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/mock/store";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/mock/utils";

export const Route = createFileRoute("/ops/automations")({
  component: AutomationsPage,
});

const AUTOMATION_LABELS: Record<string, string> = {
  invite_next_provider: "invite preferred or backup provider",
  invite_preferred_provider: "invite preferred provider",
  send_invite_reminder: "send provider reminder",
  expire_invitation: "expire invitation",
  invite_backup_provider: "invite backup provider",
  send_fee_reminder: "mark payment overdue",
  mark_payment_overdue: "mark payment overdue",
  escalate_no_provider: "escalate cart item",
  escalate_cart_item: "escalate cart item",
  customer_update_required: "customer update required",
  expire_fee: "expire fee",
};

function AutomationsPage() {
  const automations = useStore((s) => s.automations);
  const serviceProducts = useStore((s) => s.serviceProducts);
  const runJob = useStore((s) => s.runJobNow);
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Automation jobs</h1>
      <div className="overflow-x-auto rounded-xl border border-[color:var(--color-console-border)] bg-[color:var(--color-console-surface)]">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-console-muted)]/40 text-left text-xs uppercase text-[color:var(--color-console-muted-foreground)]">
            <tr>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Request</th>
              <th className="px-3 py-2">Cart item</th>
              <th className="px-3 py-2">Service product</th>
              <th className="px-3 py-2">Scheduled</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Last result</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {automations
              .slice()
              .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))
              .map((a) => {
                const product = serviceProducts.find((p) => p.id === a.serviceProductId);
                return (
                  <tr key={a.id} className="border-t border-[color:var(--color-console-border)]">
                    <td className="px-3 py-2">
                      {AUTOMATION_LABELS[a.type] ?? a.type.replace(/_/g, " ")}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">
                      <Link
                        to="/ops/requests/$id"
                        params={{ id: a.requestId }}
                        className="hover:underline"
                      >
                        {a.requestId}
                      </Link>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">{a.cartItemId ?? "—"}</td>
                    <td className="px-3 py-2 text-xs">
                      {product?.title ?? a.serviceProductId ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-xs">{formatDateTime(a.scheduledFor)}</td>
                    <td className="px-3 py-2 text-xs capitalize">
                      {a.status === "done" ? "completed" : a.status}
                    </td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">
                      {a.lastResult ?? "—"}
                    </td>
                    <td className="px-3 py-2">
                      {a.status === "scheduled" && (
                        <Button size="sm" variant="outline" onClick={() => runJob(a.id)}>
                          Run now
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
