"use client";

import Link from "next/link";
import AuthButtons from "@/app/ui/components/auth-buttons";
import { Button } from "@/app/ui/components/button";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="fixed top-0 w-full flex justify-center border-b border-b-foreground/10 h-16 bg-background z-50 px-4 sm:px-6 md:px-10">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">

            <div className="flex gap-5 items-center font-semibold">
                <Link href="/">
                    <Image src="/logos/logo_lab.png" width={60} height={18} style={{ height: 'auto' }}
                        className="hidden md:block dark:hidden rounded-md" alt="jlhd23's Lab Logo"
                    />
                </Link>

            
                <Link href="/">
                    <Image src="/logos/logo_lab.png" width={60} height={18} style={{ height: 'auto' }}
                        className="hidden md:hidden dark:md:block rounded-md" alt="jlhd23's Lab Logo"
                    />
                </Link>
            <div className="hidden md:flex items-center gap-2">
                <Button asChild size="sm" variant={"outline"}>
                    <Link href="/about">About</Link>
                </Button>
                <Button asChild size="sm" variant={"outline"}>
                    <Link href="/projects">Projects</Link>
                </Button>
            </div>
            </div>

            <div className="hidden md:flex">
                <AuthButtons />
            </div>

            <button className="md:hidden flex items-center justify-center p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700" onClick={toggleMenu}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                    )
                }
            </svg>
            </button>
        </div>

        {isOpen && (
            <div className="absolute top-16 left-0 w-full bg-background border-b border-b-foreground/10 flex flex-col items-start gap-2 py-4 px-4 md:hidden">
                <Button asChild size="sm" variant={"outline"} className="w-full text-left">
                    <Link href="/about">About me</Link>
                </Button>
                    <Button asChild size="sm" variant={"outline"} className="w-full text-left">
                <Link href="/projects">Projects</Link>
                </Button>
                <div className="w-full justify-center items-center">
                    <AuthButtons />
                </div>
            </div>
        )}
        </nav>
    );
}