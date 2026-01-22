"use client";

import TextType from '@/app/ui/components/title-text-type';
import { Download, Github, Languages, Code, BrainCircuit, FolderCode, Database, Server, 
  PackageOpen, Mails } from 'lucide-react';
import { Button } from "@/app/ui/components/button";
import Image from 'next/image';
import { Accordion, AccordionItem } from "@heroui/accordion";

export default function About() {

  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      {/* Título Centrado */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold dark:text-white">
          <TextType 
            text={["Hi, I'm José Huerta"]} 
            typingSpeed={120} 
            pauseDuration={1500} 
            showCursor={true} 
            cursorCharacter="|"
          />
        </h1>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        <div className="w-full">
          <Accordion variant="splitted" selectionMode="multiple" className="px-0">
            <AccordionItem 
              key="1" 
              title="About me" 
              classNames={{ title: "font-bold", content: "pl-2 pr-0 pb-4 text-justify text-gray-500 dark:text-gray-400" }}
            >
            I am a Software Engineer and AI Developer. I hold a B.Sc. in Industrial Engineering with a Diploma in 
            Computer Science from Pontificia Universidad Católica de Chile, where I am also pursuing a Master of 
            Engineering Science in Computer Science, specializing in Artificial Intelligence.
            
            I enjoy building projects that merge software development and AI to create innovative solutions.
            </AccordionItem>

            <AccordionItem 
              key="2" 
              title="Tech Stack and Skills" 
              classNames={{ title: "font-bold", content: "pl-2 pr-0 pb-4 text-gray-500 dark:text-gray-400" }}
            >
              <ul className="list-disc list-inside space-y-1">
                <li className="flex items-start gap-3 group">
                  <div className="shrink-0 mt-1">
                    <Languages size={20} className="text-muted-foreground group-hover:text-blue-500 transition-colors" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-base font-medium text-foreground leading-tight">Languages</span>
                    <div className="text-sm font-normal text-muted-foreground">Spanish (native), English (B2)</div>
                  </div>
                </li>

                <li className="flex items-start gap-3 group">
                  <div className="shrink-0 mt-1">
                    <Code size={20} className="text-muted-foreground group-hover:text-blue-500 transition-colors" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-base font-medium text-foreground leading-tight">Programming languages</span>
                    <div className="text-sm font-normal text-muted-foreground">C, C#, JavaScript, Python, Ruby, TypeScript</div>
                  </div>
                </li>

                <li className="flex items-start gap-3 group">
                  <div className="shrink-0 mt-1">
                    <BrainCircuit size={20} className="text-muted-foreground group-hover:text-blue-500 transition-colors" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-base font-medium text-foreground leading-tight">AI/ML</span>
                    <div className="text-sm font-normal text-muted-foreground">OpenCV, GeoPandas, Keras, NetworkX, NumPy, Pandas, PyTorch, DSPy, LangChain, LangGraph, Retrieval-Augmented Generation (RAG), ultralytics.</div>
                  </div>
                </li>

                <li className="flex items-start gap-3 group">
                  <div className="shrink-0 mt-1">
                    <FolderCode size={20} className="text-muted-foreground group-hover:text-blue-500 transition-colors" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-base font-medium text-foreground leading-tight">Web development</span>
                    <div className="text-sm font-normal text-muted-foreground">Express, FastAPI, Firebase, Koa, Next.js, React Native, Ruby on Rails.</div>
                  </div>
                </li>

                <li className="flex items-start gap-3 group">
                  <div className="shrink-0 mt-1">
                    <Database size={20} className="text-muted-foreground group-hover:text-blue-500 transition-colors" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-base font-medium text-foreground leading-tight">Databases</span>
                    <div className="text-sm font-normal text-muted-foreground">MySQL, PostgreSQL, SQLite, Firestore, MongoDB.</div>
                  </div>
                </li>

                <li className="flex items-start gap-3 group">
                  <div className="shrink-0 mt-1">
                    <Server size={20} className="text-muted-foreground group-hover:text-blue-500 transition-colors" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-base font-medium text-foreground leading-tight">Cloud</span>
                    <div className="text-sm font-normal text-muted-foreground">AWS (EC2, S3, API Gateway, Lambda).</div>
                  </div>
                </li>

                <li className="flex items-start gap-3 group">
                  <div className="shrink-0 mt-1">
                    <PackageOpen size={20} className="text-muted-foreground group-hover:text-blue-500 transition-colors" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-base font-medium text-foreground leading-tight">Tools</span>
                    <div className="text-sm font-normal text-muted-foreground">Git, Docker</div>
                  </div>
                </li>

              </ul>
            </AccordionItem>

            <AccordionItem 
              key="3" 
              title="Contact Me" 
              classNames={{ title: "font-bold", content: "pl-2 pr-0 pb-4 text-gray-500 dark:text-gray-400" }}
            >
              <ul className="list-disc list-inside space-y-1">
                <li className="flex items-start gap-3 group">
                  <div className="shrink-0 mt-1">
                    <Mails size={20} className="text-muted-foreground group-hover:text-blue-500 transition-colors" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-base font-medium text-foreground leading-tight">Email</span>
                    <div className="text-sm font-normal text-muted-foreground">jlhuertad@gmail.com — jlhuerta@uc.cl</div>
                  </div>
                </li>
                
                <li className="flex items-start gap-3 group">
                  <div className="shrink-0 mt-1">
                    <Github size={20} className="text-muted-foreground group-hover:text-blue-500 transition-colors" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-base font-medium text-foreground leading-tight">GitHub</span>
                    <div className="text-sm font-normal text-muted-foreground">
                      <a 
                        href="https://github.com/jlhd23" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="font-semibold text-inherit hover:underline decoration-blue-500/50"
                      >
                        jlhd23
                      </a>
                    </div>
                  </div>
                </li>

              </ul>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden border-2 border-blue-500/20 shadow-2xl bg-gray-800">
            <Image
              src="/about/profile_photo.jpeg"
              alt="José Huerta"
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-cover"
              priority
            />
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/jlhd23" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-gray-700 hover:bg-blue-500 hover:text-white transition-all duration-300"
            >
              <Github size={20} />
            </a>
            
            <Button asChild variant="outline" className="border-gray-700">
              <a href="/about/cv_jose_huerta.pdf" download className="flex items-center gap-2">
                Download CV <Download size={18} />
              </a>
            </Button>
          </div>
        </div>

      </div>
    </main>
  );
}