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

  const getUserInfo = async () => {
    try {
      const request = await axiosInstace.get("/user/userInfo");
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
    getUserInfo();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
