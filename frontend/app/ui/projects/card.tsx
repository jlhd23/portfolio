"use client";

interface ProjectCardProps {
	projectName: string;
	projectId: string;
	projectDescription: string;
	finished: boolean;
	relevant_topics: string[];
}

export default function ProjectCard({
	projectName,
	projectId,
	projectDescription,
	finished,
	relevant_topics,}: ProjectCardProps) {
    return (
		<>
			<div className="bg-slate-900/50 px-4 py-2 border-b border-blue-500/10 flex items-center justify-between">
				<div className="flex gap-1.5">
					<div className="w-3 h-3 rounded-full bg-slate-700" />
					<div className="w-3 h-3 rounded-full bg-slate-700" />
					<div className="w-3 h-3 rounded-full bg-slate-700" />
				</div>
				{finished ? <span className="text-[10px] font-mono text-white-500/50 uppercase tracking-tighter">project_id: {projectId}</span> :
					<span className="text-[10px] font-mono text-white-slate-600 uppercase">status: under_construction</span>}
			</div>

			<div className="p-6">
				<h3 className="text-blue-400 font-mono text-xl mb-4 font-bold tracking-tight">
					&gt; {projectName}
				</h3>

				<div className="mt-6 flex gap-3 font-mono text-[10px] mb-4">

					{finished ? (relevant_topics.map((topic) => (
						<span key={topic} className="text-blue-500 bg-blue-500/5 px-2 py-1 rounded border border-blue-500/20">
							{topic}
						</span>
						))) : (
						<span className="text-slate-500 bg-slate-500/5 px-2 py-1 rounded border border-slate-800 uppercase tracking-widest">
							In Progress
						</span>
					)}
				</div>

				<p className="text-gray-400 leading-relaxed font-sans text-justify">
					{projectDescription}
				</p>
			</div>
		</>
    );
}