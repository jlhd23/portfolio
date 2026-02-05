"use client";

import { useState, useRef } from "react";
import ProjectCard from "@/app/ui/projects/card";
import { BACKEND_URL_MAIN_API } from "@/app/params";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/app/ui/components/card";
import Image from "next/image";
import { Button } from "@/app/ui/components/button";
import { Input } from "@/app/ui/components/input";
import { Label } from "@/app/ui/components/label";
import { Mic, Square, Send, Loader2, Sparkles } from "lucide-react";

interface VoiceAgentCardProps {
	projectName: string;
	projectId: string;
	projectDescription: string;
	finished: boolean;
	relevant_topics: string[];
}

export default function VoiceAgentCard({
	projectName,
	projectId,
	projectDescription,
	finished,
	relevant_topics,
}: VoiceAgentCardProps) {
	const [apiKey, setApiKey] = useState("");
	const [tavilyApiKey, setTavilyApiKey] = useState("");
	const [groqApiKey, setGroqApiKey] = useState("");

	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [transcribing, setTranscribing] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [response, setResponse] = useState<any | null>(null);

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);

	const logoSrc = "/projects/voice_agent_diagram.png";

	async function startRecording() {
		try {
			setError(null);
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorderRef.current = new MediaRecorder(stream);
			chunksRef.current = [];

			mediaRecorderRef.current.ondataavailable = (e) => {
				if (e.data.size > 0) {
					chunksRef.current.push(e.data);
				}
			};

			mediaRecorderRef.current.onstop = async () => {
				const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
				await handleTranscribe(audioBlob);

				// Stop all tracks to release microphone
				stream.getTracks().forEach(track => track.stop());
			};

			mediaRecorderRef.current.start();
			setIsRecording(true);
		} catch (err) {
			console.error("Error accessing microphone:", err);
			setError("Could not access microphone. Please ensure permissions are granted.");
		}
	}

	function stopRecording() {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
		}
	}

	async function handleTranscribe(audioBlob: Blob) {
		if (!groqApiKey) {
			setError("Please enter your Groq API Key to transcribe audio.");
			return;
		}

		setTranscribing(true);
		try {
			const formData = new FormData();
			formData.append("file", audioBlob, "recording.webm");
			formData.append("groq_api_key", groqApiKey);

			// Note: Assuming BACKEND_URL_MAIN_API does not have trailing slash, adjust if needed
			const res = await fetch(`${BACKEND_URL_MAIN_API}/voice-agent/transcribe`, {
				method: "POST",
				body: formData,
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.detail || "Transcription failed");
			}

			const data = await res.json();
			setQuery(data.transcription);
		} catch (err: any) {
			setError(err.message || "An error occurred during transcription");
		} finally {
			setTranscribing(false);
		}
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);

		if (!apiKey) {
			setError("Please provide Gemini API Key");
			return;
		}
		if (!tavilyApiKey) {
			setError("Please provide Tavily API Key");
			return;
		}
		if (!query.trim()) {
			setError("Please enter a query or record audio");
			return;
		}

		setLoading(true);
		setResponse(null);

		try {
			const payload = {
				query: query,
				gemini_api_key: apiKey,
				tavily_api_key: tavilyApiKey
			};

			const res = await fetch(`${BACKEND_URL_MAIN_API}/voice-agent/chat`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.detail || "Chat request failed");
			}

			const data = await res.json();
			setResponse(data);
		} catch (err: any) {
			setError(err.message || "An error occurred while communicating with the agent");
		} finally {
			setLoading(false);
		}
	}

	return (
		<section className="bg-slate-950 border border-blue-500/20 rounded-xl overflow-hidden shadow-2xl">
			<ProjectCard
				projectName={projectName}
				projectId={projectId}
				projectDescription={projectDescription}
				finished={finished}
				relevant_topics={relevant_topics}
			/>

			<div className="flex justify-center mb-10">
				<div className="relative group">
					<div className="absolute -inset-1 bg-blue-500/20 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
					<Image
						src={logoSrc}
						alt="Voice Agent Logic"
						width={800}
						height={320}
						className="relative rounded-lg object-contain brightness-90 contrast-125"
					/>
				</div>
			</div>

			<Card className="border-0 bg-transparent shadow-none">
				<CardHeader>
					<CardTitle className="font-mono text-blue-400 text-sm">
						&gt; Voice Agent Interface
					</CardTitle>
					<CardDescription>
						First, enter your API keys. Then, use the microphone button to record your question.
						The audio will be transcribed using Groq (Whisper). You can edit the transcription if needed.
						Finally, send the query to the agent which uses Gemini 2.5 and Tavily to answer based on the curriculum or web search.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<div className="flex flex-col gap-6">
						{/* API Keys Section */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="apiKey">Gemini API Key</Label>
								<Input
									id="apiKey"
									type="password"
									value={apiKey}
									onChange={(e) => setApiKey(e.target.value)}
									placeholder="Required"
									className="bg-slate-900/50 border-slate-800"
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="tavilyApiKey">Tavily API Key</Label>
								<Input
									id="tavilyApiKey"
									type="password"
									value={tavilyApiKey}
									onChange={(e) => setTavilyApiKey(e.target.value)}
									placeholder="Required"
									className="bg-slate-900/50 border-slate-800"
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="groqApiKey">Groq API Key</Label>
								<Input
									id="groqApiKey"
									type="password"
									value={groqApiKey}
									onChange={(e) => setGroqApiKey(e.target.value)}
									placeholder="Required for Audio"
									className="bg-slate-900/50 border-slate-800"
								/>
							</div>
						</div>

						{/* Audio Recording Section */}
						<div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/30 gap-4">
							<div className="text-center space-y-2">
								<p className="text-sm text-slate-400">
									{isRecording ? "Recording... Click stop when done." : "Click microphone to start recording"}
								</p>
								<p className="text-xs text-slate-500 font-mono">
									{transcribing ? "Transcribing audio..." : ""}
								</p>
							</div>

							<Button
								type="button"
								variant={isRecording ? "destructive" : "default"}
								size="lg"
								className={`rounded-full w-16 h-16 transition-all duration-300 ${isRecording ? 'animate-pulse scale-110' : 'hover:scale-105'}`}
								onClick={isRecording ? stopRecording : startRecording}
								disabled={transcribing}
							>
								{transcribing ? (
									<Loader2 className="w-8 h-8 animate-spin" />
								) : isRecording ? (
									<Square className="w-8 h-8 fill-current" />
								) : (
									<Mic className="w-8 h-8" />
								)}
							</Button>
						</div>

						{/* Query Form */}
						<form onSubmit={handleSubmit} className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Label htmlFor="query">Your Query (Transcript)</Label>
								<div className="relative">
									<textarea
										id="query"
										value={query}
										onChange={(e) => setQuery(e.target.value)}
										className="flex min-h-[80px] w-full rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
										placeholder="Record audio or type your question here..."
									/>
								</div>
							</div>

							{error && (
								<p className="text-sm text-red-400 bg-red-950/20 p-3 rounded border border-red-900/50">
									{error}
								</p>
							)}

							<Button
								type="submit"
								disabled={loading || !query.trim()}
								className="w-full bg-white hover:bg-gray-200 text-black font-semibold py-6"
							>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Processing with Agent...
									</>
								) : (
									<>
										<Send className="mr-2 h-4 w-4" />
										Send to Agent
									</>
								)}
							</Button>
						</form>

						{/* Response Section */}
						{response && (
							<div className="mt-2 rounded-xl border border-blue-500/20 bg-slate-900/80 p-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="flex items-center gap-2 mb-4 border-b border-blue-500/10 pb-4">
									<Sparkles className="w-5 h-5 text-blue-400" />
									<h3 className="font-semibold text-blue-100">Agent Response</h3>
								</div>

								<div className="space-y-4">

									<div className="bg-slate-950/30 p-4 rounded-lg border border-slate-800/50">
										<p className="text-green-500 font-mono text-xs mb-2">&gt; ANSWER</p>
										<p className="text-slate-300 leading-relaxed text-justify whitespace-pre-wrap">
											{response.answer}
										</p>
									</div>

									{response.retrieved_docs && response.retrieved_docs.length > 0 && (
										<div className="mt-4">
											<p className="text-xs font-mono text-slate-500 mb-2">RETRIEVED CONTEXT</p>
											<div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
												{response.retrieved_docs.map((doc: any, i: number) => (
													<div key={i} className="text-xs bg-slate-950/50 p-2 rounded border border-slate-800 text-slate-400">
														{doc.page_content.substring(0, 1000)}...
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
