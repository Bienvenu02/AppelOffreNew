"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";

export default function AjouterFournisseurPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [domaines, setDomaines] = useState([]);
  const [selectedDomaines, setSelectedDomaines] = useState([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Charger les domaines pour le multi-select
  useEffect(() => {
    const fetchDomaines = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/domaine`);
        const json = await res.json();
        setDomaines(json.data || []);
      } catch (err) {
        console.error("Erreur lors du chargement des domaines:", err);
      }
    };
    fetchDomaines();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    if (!name || !address || selectedDomaines.length === 0) {
      setError(
        "Veuillez remplir tous les champs obligatoires et sélectionner au moins un domaine"
      );
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fournisseur`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          address,
          email,
          contact,
          domaines: selectedDomaines.length ? selectedDomaines : [], // tableau vide si rien
        }),
      });

      const data = await (response.headers.get("content-type")?.includes("application/json")
        ? response.json()
        : { message: response.statusText });

      if (!response.ok) {
        // Gestion des erreurs de validation Laravel
        const validationErrors = data.errors
          ? Object.values(data.errors).flat().join(", ")
          : data.message;
        throw new Error(validationErrors);
      }

      setMessage("Fournisseur ajouté avec succès !");
      setName("");
      setAddress("");
      setEmail("");
      setContact("");
      setSelectedDomaines([]);

      // Petite temporisation pour voir le message avant redirection
      await new Promise((r) => setTimeout(r, 600));
      router.push("/fournisseur");
    } catch (err) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ajouter un fournisseur</h1>
        <p className="text-gray-700 text-lg">
          Remplissez les informations du fournisseur et sélectionnez les domaines.
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 w-full">
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          {/* Ligne 1 : Name + Address */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">Nom</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">Adresse</label>
              <input
                type="text"
                value={address}
                onChange={(e) => { setAddress(e.target.value); setError(""); }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              />
            </div>
          </div>

          {/* Ligne 2 : Email + Contact */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">Contact</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => { setContact(e.target.value); setError(""); }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              />
            </div>
          </div>

          {/* Ligne 3 : Domaines multi-select */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Domaines</label>
            <Select
              isMulti
              options={domaines.map(d => ({ value: d.id, label: d.name }))}
              value={selectedDomaines.map(id => {
                const d = domaines.find(dom => dom.id === id);
                return d ? { value: d.id, label: d.name } : null;
              }).filter(Boolean)}
              onChange={(options) => setSelectedDomaines(options.map(o => o.value))}
              className="basic-multi-select"
              classNamePrefix="select"
              isDisabled={saving}
            />
          </div>

          {/* Bouton Ajouter */}
          <div>
            <button
              type="submit"
              disabled={saving}
              className={`px-6 py-2 text-white rounded-md transition font-semibold ${
                saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {saving ? "Enregistrement..." : "Ajouter"}
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
