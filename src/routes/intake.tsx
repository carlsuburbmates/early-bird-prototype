import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MarketingShell } from "@/components/shared/MarketingShell";
import { useStore } from "@/mock/store";
import {
  SERVICE_BLURBS, SERVICE_LABELS,
  type ServiceCategory, type PropertySize, type Urgency, type BudgetSensitivity, type RecommendationMode,
  type MoveRequest, type Customer,
} from "@/mock/types";
import { formatRange, newId, sumRanges } from "@/mock/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Check, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/intake")({
  head: () => ({
    meta: [
      { title: "Start your move — LeaseMate" },
      { name: "description", content: "Tell us about your move and we'll line up the right providers." },
    ],
  }),
  component: Intake,
});

const STEPS = ["Move details", "Services", "Providers", "Contact", "Review"] as const;
type Step = typeof STEPS[number];

const SERVICE_OPTIONS: ServiceCategory[] = [
  "removalist", "eol_cleaning", "carpet_cleaning", "rubbish_removal", "storage", "handyman", "utilities",
];

function Intake() {
  const navigate = useNavigate();
  const providers = useStore((s) => s.providers);
  const submitRequest = useStore((s) => s.submitRequest);

  const [stepIdx, setStepIdx] = useState(0);
  const step = STEPS[stepIdx];

  // Form state
  const [moveDate, setMoveDate] = useState("2026-06-21");
  const [fromAddress, setFromAddress] = useState("12 High St, Northcote VIC");
  const [toAddress, setToAddress] = useState("44 Sydney Rd, Brunswick VIC");
  const [propertySize, setPropertySize] = useState<PropertySize>("2br");
  const [urgency, setUrgency] = useState<Urgency>("standard");
  const [budget, setBudget] = useState<BudgetSensitivity>("medium");
  const [services, setServices] = useState<ServiceCategory[]>(["removalist", "eol_cleaning"]);
  const [mode, setMode] = useState<RecommendationMode>("recommend");
  const [picks, setPicks] = useState<Partial<Record<ServiceCategory, string>>>({});
  const [name, setName] = useState("Alex Renter");
  const [email, setEmail] = useState("alex@example.com");
  const [phone, setPhone] = useState("+61 400 000 000");
  const [notes, setNotes] = useState("");

  // Auto recommend the first eligible provider per service when in recommend mode
  const eligible = useMemo(() => {
    const map: Record<string, typeof providers> = {};
    services.forEach((s) => {
      map[s] = providers.filter(
        (p) => p.categories.includes(s) && p.serviceAreas.some((a) => fromAddress.includes(a)) && p.status === "active",
      );
    });
    return map;
  }, [services, providers, fromAddress]);

  const effectivePicks: Partial<Record<ServiceCategory, string>> = useMemo(() => {
    const out: Partial<Record<ServiceCategory, string>> = {};
    services.forEach((s) => {
      if (mode === "recommend") {
        out[s] = eligible[s]?.[0]?.id;
      } else {
        out[s] = picks[s] ?? eligible[s]?.[0]?.id;
      }
    });
    return out;
  }, [services, eligible, picks, mode]);

  const estimate = useMemo(() => {
    const ranges = services
      .map((s) => {
        const pid = effectivePicks[s];
        const p = providers.find((pp) => pp.id === pid);
        return p?.pricingRanges[s];
      })
      .filter(Boolean) as { min: number; max: number }[];
    return sumRanges(ranges);
  }, [services, effectivePicks, providers]);

  const toggleService = (s: ServiceCategory) =>
    setServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const canNext =
    (step === "Move details" && fromAddress && moveDate) ||
    (step === "Services" && services.length > 0) ||
    step === "Providers" ||
    (step === "Contact" && name && email && phone) ||
    step === "Review";

  const onSubmit = () => {
    const customerId = newId("cust");
    const customer: Customer = {
      id: customerId, name, email, phone, fromAddress, toAddress,
      moveDate: new Date(moveDate).toISOString(),
      propertySize, urgency, budgetSensitivity: budget, recommendationMode: mode, notes,
      createdAt: new Date().toISOString(),
    };
    // Push customer into store directly
    useStore.setState((s) => ({ ...s, customers: [...s.customers, customer], demo: { ...s.demo, activeCustomerId: customerId } }));
    const req: MoveRequest = {
      id: newId("req"),
      customerId,
      services,
      selectedProviderIds: effectivePicks,
      packageEstimate: estimate,
      priority: urgency === "urgent" ? "high" : "normal",
      state: "submitted",
      nextAction: "Send first provider invitation",
      createdAt: new Date().toISOString(),
    };
    submitRequest(req);
    navigate({ to: "/submitted/$id", params: { id: req.id } });
  };

  return (
    <MarketingShell>
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Stepper current={stepIdx} steps={STEPS as unknown as string[]} />

        <div className="mt-6 rounded-2xl border border-border/60 bg-card p-5 sm:p-7">
          {step === "Move details" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your move</h2>
              <Field label="From address"><Input value={fromAddress} onChange={(e) => setFromAddress(e.target.value)} /></Field>
              <Field label="To address (optional)"><Input value={toAddress} onChange={(e) => setToAddress(e.target.value)} /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Move date"><Input type="date" value={moveDate} onChange={(e) => setMoveDate(e.target.value)} /></Field>
                <Field label="Property size">
                  <Pills value={propertySize} onChange={setPropertySize} options={[
                    { v: "studio", l: "Studio" }, { v: "1br", l: "1 bed" }, { v: "2br", l: "2 bed" }, { v: "3br", l: "3 bed" }, { v: "4br+", l: "4+ bed" },
                  ]} />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Urgency">
                  <Pills value={urgency} onChange={setUrgency} options={[
                    { v: "flexible", l: "Flexible" }, { v: "standard", l: "Standard" }, { v: "urgent", l: "Urgent" },
                  ]} />
                </Field>
                <Field label="Budget sensitivity">
                  <Pills value={budget} onChange={setBudget} options={[
                    { v: "low", l: "Premium" }, { v: "medium", l: "Balanced" }, { v: "high", l: "Cheapest" },
                  ]} />
                </Field>
              </div>
            </div>
          )}

          {step === "Services" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">What do you need?</h2>
              <p className="text-sm text-muted-foreground">Pick everything that applies. You can change this later.</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {SERVICE_OPTIONS.map((s) => {
                  const sel = services.includes(s);
                  return (
                    <button key={s} type="button" onClick={() => toggleService(s)}
                      className={cn("rounded-xl border p-4 text-left transition-colors",
                        sel ? "border-primary bg-primary/5" : "border-border/60 bg-background hover:bg-accent")}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{SERVICE_LABELS[s]}</span>
                        {sel && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{SERVICE_BLURBS[s]}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === "Providers" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Pick providers</h2>
              <div className="flex gap-2">
                <ChoiceBtn active={mode === "recommend"} onClick={() => setMode("recommend")}>Recommend the best match</ChoiceBtn>
                <ChoiceBtn active={mode === "manual"} onClick={() => setMode("manual")}>Let me choose</ChoiceBtn>
              </div>
              <div className="space-y-3">
                {services.map((s) => {
                  const list = eligible[s] ?? [];
                  if (list.length === 0) {
                    return (
                      <div key={s} className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                        No eligible providers in your suburb for {SERVICE_LABELS[s]}. We'll keep trying.
                      </div>
                    );
                  }
                  return (
                    <div key={s} className="rounded-xl border border-border/60 bg-background p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="font-medium">{SERVICE_LABELS[s]}</div>
                      </div>
                      <div className="grid gap-2">
                        {list.slice(0, 3).map((p) => {
                          const picked = effectivePicks[s] === p.id;
                          return (
                            <button key={p.id} type="button"
                              disabled={mode === "recommend"}
                              onClick={() => setPicks((prev) => ({ ...prev, [s]: p.id }))}
                              className={cn("flex items-center justify-between rounded-lg border p-3 text-left text-sm",
                                picked ? "border-primary bg-primary/5" : "border-border/60 hover:bg-accent",
                                mode === "recommend" && "opacity-90")}>
                              <div>
                                <div className="font-medium">{p.businessName}</div>
                                <div className="text-xs text-muted-foreground">★ {p.rating.toFixed(1)} · {p.serviceAreas.slice(0, 3).join(", ")}</div>
                              </div>
                              <div className="text-xs text-muted-foreground">{p.pricingRanges[s] && formatRange(p.pricingRanges[s]!)}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="rounded-xl bg-accent/40 p-4 text-sm">
                <div className="font-medium">Package estimate</div>
                <div className="text-lg font-semibold">{formatRange(estimate)}</div>
                <div className="text-xs text-muted-foreground">Indicative range across selected providers.</div>
              </div>
            </div>
          )}

          {step === "Contact" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">How can providers reach you?</h2>
              <p className="text-sm text-muted-foreground">Only released to the provider that accepts your job.</p>
              <Field label="Full name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
                <Field label="Phone"><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
              </div>
              <Field label="Notes (optional)"><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Access info, parking, lift booking..." /></Field>
            </div>
          )}

          {step === "Review" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Review and submit</h2>
              <Review label="Move" value={`${fromAddress} → ${toAddress || "—"} · ${moveDate}`} />
              <Review label="Property" value={`${propertySize} · ${urgency} · ${budget} budget`} />
              <Review label="Services" value={services.map((s) => SERVICE_LABELS[s]).join(", ")} />
              <Review label="Estimate" value={formatRange(estimate)} />
              <Review label="Contact" value={`${name} · ${email} · ${phone}`} />
              {notes && <Review label="Notes" value={notes} />}
            </div>
          )}

          <div className="mt-7 flex items-center justify-between border-t border-border/60 pt-5">
            <Button variant="ghost" disabled={stepIdx === 0} onClick={() => setStepIdx((i) => Math.max(0, i - 1))}>Back</Button>
            {stepIdx < STEPS.length - 1 ? (
              <Button disabled={!canNext} onClick={() => setStepIdx((i) => i + 1)}>
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={onSubmit}>Submit request</Button>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          By submitting, you understand this is a prototype.{" "}
          <Link to="/" className="underline">Cancel</Link>
        </p>
      </section>
    </MarketingShell>
  );
}

function Stepper({ current, steps }: { current: number; steps: string[] }) {
  return (
    <ol className="flex flex-wrap items-center gap-2 text-xs">
      {steps.map((s, i) => (
        <li key={s} className={cn(
          "flex items-center gap-2 rounded-full border px-3 py-1",
          i < current && "border-primary/40 bg-primary/10 text-primary",
          i === current && "border-primary bg-primary text-primary-foreground",
          i > current && "border-border text-muted-foreground",
        )}>
          <span className="font-semibold">{i + 1}</span>
          <span>{s}</span>
        </li>
      ))}
    </ol>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  );
}

function Pills<T extends string>({
  value, onChange, options,
}: { value: T; onChange: (v: T) => void; options: { v: T; l: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o.v} type="button" onClick={() => onChange(o.v)}
          className={cn("rounded-full border px-3 py-1.5 text-xs",
            value === o.v ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent")}>
          {o.l}
        </button>
      ))}
    </div>
  );
}

function ChoiceBtn({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("rounded-full border px-3 py-1.5 text-xs",
      active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent")}>
      {children}
    </button>
  );
}

function Review({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 rounded-lg border border-border/60 bg-background p-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}