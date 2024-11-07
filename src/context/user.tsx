"use client";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

import { SafeUser } from "@/app/types/user";

import {login as loginAction} from "@/actions/login"
import {register as registerAction} from "@/actions/register";
import {getUser as getUserAction} from "@/actions/getUser"
import { format } from "date-fns";
import LocalStorageKit from "@/app/utils/localStorageKit";
import { Booking } from "@/app/types/property";

type OnComplete = (response?: any) => void;
type OnError = (error?: any) => void;

// default state
type UserContextState = {
  token: string | null;
  user: SafeUser | null;
  bookings: Booking[];
  loading: boolean;
  actions: {
    login: (
      email: string,
      password: string,
      onComplete: OnComplete,
      onError: OnError
    ) => Promise<void>;
    register: ( 
      name: string,
      email: string,
      password: string,
      onComplete: OnComplete,
      onError: OnError
    ) => Promise<void>;
    logout: () => void;
    fetchBookings: () => Promise<void>;
  };
};

const defaultState: UserContextState = {
  token: null,
  user: null,
  bookings: [],
  loading: false,
  actions: {
    login: () => Promise.resolve(),
    register: () => Promise.resolve(),
    logout: () => {},
    fetchBookings: () => Promise.resolve(),
  },
};

// context initator constructor
const UserContext = createContext<Partial<UserContextState>>(defaultState);

// provider
function UserProvider({children}: PropsWithChildren) {
  const [token, setToken] = useState<typeof defaultState.token>(
    defaultState.token
  );
  const [user, setUser] = useState<typeof defaultState.user>(defaultState.user);
  const [bookings, setBookings] = useState<Booking[]>(defaultState.bookings);
  const [loading, setLoading] = useState<boolean>(defaultState.loading);

  const setBookingsInContext = (bookings: Booking[]) => {
    setBookings(bookings); 
  };

  useEffect(() => {
    if(!token) {
        let _token = LocalStorageKit.get("@library/token")
        if(_token) {
            setToken(_token)
            return
        }
    }
  },[])

//   om token finns, hämtas användaren
  useEffect(() => {
    if(token && !user) {
        getUser()
    }
  },[token])

  const login: typeof defaultState.actions.login = async (
    email,
    password,
    onComplete,
    onError
  ) => {
    try {
        const token = await loginAction(email, password)
        console.log("token after setting in login",token)
        setToken(token)
        LocalStorageKit.set("@library/token", token)
    } catch(error: any) {
        console.warn("Error logging in", error.message)
        onError()
    }
  };

  const register: typeof defaultState.actions.register = async (name, email, password, onComplete, onError) => {
    try {
      const token = await registerAction(name, email, password);
      console.log("Token from register:", token);
      setToken(token);
      LocalStorageKit.set("@library/token", token);
      // onComplete();
    } catch (error: any) {
      console.warn("Error registering", error.message);
      console.warn("Detailed error data:", error.data);
      onError();
    }
  }

  const logout = () => {
    setUser(defaultState.user)
    setToken(defaultState.token)
    LocalStorageKit.remove("@library/token")
  };



  const getUser = async () => {
    try {
        if(! token ){
            throw new Error();
        }
        // return console.log("token", token)
        const _user = await getUserAction(token)
        // console.log(_user)
    } catch (error: any) {
        console.log(error)
        logout();
    }
  }

  const fetchBookings = async () => {
    if (!token) {
      console.log("No token found, cannot fetch bookings.");
      return;
    }

    console.log("Fetching bookings with token:", token);

    setLoading(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Skicka med token här
        },
      });
      const data = await response.json();
      if (response.ok) {
        setBookingsInContext(data);
        console.log("hämtning data", data)
      } else {
        console.error("Failed to fetch bookings:", data.error);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  


  return (
    <UserContext.Provider
      value={{
        token,
        user,
        bookings,
        actions: {
          login,
          register,
          logout,
          fetchBookings,
        },
      }}
    >
        {children}
    </UserContext.Provider>
  );
}

// use hook
function useUser() {
  const user = useContext(UserContext);
  if (!user) {
    throw new Error("'useUser' used outside of provider");
  }
  return user as UserContextState;
}

export { UserProvider, useUser };