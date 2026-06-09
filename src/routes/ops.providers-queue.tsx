import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/ops/providers-queue")({
  component: ProvidersQueuePage,
});

function ProvidersQueuePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Providers queue</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Demo-only queue route retained for migration sanity checks. The current provider roster
          and invite status live in the Providers view.
        </p>
      </div>
      <Link
        to="/ops/providers"
        className="inline-flex rounded-md border border-[color:var(--color-console-border)] px-3 py-2 text-sm hover:bg-[color:var(--color-console-muted)]/40"
      >
        Open providers view
      </Link>
    </div>
  );
}
