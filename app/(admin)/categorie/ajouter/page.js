"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AjouterCategoriePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [domaineId, setDomaineId] = useState("");
  const [domaines, setDomaines] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔥 Charger les domaines pour le select
  useEffect(() => {
    const fetchDomaines = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/domaine`);
        const json = await res.json();
        setDomaines(json.data);
      } catch (err) {
        console.error("Erreur:", err);
      }
    };
    fetchDomaines();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!name || !domaineId) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorie`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, domaine_id: domaineId }),
      });

      const data = await (response.headers.get("content-type")?.includes("application/json")
        ? response.json()
        : { message: response.statusText });

      if (!response.ok) throw new Error(data.message || `Erreur ${response.status}`);

      setMessage("Catégorie ajoutée avec succès !");
      setName("");
      setDomaineId("");

      await new Promise((r) => setTimeout(r, 600));
      router.push("/categorie");
    } catch (err) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ajouter une catégorie</h1>
        <p className="text-gray-700 text-lg">
          Remplissez le nom de la catégorie et sélectionnez le domaine associé.
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
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="Ex: Ordinateur"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={loading}
            />
          </div>

          {/* Select Domaine */}
          <div className="w-full">
            <label htmlFor="domaine" className="block text-gray-700 font-medium mb-2">
              Domaine
            </label>
            <select
              id="domaine"
              value={domaineId}
              onChange={(e) => { setDomaineId(e.target.value); setError(""); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={loading}
            >
              <option value="">Sélectionnez un domaine</option>
              {domaines.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Bouton Ajouter */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 text-white rounded-md transition font-semibold ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Enregistrement..." : "Ajouter"}
            </button>
          </div>

          {/* Messages */}
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {message && <p className="text-green-600 mt-2">{message}</p>}
        </form>
      </div>
    </section>
  );
}
