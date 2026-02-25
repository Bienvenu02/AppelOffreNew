"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// Fonction pour convertir "2025-04-10 09:45:00" → "2025-04-10T09:45"
const formatDateTimeLocal = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date - tzOffset).toISOString().slice(0, 16);
};

export default function ModifierOffrePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [reference, setReference] = useState("");
  const [clientId, setClientId] = useState("");
  const [intitule, setIntitule] = useState("");
  const [domaineId, setDomaineId] = useState("");
  const [dateLimite, setDateLimite] = useState("");
  const [dateOuverture, setDateOuverture] = useState("");
  const [delaiLivraison, setDelaiLivraison] = useState("");
  const [description, setDescription] = useState("");

  const [clients, setClients] = useState([]);
  const [domaines, setDomaines] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // 🔥 CHARGEMENT DES DONNÉES
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resOffre, resClients, resDomaines] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/offre/${id}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/client`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/domaine`)
        ]);

        const jsonOffre = await resOffre.json();
        const jsonClients = await resClients.json();
        const jsonDomaines = await resDomaines.json();

        if (!resOffre.ok) throw new Error(jsonOffre.message || "Impossible de charger l'offre");

        // Remplir les champs
        setReference(jsonOffre.data.reference);
        setClientId(jsonOffre.data.client_id);
        setIntitule(jsonOffre.data.intitule);
        setDomaineId(jsonOffre.data.domaine_id);
        setDelaiLivraison(jsonOffre.data.delai_livraison);
        setDescription(jsonOffre.data.description || "");

        // Conversion propre des dates
        setDateLimite(formatDateTimeLocal(jsonOffre.data.date_limite_soumission));
        setDateOuverture(formatDateTimeLocal(jsonOffre.data.date_ouverture_offre));

        setClients(jsonClients.data || []);
        setDomaines(jsonDomaines.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 🔥 ENVOI DU FORMULAIRE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offre/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference,
          client_id: clientId,
          intitule,
          domaine_id: domaineId,
          date_limite_soumission: dateLimite,
          date_ouverture_offre: dateOuverture || null,
          delai_livraison: delaiLivraison,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de la modification");

      setMessage("Offre modifiée avec succès ✔️");

      setTimeout(() => router.push("/offre"), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Chargement...</p>;

  const inputStyle =
    "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Modifier l’offre</h1>
        <p className="text-gray-700 text-lg">
          Mettez à jour les informations de l’offre sélectionnée.
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 w-full">
        <form onSubmit={handleSubmit} className="space-y-6 w-full">

          {/* Ligne 1 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Référence</label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className={inputStyle}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Client</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className={inputStyle}
              >
                <option value="">Sélectionnez un client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Intitulé</label>
              <input
                type="text"
                value={intitule}
                onChange={(e) => setIntitule(e.target.value)}
                className={inputStyle}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Domaine</label>
              <select
                value={domaineId}
                onChange={(e) => setDomaineId(e.target.value)}
                className={inputStyle}
              >
                <option value="">Sélectionnez un domaine</option>
                {domaines.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ligne 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Date limite</label>
              <input
                type="datetime-local"
                value={dateLimite}
                onChange={(e) => setDateLimite(e.target.value)}
                className={inputStyle}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Date d’ouverture</label>
              <input
                type="datetime-local"
                value={dateOuverture}
                onChange={(e) => setDateOuverture(e.target.value)}
                className={inputStyle}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Délai livraison (jours)</label>
              <input
                type="number"
                value={delaiLivraison}
                onChange={(e) => setDelaiLivraison(e.target.value)}
                className={inputStyle}
              />
            </div>
          </div>

          {/* Ligne 3 */}
          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputStyle}
              rows={3}
            ></textarea>
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {message && <p className="text-green-600">{message}</p>}

          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2 text-white rounded-md ${
              saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? "Modification..." : "Modifier l’offre"}
          </button>
        </form>
      </div>
    </section>
  );
}
