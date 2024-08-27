import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback
} from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

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

const UserContext = createContext<UserContextType | undefined>(undefined);

// Check if the token is valid and not expired
const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const decodedToken: any = jwtDecode(token);
    return decodedToken.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const router = useRouter();

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
            if (!parsedAuth.user.id && (parsedAuth.user as any)._id) {
              parsedAuth.user.id = (parsedAuth.user as any)._id;
            }
            setAuthState(parsedAuth);
            await loadServerCart(parsedAuth.token);
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
  }, []);

  // Handle token expiration
  const handleTokenExpiration = useCallback(() => {
    logout();
    setShowLogoutAlert(true);
    setTimeout(() => {
      setShowLogoutAlert(false);
      router.push("/");
    }, 5000);
  }, [router]);

  // Set up axios interceptor for handling 401 errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          handleTokenExpiration();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [handleTokenExpiration]);

  // Refresh the auth token
  const refreshToken = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/refresh-token`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authState.token}`
          }
        }
      );
      const newToken = response.data.token;
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

  // Load cart from server
  const loadServerCart = async (token: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/cart`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      localStorage.setItem("cart", JSON.stringify(response.data.cart));
    } catch (error) {
      console.error("Error loading server cart:", error);
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
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/merge-cart`,
          { cart: localCart },
          {
            headers: { Authorization: `Bearer ${newToken}` }
          }
        );
        localStorage.removeItem("cart");
      } catch (error) {
        console.error("Error merging cart:", error);
      }
    }

    // Load server cart
    await loadServerCart(newToken);

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

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
