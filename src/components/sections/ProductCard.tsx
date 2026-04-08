import { Button } from "../Button";
import "./ProductCard.css";

type Props = {
  name: string;
  price: string;
};

export function ProductCard({ name, price }: Props) {
  return (
    <article className="product-card">
      <div className="product-card__visual" aria-hidden />
      <h3 className="product-card__name">{name}</h3>
      <p className="product-card__price">{price}</p>
      <Button type="button" className="product-card__btn">
        Add to Cart
      </Button>
    </article>
  );
}
