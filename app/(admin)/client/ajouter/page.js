"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AjouterClientPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    sigle: "",
    address: "",
    ifu: "",
    contact: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/client`, {
        method: "POST",
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

      setMessage("Client ajouté avec succès !");
      setForm({
        name: "",
        sigle: "",
        address: "",
        ifu: "",
        contact: "",
        email: "",
      });

      await new Promise(r => setTimeout(r, 600));
      router.push("/client");
    } catch (err) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ajouter un nouveau client</h1>
        <p className="text-gray-700 text-lg">
          Remplissez les informations du client. Tous les champs sauf contact et email sont obligatoires.
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
              placeholder="Nom du client"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={loading}
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
              placeholder="Ex: ABC"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={loading}
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
              placeholder="Adresse du client"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={loading}
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
              placeholder="Numéro IFU"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={loading}
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
              placeholder="Numéro de contact"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={loading}
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
              placeholder="Email du client"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={loading}
            />
          </div>

          {/* Message d'erreur */}
          {error && <p className="text-red-500 text-sm mt-1 md:col-span-2">{error}</p>}

          {/* Bouton Ajouter */}
          <div className="md:col-span-2">
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

          {/* Message de confirmation */}
          {message && <p className="text-green-600 mt-2 md:col-span-2">{message}</p>}
        </form>
      </div>
    </section>
  );
}
