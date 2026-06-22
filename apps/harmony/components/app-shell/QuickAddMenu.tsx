"use client";

import { Plus, CaretDown } from "@phosphor-icons/react";
import { quickAdd } from "@/lib/app";
import { HeaderMenu, MenuLeaf } from "@/components/app-shell/HeaderMenu";

/** Header "Create" quick-create control: opens a menu of create actions. */
export function QuickAddMenu() {
  return (
    <HeaderMenu
      label="Create"
      align="left"
      triggerClassName="ac-btn h-9 gap-[7px] border border-[var(--blue-200)] bg-[var(--color-bg-brand-subtle)] text-[var(--color-text-link)]"
      trigger={
        <>
          <Plus size={16} weight="bold" aria-hidden="true" className="text-[var(--color-action-primary)]" />
          <span className="hidden text-[12.5px] sm:inline">Create</span>
          <CaretDown
            size={11}
            aria-hidden="true"
            className="text-[var(--color-action-primary)] opacity-70"
          />
        </>
      }
    >
      {(close) => (
        <>
          <p className="ac-ovl px-3 pb-1 pt-2">Create new</p>
          {quickAdd.map((leaf) => (
            <MenuLeaf key={leaf.href} leaf={leaf} onNavigate={close} />
          ))}
        </>
      )}
    </HeaderMenu>
  );
}
