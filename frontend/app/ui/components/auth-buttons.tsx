import Link from "next/link";
import { Button } from "@/app/ui/components/button";
import ThemeSwitcher from "@/app/ui/components/theme-switcher";
import { UserBadge } from "@/app/ui/components/user-badge";
import { useAuth } from "@/app/context/AuthContext";
import {User} from "@heroui/react";

export default function AuthButtons() {
    const { isAuthenticated, logout } = useAuth();
    return (
        <div className="flex gap-2">
            {isAuthenticated ? (
                <div className="flex items-center gap-3">
                    <UserBadge
                        name="José Huerta"
                        role="Software & AI Developer"
                        avatarUrl="/about/profile_photo.jpeg"
                    />

                    <Button variant="default" size="sm" onClick={logout}>
                        Logout
                    </Button>
                </div>
                ) : (
                    <>
                        <Button asChild size="sm" variant={"outline"}>
                            <Link href="/auth/login">Sign in</Link>
                        </Button>
                        <Button asChild size="sm" variant={"default"}>
                            <Link href="/auth/sign-up">Sign up</Link>
                        </Button>
                    </>
            )}
        </div>
    );
}