import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useDocs } from "./useDocs";
import { BlogUser } from "../views/blog/SettingsView";

export type Role = "viewer" | "admin";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState(true);

    const { docs: blogUsers } = useDocs<BlogUser>("users", {
        skip: user === null,
    });

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (user !== null && blogUsers.length > 0) {
            // find this user
            const blogUser = blogUsers.find((val) => val.email === user.email);
            if (blogUser) {
                setRole(blogUser.role);
            }
            setLoading(false);
        }
    }, [user, blogUsers]);

    console.log({ loading });

    return { user, loading, role };
}
