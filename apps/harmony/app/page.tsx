import type { Metadata } from "next";
import { ChartLineUp, Plus } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <PageHeader
        title="Dashboard"
        description="Your operations at a glance."
        actions={
          <Button size="sm">
            <Plus size={16} weight="bold" aria-hidden="true" />
            New job
          </Button>
        }
      />

      {/* Blank state — widgets land here as the console is built out. */}
      <Card className="mt-8 grid place-items-center px-6 py-20 text-center">
        <span
          aria-hidden="true"
          className="grid size-14 place-items-center rounded-full bg-surface-2 text-brand"
        >
          <ChartLineUp size={26} />
        </span>
        <h2 className="mt-5 text-lg font-bold text-foreground">Nothing to show yet</h2>
        <p className="mt-1 max-w-sm text-sm text-muted">
          Once jobs, schedules, and invoices start flowing, your at-a-glance
          metrics and activity will appear here.
        </p>
      </Card>
    </div>
  );
}
