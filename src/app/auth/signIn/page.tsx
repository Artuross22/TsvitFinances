"use client";

import { Login } from "@/types/login";
import { signIn } from "@/utils/auth";
import { ChangeEvent, FC, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn } from "lucide-react";

const LoginProps: FC<Login> = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlerChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
    
      
      const result = await signIn({
        email: input.email,
        password: input.password,
      });
      
      router.push("/");
    } catch (error) {
      setError("Failed to sign in. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email and password to sign in
          </p>
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Email address"
                type="email"
                name="email"
                value={input.email}
                onChange={handlerChange}
              />
            </div>
          </div>
          
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Password"
                type="password"
                name="password"
                value={input.password}
                onChange={handlerChange}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <LogIn className="h-5 w-5" />
                <span>Sign In</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginProps;