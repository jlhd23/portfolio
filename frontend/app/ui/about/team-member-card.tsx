'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/app/ui/components/card';
import { Mail, Github, Link } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/app/ui/components/badge';

export type MemberInfo = {
	name?: string;
	description?: string;
	photograph?: string;
	email?: string;
	program: string[],
	institution: string[],
	githubProfileUrl?: string,
	webPageUrl?: string,
};

export default function TeamMemberCard({
	name,
	description,
	photograph,
	email,
	program,
	institution,
	githubProfileUrl,
	webPageUrl}: MemberInfo) {

	const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
		const target = e.target as HTMLImageElement;
		if (target.src !== "/people/person-standing.svg") {
			target.src = "/people/person-standing.svg";
		}
	};

	return (
		<div className="p-4 flex justify-center items-start">
		<Card className="w-full max-w-2xl">
			<CardContent className="p-6">
			<div className="flex gap-6">
				<div className="flex-shrink-0">
				<div className="relative w-32 h-32 overflow-hidden rounded-lg border bg-muted">
					<Image src=	{photograph || "/people/person-standing.svg"} 
						alt={`${name} profile picture`} width={128} height={128} 
						className="object-cover w-full h-full" onError={handleImageError} priority={false}
					/>
				</div>
				

				<div className="flex gap-3 justify-center mt-4">
				<a href={webPageUrl} target="_blank" rel="noopener noreferrer" 
					className="flex items-center justify-center w-8 h-8 rounded-full bg-background border hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
					aria-label={`${name}'s Web Page`}
				>
					<Link size={16} />
				</a>

				<a href={githubProfileUrl} target="_blank" rel="noopener noreferrer"
					className="flex items-center justify-center w-8 h-8 rounded-full bg-background border hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
					aria-label={`${name}'s GitHub profile`}
				>
					<Github size={16} />
				</a>

				<a href={`mailto:${email}`}
					className="flex items-center justify-center w-8 h-8 rounded-full bg-background border hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
					aria-label={`Send email to ${name}`}
				>
					<Mail size={16} />
				</a>
				</div>
				</div>

				<div className="flex-1 min-w-0">
					<CardHeader className="p-0 pb-4">
						<CardTitle className="text-xl">{name}</CardTitle>
						<div className="flex flex-col gap-2 mt-2">
							{institution.map((ins, index) => (<Badge key={index}>{ins}</Badge>))}
						</div>
						<div className="flex flex-col gap-2 mt-2">
							{program.map((prog, index) => (<Badge key={index}>{prog}</Badge>))}
						</div>
					</CardHeader>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground leading-relaxed">
							{description}
						</p>
					</div>
				</div>
			</div>
			</CardContent>
		</Card>
		</div>
	);
}