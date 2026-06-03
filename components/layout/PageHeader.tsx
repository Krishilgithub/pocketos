"use client";

import Link from "next/link";
import { ChevronLeft, MoreHorizontal } from "lucide-react";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  backHref?: string;
  rightAction?: React.ReactNode;
  showMore?: boolean;
  onMoreClick?: () => void;
  transparent?: boolean;
}

export default function PageHeader({
  title,
  showBack = false,
  backHref = "/dashboard",
  rightAction,
  showMore = false,
  onMoreClick,
  transparent = false,
}: PageHeaderProps) {
  return (
    <header
      className="page-header"
      style={{
        background: transparent ? "transparent" : "var(--bg-app)",
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 16px)",
      }}
    >
      {showBack ? (
        <Link href={backHref} className="header-icon-btn" aria-label="Go back">
          <ChevronLeft size={20} strokeWidth={2} color="var(--text-primary)" />
        </Link>
      ) : (
        <div style={{ width: 40 }} />
      )}

      <h1 className="page-header-title">{title}</h1>

      {rightAction ? (
        rightAction
      ) : showMore ? (
        <button
          className="header-icon-btn"
          onClick={onMoreClick}
          aria-label="More options"
        >
          <MoreHorizontal size={20} color="var(--text-primary)" />
        </button>
      ) : (
        <div style={{ width: 40 }} />
      )}
    </header>
  );
}
