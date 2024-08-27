import React, { useCallback, useMemo, useState, useEffect } from "react";
import {
  Drawer,
  Button,
  Typography,
  IconButton
} from "@material-tailwind/react";
import { useCart } from "@/components/products/CartProvider";
import { useUser } from "@/components/profile/UserContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/profile/LoginForm";
import { XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const CartDrawer = React.memo(({ open, onClose }: CartDrawerProps) => {
  const { cartItems, removeFromCart, updateQuantity, refreshCart } = useCart();
  const { user } = useUser();
  const router = useRouter();
  const [showLoginForm, setShowLoginForm] = useState(false);

  // Calculate total amount
  const totalAmount = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + (item.price || 0) * (item.quantity || 0),
        0
      ),
    [cartItems]
  );

  // Refresh cart when drawer opens
  useEffect(() => {
    if (open) {
      refreshCart();
    }
  }, [open, refreshCart]);

  // Handle checkout process
  const handleCheckout = useCallback(() => {
    if (user) {
      router.push("/checkout");
      onClose();
    } else {
      setShowLoginForm(true);
    }
  }, [user, router, onClose]);

  // Remove item from cart
  const handleRemoveFromCart = useCallback(
    async (productId: string) => {
      await removeFromCart(productId);
      await refreshCart();
    },
    [removeFromCart, refreshCart]
  );

  // Update item quantity
  const handleUpdateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity > 0) {
        await updateQuantity(productId, quantity);
      } else {
        await removeFromCart(productId);
      }
      window.dispatchEvent(new Event("cartUpdate"));
    },
    [updateQuantity, removeFromCart]
  );

  // Handle successful login
  const handleLoginSuccess = useCallback(() => {
    setShowLoginForm(false);
    router.push("/checkout");
    onClose();
  }, [router, onClose]);

  return (
    <Drawer open={open} onClose={onClose} placement="right" size={400}>
      <div className="p-4 h-full flex flex-col">
        {/* Close button */}
        <IconButton
          size="sm"
          color="gray"
          variant="text"
          onClick={onClose}
          className="!absolute !top-2 !right-2"
        >
          <XMarkIcon className="h-5 w-5" />
        </IconButton>
        <Typography variant="h4" color="blue-gray" className="mb-4">
          Your Cart
        </Typography>
        {showLoginForm ? (
          <LoginForm
            onClose={() => setShowLoginForm(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        ) : (
          <>
            {/* Cart items list */}
            <div className="flex-grow overflow-y-auto">
              {cartItems.length === 0 ? (
                <Typography>Your cart is empty</Typography>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={`${item.productId}-${item.name || "unknown"}`}
                    className="flex items-center mb-4 border-b pb-4"
                  >
                    {/* Product image */}
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name || "Product image"}
                        width={50}
                        height={50}
                        className="object-cover mr-4"
                      />
                    ) : (
                      <div className="w-[50px] h-[50px] bg-gray-200 mr-4"></div>
                    )}
                    {/* Product details */}
                    <div className="flex-grow">
                      <Typography variant="h6">
                        {item.name || `Product ${item.productId}`}
                      </Typography>
                      <Typography variant="small" color="gray">
                        ${(item.price || 0).toFixed(2)} x {item.quantity || 0}
                      </Typography>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        Total: $
                        {((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                      </Typography>
                    </div>
                    {/* Quantity control and remove button */}
                    <div className="flex items-center">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <IconButton
                          size="sm"
                          variant="text"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId,
                              (item.quantity || 1) - 1
                            )
                          }
                        >
                          <MinusIcon className="h-4 w-4" />
                        </IconButton>
                        <span className="mx-2">{item.quantity || 0}</span>
                        <IconButton
                          size="sm"
                          variant="text"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId,
                              (item.quantity || 0) + 1
                            )
                          }
                        >
                          <PlusIcon className="h-4 w-4" />
                        </IconButton>
                      </div>
                      <IconButton
                        size="sm"
                        color="red"
                        className="ml-2"
                        onClick={() => handleRemoveFromCart(item.productId)}
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* Total and checkout button */}
            <div className="mt-4">
              <Typography variant="h5" color="blue-gray" className="font-bold">
                Total: ${totalAmount.toFixed(2)}
              </Typography>
              <Button
                type="submit"
                className="mt-2 w-full"
                onClick={handleCheckout}
              >
                {user ? "Proceed to Checkout" : "Login to Checkout"}
              </Button>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
});

CartDrawer.displayName = "CartDrawer";
