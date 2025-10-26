// src/pages/not-found/NotFoundPage.jsx
import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center">
      <div className="p-8">
        {/* Ícono o emoji */}
        <p className="text-6xl font-semibold text-primary-500 mb-4">🗺️</p>

        {/* Título principal */}
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight sm:text-5xl">404 - Página no encontrada</h1>

        {/* Párrafo descriptivo */}
        <p className="mt-4 text-base text-gray-600">Lo sentimos, la página que estás buscando no existe o fue movida.</p>

        {/* Enlace para volver al inicio */}
        <div className="mt-10">
          <Link
            to="/"
            className="rounded-md bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors duration-200"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
