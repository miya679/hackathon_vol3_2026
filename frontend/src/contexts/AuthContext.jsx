import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { signOutUser, subscribeAuth } from "../services/authService";
import { ensureUserProfile, getUserProfile } from "../services/userService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return subscribeAuth(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const p = await ensureUserProfile(
            firebaseUser.uid,
            firebaseUser.email ?? ""
          );
          setProfile(p);
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });
  }, []);

  const refreshProfile = async () => {
    if (!user) return null;
    const p = await getUserProfile(user.uid);
    setProfile(p);
    return p;
  };

  const logout = async () => {
    await signOutUser();
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      logout,
      refreshProfile,
    }),
    [user, profile, loading]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
