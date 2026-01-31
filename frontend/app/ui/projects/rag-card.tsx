"use client";

import { useState } from "react";
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

interface RagCardProps {
	projectName: string;
	projectId: string;
	projectDescription: string;
	finished: boolean;
	relevant_topics: string[];
}

export default function RagCard({
	projectName,
	projectId,
	projectDescription,
	finished,
	relevant_topics,
}: RagCardProps) {
	const [apiKey, setApiKey] = useState("");
	const [tavilyApiKey, setTavilyApiKey] = useState("");
	const [topic, setTopic] = useState("");
	const [query, setQuery] = useState("");
	const [document, setDocument] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [response, setResponse] = useState<any | null>(null);
	const logoSrc = "/projects/rag_diagram.png";

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);

    if (!document) {
		setError("Please upload a PDF document");
		return;
    }

    const formData = new FormData();
	formData.append("gemini_api_key", apiKey);
	formData.append("tavily_api_key", tavilyApiKey);
	formData.append("documents_topic", topic);
	formData.append("question", query);
	formData.append("pdf", document);

	const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60_000);

    try {
		setLoading(true);
		const res = await fetch(`${BACKEND_URL_MAIN_API}/rag/query`, {
			method: "POST",
			body: formData,
			signal: controller.signal,
		});
		console.log(res);
		if (!res.ok) {
			throw new Error("RAG request failed");
		}

		const data = await res.json();
		setResponse(data);
		} catch (err) {
			if (err instanceof DOMException && err.name === "AbortError") {
				setError("The request took too long (timeout after 60s)");
			} else {
				setError(err instanceof Error ? err.message : "Unexpected error");
			}
		} finally {
			clearTimeout(timeoutId);
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
					alt="Lab Logo" 
					width={400} 
					height={160} 
					className="relative rounded-lg object-contain brightness-90 contrast-125"
				/>
				</div>
			</div>

			{/* <div className="p-6"> */}
				<Card >
				<CardHeader>
					<CardTitle className="font-mono text-blue-400 text-sm">
					&gt; RAG Interface
					</CardTitle>
					<CardDescription>
						Submit a query and document to run the RAG pipeline you must provide a Gemini API key, insert a PDF document
						to retrieve information from, specify the topic of the document, and enter your query.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit}>
					<div className="flex flex-col gap-6">
						<div className="grid gap-2">
						<Label htmlFor="apiKey">Gemini API Key</Label>
						<Input
							id="apiKey"
							type="password"
							required
							value={apiKey}
							onChange={(e) => setApiKey(e.target.value)}
						/>
						</div>
						
						<div className="grid gap-2">
						<Label htmlFor="tavilyApiKey">Tavily API Key (optional)</Label>
						<Input
							id="tavilyApiKey"
							type="password"
							value={tavilyApiKey}
							onChange={(e) => setTavilyApiKey(e.target.value)}
							placeholder=""
						/>
						</div>

						<div className="grid gap-2">
						<Label htmlFor="topic">Document topic</Label>
						<Input
							id="topic"
							type="text"
							required
							value={topic}
							onChange={(e) => setTopic(e.target.value)}
						/>
						</div>

						<div className="grid gap-2">
						<Label htmlFor="query">Query</Label>
						<Input
							id="query"
							type="text"
							required
							value={query}
							onChange={(e) => setQuery(e.target.value)}
						/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="document">Document (PDF)</Label>
							<Input
								id="document"
								type="file"
								accept="application/pdf"
								required
								onChange={(e) =>
									setDocument(e.target.files?.[0] || null)
								}
							/>
						</div>

						{error && (
							<p className="text-sm text-red-500">{error}</p>
						)}

						<Button type="submit" disabled={loading}>
							{loading ? "Running RAG..." : "Run RAG"}
						</Button>

						{response && (
							<div className="mt-6 rounded-lg border border-blue-500/20 bg-slate-900 p-4">
							<p className="mb-2 text-xs font-mono text-blue-400">
								&gt; RAG Response
							</p>
							<p className="mb-2 text-gray-400 leading-relaxed font-sans text-justify">
								<strong>Topic: </strong>{response.topic}
							</p>
							<p className="mb-2 text-gray-400 leading-relaxed font-sans text-justify">
								<strong>Source: </strong>{response.source}
							</p>
							<p className="mb-2 text-gray-400 leading-relaxed font-sans text-justify">
								<strong>Answer: </strong>{response.answer}
							</p>
							</div>
						)}
					</div>
					</form>
				</CardContent>
				</Card>
			{/* </div> */}
		</section>
    );
}
