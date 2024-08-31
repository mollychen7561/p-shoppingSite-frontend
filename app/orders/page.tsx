"use client";

import React, { useEffect, useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import { useUser } from "@/components/profile/UserContext";
import { userApi } from "@/app/lib/api/userApi";
import Image from "next/image";

// Define table headers
const TABLE_HEAD = ["Date", "Products", "Total", "Shipping Info"];

// Define types for order and related data
interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingInfo {
  phoneNumber: string;
  address: string;
  paymentMethod: string;
}

interface Order {
  _id: string;
  createdAt: string;
  total: number;
  items: OrderItem[];
  shippingInfo?: ShippingInfo;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useUser();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !token) {
        setIsLoading(false);
        setError("Please login to view your orders");
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        // Fetch orders using the API client
        const data = await userApi.getOrders(token);
        // Sort orders by date, most recent first
        const sortedOrders = data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message || "Failed to load orders");
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, token]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div>
          {/* Desktop view */}
          <div className="hidden md:block">
            <Card className="h-full w-full overflow-scroll">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold leading-none opacity-70"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map(
                    ({ _id, createdAt, total, items, shippingInfo }) => (
                      <tr key={_id} className="even:bg-blue-gray-50/50">
                        <td className="p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {new Date(createdAt).toLocaleDateString()}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col space-y-2">
                            {items.map((item) => (
                              <div
                                key={item.productId}
                                className="flex items-center space-x-2"
                              >
                                <div className="relative w-10 h-10">
                                  <Image
                                    src={item.image || "/placeholder.png"}
                                    alt={item.name}
                                    fill
                                    sizes="40px"
                                    style={{
                                      objectFit: "cover"
                                    }}
                                    className="rounded"
                                  />
                                </div>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {item.name} (x{item.quantity})
                                </Typography>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            ${total.toFixed(2)}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {shippingInfo ? (
                              <>
                                Phone: {shippingInfo.phoneNumber}
                                <br />
                                Address: {shippingInfo.address}
                                <br />
                                Payment: {shippingInfo.paymentMethod}
                              </>
                            ) : (
                              "Shipping info not available"
                            )}
                          </Typography>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </Card>
          </div>

          {/* Mobile view */}
          <div className="md:hidden space-y-6">
            {orders.map(({ _id, createdAt, total, items, shippingInfo }) => (
              <Card key={_id} className="p-4">
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Order Date: {new Date(createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Total: ${total.toFixed(2)}
                </Typography>
                <div className="mb-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-bold mb-2"
                  >
                    Products:
                  </Typography>
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <div className="relative w-10 h-10">
                        <Image
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          fill
                          sizes="40px"
                          style={{
                            objectFit: "cover"
                          }}
                          className="rounded"
                        />
                      </div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {item.name} (x{item.quantity})
                      </Typography>
                    </div>
                  ))}
                </div>
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-bold mb-1"
                  >
                    Shipping Info:
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {shippingInfo ? (
                      <>
                        Phone: {shippingInfo.phoneNumber}
                        <br />
                        Address: {shippingInfo.address}
                        <br />
                        Payment: {shippingInfo.paymentMethod}
                      </>
                    ) : (
                      "Shipping info not available"
                    )}
                  </Typography>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
