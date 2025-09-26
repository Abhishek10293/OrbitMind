"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  const handleOnClick = () => {
    router.push('/sign-in');
  }


  return (
     <div
        className="fixed top-0 left-0 w-full h-[100vh] -z-10 bg-cover bg-center transition-opacity duration-500"
        style={{
          backgroundImage: "url('/banner.png')",
        }}
      >
        <div
          className = 'flex flex-col justify-center items-center gap-6 pr-3 mr-10 mt-[80vh]'
        >
          <Button 
            className = 'bg-cyan-300 hover:bg-cyan-500 cursor-pointer'
            onClick = {handleOnClick}
          >
            Get Started
          </Button>
          <div 
            className = 'text-center text-cyan-500 text-md font-mono font-light flex flex-col gap-3'
          >
            <div>
              Developed By :  Abhishek Singh Rathod
            </div>
            <a href = "https://github.com/Abhishek10293/OrbitMind">
              <div 
                className = 'flex gap-2 items-center justify-center'
              >
                <Image 
                  src = {'/github.png'}
                  alt = {'github'}
                  height = {60}
                  width = {60}
                  className = 'object-cover h-[20px] w-[20px] cursor-pointer'
                />
                <h3 className = 'text-md'>Code</h3>
              </div>
            </a>
          </div>
        </div>
      </div>
  );
}
