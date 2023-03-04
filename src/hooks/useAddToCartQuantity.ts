import { useCallback, useState } from 'react';

type UseAddToCartQuantityOpts = {
  upperBound?: number;
};

export const useAddToCartQuantity = (opts?: UseAddToCartQuantityOpts) => {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, opts?.upperBound || Infinity));
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  return { quantity, increaseQuantity, decreaseQuantity };
};
