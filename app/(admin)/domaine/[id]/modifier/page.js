"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ModifierDomainePage() {
  const router = useRouter();
  const params = useParams(); // récupère l'id dans l'URL
  const id = params.id;

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // 🔥 Charger le domaine à modifier
  useEffect(() => {
    const fetchDomaine = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/domaine/${id}`);
        const json = await response.json();

        if (!response.ok) {
          throw new Error(json.message || "Impossible de charger les données");
        }

        setName(json.data.name);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDomaine();
  }, [id]);

  // 🔥 Envoi du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/domaine/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ name }),
        }
      );

      const data = await (response.headers
        .get("content-type")
        ?.includes("application/json")
        ? response.json()
        : { message: response.statusText });

      if (!response.ok) {
        throw new Error(data.message || `Erreur ${response.status}`);
      }

      setMessage("Domaine modifié avec succès ✔️");

      await new Promise((r) => setTimeout(r, 600));

      router.push("/domaine");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Chargement...</p>;

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Modifier domaine
        </h1>
        <p className="text-gray-700 text-lg">
          Mettez à jour le nom du domaine sélectionné.
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 w-full">
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          {/* Champ Nom */}
          <div className="w-full">
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Nom du domaine
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={saving}
            />

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Bouton modifier */}
          <div>
            <button
              type="submit"
              disabled={saving}
              className={`px-6 py-2 text-white rounded-md transition font-semibold ${
                saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {saving ? "Modification..." : "Modifier"}
            </button>
          </div>

          {message && <p className="text-green-600 mt-2">{message}</p>}
        </form>
      </div>
    </section>
  );
}
