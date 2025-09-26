"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { AuthContext, UserType } from "@/context/authcontext";
import { GetAuthUserData } from "@/src/Services/GlobalApi";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("user_token");
      if (!token) {
        setLoadingUser(false);
        return;
      }

      try {
        // 1️⃣ Get user info from Google
        const googleUser = await GetAuthUserData(token);

        if (!googleUser?.email) {
          // If no email, stop here
          setUser(null);
          setLoadingUser(false);
          return;
        }

        // 2️⃣ Fetch user from Convex safely
        const userFromConvex = await convex.query(api.users.GetUser, {
          email: googleUser.email,
        });

        if (userFromConvex) {
          setUser(userFromConvex);
        } else {
          // 3️⃣ Create user if not found
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
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [convex]);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
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
