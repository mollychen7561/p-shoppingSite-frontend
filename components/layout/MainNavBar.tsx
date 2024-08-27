"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CartDrawer } from "@/components/products/CartDrawer";
import { useCart } from "@/components/products/CartProvider";
import { SignUpForm } from "@/components/profile/SignUpForm";
import { LoginForm } from "@/components/profile/LoginForm";
import { useUser } from "@/components/profile/UserContext";
import { LogoutAlert } from "@/components/profile/LogoutAlert";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  Dialog
} from "@material-tailwind/react";
import {
  HomeIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  ArrowLeftEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  UserPlusIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline";

export function MainNavbar() {
  // State management
  const [openNav, setOpenNav] = useState(false);
  const [openSignUpModal, setOpenSignUpModal] = useState(false);
  const [openLogInModal, setOpenLogInModal] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  // Hooks
  const router = useRouter();
  const { user, logout, showLogoutAlert, setShowLogoutAlert } = useUser();
  const { totalItems } = useCart();
  const latestTotalItems = useRef(totalItems);

  // Update cart item count when totalItems changes
  useEffect(() => {
    latestTotalItems.current = totalItems;
    setCartItemCount(totalItems);
  }, [totalItems]);

  // Update cart count callback
  const updateCartCount = useCallback(() => {
    setCartItemCount(latestTotalItems.current);
  }, []);

  // Listen for cart updates
  useEffect(() => {
    window.addEventListener("cartUpdate", updateCartCount);
    return () => {
      window.removeEventListener("cartUpdate", updateCartCount);
    };
  }, [updateCartCount]);

  // Modal handlers
  const handleOpenSignUpModal = useCallback(() => setOpenSignUpModal(true), []);
  const handleCloseSignUpModal = useCallback(
    () => setOpenSignUpModal(false),
    []
  );
  const handleOpenLogInModal = useCallback(() => setOpenLogInModal(true), []);
  const handleCloseLogInModal = useCallback(() => setOpenLogInModal(false), []);
  const handleOpenCart = useCallback(() => setOpenCart(true), []);
  const handleCloseCart = useCallback(() => setOpenCart(false), []);

  // Login success handler
  const handleLoginSuccess = useCallback(() => {
    handleCloseLogInModal();
    window.dispatchEvent(new Event("cartUpdate"));
  }, [handleCloseLogInModal]);

  // Logout handler
  const handleLogout = useCallback(() => {
    logout();
    if (setShowLogoutAlert) {
      setShowLogoutAlert(true);
    }
    window.dispatchEvent(new Event("cartUpdate"));
  }, [logout, setShowLogoutAlert]);

  // Navigation list
  const navList = useMemo(
    () => (
      <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="flex items-center gap-x-2 p-1 font-medium hover:bg-gray-100 hover:rounded-lg hover:py-2"
        >
          <HomeIcon className="h-6 w-6" />
          <a href="/" className="flex items-center">
            Home
          </a>
        </Typography>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="flex items-center gap-x-2 p-1 font-medium hover:bg-gray-100 hover:rounded-lg hover:py-2"
        >
          <ShoppingBagIcon className="h-6 w-6" />
          <a href="/allproducts" className="flex items-center">
            Store
          </a>
        </Typography>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="flex items-center gap-x-2 p-1 font-medium hover:bg-gray-100 hover:rounded-lg hover:py-2"
        >
          <UserGroupIcon className="h-6 w-6" />
          <a href="/about" className="flex items-center">
            About
          </a>
        </Typography>
      </ul>
    ),
    []
  );

  return (
    <>
      <Navbar className="mx-auto max-w-full px-4 py-2 lg:px-8 lg:py-4">
        <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
          {/* Logo and brand name */}
          <div className="flex items-center text-blue-gray-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="20"
              viewBox="0 0 500 500"
            >
              <path d="M291.2 388.4c31.2-18.8 64.7-36.4 101.1-36.4H448c4.6 0 9.1-.2 13.6-.7l85.3 121.9c4 5.7 11.3 8.2 17.9 6.1s11.2-8.3 11.2-15.3V224c0-70.7-57.3-128-128-128H392.3c-36.4 0-69.9-17.6-101.1-36.4C262.3 42.1 228.3 32 192 32C86 32 0 118 0 224c0 71.1 38.6 133.1 96 166.3V456c0 13.3 10.7 24 24 24s24-10.7 24-24V410c15.3 3.9 31.4 6 48 6c5.4 0 10.7-.2 16-.7V456c0 13.3 10.7 24 24 24s24-10.7 24-24V405.1c12.4-4.4 24.2-10 35.2-16.7zM448 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
            </svg>
            <Typography
              as="a"
              href="/"
              className="mr-4 cursor-pointer py-1.5 px-1.5 font-medium"
            >
              Kiwi Shop
            </Typography>
          </div>

          {/* Navigation list for large screens */}
          <div className="hidden lg:block">{navList}</div>

          {/* User actions for large screens */}
          <div className="hidden lg:flex items-center gap-x-1">
            {user ? (
              <>
                <Button
                  variant="text"
                  size="sm"
                  className="flex items-center normal-case"
                  onClick={handleLogout}
                >
                  <ArrowRightStartOnRectangleIcon className="h-6 w-6 mr-1" />
                  <span>Log out</span>
                </Button>
                <Link href="/profile">
                  <Button
                    variant="gradient"
                    size="sm"
                    className="flex items-center normal-case"
                  >
                    <UserCircleIcon className="h-6 w-6 mr-1" />
                    <span>Profile</span>
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Button
                  variant="text"
                  size="sm"
                  className="flex items-center normal-case"
                  onClick={handleOpenLogInModal}
                >
                  <ArrowLeftEndOnRectangleIcon className="h-6 w-6 mr-1" />
                  <span>Log in</span>
                </Button>
                <Button
                  variant="gradient"
                  size="sm"
                  className="flex items-center normal-case"
                  onClick={handleOpenSignUpModal}
                >
                  <UserPlusIcon className="h-6 w-6 mr-1" />
                  <span>Sign Up</span>
                </Button>
              </>
            )}
            <Button variant="text" size="sm" onClick={handleOpenCart}>
              <div className="relative inline-block">
                <ShoppingCartIcon className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartItemCount}
                  </span>
                )}
              </div>
            </Button>
          </div>

          {/* Cart button and hamburger menu for small screens */}
          <div className="flex items-center lg:hidden">
            <Button
              variant="text"
              size="sm"
              onClick={handleOpenCart}
              className="mr-2"
            >
              <div className="relative inline-block">
                <ShoppingCartIcon className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartItemCount}
                  </span>
                )}
              </div>
            </Button>
            <IconButton
              variant="text"
              className="h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </IconButton>
          </div>
        </div>

        {/* Collapsible navigation for small screens */}
        <Collapse open={openNav}>
          <div className="container mx-auto">
            {navList}
            <div className="flex flex-col gap-2 mt-2">
              {user ? (
                <div className="flex justify-between">
                  <Button
                    variant="text"
                    size="sm"
                    className="flex items-center flex-grow mr-2"
                    onClick={handleLogout}
                  >
                    <ArrowRightStartOnRectangleIcon className="h-6 w-6 mr-1" />
                    <span>Log out</span>
                  </Button>
                  <Link href="/profile" className="flex-grow">
                    <Button
                      variant="gradient"
                      size="sm"
                      className="flex items-center w-full"
                    >
                      <UserCircleIcon className="h-6 w-6 mr-1" />
                      <span>Profile</span>
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex justify-between">
                  <Button
                    variant="text"
                    size="sm"
                    className="flex items-center flex-grow mr-2"
                    onClick={handleOpenLogInModal}
                  >
                    <ArrowLeftEndOnRectangleIcon className="h-6 w-6 mr-1" />
                    <span>Log in</span>
                  </Button>
                  <Button
                    variant="gradient"
                    size="sm"
                    className="flex items-center flex-grow"
                    onClick={handleOpenSignUpModal}
                  >
                    <UserPlusIcon className="h-6 w-6 mr-1" />
                    <span>Sign up</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Collapse>
      </Navbar>

      {/* Sign Up Dialog */}
      <Dialog
        open={openSignUpModal}
        handler={handleCloseSignUpModal}
        className="bg-transparent shadow-none"
      >
        <SignUpForm onClose={handleCloseSignUpModal} />
      </Dialog>

      {/* Log In Dialog */}
      <Dialog
        open={openLogInModal}
        handler={handleCloseLogInModal}
        className="bg-transparent shadow-none"
      >
        <LoginForm
          onClose={handleCloseLogInModal}
          onLoginSuccess={handleLoginSuccess}
        />
      </Dialog>

      {/* Logout Alert */}
      <LogoutAlert
        open={showLogoutAlert}
        onClose={() => {
          if (setShowLogoutAlert) {
            setShowLogoutAlert(false);
          }
        }}
        message="Logout Successful"
      />

      {/* Cart Drawer */}
      <CartDrawer open={openCart} onClose={handleCloseCart} />
    </>
  );
}
