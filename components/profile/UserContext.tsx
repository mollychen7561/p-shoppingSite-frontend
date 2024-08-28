import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback
} from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { userApi } from "@/app/lib/api/userApi";

// Define types for User and AuthState
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

// Define the shape of the UserContext
interface UserContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  getUserData: () => User | null;
  showLogoutAlert: boolean;
  setShowLogoutAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UserProviderProps {
  children: ReactNode;
}

// Create the UserContext
const UserContext = createContext<UserContextType | undefined>(undefined);

// Function to check if a token is valid and not expired
const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const decodedToken: any = jwtDecode(token);
    return decodedToken.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

// UserProvider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const router = useRouter();

  // Handle token expiration
  const handleTokenExpiration = useCallback(() => {
    logout();
    setShowLogoutAlert(true);
    setTimeout(() => {
      setShowLogoutAlert(false);
      router.push("/");
    }, 5000);
  }, [router]);

  // Load user data from local storage on initial render
  useEffect(() => {
    const loadUser = async () => {
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) {
        try {
          const parsedAuth: AuthState = JSON.parse(storedAuth);
          if (
            parsedAuth.user &&
            parsedAuth.token &&
            isTokenValid(parsedAuth.token)
          ) {
            // Ensure user id is set correctly
            if (!parsedAuth.user.id && (parsedAuth.user as any)._id) {
              parsedAuth.user.id = (parsedAuth.user as any)._id;
            }
            setAuthState(parsedAuth);
            await userApi.getCart(parsedAuth.token);
          } else {
            throw new Error("Invalid or expired stored auth data");
          }
        } catch (error) {
          localStorage.removeItem("auth");
          handleTokenExpiration();
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, [handleTokenExpiration]);

  // Refresh the auth token
  const refreshToken = async () => {
    try {
      const newToken = await userApi.refreshToken(authState.token!);
      setAuthState((prev) => ({ ...prev, token: newToken }));
      localStorage.setItem(
        "auth",
        JSON.stringify({ ...authState, token: newToken })
      );
      return newToken;
    } catch (error) {
      handleTokenExpiration();
      return null;
    }
  };

  // Handle user login
  const login = useCallback(async (userData: User, newToken: string) => {
    if (!userData.id && (userData as any)._id) {
      userData.id = (userData as any)._id;
    }
    const newAuthState = { user: userData, token: newToken };
    setAuthState(newAuthState);
    localStorage.setItem("auth", JSON.stringify(newAuthState));

    // Merge local cart with server cart
    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (localCart.length > 0) {
      try {
        await userApi.mergeCart(newToken, localCart);
        localStorage.removeItem("cart");
      } catch (error) {
        console.error("Error merging cart:", error);
      }
    }

    // Load server cart
    await userApi.getCart(newToken);

    // Trigger cart update event
    window.dispatchEvent(new Event("cartUpdate"));
  }, []);

  // Handle user logout
  const logout = useCallback(() => {
    setAuthState({ user: null, token: null });
    localStorage.removeItem("auth");
    localStorage.removeItem("cart");

    window.dispatchEvent(new Event("cartUpdate"));
  }, []);

  // Get current user data
  const getUserData = useCallback(() => {
    return authState.user;
  }, [authState.user]);

  // Provide the context value
  return (
    <UserContext.Provider
      value={{
        user: authState.user,
        token: authState.token,
        login,
        logout,
        isLoading,
        getUserData,
        showLogoutAlert,
        setShowLogoutAlert
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
