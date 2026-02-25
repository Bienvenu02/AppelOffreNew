"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AjouterEquipementPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [categorieId, setCategorieId] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔥 Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorie`);
        const json = await res.json();
        setCategories(json.data);
      } catch (err) {
        console.error("Erreur:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (!name || !categorieId) {
      setError("Veuillez remplir tous les champs obligatoires");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          categorie_id: categorieId,
          description,
        }),
      });

      const data = await (response.headers.get("content-type")?.includes("application/json")
        ? response.json()
        : { message: response.statusText });

      if (!response.ok) throw new Error(data.message || `Erreur ${response.status}`);

      setMessage("Équipement ajouté avec succès !");
      setName("");
      setCategorieId("");
      setDescription("");

      // Petite pause avant redirection
      await new Promise((r) => setTimeout(r, 600));
      router.push("/equipement");
    } catch (err) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Ajouter un équipement</h1>
      <p className="text-gray-700 text-lg mb-6">
        Remplissez les informations nécessaires pour ajouter un nouvel équipement.
      </p>

      <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Champ Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Nom de l'équipement *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="Ex: Imprimante Laser"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Catégorie *
            </label>
            <select
              value={categorieId}
              onChange={(e) => { setCategorieId(e.target.value); setError(""); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">Sélectionnez une catégorie</option>

              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Description (optionnel)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ajoutez une description..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md h-28 resize-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            ></textarea>
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 text-white rounded-md font-semibold transition ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Enregistrement..." : "Ajouter"}
          </button>

          {/* Messages */}
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {message && <p className="text-green-600 mt-2">{message}</p>}
        </form>
      </div>
    </section>
  );
}
