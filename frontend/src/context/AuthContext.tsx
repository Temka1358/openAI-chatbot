import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  checkAuthStatus,
  loginUser,
  logoutUser,
  signupUser,
  setUserLevel,
} from "../helpers/api-communicator";

type User = {
  name: string;
  email: string;
  level: number;
};
type UserAuth = {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (firstName: string,lastName: string, age: number, eikenLevel: number, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserLevel: (level: number) => Promise<void>;
};
const AuthContext = createContext<UserAuth | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // fetch if the user's cookies are valid then skip login
    async function checkStatus() {
      const data = await checkAuthStatus();
      if (data) {
        setUser({ email: data.email, name: data.name, level: data.level });
        setIsLoggedIn(true);
      }
    }
    checkStatus();
  }, []);
  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password);
    if (data) {
      setUser({ email: data.email, name: data.name, level: data.level });
      setIsLoggedIn(true);
    }
  };
  const signup = async (firstName: string,lastName: string, age: number, eikenLevel: number, email: string, password: string) => {
    const data = await signupUser(firstName,lastName, age, eikenLevel, email, password);
    if (data) {
      setUser({ email: data.email, name: data.name, level: data.level });
      setIsLoggedIn(true);
    }
  };
  const logout = async () => {
    await logoutUser();
    setIsLoggedIn(false);
    setUser(null);
    // window.location.reload();
  };

  const updateUserLevel = async (level: number) => {
    if (!user) return;
    try {
      const data = await setUserLevel(level);
      setUser({ email: data.email, name: data.name, level: data.level });
    } catch (error) {
      console.error("Failed to update user level:", error);
    }
  };

  const value = {
    user,
    isLoggedIn,
    login,
    logout,
    signup,
    updateUserLevel,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
