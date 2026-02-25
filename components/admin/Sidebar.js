"use client";
import { useState } from "react";
import Link from "next/link";

export default function Sidebar({ open, onClose }) {
  const [subMenuOpen, setSubMenuOpen] = useState({});

  const toggleSubMenu = (key) => {
    setSubMenuOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // 👉 ferme le sidebar si on clique en mobile
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      <aside
        className={`fixed md:static inset-y-0 left-0 z-20 w-68 bg-base-100 shadow-lg transform transition-transform duration-300 
          ${
            open ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 flex flex-col`}
      >
        {/* HEADER */}
        <div className="bg-base-300 shadow-md flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold px-4">AppOffre</h1>
          <button className="md:hidden text-2xl px-4" onClick={onClose}>
            ✖
          </button>
        </div>

        {/* LINKS */}
        <div className="flex-1 p-4 overflow-y-auto">
          <ul className="flex flex-col gap-2">
            {/* DASHBOARD */}
            <li>
              <Link
                href="/dashboard"
                onClick={handleLinkClick}
                className="w-full pl-2 py-2 rounded-md hover:bg-base-200 block"
              >
                Dashboard
              </Link>
            </li>

            {/* Offre */}
            <li>
              <Link
                href="/offre"
                onClick={handleLinkClick}
                className="w-full pl-2 py-2 rounded-md hover:bg-base-200 block"
              >
                Offre
              </Link>
            </li>

            {/* Client */}
            <li>
              <Link
                href="/client"
                onClick={handleLinkClick}
                className="w-full pl-2 py-2 rounded-md hover:bg-base-200 block"
              >
                Client
              </Link>
            </li>

            {/* Fournisseur */}
            <li>
              <Link
                href="/fournisseur"
                onClick={handleLinkClick}
                className="w-full pl-2 py-2 rounded-md hover:bg-base-200 block"
              >
                Fournisseur
              </Link>
            </li>

            {/* Equipement */}
            <li>
              <Link
                href="/equipement"
                onClick={handleLinkClick}
                className="w-full pl-2 py-2 rounded-md hover:bg-base-200 block"
              >
                Equipement
              </Link>
            </li>

            {/* GESTION TIERS */}
            <li>
              <button
                className="flex justify-between items-center w-full px-2 py-2 rounded-md hover:bg-base-200"
                onClick={() => toggleSubMenu("gestion_tiers")}
              >
                Gestion Tiers
                <span
                  className={`transition-transform ${
                    subMenuOpen.gestion_tiers ? "rotate-90" : ""
                  }`}
                >
                  ▶
                </span>
              </button>

              {subMenuOpen.gestion_tiers && (
                <ul className="mt-1 flex flex-col gap-1">
                  <li>
                    <Link
                      href="/domaine"
                      onClick={handleLinkClick}
                      className="w-full pl-8 pr-2 py-2 rounded-md hover:bg-base-200 block"
                    >
                      Domaine
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/categorie"
                      onClick={handleLinkClick}
                      className="w-full pl-8 pr-2 py-2 rounded-md hover:bg-base-200 block"
                    >
                      Categorie
                    </Link>
                  </li>
                </ul>
              )}
            </li>

          </ul>
        </div>
      </aside>

      {/* OVERLAY (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-transparent z-10 md:hidden"
          onClick={onClose}
        ></div>
      )}
    </>
  );
}
