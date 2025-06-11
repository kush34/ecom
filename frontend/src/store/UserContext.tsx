import React, { createContext, useEffect, useState } from "react";
import type ReactNode from "react";

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
      const response = await fetch(`${import.meta.env.VITE_Backend_URL}/user/userInfo`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("accessToken")) as string;
    if (!token) {
      setUser(null);
       console.log(`no token found`)
    } else {
      getUserInfo(token);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
