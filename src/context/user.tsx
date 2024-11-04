"use client";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

import { SafeUser } from "@/app/types/user";

import {login as loginAction} from "@/actions/login"
import {register as registerAction} from "@/actions/register";
import {getUser as getUserAction} from "@/actions/getUser"
import LocalStorageKit from "@/app/utils/localStorageKit";

type OnComplete = (response?: any) => void;
type OnError = (error?: any) => void;

// default state
type UserContextState = {
  token: string | null;
  user: SafeUser | null;
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
  };
};

const defaultState: UserContextState = {
  token: null,
  user: null,
  actions: {
    login: () => Promise.resolve(),
    register: () => Promise.resolve(),
    logout: () => {},
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

//   se efter om det finns token sparad i localstorage
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
        console.log(_user)
    } catch (error: any) {
        console.log(error)
        logout();
    }
  }

  return (
    <UserContext.Provider
      value={{
        token,
        user,
        actions: {
          login,
          register,
          logout,
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