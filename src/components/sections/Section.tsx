import type { ReactNode } from "react";
import "./Section.css";

type Bg = "white" | "blush" | "warm";

type Props = {
  bg?: Bg;
  children: ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div";
};

export function Section({
  bg = "white",
  children,
  className = "",
  id,
  as: Tag = "section",
}: Props) {
  return (
    <Tag
      id={id}
      className={`grown-section grown-section--${bg} ${className}`.trim()}
    >
      <div className="grown-section__inner">{children}</div>
    </Tag>
  );
}
