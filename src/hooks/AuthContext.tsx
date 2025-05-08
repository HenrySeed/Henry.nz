import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useDocs } from "./useDocs";
import { BlogUser } from "../views/blog/SettingsView";

export type Role = "viewer" | "admin";

type AuthContextType = {
    user: User | null;
    role: Role | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);

    const [role, setRole] = useState<Role | null>(null);
    const [loadingRole, setLoadingRole] = useState(true);

    const { docs: blogUsers } = useDocs<BlogUser>("users", {
        skip: user === null,
    });

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoadingUser(false);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (user !== null && blogUsers.length > 0) {
            const blogUser = blogUsers.find((val) => val.email === user.email);
            if (blogUser) {
                setRole(blogUser.role);
                setLoadingRole(false);
            }
        }
    }, [user, blogUsers]);

    const value = {
        user,
        role,
        loading: loadingUser || loadingRole,
    };
    console.log(`[AuthContext] `, value);

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export function useAuthContext() {
    const context = useContext(AuthContext);
    return context;
}
