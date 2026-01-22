'use client';
import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";
import Link from "next/link";

type LucideIconComponent = React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;

export function ContentDescriptor({ title, path, iconName, children,}: { 
	title: string; path:string; iconName: keyof typeof LucideIcons; children: React.ReactNode; }) {
	
	const Icon = LucideIcons[iconName] as LucideIconComponent;
	const ICON_SIZE = 16;

	return (
		<li className="relative">
			<Icon size={ICON_SIZE} className="absolute top-[3px] mr-2 peer text-muted-foreground" />
			<label htmlFor={title} className="relative text-base text-foreground peer-checked:line-through font-medium">
			<Link href={path}><span className="ml-8 cursor-pointer hover:underline">{title}</span></Link>
			<div className="ml-8 text-sm peer-checked:line-through font-normal text-muted-foreground">
				{children}
			</div>
			</label>
		</li>
	);
}