"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

interface FABProps {
  href?: string;
  onClick?: () => void;
}

export default function FAB({ href = "/add", onClick }: FABProps) {
  if (onClick) {
    return (
      <button
        className="fab"
        onClick={onClick}
        aria-label="Add new transaction"
        id="fab-add-transaction"
      >
        <Plus size={26} color="white" strokeWidth={2.5} />
      </button>
    );
  }

  return (
    <Link
      href={href}
      className="fab"
      aria-label="Add new transaction"
      id="fab-add-transaction"
    >
      <Plus size={26} color="white" strokeWidth={2.5} />
    </Link>
  );
}
