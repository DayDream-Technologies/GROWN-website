import "./PlaceholderImage.css";

type Props = {
  label: string;
  tone?: "blush" | "warm" | "white";
};

export function PlaceholderImage({ label, tone = "blush" }: Props) {
  return (
    <div
      className={`placeholder-image placeholder-image--${tone}`}
      role="img"
      aria-label={label}
    >
      <span className="placeholder-image__label">{label}</span>
    </div>
  );
}
