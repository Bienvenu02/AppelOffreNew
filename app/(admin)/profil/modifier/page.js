"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function ModifierProfilPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // 🚀 Pré-remplir les valeurs grâce au hook
  useEffect(() => {
    if (!loading && user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [loading, user]);

  // 🚀 Mettre à jour le profil
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email }),
      });

      const data = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };

      if (!response.ok) {
        throw new Error(data.message || `Erreur ${response.status}`);
      }

      setMessage("Profil mis à jour avec succès ✔️");

      setTimeout(() => router.push("/dashboard"), 600);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Chargement...</p>;
  if (!user) return null; // protection

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Modifier mon profil
        </h1>
        <p className="text-gray-700 text-lg">
          Mettez à jour vos informations personnelles.
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Champ Nom */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Nom complet
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              disabled={saving}
            />
          </div>

          {/* Champ Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Adresse email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              disabled={saving}
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {message && <p className="text-green-600">{message}</p>}

          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2 text-white rounded-md font-semibold ${
              saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? "Modification..." : "Mettre à jour"}
          </button>
        </form>
      </div>
    </section>
  );
}
