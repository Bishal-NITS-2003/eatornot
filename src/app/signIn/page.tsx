"use client"; // This marks this component as a client-side component

import { useRouter } from "next/navigation";
import FloatingShape from "../components/FloatingShape";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import Link from "next/link"; // Use next/link for navigation
import { useState } from "react";
import Input from "../components/Input";


const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);  // To handle loading state
  const [error, setError] = useState(null);  // To handle error state



  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Data to be sent to the API
    const requestData = {
      email,
      password,
    };

    console.log(requestData);  // Log the data to be sent

    setLoading(true);  // Set loading state to true
    setError(null);    // Clear any previous error

    try {
      // Making the API call
      const response = await fetch("/api/signIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        // If response is not ok, handle the error based on the server&apos;s response
        throw new Error(data.message || "Something went wrong.");
      }
      // On successful login, redirect to the dashboard page
      router.push("/dashboard");  // Use the router to navigate to the dashboard page

    } catch (error) {
      // Handle error and set error message in state
      setError(error.message);  // Set error message in state
    } finally {
      setLoading(false);  // Set loading state to false after request
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Welcome Back
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleLogin}>
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center mb-6">
            <Link href="/forgot-password" className="text-sm text-green-400 hover:underline">
              Forgot password?
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            type="submit"
            disabled={loading} // Disable button while loading
          >
             {loading ? "Logging In..." : "Login"}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/signUp" className="text-green-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
    </div>
  );
}

export default SignIn;