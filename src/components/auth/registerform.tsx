"use client"

import { FormEvent, useState, useEffect } from "react";
import { useUser } from "@/context/user";
import { Button } from "../ui/button";
import { Input } from "../ui/input"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface RegisterFormProps {
    onRegisterSuccess: () => void;
}


export default function RegisterForm( {onRegisterSuccess}: RegisterFormProps ) {
    const user = useUser();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const registerUser = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
       user.actions.register(
        name,
        email,
        password,
        () => {},
        () => {}
       );

       toast.success("Welcome to Staycation! Your information is saved.");


       console.log({
        name,
        email,
        password,
       })
      };

      useEffect(() => {
        if (user.token) {
            onRegisterSuccess();
          }
        console.log("user token:", user.token);
      }, [user.token, onRegisterSuccess]);

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
        <form onSubmit={registerUser}>
    <Input
        placeholder="Name"
        type="name"
        value={name}
        onChange={(e) => setName(e.target.value as string)}
      />
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
      <Button variant="default">Register</Button>
    </form>
    </div>
    )
}