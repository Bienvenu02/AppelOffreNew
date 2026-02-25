"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ModifierClientPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [form, setForm] = useState({
    name: "",
    sigle: "",
    address: "",
    ifu: "",
    contact: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // 🔥 Charger le client
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/client/${id}`);
        const json = await response.json();

        if (!response.ok) {
          throw new Error(json.message || "Impossible de charger les données");
        }

        setForm({
          name: json.data.name || "",
          sigle: json.data.sigle || "",
          address: json.data.address || "",
          ifu: json.data.ifu || "",
          contact: json.data.contact || "",
          email: json.data.email || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  // 🔥 Soumettre la modification
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/client/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await (response.headers.get("content-type")?.includes("application/json")
        ? response.json()
        : { message: response.statusText });

      if (!response.ok) throw new Error(data.message || `Erreur ${response.status}`);

      setMessage("Client modifié avec succès ✔️");
      await new Promise((r) => setTimeout(r, 600));
      router.push("/client");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  if (loading) return <p className="p-6">Chargement...</p>;

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Modifier le client</h1>
        <p className="text-gray-700 text-lg">
          Mettez à jour les informations du client sélectionné.
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 w-full">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nom */}
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Nom</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={saving}
            />
          </div>

          {/* Sigle */}
          <div>
            <label htmlFor="sigle" className="block text-gray-700 font-medium mb-2">Sigle</label>
            <input
              type="text"
              id="sigle"
              name="sigle"
              value={form.sigle}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={saving}
            />
          </div>

          {/* Adresse */}
          <div>
            <label htmlFor="address" className="block text-gray-700 font-medium mb-2">Adresse</label>
            <input
              type="text"
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={saving}
            />
          </div>

          {/* IFU */}
          <div>
            <label htmlFor="ifu" className="block text-gray-700 font-medium mb-2">IFU</label>
            <input
              type="text"
              id="ifu"
              name="ifu"
              value={form.ifu}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={saving}
            />
          </div>

          {/* Contact */}
          <div>
            <label htmlFor="contact" className="block text-gray-700 font-medium mb-2">Contact (optionnel)</label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={saving}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email (optionnel)</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={saving}
            />
          </div>

          {/* Message d'erreur */}
          {error && <p className="text-red-500 text-sm mt-1 md:col-span-2">{error}</p>}

          {/* Bouton Modifier */}
          <div className="md:col-span-2">
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

          {/* Message de confirmation */}
          {message && <p className="text-green-600 mt-2 md:col-span-2">{message}</p>}
        </form>
      </div>
    </section>
  );
}
