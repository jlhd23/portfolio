"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
	isAuthenticated: boolean;
	login: () => void;
	logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
    	const stored = localStorage.getItem("isAuthenticated");
    	if (stored === "true") {
			setIsAuthenticated(true);
    	}
	}, []);

	const login = () => {
    	setIsAuthenticated(true);
    	localStorage.setItem("isAuthenticated", "true");
	};

	const logout = () => {
    	setIsAuthenticated(false);
    	localStorage.removeItem("isAuthenticated");
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuth must be used inside AuthProvider");
	}
	return ctx;
}
