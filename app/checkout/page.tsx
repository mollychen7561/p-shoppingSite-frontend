"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Typography,
  Input,
  Select,
  Option,
  Button,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Spinner
} from "@material-tailwind/react";
import { useCart } from "@/components/products/CartProvider";
import { useUser } from "@/components/profile/UserContext";
import Image from "next/image";
import {
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { userApi } from "@/app/lib/api/userApi";

const CheckOutPage = () => {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { token } = useUser();

  // State management
  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [originalTotal, setOriginalTotal] = useState(0);
  const [discountedTotal, setDiscountedTotal] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Calculate total price and apply discount if coupon is used
  useEffect(() => {
    if (cartItems) {
      const newTotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      setOriginalTotal(newTotal);
      setDiscountedTotal(isCouponApplied ? newTotal * 0.88 : newTotal);
      setIsLoading(false);
    }
  }, [cartItems, isCouponApplied]);

  // Handle coupon input change
  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoupon(e.target.value);
  };

  // Apply coupon if valid
  const applyCoupon = () => {
    if (coupon === "coupon888" && !isCouponApplied) {
      setCouponMessage("Coupon successfully applied!");
      setIsCouponApplied(true);
      setDiscountedTotal(originalTotal * 0.88);
    } else if (isCouponApplied) {
      setCouponMessage("Coupon already applied.");
    } else {
      setCouponMessage("Invalid coupon code.");
    }
  };

  // Remove applied coupon
  const removeCoupon = () => {
    setCoupon("");
    setCouponMessage("");
    setIsCouponApplied(false);
    setDiscountedTotal(originalTotal);
  };

  // Update item quantity in cart
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  // Remove item from cart
  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };

  // Validate phone number
  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError("Please enter a valid 10-digit phone number");
      return false;
    }
    setPhoneError("");
    return true;
  };

  // Validate address
  const validateAddress = (addr: string) => {
    if (addr.length > 30) {
      setAddressError("Address must not exceed 30 characters");
      return false;
    }
    setAddressError("");
    return true;
  };

  // Handle order confirmation
  const handleConfirmOrder = async () => {
    // Check if user is logged in
    if (!token) {
      setFormError("Please log in to place an order.");
      return;
    }

    // Check if cart is empty
    if (cartItems.length === 0) {
      setFormError(
        "Your cart is empty. Please add items before placing an order."
      );
      return;
    }

    // Validate form fields
    if (!phoneNumber || !address || !paymentMethod) {
      setFormError("Please fill in all fields");
      return;
    }

    if (!validatePhone(phoneNumber) || !validateAddress(address)) {
      return;
    }

    try {
      // Send order to the server
      const response = await userApi.createOrder(token, {
        items: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total: isCouponApplied ? discountedTotal : originalTotal,
        shippingInfo: {
          phoneNumber,
          address,
          paymentMethod
        }
      });

      if (response.success) {
        setIsModalOpen(true);
        clearCart();
      }
    } catch (error) {
      setFormError("Failed to create order. Please try again.");
    }
  };

  // Handle modal confirmation
  const handleModalConfirm = () => {
    setIsModalOpen(false);
    router.push("/orders");
  };

  // Show loading spinner while data is being fetched
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-6xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center">
        Please Confirm Your Shopping List
      </h1>

      {/* Cart items list */}
      <div className="mb-8">
        {/* Desktop view */}
        <div className="hidden md:block">
          <Card className="overflow-scroll">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {["Product", "Quantity", "Total Price"].map((head) => (
                    <th
                      key={head}
                      className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.productId} className="even:bg-blue-gray-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="object-cover rounded"
                        />
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {item.name}
                        </Typography>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <IconButton
                          size="sm"
                          variant="text"
                          onClick={() =>
                            item.quantity > 1
                              ? handleQuantityChange(
                                  item.productId,
                                  item.quantity - 1
                                )
                              : handleRemoveItem(item.productId)
                          }
                        >
                          {item.quantity > 1 ? (
                            <MinusIcon className="h-4 w-4" />
                          ) : (
                            <TrashIcon className="h-4 w-4" />
                          )}
                        </IconButton>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="sm"
                          variant="text"
                          onClick={() =>
                            handleQuantityChange(
                              item.productId,
                              item.quantity + 1
                            )
                          }
                        >
                          <PlusIcon className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </td>
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Mobile view */}
        <div className="md:hidden">
          {cartItems.map((item) => (
            <Card key={item.productId} className="mb-4 p-4">
              <div className="flex items-center gap-4">
                <Image
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="object-cover rounded"
                />
                <div className="flex-grow">
                  <Typography variant="h6" color="blue-gray">
                    {item.name}
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    Price: ${item.price.toFixed(2)}
                  </Typography>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  <IconButton
                    size="sm"
                    variant="text"
                    onClick={() =>
                      item.quantity > 1
                        ? handleQuantityChange(
                            item.productId,
                            item.quantity - 1
                          )
                        : handleRemoveItem(item.productId)
                    }
                  >
                    {item.quantity > 1 ? (
                      <MinusIcon className="h-4 w-4" />
                    ) : (
                      <TrashIcon className="h-4 w-4" />
                    )}
                  </IconButton>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {item.quantity}
                  </Typography>
                  <IconButton
                    size="sm"
                    variant="text"
                    onClick={() =>
                      handleQuantityChange(item.productId, item.quantity + 1)
                    }
                  >
                    <PlusIcon className="h-4 w-4" />
                  </IconButton>
                </div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  Total: ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between gap-6">
        {/* Receiver's Information */}
        <div className="w-full md:w-1/2">
          <h3 className="text-lg font-semibold mb-4">
            Receiver&apos;s Information
          </h3>
          <form className="w-full">
            <div className="mb-6 flex flex-col gap-6">
              <Input
                size="lg"
                label="Phone Number"
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  validatePhone(e.target.value);
                }}
                error={!!phoneError}
                required
              />
              {phoneError && (
                <Typography color="red" className="mt-2">
                  {phoneError}
                </Typography>
              )}
              <Input
                size="lg"
                label="Address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  validateAddress(e.target.value);
                }}
                error={!!addressError}
                required
              />
              {addressError && (
                <Typography color="red" className="mt-2">
                  {addressError}
                </Typography>
              )}
              <Select
                label="Payment Method"
                value={paymentMethod}
                onChange={(value) => setPaymentMethod(value as string)}
                required
              >
                <Option value="Credit Card">Credit Card</Option>
                <Option value="PayPal">PayPal</Option>
                <Option value="Bank Transfer">Bank Transfer</Option>
              </Select>
            </div>
          </form>
          {formError && (
            <Typography color="red" className="mt-2">
              {formError}
            </Typography>
          )}
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-1/2">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">
              Do You Want To Use Coupon?
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <Input
                variant="gradient"
                label="Input Coupon"
                value={coupon}
                onChange={handleCouponChange}
                disabled={isCouponApplied}
                className="flex-grow"
              />
              {!isCouponApplied ? (
                <Button onClick={applyCoupon} disabled={!coupon}>
                  Apply
                </Button>
              ) : (
                <IconButton onClick={removeCoupon} color="red">
                  <TrashIcon className="h-5 w-5" />
                </IconButton>
              )}
            </div>
            {couponMessage && (
              <Typography
                color={isCouponApplied ? "green" : "red"}
                className="mt-2"
              >
                {couponMessage}
              </Typography>
            )}
          </div>

          <div className="text-right mb-4">
            <h1 className="text-xl font-bold">
              Total:
              {isCouponApplied ? (
                <>
                  <span className="line-through mr-2">
                    ${originalTotal.toFixed(2)}
                  </span>
                  <span className="text-red-500">
                    ${discountedTotal.toFixed(2)}
                  </span>
                </>
              ) : (
                <span>${originalTotal.toFixed(2)}</span>
              )}
            </h1>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              variant="gradient"
              ripple="light"
              fullWidth
              onClick={handleConfirmOrder}
              disabled={cartItems.length === 0}
            >
              Confirm Order
            </Button>
            {cartItems.length === 0 && (
              <Typography color="red" className="mt-2">
                Your cart is empty. Please add items before placing an order.
              </Typography>
            )}
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      <Dialog open={isModalOpen} handler={() => setIsModalOpen(false)}>
        <DialogHeader className="text-center justify-center">
          Order Confirmed
        </DialogHeader>
        <DialogBody divider className="text-center">
          Your order has been successfully placed. Thank you for your purchase!
        </DialogBody>
        <DialogFooter className="justify-center">
          <Button onClick={handleModalConfirm} type="submit">
            View Orders
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default CheckOutPage;
