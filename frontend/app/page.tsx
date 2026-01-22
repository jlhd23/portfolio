import { Hero } from "@/app/ui/landing/hero";
import { LinksContents } from "./ui/landing/links-content";

export default function Home() {
	return (
		<main className="min-h-screen flex flex-col items-center">
		<div className="flex-1 w-full flex flex-col gap-20 items-center">
			{/* max-w-5xl w-full*/}
			<div className="flex-1 flex flex-col gap-20 w-full p-5">
				<Hero />
				<LinksContents/>
			</div>
		</div>
		</main>
	);
}
