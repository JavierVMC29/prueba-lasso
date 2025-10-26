import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";

import { Breadcrumb } from "@src/components/Breadcrumb";
import { SIDEBAR_LINKS } from "@src/routes/SidebarLinks";

export function NavbarLayout({ children }: { children: React.ReactNode }) {
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (SIDEBAR_LINKS.length === 0) return;
    const activeParent = SIDEBAR_LINKS.find((link) => link.children && link.children.some((child) => location.pathname.startsWith(child.to)));
    if (activeParent && !openMenus.includes(activeParent.name)) {
      setOpenMenus((prev) => [...prev, activeParent.name]);
    }
  }, [location.pathname, SIDEBAR_LINKS]);

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => (prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]));
  };

  const handleSidebarLinkClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-primary-50">
      {/* Top Navbar */}
      {/* --- CAMBIO: Color de fondo a slate-950 (Lasso Dark) --- */}
      <header className="bg-primary-950 text-white h-16 flex items-center px-4 shadow-lg gap-4 z-10 relative">
        {/* Burger Menu (Mobile) */}
        <button className="md:hidden" onClick={() => setSidebarOpen((prev) => !prev)}>
          {sidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>

        {/* --- CAMBIO: Logo SVG de Lasso --- */}
        <div className="shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Lasso Logo" className="h-7 w-auto" />
            <span className="font-bold text-2xl text-white">Lasso</span>
          </Link>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 top-16 md:top-0 z-50
            md:relative md:translate-x-0 md:flex
            
            w-64 flex-col
            transform transition-transform duration-200 ease-in-out
            
            // --- CAMBIO: Color de fondo a slate-950 y texto a gris claro ---
            bg-primary-950 text-primary-300 text-sm 
            
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <nav className="flex-1 p-2 space-y-1">
            {SIDEBAR_LINKS.map((link) => {
              const isActive = location.pathname === link.to || (link.children && link.children.some((child) => location.pathname.startsWith(child.to)));
              const isOpen = openMenus.includes(link.name);

              if (link.children) {
                return (
                  <div key={link.name}>
                    {/* --- CAMBIO: Colores de hover/active a slate-800 y texto a 'white' --- */}
                    <div className={`w-full flex justify-between items-center rounded-lg ${isActive ? "bg-primary-800 text-white" : "hover:bg-primary-800 hover:text-white"}`}>
                      <Link to={link.to!} className="flex-1 flex items-center gap-2 p-2.5" onClick={handleSidebarLinkClick}>
                        {link.icon ? link.icon : undefined}
                        <span>{link.name}</span>
                      </Link>
                      <button onClick={() => toggleMenu(link.name)} className="p-2.5 rounded-lg hover:outline-none hover:ring-2 hover:ring-primary-700 cursor-pointer" aria-expanded={isOpen} aria-label={`Toggle ${link.name} submenu`}>
                        {isOpen ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                      </button>
                    </div>
                    {isOpen && (
                      <div className="ml-4 space-y-1 mt-1 border-l border-primary-700 pl-2">
                        {link.children.map((sub: any) => {
                          const subActive = location.pathname === sub.to;
                          return (
                            <Link
                              key={sub.to}
                              to={sub.to}
                              // --- CAMBIO: Colores de hover/active ---
                              className={`block text-sm p-2.5 rounded-lg ${subActive ? "bg-primary-800 text-white font-semibold" : "hover:bg-primary-800 hover:text-white"}`}
                              onClick={() => setSidebarOpen(false)}
                            >
                              {sub.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.to}
                  to={link.to!}
                  onClick={handleSidebarLinkClick}
                  // --- CAMBIO: Colores de hover/active ---
                  className={`flex items-center text-sm gap-2 p-2.5 mb-2 rounded-lg ${isActive ? "bg-primary-800 text-white font-semibold" : "hover:bg-primary-800 hover:text-white"}`}
                >
                  {link.icon ? link.icon : undefined}
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Breadcrumb sidebarLinks={SIDEBAR_LINKS} />
          {children}
        </main>
      </div>
    </div>
  );
}
