import React from "react";

export default function Home() {
  return (
    <div className="font-sans text-gray-800">
      {/* Top Info Bar */}
      <div className="bg-green-200 text-sm py-2 px-4 flex justify-between">
        <span>📍 MJ9G+933, El Hajeb</span>
        <span>🗓 Mon — Fri: 8am — 5pm</span>
      </div>

      {/* Header */}
      <header className="bg-green-900 text-white flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-4">
          <img src="/* LOGO IMAGE */" alt="Logo" className="h-10" />
          <h1 className="text-xl font-bold">El Hajeb</h1>
        </div>
        <nav className="space-x-6">
          <a href="#" className="hover:underline">Accueil</a>
          <a href="#" className="hover:underline">Actualités</a>
          <a href="#" className="hover:underline">Organigramme De La Province</a>
          <a href="#" className="hover:underline">Aperçu De La Province</a>
          <a href="#" className="hover:underline">Secteurs</a>
        </nav>
        <div className="flex items-center border border-gray-400">
          <input type="text" placeholder="Search" className="px-2 py-1 text-black" />
          <button className="bg-black text-white px-3">Search</button>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[500px] flex items-center"
        style={{ backgroundImage: "url('/* HERO BACKGROUND IMAGE */')" }}
      >
        <div className="bg-black bg-opacity-40 text-white p-8 max-w-2xl">
          <p className="mb-2">Façonnons l’avenir d’El Hajeb</p>
          <h2 className="text-3xl font-bold leading-snug">
            Inclusive. Durable. Connectée.<br />
            Ensemble pour des villes humaines et intelligentes.
          </h2>
        </div>
        <div className="absolute right-10 top-20 space-y-4">
          <img src="/* IMAGE 1 */" alt="img1" className="w-64 border-4 border-green-400" />
          <img src="/* IMAGE 2 */" alt="img2" className="w-64 border-4 border-green-400" />
          <img src="/* IMAGE 3 */" alt="img3" className="w-64 border-4 border-green-400" />
        </div>
      </section>

      {/* Discover Section */}
      <section className="bg-green-800 text-white px-8 py-12">
        <h3 className="uppercase text-lg mb-2">Découvrez El Hajeb</h3>
        <h2 className="text-2xl font-bold mb-4">Une province riche en culture, en opportunités et en communauté</h2>
        <p className="max-w-4xl">
          Située au cœur du Moyen Atlas, la province d’El Hajeb se distingue par son patrimoine naturel,
          sa diversité culturelle et son engagement envers un développement durable et participatif...
        </p>
      </section>

      {/* Key Points Section */}
      <section className="bg-white py-12 px-8">
        <h2 className="text-center text-2xl font-bold mb-8">Les Atouts Majeurs De La Province D’El Hajeb</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[ 
            {
              title: "Un cadre naturel exceptionnel",
              text: "Des forêts, des sources d’eau, un climat tempéré..."
            },
            {
              title: "Des infrastructures en plein essor",
              text: "Routes, assainissement, eau potable, électricité..."
            },
            {
              title: "Un capital humain dynamique",
              text: "Une population jeune, des établissements d’enseignement..."
            },
            {
              title: "Une économie agricole et artisanale riche",
              text: "Agriculture, arboriculture, élevage..."
            }
          ].map((item, i) => (
            <div key={i} className="bg-white shadow p-6 rounded">
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest News */}
      <section className="bg-white py-12 text-center">
        <h2 className="text-xl font-bold mb-4">DERNIÈRES ACTUALITÉS</h2>
        <div className="mx-auto w-1/2 h-24 border rounded flex items-center justify-center">
          <span>Place for news content</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold mb-2">El Hajeb</h3>
          <p>Découvrez El Hajeb, un territoire riche et dynamique...</p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Contact us</h3>
          <p>📞 +91-123-456-7890</p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Images</h3>
          <div className="flex space-x-2">
            <div className="w-16 h-16 bg-gray-300"></div>
            <div className="w-16 h-16 bg-gray-300"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
