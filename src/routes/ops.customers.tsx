import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/mock/store";
import { selectCustomerList } from "@/mock/selectors";
import { StateBadge } from "@/components/shared/StateBadge";
import { formatDate, relativeFromNow } from "@/mock/utils";

export const Route = createFileRoute("/ops/customers")({
  head: () => ({ meta: [{ title: "Customers — LeaseMate Ops" }] }),
  component: CustomersPage,
});

function CustomersPage() {
  const rows = useStore(selectCustomerList);
  const requests = useStore((s) => s.requests);
  const now = useStore((s) => s.demo.virtualNow);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-2">
        <h1 className="text-xl font-semibold">Customers</h1>
        <p className="text-xs text-[color:var(--color-console-muted-foreground)]">{rows.length} total</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[color:var(--color-console-border)] bg-[color:var(--color-console-surface)]">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-console-muted)]/40 text-left text-xs uppercase text-[color:var(--color-console-muted-foreground)]">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Contact</th>
              <th className="px-3 py-2">Suburb</th>
              <th className="px-3 py-2">Move date</th>
              <th className="px-3 py-2">Requests</th>
              <th className="px-3 py-2">Latest</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ customer, requestCount, latestState, latestRequestAt }) => {
              const latest = requests.find(
                (r) => r.customerId === customer.id && r.createdAt === latestRequestAt,
              );
              return (
                <tr key={customer.id} className="border-t border-[color:var(--color-console-border)] hover:bg-[color:var(--color-console-muted)]/30">
                  <td className="px-3 py-2 font-medium">{customer.name}</td>
                  <td className="px-3 py-2 text-xs">
                    <div>{customer.email}</div>
                    <div className="text-[color:var(--color-console-muted-foreground)]">{customer.phone}</div>
                  </td>
                  <td className="px-3 py-2 text-xs">{customer.fromAddress.split(",")[1]?.trim() ?? "—"}</td>
                  <td className="px-3 py-2 text-xs">{formatDate(customer.moveDate)}</td>
                  <td className="px-3 py-2">{requestCount}</td>
                  <td className="px-3 py-2">
                    {latestState ? (
                      <div className="flex items-center gap-2">
                        <StateBadge state={latestState} />
                        {latest && (
                          <Link to="/ops/requests/$id" params={{ id: latest.id }} className="font-mono text-[10px] hover:underline">
                            {latest.id}
                          </Link>
                        )}
                        {latestRequestAt && (
                          <span className="text-[10px] text-[color:var(--color-console-muted-foreground)]">
                            {relativeFromNow(latestRequestAt, now)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
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