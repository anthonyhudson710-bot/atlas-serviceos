"use client";

import { CaretDown } from "@phosphor-icons/react";
import { account } from "@/lib/app";
import { HeaderMenu, MenuLeaf } from "@/components/app-shell/HeaderMenu";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.atlasfsm.com";
const IAM_URL = process.env.NEXT_PUBLIC_IAM_URL ?? "https://iam.atlasfsm.com";

async function signOut() {
  try {
    // Clears the shared .atlasfsm.com session cookie at the API.
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Redirect regardless — the proxy will re-gate if the cookie survives.
  }
  window.location.href = `${IAM_URL}/login`;
}

/**
 * Header account control: avatar + name/org trigger → account links and a
 * working sign out. Sits at the right of the global header.
 */
export function ProfileMenu() {
  return (
    <HeaderMenu
      label="Account menu"
      align="right"
      triggerClassName="ac-btn b-ghost h-10 gap-2 pl-1.5 pr-2"
      trigger={
        <>
          <span className="ac-av size-7 bg-[var(--navy-600)] text-[11px]">
            {account.user.initials}
          </span>
          <span className="hidden text-left leading-tight md:block">
            <span className="block text-[12px] font-semibold text-[var(--color-text-primary)]">
              {account.user.name}
            </span>
            <span className="block text-[10.5px] text-[var(--color-text-tertiary)]">
              {account.user.org}
            </span>
          </span>
          <CaretDown size={13} aria-hidden="true" className="text-[var(--color-text-tertiary)]" />
        </>
      }
    >
      {(close) => (
        <>
          <div className="px-3 py-2">
            <p className="text-sm font-bold text-foreground">{account.user.name}</p>
            <p className="truncate text-xs text-muted">{account.user.org}</p>
          </div>
          <div className="my-1 h-px bg-border" />
          {account.items
            .filter((item) => item.href !== "/logout")
            .map((leaf) => (
              <MenuLeaf key={leaf.href} leaf={leaf} onNavigate={close} />
            ))}
          <div className="my-1 h-px bg-border" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              close();
              void signOut();
            }}
            className="block w-full px-3 py-2 text-left text-sm font-semibold text-foreground hover:bg-surface-2"
          >
            Sign out
          </button>
        </>
      )}
    </HeaderMenu>
  );
}
