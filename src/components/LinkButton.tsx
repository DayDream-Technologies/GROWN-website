import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import "./Button.css";

type Props = {
  to: string;
  variant?: "primary" | "ghost" | "rose" | "maroon";
  children: ReactNode;
  className?: string;
};

export function LinkButton({
  to,
  variant = "primary",
  children,
  className = "",
}: Props) {
  const cls = `grown-btn grown-btn--${variant} ${className}`.trim();
  return (
    <Link to={to} className={cls}>
      {children}
    </Link>
  );
}
