"use client";
import { Login } from "@/types/login";
import { signIn } from "@/utils/auth";
import { ChangeEvent, FC, useState } from "react";

import { useRouter } from "next/navigation";

const LoginProps: FC<Login> = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handlerChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async () => {
    try {
      const result = await signIn({
        email: input.email,
        password: input.password,
      });
      console.log(result);

      router.push("/");
    } catch (error) {
      setError(
        "Failed to sign in. Please check your credentials and try again.",
      );
    }
  };

  return (
    <div>
      <input
        placeholder="email"
        type="text"
        name="email"
        value={input.email}
        onChange={handlerChange}
      />
      <input
        placeholder="password"
        type="password"
        name="password"
        value={input.password}
        onChange={handlerChange}
      />
      <button type="button" onClick={handleSignIn}>
        Sign In
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default LoginProps;
