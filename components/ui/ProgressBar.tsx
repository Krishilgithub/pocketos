"use client";

import { useEffect, useRef } from "react";
import { getProgress } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  target: number;
  color?: string;
  height?: number;
  animate?: boolean;
  showPercentage?: boolean;
}

export default function ProgressBar({
  current,
  target,
  color = "var(--green)",
  height = 5,
  animate = true,
  showPercentage = false,
}: ProgressBarProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  const percentage = getProgress(current, target);

  useEffect(() => {
    if (animate && fillRef.current) {
      fillRef.current.style.width = "0%";
      const timer = setTimeout(() => {
        if (fillRef.current) {
          fillRef.current.style.width = `${percentage}%`;
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [percentage, animate]);

  return (
    <div style={{ width: "100%" }}>
      <div className="progress-track" style={{ height }}>
        <div
          ref={fillRef}
          className="progress-fill"
          style={{
            width: animate ? "0%" : `${percentage}%`,
            backgroundColor: color,
          }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${percentage}% complete`}
        />
      </div>
      {showPercentage && (
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--text-secondary)",
            marginTop: 4,
            display: "block",
          }}
        >
          {percentage}%
        </span>
      )}
    </div>
  );
}
