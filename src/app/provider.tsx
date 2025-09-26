"use client";

import React, { useEffect, useState, useMemo } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { AuthContext, UserType } from "@/context/authcontext";
import { GetAuthUserData } from "@/src/Services/GlobalApi";
import { api } from "@/convex/_generated/api";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);

  // Wrap convex client in useMemo so it doesn't change on every render
  const convex = useMemo(
    () => new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || ""),
    []
  );

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("user_token");
      if (!token) return;

      try {
        const googleUser = await GetAuthUserData(token);

        if (!googleUser?.email) {
          setUser(null);
          return;
        }

        const userFromConvex = await convex.query(api.users.GetUser, {
          email: googleUser.email,
        });

        if (userFromConvex) {
          setUser(userFromConvex);
        } else {
          const created = await convex.mutation(api.users.CreateUser, {
            name: googleUser.name,
            email: googleUser.email,
            picture: googleUser.picture,
          });
          setUser(created);
        }
      } catch (error) {
        console.error("Failed to restore user:", error);
        setUser(null);
      }
    };

    loadUser();
  }, [convex]);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <ConvexProvider client={convex}>
        <AuthContext.Provider value={{ user, setUser }}>
          <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </NextThemesProvider>
        </AuthContext.Provider>
      </ConvexProvider>
    </GoogleOAuthProvider>
  );
};

export default Provider;
