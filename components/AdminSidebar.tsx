"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Building2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { logout } from "@/app/admin/login/actions";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex shrink-0 flex-col justify-between border-b bg-secondary/30 p-4 md:h-screen md:w-56 md:border-b-0 md:border-r md:p-6">
      <div>
        <div className="flex items-center gap-2 px-2 font-semibold">
          <Building2 className="size-5" />
          Panel
        </div>
        <nav className="mt-6 space-y-1">
          <Link
            href="/admin/projelerim"
            className={cn(
              "block rounded-md px-2 py-2 text-sm font-medium transition-colors",
              pathname.startsWith("/admin/projelerim")
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:bg-background/60"
            )}
          >
            Projelerim
          </Link>
        </nav>
      </div>

      <form action={logout}>
        <button
          type="submit"
          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-background/60"
        >
          <LogOut className="size-4" />
          Çıkış Yap
        </button>
      </form>
    </aside>
  );
}
