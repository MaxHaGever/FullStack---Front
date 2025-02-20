import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
    isLoggedIn: boolean;
    userId: string | null;
    login: (userId: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | null>(null);

    const login = (userId: string) => {
        setIsLoggedIn(true);
        setUserId(userId);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use AuthContext
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
};
