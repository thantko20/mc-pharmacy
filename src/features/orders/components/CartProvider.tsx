import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { TMedicine } from '@/features/medicines/types';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { useCreateOrder } from '../api/createOrder';

type TCartMedicine = TMedicine & { quantity: number };

type TCartContext = {
  items: TCartMedicine[];
  addToCart: (item: TCartMedicine) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  totalItems: () => number;
  clearCart: () => void;
};

const CartContext = createContext<TCartContext>({
  items: [],
  addToCart: (item) => {},
  removeFromCart: (id) => {},
  increaseQuantity: (id: string) => {},
  decreaseQuantity: (id: string) => {},
  totalItems: () => 0,
  clearCart: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<TCartMedicine[]>([]);

  const { user } = useAuth();
  const mutation = useCreateOrder();

  useEffect(() => {
    if (!user) {
      setItems([]);
    }
  }, [user]);

  const addToCart = (item: TCartMedicine) => {
    if (!user) return;

    if (items.some((i) => i._id === item._id)) {
      setItems((prevItems) => {
        const tempItems = [...prevItems];

        const tempIdx = tempItems.findIndex((value) => value._id === item._id);

        if (tempIdx >= 0) {
          const isOverStocks =
            item.stocks < tempItems[tempIdx].quantity + item.quantity;
          tempItems[tempIdx].quantity += isOverStocks ? 0 : item.quantity;

          return tempItems;
        }

        return tempItems;
      });
    } else {
      setItems((prevItems) => [...prevItems, item]);
    }
  };

  const removeFromCart = (id: string) => {
    if (!user) return;
    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  const increaseQuantity = (id: string) => {
    if (!user) return;

    setItems((prevItems) => {
      const tempItems = [...prevItems];
      const idx = tempItems.findIndex(
        (value) => value._id === id && value.stocks > value.quantity + 1,
      );

      if (idx >= 0) {
        tempItems[idx].quantity += 1;
        return tempItems;
      }

      return tempItems;
    });
  };

  const decreaseQuantity = (id: string) => {
    if (!user) return;

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

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        items,
        totalItems,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
