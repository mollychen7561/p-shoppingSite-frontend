"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Avatar,
  Card,
  CardBody,
  Chip,
  Typography
} from "@material-tailwind/react";
import { HeartIcon, ShoppingBagIcon } from "@heroicons/react/24/solid";
import { useUser } from "@/components/profile/UserContext";
import { userApi } from "@/app/lib/api/userApi";

interface UserData {
  name: string;
  email: string;
}

const ProfilePage = () => {
  const [userData, setUserData] = useState<UserData>({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useUser();

  useEffect(() => {
    if (!user || !token) {
      setLoading(false);
      setError("Please log in to view your profile.");
      return;
    }

    const fetchUserData = async () => {
      try {
        const data = await userApi.getProfile(token);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, token]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center mt-10 px-4 sm:px-0">
      <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-gray-100 mb-5">
        <CardBody className="flex flex-col sm:flex-row items-center">
          <div className="flex flex-col items-center sm:mr-10 mb-4 sm:mb-0">
            <Avatar
              src="https://docs.material-tailwind.com/img/face-2.jpg"
              alt="avatar"
              size="xxl"
              className="mb-2"
            />
            <Chip color="indigo" value="New Member" />
          </div>
          <div className="flex flex-col justify-center text-center sm:text-left">
            <Typography variant="h4">{userData.name}</Typography>
            <Typography variant="h5" color="gray" className="font-normal">
              {userData.email}
            </Typography>
          </div>
        </CardBody>
      </Card>

      <div className="flex flex-col sm:flex-row justify-between w-full max-w-sm sm:max-w-md md:max-w-lg gap-4">
        <Link
          href="/wishlist"
          passHref
          className="w-full sm:w-[calc(50%-0.5rem)]"
        >
          <Card className="w-full cursor-pointer bg-gray-100 hover:bg-gray-200">
            <CardBody className="flex flex-col items-center justify-center py-4">
              <HeartIcon className="h-6 w-6 text-red-300 mb-2" />
              <Typography>Wishlist</Typography>
            </CardBody>
          </Card>
        </Link>

        <Link
          href="/orders"
          passHref
          className="w-full sm:w-[calc(50%-0.5rem)]"
        >
          <Card className="w-full cursor-pointer bg-gray-100 hover:bg-gray-200">
            <CardBody className="flex flex-col items-center justify-center py-4">
              <ShoppingBagIcon className="h-6 w-6 text-slate-500 mb-2" />
              <Typography>Orders</Typography>
            </CardBody>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
