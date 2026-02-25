"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header({ openSidebar, toggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const router = useRouter();

  // Fermer le dropdown si on clique ailleurs
  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Déconnexion
  const handleLogout = async () => {
    try {
      setDropdownOpen(false); // 👈 ferme le menu

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Erreur lors de la déconnexion");

      router.push("/login");
    } catch (error) {
      console.error("Erreur logout:", error);
    }
  };

  return (
    <header className="bg-base-300 shadow-md h-16 px-4 flex items-center justify-between">
      <button className="md:hidden text-3xl" onClick={toggleSidebar}>
        {openSidebar ? "✖" : "☰"}
      </button>

      <div className="flex-1"></div>

      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center gap-2 bg-base-200 px-4 py-2 rounded-md hover:bg-base-300"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span>Compte</span>
          <span
            className={`transition-transform ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        <ul
          className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg transition-all duration-200
          ${
            dropdownOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <li>
            <Link
              href="/profil/modifier"
              onClick={() => setDropdownOpen(false)} // 👈 ferme le dropdown
              className="w-full block px-4 py-2 text-left hover:bg-gray-100 rounded-t-lg"
            >
              Profil
            </Link>
          </li>

          <li>
            <button
              onClick={() => setDropdownOpen(false)} // 👈 ferme aussi
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              Paramètres
            </button>
          </li>

          <li>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-b-lg text-red-500"
            >
              Déconnexion
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}
