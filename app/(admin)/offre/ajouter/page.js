"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AjouterOffrePage() {
  const router = useRouter();

  const [domaines, setDomaines] = useState([]);
  const [clients, setClients] = useState([]);

  // Champs Offre
  const [reference, setReference] = useState("");
  const [clientId, setClientId] = useState("");
  const [intitule, setIntitule] = useState("");
  const [domaineId, setDomaineId] = useState("");
  const [dateLimite, setDateLimite] = useState("");
  const [dateOuverture, setDateOuverture] = useState("");
  const [delaiLivraison, setDelaiLivraison] = useState("");
  const [description, setDescription] = useState("");

  // Services dynamiques
  const [services, setServices] = useState([
    { name: "", nombre: "", type_service: "fourniture", description: "" },
  ]);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Récupération des domaines
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/domaine`)
      .then((res) => res.json())
      .then((data) => setDomaines(data.data || []));

    // Récupération des clients
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/client`)
      .then((res) => res.json())
      .then((data) => setClients(data.data || []));
  }, []);

  const addService = () => {
    setServices([
      ...services,
      { name: "", nombre: "", type_service: "fourniture", description: "" },
    ]);
  };

  const removeService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const updateService = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = value;
    setServices(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Validation des champs obligatoires
    if (!reference || !clientId || !intitule || !domaineId || !dateLimite || !delaiLivraison) {
      setError("Veuillez remplir tous les champs obligatoires.");
      setLoading(false);
      return;
    }

    for (const s of services) {
      if (!s.name || !s.nombre || !s.type_service) {
        setError("Veuillez remplir tous les champs des services.");
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offre`, {
        method: "POST",
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
          services,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");

      setMessage("Offre enregistrée avec succès !");
      setTimeout(() => router.push("/offre"), 700);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ajouter une offre</h1>
        <p className="text-gray-700 text-lg">
          Remplissez les informations de l’offre ainsi que les services associés.
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 w-full">
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          {/* Offre : ligne 1 (4 champs) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Référence</label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className={inputStyle}
                placeholder="Ex: OFR-001"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Client</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className={`${inputStyle} text-gray-700 bg-white`}
              >
                <option value="">Sélectionnez un client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
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
                placeholder="Ex: Fourniture d'équipements"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Domaine</label>
              <select
                value={domaineId}
                onChange={(e) => setDomaineId(e.target.value)}
                className={`${inputStyle} text-gray-700 bg-white`}
              >
                <option value="">Sélectionnez un domaine</option>
                {domaines.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Offre : ligne 2 (3 champs) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Date limite de soumission</label>
              <input
                type="datetime-local"
                value={dateLimite}
                onChange={(e) => setDateLimite(e.target.value)}
                className={inputStyle}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Date d’ouverture (facultatif)</label>
              <input
                type="datetime-local"
                value={dateOuverture}
                onChange={(e) => setDateOuverture(e.target.value)}
                className={inputStyle}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Délai de livraison (jours)</label>
              <input
                type="number"
                value={delaiLivraison}
                onChange={(e) => setDelaiLivraison(e.target.value)}
                className={inputStyle}
              />
            </div>
          </div>

          {/* Offre : ligne 3 (1 champ) */}
          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputStyle}
              rows={3}
            ></textarea>
          </div>

          {/* Services */}
          <h2 className="text-xl font-semibold mt-6 mb-2">Services inclus dans l’offre</h2>

          {services.map((s, index) => (
            <div key={index} className="border p-4 rounded-lg bg-gray-50 relative">
              {services.length > 1 && (
                <button
                  type="button"
                  className="absolute right-2 top-2 text-red-600"
                  onClick={() => removeService(index)}
                >
                  ✕
                </button>
              )}

              {/* Ligne 1 : 3 champs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Nom</label>
                  <input
                    type="text"
                    value={s.name}
                    onChange={(e) => updateService(index, "name", e.target.value)}
                    className={inputStyle}
                    placeholder="Ex: Fourniture PC"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Nombre / Quantité</label>
                  <input
                    type="number"
                    value={s.nombre}
                    onChange={(e) => updateService(index, "nombre", e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Type de service</label>
                  <select
                    value={s.type_service}
                    onChange={(e) => updateService(index, "type_service", e.target.value)}
                    className={inputStyle}
                  >
                    <option value="fourniture">Fourniture</option>
                    <option value="prestation">Prestation</option>
                  </select>
                </div>
              </div>

              {/* Ligne 2 : textarea description */}
              <div className="mt-3">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  value={s.description}
                  onChange={(e) => updateService(index, "description", e.target.value)}
                  className={inputStyle}
                  rows={2}
                ></textarea>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addService}
            className="px-4 py-2 mr-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            ➕ Ajouter un autre service
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 text-white rounded-md transition font-semibold ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Enregistrement..." : "Créer l’offre"}
          </button>

          {error && <p className="text-red-500">{error}</p>}
          {message && <p className="text-green-600">{message}</p>}
        </form>
      </div>
    </section>
  );
}
