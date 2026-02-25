"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Tous les hooks DOIVENT être ici, jamais après un return
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  // Après TOUS les hooks, maintenant tu peux bloquer la page
  if (loading || user) {
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Identifiants incorrects");
        return;
      }

      setSuccess(data.message);

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("Erreur serveur");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center from-gray-100 to-gray-300 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Connexion
        </h1>
        <p className="text-gray-500 text-center">Ravi de te revoir 👋</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-200 text-red-800 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-200 text-green-800 rounded-lg">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
              placeholder="exemple@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition"
          >
            Se connecter
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm">
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="font-medium text-gray-900 hover:underline"
          >
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
