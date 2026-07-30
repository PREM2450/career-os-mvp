import { HTMLAttributes, ReactNode } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function GlassCard({ children, className = "", ...rest }: GlassCardProps) {
  return (
    <div className={`glass-card p-6 ${className}`} {...rest}>
      {children}
    </div>
  );
}
