// hooks/useAuth.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true; // pour éviter les updates après un unmount

    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:8000/me", {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok || data.message) {
          if (isMounted) {
            setUser(null);
            setLoading(false);
            router.replace("/login"); // redirection immédiate, remplace l’historique
          }
        } else {
          if (isMounted) {
            setUser(data);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setUser(null);
          setLoading(false);
          router.replace("/login");
        }
      }
    }

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return { user, loading };
}
