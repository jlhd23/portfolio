"use client";

import TextType from '@/app/ui/components/title-text-type';
import { Divider } from "@heroui/divider";
import RagCard from '@/app/ui/projects/rag-card';
import VoiceAgentCard from '@/app/ui/projects/voice-agent-card';
import { useState, useRef } from 'react';

export default function ProjectsPage() {

    const pageDescription = `Here you can find some of the projects and experiments that I have worked on, showcasing my skills and passion for technology. In the landing page of this portfolio I mentioned a web development project (this website), a RAG project using LangGraph and Gemini, and an OpenStreetMap POI visualizer, but this is just a small sample of what I have done.`;
    const ragProjectDescription = `This project involves building a Retrieval-Augmented Generation (RAG) system using LangGraph and Gemini. The system is designed to enhance the capabilities of language models by integrating them with a retrieval mechanism that allows them to access and utilize external data. For example you can upload a PDF document and then ask questions about its content, with the model providing accurate and contextually relevant answers
    based on the retrieved information. If the model does not know the answer, it will use a web search tool to find the answer online. Below, you can see a diagram of the RAG orchestration flow.`;
    const voiceAgentDescription = `The Voice Agent is a voice assistant that allows users to interact with it using natural language. The agent can answer questions about José's resume or search the web (if the question is not about his resume). Below, you can see a diagram of the Voice Agent orchestration flow.`;

    return (
        <main className="max-w-4xl mx-auto px-6 py-20">
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

            <p className="text-gray-500 dark:text-gray-400 mb-12 text-justify text-lg italic">
                {pageDescription}
            </p>

            <div className="space-y-10">
                <RagCard
                    projectName="Adaptive RAG System"
                    projectId="adaptive_rag"
                    projectDescription={ragProjectDescription}
                    finished={true}
                    relevant_topics={["LANGGRAPH", "GEMINI API", "RAG"]}
                />

                <Divider className="opacity-10" />

                <VoiceAgentCard
                    projectName="Voice Agent"
                    projectId="voice_agent"
                    projectDescription={voiceAgentDescription}
                    finished={true}
                    relevant_topics={["LANGGRAPH", "GEMINI API", "SPEECH RECOGNITION", "WHISPR FLOW"]}
                />

                <Divider className="opacity-10" />
            </div>
        </main>
    );
}