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

export function LoginForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	const [email, setEmail] = useState("jlhuertad@gmail.com");
	const [password, setPassword] = useState("securepassword");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth();
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
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
			<CardTitle className="text-2xl">Login</CardTitle>
			<CardDescription>
				Enter your email below to login to your account
			</CardDescription>
			</CardHeader>
			<CardContent>
			<form onSubmit={handleLogin}>
				<div className="flex flex-col gap-6">
				<div className="grid gap-2">
					<Label htmlFor="email">Email</Label>
					<Input
					id="email"
					type="email"
					placeholder="jlhuertad@gmail.com/jlhuerta@uc.cl"
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
				{error && <p className="text-sm text-red-500">{error}</p>}
				<Button type="submit" className="w-full" disabled={isLoading}>
					{isLoading ? "Logging in..." : "Login"}
				</Button>
				</div>
				<div className="mt-4 text-center text-sm">
				Don&apos;t have an account?{" "}
				<Link
					href="/auth/sign-up"
					className="underline underline-offset-4"
				>
					Sign up
				</Link>
				</div>
			</form>
			</CardContent>
		</Card>
		</div>
	);
}
