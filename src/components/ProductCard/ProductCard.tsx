import React, { FC } from "react";
import { Props } from "./types";

export const ProductCard: FC<Props> = (props) => {
  const { product, onPurchase } = props;
  const { name, price, id } = product;

  return (
    <article style={{ border: "1px solid #000", padding: 16 }}>
      <h2>{name}</h2>
      <button onClick={() => onPurchase(product)}>Buy ({price})</button>
    </article>
  );
};
