import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  Input,
  Button,
  Typography,
  IconButton
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useUser } from "@/components/profile/UserContext";

export function LoginForm({ onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      console.log(
        "Sending request to:",
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`
      );
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`,
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Response received:", response);

      if (response.data && response.data.user && response.data.token) {
        const userData = {
          id: response.data.user._id || response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email
        };
        const token = response.data.token;
        console.log("Logged in user data:", userData);
        console.log("Received token:", token);

        await login(userData, token);

        setMessage(response.data.message || "Login successful");
        onLoginSuccess();

        const storedAuth = JSON.parse(localStorage.getItem("auth"));
        // console.log("Verifying stored auth data:", storedAuth);

        window.dispatchEvent(new Event("cartUpdate"));
      } else {
        // console.error("Unexpected response structure:", response.data);
        setMessage("Login failed: Unexpected response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          console.error("Request timed out");
          setMessage("Login failed: Request timed out");
        } else {
          // console.error("Axios error details:", error.response?.data);
          setMessage(
            error.response?.data?.message ||
              "Login failed: " + (error.response?.status || "Unknown error")
          );
        }
      } else {
        setMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="p-8 bg-white relative w-full max-w-md" shadow={false}>
        <IconButton
          variant="text"
          color="blue-gray"
          className="!absolute !top-2 !right-2"
          onClick={onClose}
        >
          <XMarkIcon strokeWidth={2} className="h-5 w-5" />
        </IconButton>

        <div className="text-left">
          <Typography variant="h4" color="blue-gray">
            Log In
          </Typography>

          <Typography color="gray" className="mt-1 font-normal">
            Please log in to your account to continue shopping.
          </Typography>
        </div>

        <form className="mt-8 mb-2 w-full" onSubmit={handleLogin}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "hidden"
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "hidden"
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button className="mt-6" fullWidth type="submit">
            Log In
          </Button>
          {message && (
            <Typography color="red" className="mt-4">
              {message}
            </Typography>
          )}
        </form>
      </Card>
    </div>
  );
}
