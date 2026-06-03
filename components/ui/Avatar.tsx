"use client";

import { getInitials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  color?: string;
  size?: number;
  fontSize?: number;
  src?: string;
}

export default function Avatar({ name, color = "#4F6EF7", size = 40, fontSize = 14, src }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
      aria-label={name}
    >
      <span
        style={{
          color: "white",
          fontSize,
          fontWeight: 700,
          fontFamily: "'Inter', sans-serif",
          letterSpacing: "0.02em",
        }}
      >
        {getInitials(name)}
      </span>
    </div>
  );
}
