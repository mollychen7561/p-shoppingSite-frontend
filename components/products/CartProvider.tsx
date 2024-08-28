import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo
} from "react";
import { useUser } from "@/components/profile/UserContext";
import { userApi } from "@/app/lib/api/userApi";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  refreshCart: () => Promise<void>;
  loadCart: () => Promise<void>;
  totalItems: number;
  cartLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loadingCart, setLoadingCart] = useState(false);
  const [cartLoaded, setCartLoaded] = useState(false);
  const { user, token } = useUser();

  const updateServerCart = useCallback(
    async (cart: CartItem[]) => {
      if (user && token) {
        try {
          await userApi.updateCart(token, cart);
        } catch (error) {
          console.error("Error updating server cart:", error);
        }
      }
    },
    [user, token]
  );

  const loadCart = useCallback(async () => {
    if (loadingCart || cartLoaded) return;
    setLoadingCart(true);

    try {
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

      if (user && token) {
        const serverCart = await userApi.getCart(token);

        if (serverCart && serverCart.length > 0) {
          setCartItems(serverCart);
          localStorage.setItem("cart", JSON.stringify(serverCart));
        } else if (localCart.length > 0) {
          setCartItems(localCart);
          await updateServerCart(localCart);
        } else {
          setCartItems([]);
        }
      } else {
        setCartItems(localCart);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(localCart);
    } finally {
      setLoadingCart(false);
      setCartLoaded(true);
    }
  }, [user, token, updateServerCart, loadingCart, cartLoaded]);

  useEffect(() => {
    if (!cartLoaded) {
      loadCart();
    }
  }, [loadCart, cartLoaded]);

  const handleLogout = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem("cart");
    setTotalItems(0);
    setCartLoaded(false);
  }, []);

  useEffect(() => {
    window.addEventListener("logout", handleLogout);
    return () => {
      window.removeEventListener("logout", handleLogout);
    };
  }, [handleLogout]);

  useEffect(() => {
    const newTotal = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    setTotalItems(newTotal);
    window.dispatchEvent(new Event("cartUpdate"));
  }, [cartItems]);

  const addToCart = useCallback(
    async (newItem: CartItem) => {
      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (item) => item.productId === newItem.productId
        );

        let updatedCartItems: CartItem[];
        if (existingItemIndex !== -1) {
          updatedCartItems = prevItems.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          );
        } else {
          updatedCartItems = [...prevItems, newItem];
        }

        localStorage.setItem("cart", JSON.stringify(updatedCartItems));

        return updatedCartItems;
      });

      try {
        if (user && token) {
          await updateServerCart(cartItems);
        }
      } catch (error) {
        console.error("Error updating server cart:", error);
      }
    },
    [user, token, updateServerCart, cartItems]
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      setCartItems((prevItems) => {
        const updatedCart = prevItems.filter(
          (item) => item.productId !== productId
        );
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      });

      if (user && token) {
        await updateServerCart(cartItems);
      }
    },
    [user, token, updateServerCart, cartItems]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      setCartItems((prevItems) => {
        const updatedCart = prevItems
          .map((item) =>
            item.productId === productId
              ? { ...item, quantity: Math.max(0, quantity) }
              : item
          )
          .filter((item) => item.quantity > 0);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      });

      if (user && token) {
        await updateServerCart(cartItems);
      }
    },
    [user, token, updateServerCart, cartItems]
  );

  const clearCart = useCallback(async () => {
    setCartItems([]);
    setTotalItems(0);
    localStorage.removeItem("cart");
    if (user && token) {
      await updateServerCart([]);
    }
  }, [user, token, updateServerCart]);

  const getTotalItems = useCallback(() => totalItems, [totalItems]);

  const refreshCart = useCallback(async () => {
    await loadCart();
  }, [loadCart]);

  const contextValue = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems: () => totalItems,
      refreshCart,
      loadCart,
      totalItems,
      cartLoaded
    }),
    [
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      refreshCart,
      loadCart,
      totalItems,
      cartLoaded
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
