"use client";

import Image from "next/image";
import { cn } from "@/app/lib/utils";

type UserBadgeProps = {
	name: string;
	role: string;
	avatarUrl: string;
	className?: string;
};

export function UserBadge({
	name,
	role,
	avatarUrl,
	className,
}: UserBadgeProps) {
	return (
		<div
		className={cn(
			"flex items-center gap-3 rounded-full bg-black/80 px-4 py-2",
			className
		)}
		>
		<div className="relative h-9 w-9 overflow-hidden rounded-full">
			<Image
				src={avatarUrl}
				alt={name}
				fill
				className="object-cover"
			/>
		</div>

		<div className="leading-tight">
			<p className="text-sm font-semibold text-white">{name}</p>
			<p className="text-xs text-white/70">{role}</p>
		</div>
		</div>
	);
}
