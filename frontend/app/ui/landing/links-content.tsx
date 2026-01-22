import { ContentDescriptor } from "@/app/ui/landing/content-descriptor";

export function LinksContents() {
	return (
		<div className="flex flex-col gap-8 items-center px-4 sm:px-10 md:px-20 lg:px-80 pt-1 pb-5">
			<ol className="flex flex-col gap-6">

				<ContentDescriptor title="About me" path="/about" iconName="FileUser">
					<p>
						Learn more about my background and download my resume here.
					</p>
				</ContentDescriptor>

				<ContentDescriptor title="Explore my portfolio's projects" path="/projects" iconName="BrainCircuit">
					<p>
						Check out some of the projects I have been working on.
					</p>
				</ContentDescriptor>
			</ol>
		</div>
	);
}