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
    formData.append("topic", topic);
    formData.append("query", query);
    formData.append("document", document);

    try {
		setLoading(true);
		console.log(formData.get("document"));
		console.log(formData.get("topic"));
		console.log(formData.get("query"));
		console.log(formData.get("gemini_api_key"));
		console.log(formData.get("tavily_api_key"));
		console.log(`${BACKEND_URL_MAIN_API}/rag`)
		const res = await fetch(`${BACKEND_URL_MAIN_API}/rag/query`, {
			method: "POST",
			body: formData,
		});
		console.log(res);
		if (!res.ok) {
			throw new Error("RAG request failed");
		}

		const data = await res.json();
		console.log("RAG response:", data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unexpected error");
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

			{/* <div className="p-6"> */}
				<Card>
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
							placeholder="Only needed for web search"
						/>
						</div>

						<div className="grid gap-2">
						<Label htmlFor="topic">Topic</Label>
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
					</div>
					</form>
				</CardContent>
				</Card>
			{/* </div> */}
		</section>
    );
}
