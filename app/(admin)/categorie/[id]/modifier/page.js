"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ModifierCategoriePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [name, setName] = useState("");
  const [domaineId, setDomaineId] = useState("");
  const [domaines, setDomaines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // 🔥 Charger la catégorie et les domaines
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resCategorie, resDomaines] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorie/${id}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/domaine`)
        ]);

        const jsonCategorie = await resCategorie.json();
        const jsonDomaines = await resDomaines.json();

        if (!resCategorie.ok) throw new Error(jsonCategorie.message || "Impossible de charger la catégorie");
        if (!resDomaines.ok) throw new Error(jsonDomaines.message || "Impossible de charger les domaines");

        setName(jsonCategorie.data.name);
        setDomaineId(jsonCategorie.data.domaine_id || "");
        setDomaines(jsonDomaines.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 🔥 Envoi du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorie/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, domaine_id: domaineId }),
      });

      const data = await (response.headers.get("content-type")?.includes("application/json")
        ? response.json()
        : { message: response.statusText });

      if (!response.ok) throw new Error(data.message || `Erreur ${response.status}`);

      setMessage("Catégorie modifiée avec succès ✔️");

      // Petite pause pour afficher le message
      await new Promise(r => setTimeout(r, 600));

      router.push("/categorie");
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
          Modifier catégorie
        </h1>
        <p className="text-gray-700 text-lg">
          Mettez à jour le nom et le domaine de la catégorie sélectionnée.
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 w-full">
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          {/* Champ Nom */}
          <div className="w-full">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Nom de la catégorie
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={saving}
            />
          </div>

          {/* Sélect Domaine */}
          <div className="w-full">
            <label htmlFor="domaine" className="block text-gray-700 font-medium mb-2">
              Domaine
            </label>
            <select
              id="domaine"
              value={domaineId}
              onChange={(e) => setDomaineId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={saving}
            >
              <option value="">-- Choisir un domaine --</option>
              {domaines.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          {/* Bouton Modifier */}
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
