"use client";

import { cn } from "@/app/lib/utils";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/app/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/app/ui/components/card";
import { Input } from "@/app/ui/components/input";
import { Label } from "@/app/ui/components/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	const [email, setEmail] = useState("jlhuertad@gmail.com");
	const [password, setPassword] = useState("securepassword");
	const [repeatPassword, setRepeatPassword] = useState("securepassword");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { login } = useAuth();

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		login();
		setTimeout(() => {
			router.push("/");
		}, 500);
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
		<Card>
			<CardHeader>
			<CardTitle className="text-2xl">Sign up</CardTitle>
			<CardDescription>Create a new account</CardDescription>
			</CardHeader>
			<CardContent>
			<form onSubmit={handleSignUp}>
				<div className="flex flex-col gap-6">
				<div className="grid gap-2">
					<Label htmlFor="email">Email</Label>
					<Input
					id="email"
					type="email"
					placeholder="jlhuertad@gmail.com"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className="grid gap-2">
					<div className="flex items-center">
					<Label htmlFor="password">Password</Label>
					</div>
					<Input
					id="password"
					type="password"
					placeholder="secure-password"
					required
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<div className="grid gap-2">
					<div className="flex items-center">
					<Label htmlFor="repeat-password">Repeat Password</Label>
					</div>
					<Input
					id="repeat-password"
					type="password"
					required
					value={repeatPassword}
					onChange={(e) => setRepeatPassword(e.target.value)}
					/>
				</div>
				{error && <p className="text-sm text-red-500">{error}</p>}
				<Button type="submit" className="w-full" disabled={isLoading}>
					{isLoading ? "Creating an account..." : "Sign up"}
				</Button>
				</div>
				<div className="mt-4 text-center text-sm">
				Already have an account?{" "}
				<Link href="/auth/login" className="underline underline-offset-4">
					Login
				</Link>
				</div>
			</form>
			</CardContent>
		</Card>
		</div>
	);
}
