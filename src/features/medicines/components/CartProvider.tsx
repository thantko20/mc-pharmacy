import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import { TMedicine } from '../types';

type TCartMedicine = TMedicine & { quantity: number };

type TCartContext = {
  items: TCartMedicine[];
  addToCart: (item: TCartMedicine) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  totalItems: () => number;
};

const CartContext = createContext<TCartContext>({
  items: [],
  addToCart: (item) => {},
  removeFromCart: (id) => {},
  increaseQuantity: (id: string) => {},
  decreaseQuantity: (id: string) => {},
  totalItems: () => 0,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<TCartMedicine[]>([]);

  const addToCart = (item: TCartMedicine) => {
    if (items.some((i) => i._id === item._id)) {
      setItems((prevItems) => {
        const tempItems = [...prevItems];

        const tempIdx = tempItems.findIndex((value) => value._id === item._id);

        if (tempIdx >= 0) {
          tempItems[tempIdx].quantity += item.quantity;

          return tempItems;
        }

        return tempItems;
      });
    } else {
      setItems((prevItems) => [...prevItems, item]);
    }
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  const increaseQuantity = (id: string) => {
    setItems((prevItems) => {
      const tempItems = [...prevItems];
      const idx = tempItems.findIndex(
        (value) => value._id === id && value.stock > value.quantity + 1,
      );

      if (idx >= 0) {
        tempItems[idx].quantity += 1;
        return tempItems;
      }

      return tempItems;
    });
  };

  const decreaseQuantity = (id: string) => {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.quantity > 0) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
    });
  };

  const totalItems = useCallback(() => {
    return items.reduce((prev, curr) => prev + curr.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        items,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
