import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/mock/store";
import { selectProviderQueue } from "@/mock/selectors";
import { FeeBadge, InvitationBadge } from "@/components/shared/StateBadge";
import { SERVICE_LABELS } from "@/mock/types";
import { formatDateTime, relativeFromNow } from "@/mock/utils";

export const Route = createFileRoute("/ops/providers-queue")({
  head: () => ({ meta: [{ title: "Provider Queue — LeaseMate Ops" }] }),
  component: ProviderQueuePage,
});

function ProviderQueuePage() {
  const queue = useStore(selectProviderQueue);
  const now = useStore((s) => s.demo.virtualNow);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Provider Queue</h1>
        <p className="text-xs text-muted-foreground">
          Live invitation and response work for cart-item preferred/backup routing.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[color:var(--color-console-border)] bg-[color:var(--color-console-surface)]">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-console-muted)]/40 text-left text-xs uppercase text-[color:var(--color-console-muted-foreground)]">
            <tr>
              <th className="px-3 py-2">Invitation ID</th>
              <th className="px-3 py-2">Request ID</th>
              <th className="px-3 py-2">Cart Item ID</th>
              <th className="px-3 py-2">Service Product</th>
              <th className="px-3 py-2">Provider</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Preferred/Backup</th>
              <th className="px-3 py-2">Invitation State</th>
              <th className="px-3 py-2">Response Due</th>
              <th className="px-3 py-2">Response Age</th>
              <th className="px-3 py-2">Payment State</th>
              <th className="px-3 py-2">Next Action</th>
            </tr>
          </thead>
          <tbody>
            {queue.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-3 py-6 text-center text-muted-foreground">
                  No live provider invitation work.
                </td>
              </tr>
            ) : (
              queue.map(
                ({
                  invitation,
                  cartItem,
                  serviceProduct,
                  provider,
                  fee,
                  responseAgeMins,
                  nextAction,
                }) => (
                  <tr
                    key={invitation.id}
                    className="border-t border-[color:var(--color-console-border)]"
                  >
                    <td className="px-3 py-2 font-mono text-xs">{invitation.id}</td>
                    <td className="px-3 py-2 font-mono text-xs">
                      <Link
                        to="/ops/requests/$id"
                        params={{ id: invitation.requestId }}
                        className="hover:underline"
                      >
                        {invitation.requestId}
                      </Link>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {cartItem?.id ?? invitation.cartItemId ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      {serviceProduct?.title ?? invitation.serviceProductId ?? "—"}
                    </td>
                    <td className="px-3 py-2">{provider?.businessName ?? "—"}</td>
                    <td className="px-3 py-2 text-xs">{SERVICE_LABELS[invitation.category]}</td>
                    <td className="px-3 py-2 text-xs capitalize">{invitation.position ?? "—"}</td>
                    <td className="px-3 py-2">
                      <InvitationBadge state={invitation.state} />
                    </td>
                    <td className="px-3 py-2 text-xs">
                      {invitation.expiresAt ? formatDateTime(invitation.expiresAt) : "—"}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      {responseAgeMins === undefined ? "—" : `${Math.round(responseAgeMins / 60)}h`}{" "}
                      {invitation.sentAt ? `(${relativeFromNow(invitation.sentAt, now)})` : ""}
                    </td>
                    <td className="px-3 py-2">
                      {fee ? (
                        <FeeBadge status={fee.status} />
                      ) : (
                        <span className="text-xs text-muted-foreground">No fee</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{nextAction}</td>
                  </tr>
                ),
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
