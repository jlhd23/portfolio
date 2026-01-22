"use client";

import TextType from '@/app/ui/components/title-text-type';
import { Divider } from "@heroui/divider";

export default function ProjectsPage() {

    const pageDescription = `Here you can find some of the projects and experiments that I have worked on, showcasing my skills and passion for technology. In the landing page of this portfolio I mentioned a web development project (this website), a RAG project using LangGraph and Gemini, and an OpenStreetMap POI visualizer, but this is just a small sample of what I have done.`;

    const ragProjectDescription = `This project involves building a Retrieval-Augmented Generation (RAG) system using LangGraph and Gemini. The system is designed to enhance the capabilities of language models by integrating them with a retrieval mechanism that allows them to access and utilize external data. For example you can upload a PDF document and then ask questions about its content, with the model providing accurate and contextually relevant answers based on the retrieved information. If the model does not know the answer, it will use a web search tool to find the answer online.`;

    const poiVisualizerDescription = `The OpenStreetMap POI visualizer is a web application that allows users to visualize points of interest (POIs) from OpenStreetMap data. The application provides an interactive map interface where users can explore various categories of POIs, such as restaurants, parks, museums, and more. Unfortunately, this project is still under construction.`;

    return (
        <main className="max-w-4xl mx-auto px-6 py-20">
            {/* Título Principal */}
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-extrabold dark:text-white">
                    <TextType 
                        text={["José Huerta's Lab Projects"]} 
                        typingSpeed={100} 
                        showCursor={true} 
                        cursorCharacter="|"
                    />
                </h1>
            </div>

            {/* Intro de la página */}
            <p className="text-gray-500 dark:text-gray-400 mb-12 text-justify text-lg italic">
                {pageDescription}
            </p>

            <div className="space-y-10">

                <section className="bg-slate-950 border border-blue-500/20 rounded-xl overflow-hidden shadow-2xl">

                    <div className="bg-slate-900/50 px-4 py-2 border-b border-blue-500/10 flex items-center justify-between">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-slate-700" />
                            <div className="w-3 h-3 rounded-full bg-slate-700" />
                            <div className="w-3 h-3 rounded-full bg-slate-700" />
                        </div>
                        <span className="text-[10px] font-mono text-blue-500/50 uppercase tracking-tighter">project_id: adaptive_rag</span>
                    </div>

                    <div className="p-6">
                        <h3 className="text-blue-400 font-mono text-xl mb-4 font-bold tracking-tight">
                            &gt; Adaptive RAG System
                        </h3>

						<div className="mt-6 flex gap-3 font-mono text-[10px] mb-4">
                            <span className="text-blue-500 bg-blue-500/5 px-2 py-1 rounded border border-blue-500/20">LANGGRAPH</span>
                            <span className="text-blue-500 bg-blue-500/5 px-2 py-1 rounded border border-blue-500/20">GEMINI API</span>
                            <span className="text-blue-500 bg-blue-500/5 px-2 py-1 rounded border border-blue-500/20">PYTHON</span>
                        </div>

                        <p className="text-gray-400 leading-relaxed font-sans text-justify">
                            {ragProjectDescription}
                        </p>
                    </div>
                </section>

                <Divider className="opacity-10" />

                <section className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-slate-700" />
                            <div className="w-3 h-3 rounded-full bg-slate-700" />
                            <div className="w-3 h-3 rounded-full bg-slate-700" />
                        </div>
                        <span className="text-[10px] font-mono text-slate-600 uppercase">status: under_construction</span>
                    </div>
                    <div className="p-6">
                        <h3 className="text-slate-300 font-mono text-xl mb-4 font-bold tracking-tight">
                            &gt; OSM POI Visualizer
                        </h3>

						<div className="mt-6 flex gap-3 font-mono text-[10px] mb-4">
                            <span className="text-slate-500 bg-slate-500/5 px-2 py-1 rounded border border-slate-800 uppercase tracking-widest">In Progress</span>
                        </div>

                        <p className="text-gray-500 leading-relaxed font-sans text-justify italic">
                            {poiVisualizerDescription}
                        </p>

                    </div>
                </section>
            </div>
        </main>
    );
}