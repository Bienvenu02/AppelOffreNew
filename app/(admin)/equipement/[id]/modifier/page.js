"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ModifierEquipementPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [name, setName] = useState("");
  const [categorieId, setCategorieId] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // 🔥 Charger l'équipement + catégories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resEquipement, resCategories] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipement/${id}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorie`)
        ]);

        const jsonEquipement = await resEquipement.json();
        const jsonCategories = await resCategories.json();

        if (!resEquipement.ok) throw new Error(jsonEquipement.message || "Impossible de charger l'équipement");
        if (!resCategories.ok) throw new Error(jsonCategories.message || "Impossible de charger les catégories");

        setName(jsonEquipement.data.name);
        setCategorieId(jsonEquipement.data.categorie_id || "");
        setDescription(jsonEquipement.data.description || "");
        setCategories(jsonCategories.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 🔥 Envoyer modification
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipement/${id}`, {
        method: "PUT",
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

      setMessage("Équipement modifié avec succès ✔️");

      await new Promise((r) => setTimeout(r, 600));
      router.push("/equipement");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Chargement…</p>;

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Modifier l'équipement
      </h1>
      <p className="text-gray-700 text-lg mb-6">
        Modifiez les informations de l'équipement sélectionné.
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
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              disabled={saving}
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Catégorie *
            </label>
            <select
              value={categorieId}
              onChange={(e) => setCategorieId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              disabled={saving}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md h-28 resize-none focus:ring-2 focus:ring-blue-500"
              disabled={saving}
            ></textarea>
          </div>

          {/* Erreur */}
          {error && <p className="text-red-500">{error}</p>}

          {/* Bouton Modifier */}
          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2 text-white rounded-md font-semibold transition ${
              saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? "Modification..." : "Modifier"}
          </button>

          {/* Message succès */}
          {message && <p className="text-green-600 mt-2">{message}</p>}
        </form>
      </div>
    </section>
  );
}
