import React, { useEffect, useState } from "react";
import { Dialog, Typography, Button } from "@material-tailwind/react";
import { useRouter } from "next/navigation";

interface LogoutAlertProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

export const LogoutAlert: React.FC<LogoutAlertProps> = ({
  open,
  onClose,
  message
}) => {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const redirectTimer = setTimeout(() => {
        clearInterval(timer);
        onClose();
        router.push("/");
      }, 5000);

      return () => {
        clearInterval(timer);
        clearTimeout(redirectTimer);
      };
    }
  }, [open, onClose, router]);

  const handleGoToHomepage = () => {
    onClose();
    router.push("/");
  };

  return (
    <Dialog open={open} handler={onClose} className="bg-white shadow-xl">
      <div className="p-6 text-center">
        <Typography variant="h5" className="mb-4">
          {message}
        </Typography>
        <Typography variant="paragraph" className="mb-6">
          You will be redirected to the homepage in {countdown} seconds.
        </Typography>
        <Button type="submit" onClick={handleGoToHomepage}>
          Go to Homepage Now
        </Button>
      </div>
    </Dialog>
  );
};
