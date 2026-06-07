import { Link, useRouter } from "@tanstack/react-router";
import { Clock, RefreshCw, FastForward, User, Briefcase, Activity } from "lucide-react";
import { useStore } from "@/mock/store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateTime } from "@/mock/utils";
import { cn } from "@/lib/utils";
import type { DemoRole } from "@/mock/types";

/**
 * Demo Role Switcher — prototype tool only, NOT real authentication.
 * MIGRATION: delete this component. Replace with a real auth-gated layout.
 */
const ROLE_TARGETS: Record<DemoRole, string> = {
  customer: "/intake",
  provider: "/provider",
  operator: "/ops",
};

export function DemoBar() {
  const role = useStore((s) => s.demo.role);
  const virtualNow = useStore((s) => s.demo.virtualNow);
  const setRole = useStore((s) => s.setRole);
  const advanceTime = useStore((s) => s.advanceTime);
  const reset = useStore((s) => s.resetDemoData);
  const router = useRouter();

  const go = (r: DemoRole) => {
    setRole(r);
    router.navigate({ to: ROLE_TARGETS[r] });
  };

  return (
    <div className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-border bg-[color:var(--color-foreground)] px-4 py-2 text-[color:var(--color-background)]">
      <Link to="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
        <span className="rounded-md bg-primary px-2 py-0.5 text-primary-foreground">LM</span>
        LeaseMate
        <span className="ml-2 hidden rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide sm:inline">
          Prototype
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <span className="hidden text-xs text-white/60 lg:inline">Demo Role Switcher — not real auth</span>
        <div className="inline-flex overflow-hidden rounded-md border border-white/15">
          {(
            [
              { r: "customer", label: "Customer", Icon: User },
              { r: "provider", label: "Provider", Icon: Briefcase },
              { r: "operator", label: "Operator", Icon: Activity },
            ] as { r: DemoRole; label: string; Icon: typeof User }[]
          ).map(({ r, label, Icon }) => (
            <button
              key={r}
              onClick={() => go(r)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium transition-colors",
                role === r ? "bg-primary text-primary-foreground" : "bg-transparent text-white/80 hover:bg-white/10",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <div className="ml-1 hidden items-center gap-1.5 rounded-md border border-white/15 px-2 py-1 text-xs text-white/80 md:flex">
          <Clock className="h-3.5 w-3.5" />
          {formatDateTime(virtualNow)}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary" className="h-7 gap-1.5">
              <FastForward className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Advance time</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Virtual clock</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => advanceTime(5)}>+ 5 minutes</DropdownMenuItem>
            <DropdownMenuItem onClick={() => advanceTime(60)}>+ 1 hour</DropdownMenuItem>
            <DropdownMenuItem onClick={() => advanceTime(60 * 24)}>+ 24 hours</DropdownMenuItem>
            <DropdownMenuItem onClick={() => advanceTime(60 * 24 * 3)}>+ 3 days</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => useStore.getState().runDue()}>Run due automations now</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={reset} className="text-destructive focus:text-destructive">
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              Reset demo data
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
