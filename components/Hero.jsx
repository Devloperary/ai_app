"use client";
import React from "react";
import { useRouter } from "next/navigation";
import FancyButton from "@/components/ui/FancyButton";
import { Boxes } from "@/components/ui/background-boxes";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export default function Hero() {
    const router = useRouter();

    return (


        <div
            className="min-h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center"
        >
            <div
                className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none"
            />

            <Boxes />

            <header className="z-30 flex justify-end items-center p-4 gap-4 h-16 bg-transparent absolute top-2 w-full">
                <SignedOut>
                    <SignInButton><button className="bg-[#ffffff] text-black rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                            Sign In
                        </button></SignInButton>
                    <SignUpButton>
                        <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                            Sign Up
                        </button>
                    </SignUpButton>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </header>
            <h1
                className="text-4xl md:text-6xl font-bold text-white text-center relative z-50"
            >
                Welcome to Your AI Assistant
            </h1>
            <p
                className="text-center mt-2 text-neutral-300 text-sm md:text-xl font-medium max-w-3xl bg-clip-text bg-zinc-500 opacity-50 relative z-20"
            >
                Unlock your full potential with the limitless power of AI—your intelligent
                partner in learning, productivity, and innovation.
            </p>

            <div className="btn p-10 flex lg:flex-row items-center justify-center gap-4 sm:flex-col">
                <div className="mt-4">
                    <FancyButton onClick={() => router.push("/chat")}>Start Journey</FancyButton>
                </div>
            </div>





        </div>
    );
}
