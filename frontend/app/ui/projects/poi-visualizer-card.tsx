"use client";

import ProjectCard from "@/app/ui/projects/card";

interface RagCardProps {
	projectName: string;
	projectId: string;
	projectDescription: string;
	finished: boolean;
	relevant_topics: string[];
}

export default function PoiVisualizerCard({
	projectName,
	projectId,
	projectDescription,
	finished,
	relevant_topics,
}: RagCardProps) {

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

			{/* </div> */}
		</section>
	);
}