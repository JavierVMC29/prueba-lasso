import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";

import { NavbarLayout } from "@src/layout/NavBarLayout";
import PublicRoute from "./PublicRoute";

const CreateGrantPage = lazy(() => import("@src/pages/grants/CreateGrantPage"));
const ViewGrantsPage = lazy(() => import("@src/pages/grants/ViewGrantsPage"));
const HomePage = lazy(() => import("@src/pages/home/HomePage"));
const NotFoundPage = lazy(() => import("@src/pages/not-found/NotFoundPage"));

const LoadingFallback = () => <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Cargando...</div>;

export const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <NavbarLayout>
                  <HomePage />
                </NavbarLayout>
              </PublicRoute>
            }
          />

          <Route
            path="/grants"
            element={
              <PublicRoute>
                <NavbarLayout>
                  <HomePage />
                </NavbarLayout>
              </PublicRoute>
            }
          />

          <Route
            path="/grants/view"
            element={
              <PublicRoute>
                <NavbarLayout>
                  <ViewGrantsPage />
                </NavbarLayout>
              </PublicRoute>
            }
          />

          <Route
            path="/grants/add"
            element={
              <PublicRoute>
                <NavbarLayout>
                  <CreateGrantPage />
                </NavbarLayout>
              </PublicRoute>
            }
          />

          {/* --- RUTA COMODÍN PARA "NOT FOUND" (404) --- */}
          {/* Esta debe ser SIEMPRE la última ruta. */}
          {/* Si ninguna de las rutas anteriores coincide, se renderizará esta. */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
