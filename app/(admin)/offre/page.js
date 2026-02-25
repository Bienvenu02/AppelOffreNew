"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function OffresPage() {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openRow, setOpenRow] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const buttonRefs = useRef({});

  // 🔥 Charger les offres
  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offre`);
        const json = await res.json();
        setOffres(json.data || []);
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffres();
  }, []);

  // 🔥 Suppression
  const handleDelete = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer cette offre ?")) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offre/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      setOffres((prev) => prev.filter((o) => o.id !== id));
      alert("Offre supprimée !");
      setOpenRow(null);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Impossible de supprimer !");
    }
  };

  // 🔥 Menu Action
  const toggleRow = (id) => {
    if (openRow === id) {
      setOpenRow(null);
    } else {
      const rect = buttonRefs.current[id].getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY,
        left: rect.right - 128,
      });
      setOpenRow(id);
    }
  };

  // Fermer menu si clic extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openRow &&
        !buttonRefs.current[openRow]?.contains(e.target) &&
        !document.getElementById(`dropdown-${openRow}`)?.contains(e.target)
      ) {
        setOpenRow(null);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [openRow]);

  if (loading) return <p className="p-6">Chargement...</p>;

  return (
    <section className="p-6">
      <h2 className="text-2xl font-semibold mb-5 text-gray-700">Liste des offres</h2>

      <div className="mb-4">
        <Link href="/offre/ajouter">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Ajouter
          </button>
        </Link>
      </div>

      {/* Tableau responsive */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 w-full overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-3 text-left font-medium">#</th>
              <th className="px-4 py-3 text-left font-medium">Référence</th>
              <th className="px-4 py-3 text-left font-medium">Client</th>
              <th className="px-4 py-3 text-left font-medium">Domaine</th>
              <th className="px-4 py-3 text-left font-medium">Intitulé</th>
              <th className="px-4 py-3 text-left font-medium">Date limite</th>
              <th className="px-4 py-3 text-left font-medium">Statut</th>
              <th className="px-4 py-3 text-right font-medium w-24">Action</th>
            </tr>
          </thead>

          <tbody>
            {offres.map((offre, index) => (
              <tr key={offre.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-gray-700">{index + 1}</td>
                <td className="px-4 py-3 text-gray-800 font-medium">{offre.reference}</td>

                <td className="px-4 py-3 text-gray-600">
                  {offre?.client?.name || <span className="italic text-gray-400">—</span>}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {offre?.domaine?.name || <span className="italic text-gray-400">—</span>}
                </td>

                <td className="px-4 py-3 text-gray-700">{offre.intitule}</td>

                <td className="px-4 py-3 text-gray-600">
                  {new Date(offre.date_limite_soumission).toLocaleDateString()}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-md ${
                      {
                        en_cours: "bg-yellow-100 text-yellow-700",
                        gagnee: "bg-green-100 text-green-700",
                        perdue: "bg-red-100 text-red-700",
                        abandonnee: "bg-gray-200 text-gray-600",
                      }[offre.status]
                    }`}
                  >
                    {offre.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-right">
                  <button
                    ref={(el) => (buttonRefs.current[offre.id] = el)}
                    onClick={() => toggleRow(offre.id)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                  >
                    Action
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MENU ACTION */}
      {openRow && (
        <ul
          id={`dropdown-${openRow}`}
          className="fixed w-32 bg-white shadow-md border border-gray-200 rounded-md text-sm z-50"
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
        >
          <li>
            <Link href={`/offre/${openRow}/modifier`}>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100">
                Modifier
              </button>
            </Link>
          </li>
          <li>
            <button
              onClick={() => handleDelete(openRow)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
            >
              Supprimer
            </button>
          </li>
        </ul>
      )}
    </section>
  );
}
