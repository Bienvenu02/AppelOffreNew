"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AjouterDomainePage() {
  const router = useRouter(); // <-- IMPORTANT: appel useRouter ici
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/domaine`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name }),
      });

      // pour éviter un crash si la réponse n'est pas JSON
      const data = await (response.headers.get("content-type")?.includes("application/json")
        ? response.json()
        : { message: response.statusText });

      if (!response.ok) {
        // affiche le message renvoyé par le backend si présent
        throw new Error(data.message || `Erreur ${response.status}`);
      }

      setMessage("Domaine ajouté avec succès !");
      setName(""); // reset

      // Petite temporisation si tu veux voir le message avant redirection (optionnel)
      await new Promise(r => setTimeout(r, 600));

      router.push("/domaine");
      // ou router.replace("/domaines") si tu veux remplacer l'historique
    } catch (err) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      {/* Contexte / header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Ajouter un nouveau domaine
        </h1>
        <p className="text-gray-700 text-lg">
          Remplissez le nom du domaine que vous souhaitez ajouter. Il sera
          visible dans la liste pour gestion.
        </p>
      </div>

      {/* Formulaire pleine largeur */}
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
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Ex: Informatique"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={loading}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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

          {/* Message de confirmation / erreur */}
          {message && <p className="text-green-600 mt-2">{message}</p>}
        </form>
      </div>
    </section>
  );
}
