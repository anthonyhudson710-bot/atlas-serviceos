"use client";

import { Plus } from "@phosphor-icons/react";
import { quickAdd } from "@/lib/app";
import { HeaderMenu, MenuLeaf } from "@/components/app-shell/HeaderMenu";

/** Topbar "+" quick-create control: a plus icon that opens a create menu. */
export function QuickAddMenu() {
  return (
    <HeaderMenu
      label="Quick add"
      align="right"
      triggerClassName="grid size-10 place-items-center rounded-lg bg-action text-white transition-colors hover:bg-action-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      trigger={<Plus size={20} weight="bold" aria-hidden="true" />}
    >
      {(close) => (
        <>
          <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-muted-2">
            Create
          </p>
          {quickAdd.map((leaf) => (
            <MenuLeaf key={leaf.href} leaf={leaf} onNavigate={close} />
          ))}
        </>
      )}
    </HeaderMenu>
  );
}
