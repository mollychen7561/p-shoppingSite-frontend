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

export function SignUpForm({ onClose, onSignUpSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/register`,
        { name, email, password }
      );
      setMessage(response.data.message);
      if (response.data.message === "User registered successfully") {
        onSignUpSuccess();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
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
            Sign Up
          </Typography>

          <Typography color="gray" className="mt-1 font-normal">
            Please sign up to create a new account.
          </Typography>
        </div>

        <form className="mt-8 mb-2 w-full" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Name
            </Typography>
            <Input
              size="lg"
              placeholder="John Doe"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none"
              }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

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
            Sign Up
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
