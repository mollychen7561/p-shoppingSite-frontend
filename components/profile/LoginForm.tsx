import React, { useState } from "react";
import {
  Card,
  Input,
  Button,
  Typography,
  IconButton
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useUser } from "@/components/profile/UserContext";
import { userApi } from "@/app/lib/api/userApi";

interface LoginFormProps {
  onClose: () => void;
  onLoginSuccess: () => void;
  initialEmail?: string;
  welcomeMessage?: string;
}

export function LoginForm({
  onClose,
  onLoginSuccess,
  initialEmail = "",
  welcomeMessage = ""
}: LoginFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await userApi.login({ email, password });

      if (response.user && response.token) {
        const userData = {
          id: response.user._id || response.user.id,
          name: response.user.name,
          email: response.user.email
        };
        const token = response.token;

        await login(userData, token);

        setMessage(response.message || "Login successful");
        onLoginSuccess();

        window.dispatchEvent(new Event("cartUpdate"));
      } else {
        setMessage(
          "Login failed: Please check your email and password, then try again."
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        // Provide more specific user feedback based on error type or message
        if (
          error.message.includes("network") ||
          error.message.includes("Network")
        ) {
          setMessage(
            "Login failed: Network connection issue. Please check your internet connection and try again."
          );
        } else if (error.message.includes("400")) {
          setMessage(
            "Login failed: Invalid request. Please ensure all required fields are filled correctly."
          );
        } else if (
          error.message.includes("401") ||
          error.message.includes("unauthorized")
        ) {
          setMessage(
            "Login failed: Incorrect email or password. Please double-check and try again."
          );
        } else if (error.message.includes("500")) {
          setMessage("Login failed: Server error. Please try again later.");
        } else {
          setMessage(
            "Login failed: An unknown error occurred. Please try again later or contact customer support."
          );
        }
      } else {
        setMessage(
          "Login failed: An unexpected error occurred. Please try again later."
        );
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
