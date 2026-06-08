import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/mock/store";
import { selectBillingQueue, selectOverdueFees } from "@/mock/selectors";
import { FeeBadge } from "@/components/shared/StateBadge";
import { SERVICE_LABELS } from "@/mock/types";
import { formatDateTime, formatMoney, relativeFromNow } from "@/mock/utils";

export const Route = createFileRoute("/ops/billing")({
  head: () => ({ meta: [{ title: "Billing — LeaseMate Ops" }] }),
  component: BillingPage,
});

function BillingPage() {
  const queue = useStore(selectBillingQueue);
  const overdue = useStore(selectOverdueFees);
  const now = useStore((s) => s.demo.virtualNow);
  const pay = useStore((s) => s.payIntroductionFee);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h1 className="text-xl font-semibold">Billing</h1>
        <p className="text-xs text-[color:var(--color-console-muted-foreground)]">
          {queue.length} outstanding · {overdue.length} overdue
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[color:var(--color-console-border)] bg-[color:var(--color-console-surface)]">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-console-muted)]/40 text-left text-xs uppercase text-[color:var(--color-console-muted-foreground)]">
            <tr>
              <th className="px-3 py-2">Request</th>
              <th className="px-3 py-2">Provider</th>
              <th className="px-3 py-2">Service</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Due</th>
              <th className="px-3 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {queue.length === 0 ? (
              <tr><td colSpan={7} className="px-3 py-6 text-center text-muted-foreground">No outstanding introduction fees.</td></tr>
            ) : queue.map(({ fee, request, provider }) => (
              <tr key={fee.id} className="border-t border-[color:var(--color-console-border)] hover:bg-[color:var(--color-console-muted)]/30">
                <td className="px-3 py-2 font-mono text-xs">
                  <Link to="/ops/requests/$id" params={{ id: fee.requestId }} className="hover:underline">{fee.requestId}</Link>
                </td>
                <td className="px-3 py-2">{provider?.businessName ?? "—"}</td>
                <td className="px-3 py-2 text-xs">{SERVICE_LABELS[fee.category]}</td>
                <td className="px-3 py-2 font-medium">{formatMoney(fee.amount)}</td>
                <td className="px-3 py-2"><FeeBadge status={fee.status} /></td>
                <td className="px-3 py-2 text-xs">
                  {formatDateTime(fee.dueAt)} <span className="text-[color:var(--color-console-muted-foreground)]">({relativeFromNow(fee.dueAt, now)})</span>
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => pay(fee.id)}
                    className="rounded-md border border-[color:var(--color-console-border)] px-2 py-1 text-xs hover:bg-[color:var(--color-console-muted)]/40"
                  >
                    Mark paid (mock)
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[color:var(--color-console-muted-foreground)]">
        Request context: <Link to="/ops/requests" className="underline">all requests →</Link>
      </p>
    </div>
  );
}