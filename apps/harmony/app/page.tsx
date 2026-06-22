import type { Metadata } from "next";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { SystemStatus } from "@/components/dashboard/SystemStatus";

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

      {/* Dashboard widgets. System status is live; more land here over time. */}
      <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
        <SystemStatus />
      </div>
    </div>
  );
}
