// pages/index.js
"use client";

import FloatingShape from './components/FloatingShape';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      
      {/* Floating Shapes */}
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />

      {/* Hero Section */}
      <div className="text-center text-white space-y-8 z-10">
        <h1 className="text-5xl font-bold">Food Detector</h1>
        <p className="text-lg text-gray-300 max-w-md mx-auto">
          Discover the suitability of foods based on dietary restrictions and health conditions.
        </p>
        
        <div className="space-x-4">
          <Link href="/signIn" className="px-6 py-3 bg-green-600 rounded-lg text-white font-medium hover:bg-green-700 transition duration-200">
            Sign In
          </Link>
          <Link href="/signUp" className="px-6 py-3 bg-emerald-600 rounded-lg text-white font-medium hover:bg-emerald-700 transition duration-200">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
