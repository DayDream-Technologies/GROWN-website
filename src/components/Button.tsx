import type { ButtonHTMLAttributes } from "react";
import "./Button.css";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "rose";
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...rest
}: Props) {
  const cls = `grown-btn grown-btn--${variant} ${className}`.trim();
  return <button type={type} className={cls} {...rest} />;
}
