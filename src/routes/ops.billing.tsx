import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/mock/store";
import { selectBillingQueue, selectOverdueFees } from "@/mock/selectors";
import { FeeBadge, ReleaseBadge } from "@/components/shared/StateBadge";
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
        <h1 className="text-xl font-semibold">Billing Queue</h1>
        <p className="text-xs text-[color:var(--color-console-muted-foreground)]">
          {queue.length} cart-item unlocks outstanding · {overdue.length} overdue
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[color:var(--color-console-border)] bg-[color:var(--color-console-surface)]">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-console-muted)]/40 text-left text-xs uppercase text-[color:var(--color-console-muted-foreground)]">
            <tr>
              <th className="px-3 py-2">Fee ID</th>
              <th className="px-3 py-2">Request ID</th>
              <th className="px-3 py-2">Cart Item ID</th>
              <th className="px-3 py-2">Service Product</th>
              <th className="px-3 py-2">Provider</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Preferred/Backup</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Fee Status</th>
              <th className="px-3 py-2">Due</th>
              <th className="px-3 py-2">Customer Release State</th>
              <th className="px-3 py-2 text-right">Next Action</th>
            </tr>
          </thead>
          <tbody>
            {queue.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-3 py-6 text-center text-muted-foreground">
                  No outstanding introduction fees.
                </td>
              </tr>
            ) : (
              queue.map(({ fee, provider, cartItem, serviceProduct, release, nextAction }) => (
                <tr
                  key={fee.id}
                  className="border-t border-[color:var(--color-console-border)] hover:bg-[color:var(--color-console-muted)]/30"
                >
                  <td className="px-3 py-2 font-mono text-xs">{fee.id}</td>
                  <td className="px-3 py-2 font-mono text-xs">
                    <Link
                      to="/ops/requests/$id"
                      params={{ id: fee.requestId }}
                      className="hover:underline"
                    >
                      {fee.requestId}
                    </Link>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">
                    {cartItem?.id ?? fee.cartItemId ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {serviceProduct?.title ?? fee.serviceProductId ?? "—"}
                  </td>
                  <td className="px-3 py-2">{provider?.businessName ?? "—"}</td>
                  <td className="px-3 py-2 text-xs">{SERVICE_LABELS[fee.category]}</td>
                  <td className="px-3 py-2 text-xs capitalize">{fee.position ?? "—"}</td>
                  <td className="px-3 py-2 font-medium">{formatMoney(fee.amount)}</td>
                  <td className="px-3 py-2">
                    <FeeBadge status={fee.status} />
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {formatDateTime(fee.dueAt)}{" "}
                    <span className="text-[color:var(--color-console-muted-foreground)]">
                      ({relativeFromNow(fee.dueAt, now)})
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <ReleaseBadge
                      state={
                        release?.releaseState ??
                        (fee.status === "paid" ? "ready_to_release" : "payment_pending")
                      }
                    />
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => pay(fee.id)}
                      className="rounded-md border border-[color:var(--color-console-border)] px-2 py-1 text-xs hover:bg-[color:var(--color-console-muted)]/40"
                    >
                      {nextAction}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[color:var(--color-console-muted-foreground)]">
        Prototype note: this records a mock/demo operator confirmation only; no payment processor is
        integrated.
      </p>
    </div>
  );
}
