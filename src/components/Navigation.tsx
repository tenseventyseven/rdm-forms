"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname(); // Get the current pathname

  return (
    <nav className="flex space-x-4 p-4">
      <Link
        href="/"
        className={clsx("hover:underline", {
          underline: pathname === "/",
        })}
      >
        Home
      </Link>
      <Link
        href="/request"
        className={clsx("hover:underline", {
          underline: pathname === "/request",
        })}
      >
        Request
      </Link>
      <Link
        href="/review"
        className={clsx("hover:underline", {
          underline: pathname === "/review",
        })}
      >
        Review
      </Link>
    </nav>
  );
}
