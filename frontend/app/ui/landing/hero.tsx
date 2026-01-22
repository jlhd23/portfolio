'use client';
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";
import CarouselLanding from "@/app/ui/landing/carousel";
import TextType from "@/app/ui/components/title-text-type";

export function Hero() {
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	if (!mounted) return null;

	const logoSrc = "/logos/logo_lab.png";
	return (


		<div className="flex flex-col gap-8 items-center px-4 sm:px-10 md:px-20 lg:px-80 pt-20 pb-3">

			<h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
				<TextType text={["José Huerta's Lab"]} typingSpeed={120} pauseDuration={1500} showCursor={true} cursorCharacter="|"/>
			</h1>

			<section className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">

				<div className="bg-slate-900/50 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
					<div className="flex gap-1.5">
					<div className="w-3 h-3 rounded-full bg-blue-500/20 border border-blue-500/40" />
					<div className="w-3 h-3 rounded-full bg-slate-700" />
					<div className="w-3 h-3 rounded-full bg-slate-700" />
					</div>
					<span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">readme.md</span>
				</div>

				<div className="p-6 md:p-8">

					<p className="mb-8 text-gray-400 text-justify leading-relaxed">
					Hi! My name is José Huerta (or <a 
						href="https://github.com/jlhd23" 
						target="_blank" 
						rel="noopener noreferrer" 
						className="font-semibold text-gray-200 hover:text-blue-400 hover:underline transition-colors"
					>
						jlhd23
					</a> on GitHub) and this is my portfolio. Here, you will find a compilation
					of projects and experiments that showcase my skills and passion for technology. 
					Feel free to explore.
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-y border-slate-900 py-8 my-6">
					
					<div className="flex flex-col gap-4">
						<div className="mt-6 flex gap-3 font-mono text-xs">
                            <span className="text-blue-500 bg-blue-500/5 px-2 py-1 rounded border border-blue-500/20">Main Projects</span>
                        </div>
						<ul className="space-y-3 text-gray-400">
						<li className="flex items-center gap-3 text-sm">
							<span className="text-blue-500 font-bold">→</span>
							Web development (this website)
						</li>
						<li className="flex items-center gap-3 text-sm">
							<span className="text-blue-500 font-bold">→</span>
							RAG (using LangGraph and Gemini)
						</li>
						<li className="flex items-start gap-3 text-sm">
							<span className="text-blue-500 font-bold">→</span>
							<span>
							OpenStreetMap POI visualizer 
							<span className="ml-2 text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded uppercase font-mono">
								Work in progress
							</span>
							</span>
						</li>
						</ul>
					</div>

					<div className="flex justify-center">
						<div className="relative group">
						<div className="absolute -inset-1 bg-blue-500/20 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
						<Image 
							src={logoSrc} 
							alt="Lab Logo" 
							width={200} 
							height={80} 
							className="relative rounded-lg object-contain brightness-90 contrast-125"
						/>
						</div>
					</div>
					</div>

					<p className="text-gray-500 text-sm italic font-mono flex items-center gap-2">
					<span className="animate-pulse">●</span> 
					Here are some screenshots of these projects.
					</p>
				</div>
			</section>
			<CarouselLanding/>
		</div>
	);
}