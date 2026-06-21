"use client";

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
 * Header profile control for mobile/tablet (the desktop rail already pins an
 * account avatar). Avatar trigger → account links + a working sign out.
 */
export function ProfileMenu() {
  return (
    <HeaderMenu
      label="Account"
      align="right"
      triggerClassName="grid size-10 place-items-center rounded-full ring-1 ring-border transition hover:ring-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      trigger={
        <span className="grid size-8 place-items-center rounded-full bg-spectrum text-xs font-bold text-white">
          {account.user.initials}
        </span>
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
