import type { ReactNode } from "react";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";

export function PublicPage({ children }: { children: ReactNode }) {
  return (
    <div className="ambient-bg min-h-screen">
      <SiteNav />
      <main className="page-enter">{children}</main>
      <SiteFooter />
    </div>
  );
}
