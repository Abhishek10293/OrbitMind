"use client"

import { Button } from "@/src/components/ui/button";
import Image from "next/image"
import { useGoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { GetAuthUserData } from "@/src/Services/GlobalApi";
import { useContext } from "react";
import { AuthContext } from "@/context/authcontext";
import { useRouter } from 'next/navigation';


export default function SignInPage() {
const CreateUser=useMutation(api.users.CreateUser);
const {user,setUser}=useContext(AuthContext);
const router=useRouter();
const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    console.log(tokenResponse);
    if(typeof window !== 'undefined'){
    localStorage.setItem('user_token', tokenResponse.access_token);
    }
   const user=await GetAuthUserData(tokenResponse.access_token);
    console.log(user);
    const result=await CreateUser({
      name:user?.name,
      email:user?.email,
      picture:user.picture
    })
    setUser(result);
    router.replace('/ai_assistance');
    console.log(result);
  },
  onError: errorResponse => console.log(errorResponse),
});
  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section with a1 background */}
      <div
        className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 md:px-16 text-white"
        style={{ backgroundImage: "url('/a1.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <Image src="/logo.jpg" alt="Orbit Mind Logo" width={40} height={40} />
          <h1 className="text-2xl font-bold">
            <span className="text-cyan-400">Orbit</span> Mind
          </h1>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-mono font-bold text-center leading-snug">
          <span className="text-cyan-400">Orbit Mind</span> remembers,<br />so you don&apos;t have to!
        </h2>

        <p className="mt-4 text-cyan-300 text-center font-mono">
          Where every assistant is smarter than your group chat.
        </p>

        {/* Google Button */}
        <div className="mt-10">
          <Button onClick={()=>googleLogin()}className="bg-white text-black hover:bg-gray-100 flex items-center gap-3 px-6 py-6 text-lg rounded-xl shadow-lg">
            <Image src="/google.png" alt="Google logo" width={24} height={24} />
            Continue with Google
          </Button>
        </div>
      </div>

      {/* Right Section with a2 background */}
      <div
        className="w-full md:w-1/2 flex justify-center items-center px-6 py-12 text-white"
        style={{ backgroundImage: "url('/a2.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="max-w-md w-full">
          <h3 className="text-cyan-400 text-xl text-center mb-6">
            Olivia is here for handling your Emails
          </h3>

          {/* Mockup Card */}
          <div className="bg-zinc-900/80 backdrop-blur-md rounded-xl shadow-lg p-6 text-sm">
            <p className="mb-4 text-gray-300">
              When starting an email to a professor, it&apos;s essential to be professional, respectful,
              and clear in your communication. Here are some tips to help you get started:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-1">
              <li><span className="text-white">Use a formal greeting:</span> Dear Professor [Last Name]</li>
              <li><span className="text-white">Use a clear and concise subject line.</span></li>
              <li><span className="text-white">Introduce yourself:</span> Include your name, course & semester.</li>
              <li><span className="text-white">State the purpose of your email clearly.</span></li>
              <li><span className="text-white">Be respectful and polite.</span></li>
            </ul>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-6">
            <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
            <span className="w-3 h-3 rounded-full bg-gray-500"></span>
            <span className="w-3 h-3 rounded-full bg-gray-500"></span>
            <span className="w-3 h-3 rounded-full bg-gray-500"></span>
          </div>
        </div>
      </div>
    </main>
  )
}
