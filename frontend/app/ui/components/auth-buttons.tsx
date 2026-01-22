import Link from "next/link";
import { Button } from "@/app/ui/components/button";
import ThemeSwitcher from "@/app/ui/components/theme-switcher";

export default function AuthButtons() {
    return (
        <div className="flex gap-2">
            <ThemeSwitcher/>
            <Button asChild size="sm" variant={"outline"}>
                <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild size="sm" variant={"default"}>
                <Link href="/auth/sign-up">Sign up</Link>
            </Button>
        </div>
    );
}