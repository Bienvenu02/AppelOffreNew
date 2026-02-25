"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openRow, setOpenRow] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const buttonRefs = useRef({});

  // 🔥 Charger les catégories avec leur domaine
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorie`);
        const json = await res.json();
        setCategories(json.data);
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // 🔥 Fonction de suppression
  const handleDelete = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer cette catégorie ?")) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorie/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      setCategories((prev) => prev.filter((c) => c.id !== id));
      alert("Catégorie supprimée avec succès !");
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
        Liste des catégories
      </h2>

      <div className="mb-4">
        <Link href="/categorie/ajouter">
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
              <th className="px-4 py-3 text-left font-medium">Nom de la catégorie</th>
              <th className="px-4 py-3 text-left font-medium">Domaine</th>
              <th className="px-4 py-3 text-right font-medium w-24">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((categorie, index) => (
              <tr
                key={categorie.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 text-gray-700">{index + 1}</td>
                <td className="px-4 py-3 text-gray-800 font-medium">{categorie.name}</td>
                <td className="px-4 py-3 text-gray-600">
                  {categorie.domaine?.name}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    ref={(el) => (buttonRefs.current[categorie.id] = el)}
                    onClick={() => toggleRow(categorie.id)}
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

      {/* Dropdown Action */}
      {openRow && (
        <ul
          id={`dropdown-${openRow}`}
          className="fixed w-32 bg-white shadow-md border border-gray-200 rounded-md text-sm z-50"
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
        >
          <li>
            <Link href={`/categorie/${openRow}/modifier`}>
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
