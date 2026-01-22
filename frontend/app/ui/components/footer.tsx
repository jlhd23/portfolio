import React from "react";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="w-full flex flex-col md:flex-row items-center justify-center text-center md:text-center gap-4 md:gap-8 py-6 px-4 border-t bg-background">
            <p className="text-xs md:text-sm">
                Powered by{" "}
                <span className="font-bold">José Huerta's Lab</span>
            </p>

            <div className="flex items-center gap-4 mt-2 md:mt-0">
                <Image src="/logos/logo_white_background.png" width={60} height={24} className="hidden md:block dark:hidden rounded-md" alt="logo white background"/>
                <Image src="/logos/logo_black_background.png" width={60}height={24} className="hidden md:hidden dark:md:block rounded-md" alt="logo black background"/>
            </div>
        </footer>
    );
}