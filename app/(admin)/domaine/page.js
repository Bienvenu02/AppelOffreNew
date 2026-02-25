"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function DomainesPage() {
  const [domaines, setDomaines] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openRow, setOpenRow] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const buttonRefs = useRef({});

  // 🔥 Charger les domaines
  useEffect(() => {
    const fetchDomaines = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/domaine`
        );
        const json = await response.json();
        setDomaines(json.data);
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDomaines();
  }, []);

  // 🔥 Fonction de suppression
  const handleDelete = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer ce domaine ?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/domaine/${id}`,
        { method: "DELETE"}
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      // 🔥 Mise à jour immédiate du state sans recharger la page
      setDomaines((prev) => prev.filter((d) => d.id !== id));

      alert("Domaine supprimé avec succès !");
      setOpenRow(null);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Impossible de supprimer !");
    }
  };

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openRow &&
        !buttonRefs.current[openRow].contains(e.target) &&
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
      <h2 className="text-2xl font-semibold mb-5 text-gray-700">
        Liste des domaines d’équipements
      </h2>

      <div className="mb-4">
        <Link href="/domaine/ajouter">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Ajouter
          </button>
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 w-full overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-3 text-left font-medium">#</th>
              <th className="px-4 py-3 text-left font-medium">
                Nom du domaine
              </th>
              <th className="px-4 py-3 text-right font-medium w-24">Action</th>
            </tr>
          </thead>

          <tbody>
            {domaines.map((domaine, index) => (
              <tr
                key={domaine.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 text-gray-700">{index + 1}</td>
                <td className="px-4 py-3 text-gray-800 font-medium">
                  {domaine.name}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    ref={(el) => (buttonRefs.current[domaine.id] = el)}
                    onClick={() => toggleRow(domaine.id)}
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

      {openRow && (
        <ul
          id={`dropdown-${openRow}`}
          className="fixed w-32 bg-white shadow-md border border-gray-200 rounded-md text-sm z-50"
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
        >
          <li>
            <Link href={`/domaine/${openRow}/modifier`}>
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
