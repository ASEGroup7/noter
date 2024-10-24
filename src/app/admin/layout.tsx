"use client"

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Users",
    href: "/admin/users",
  },
  {
    title: "Notes",
    href: "/admin/notes",
  },
  {
    title: "Tags",
    href: "/admin/tags",
  },
]

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <section className="grid grid-cols-[300px_1fr] flex-1">
      <div className="p-4 border-r">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <nav className="flex flex-col gap-x-0 gap-y-1 mt-4">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === item.href
                  ? "bg-muted hover:bg-muted"
                  : "hover:bg-transparent hover:underline",
                  "justify-start"
              )}>
                {item.title}
              </Link>
          ))}
        </nav>
      </div>
      {children}
    </section>
  );
}
