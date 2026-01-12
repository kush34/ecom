import { axiosInstace } from "@/utils/axiosService";
import React, { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { ProductType } from "./CartContext";

export type address = {
  city: string,
  pincode: string,
  contact: string
  address: string,
}

type User = {
  _id: string;
  email: string;
  role: 'user' | 'admin',
  cart: ProductType[]
  addresses: address[]
} | null;

type UserContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  loading: boolean;
};

const UserContext = createContext<UserContextType | null>(null);

type UserContextProviderProps = {
  children: ReactNode;
};

const UserContextProvider: React.FC<UserContextProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true)
  const getUserInfo = async () => {
    setLoading(true)
    try {
      const request = await axiosInstace.get("/user/userInfo");
      if (request.status == 200) {
        setUser(request.data);
        // console.log("userSet",request.data)
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      setUser(null);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
