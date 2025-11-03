import { axiosInstace } from "@/utils/axiosService";
import React, { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type User = {
  id: string;
  name: string;
  email: string;
} | null;

type UserContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

const UserContext = createContext<UserContextType | null>(null);

type UserContextProviderProps = {
  children: ReactNode;
};

const UserContextProvider: React.FC<UserContextProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(null);

  const getUserInfo = async (token: string) => {
    try {
      const request = await axiosInstace.get("/user/userInfo", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (request.status == 200) {
        setUser(request.data);
      } else {
        setUser(null);
      }
      console.log()
    } catch (error) {
      console.error("Error fetching user info:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    const raw = localStorage.getItem("accessToken");
    if (!raw) {
      setUser(null);
      console.log("No token found");
      return;
    }

    const token = JSON.parse(raw) as string;
    getUserInfo(token);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
