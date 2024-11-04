"use client";

import { useUser } from "@/context/user";
import { Input } from "../ui/input"
import { FormEvent, useState } from "react";
import { Button } from "../ui/button"
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LoginFormProps {
    onLoginSuccess: () => void;
  }

export default function LoginForm( { onLoginSuccess }: LoginFormProps ) {
  const user = useUser();

  const [email, setEmail] = useState("elin@elin.se");
  const [password, setPassword] = useState("password123");

  const login = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    user.actions.login(
      email,
      password,
      () => {},
      () => {}
    );

    toast.success("Welcome back! Login was successful");

    console.log({
      email,
      password,
    });
  };

  useEffect(() => {
    if (user.token) {
        onLoginSuccess();
      }
    console.log("user token:", user.token);
  }, [user.token, onLoginSuccess]);

  

  const handleLogout = () => {
    user.actions.logout();
  }; 

  
  

  if(user.token ){
    return (
        <Button onClick={handleLogout}>
            Logout
        </Button>
    )
  }
  return (
    <div> 
        <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
    <form onSubmit={login}>
      <Input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value as string)}
      />
      <Input
        placeholder="********"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value as string)}
      />
      <Button variant="default">Login</Button>
    </form>
    </div>
  );
}