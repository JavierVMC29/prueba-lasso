import { useLocation, Link } from "react-router";
import type { SidebarLink } from "@src/routes/SidebarLinks"; // Import the SidebarLink type
import { HomeIcon } from "lucide-react";

// Define the props for the component, including the dynamic sidebar links
interface BreadcrumbProps {
  sidebarLinks: SidebarLink[];
}

export const Breadcrumb = ({ sidebarLinks }: BreadcrumbProps) => {
  const location = useLocation();

  // This function now searches through the links passed via props
  const findLinkName = (pathname: string): string | null => {
    for (const link of sidebarLinks) {
      if (link.to === pathname) return link.name;
      if (link.children) {
        const child = link.children.find((c) => c.to === pathname);
        if (child) return child.name;
      }
    }
    return null;
  };

  const pathParts = location.pathname.split("/").filter(Boolean);
  const breadcrumbItems = pathParts
    .map((_, idx) => "/" + pathParts.slice(0, idx + 1).join("/"))
    .map((path) => findLinkName(path))
    .filter((name): name is string => name !== null); // Type guard to filter out nulls

  return (
    <nav className="flex items-center text-sm text-gray-600 mb-4">
      <Link to="/" className="flex items-center gap-1 hover:text-primary-900">
        <HomeIcon className="w-4 h-4" />
      </Link>
      {breadcrumbItems.map((name, index) => (
        <div key={index} className="flex items-center">
          <span className="mx-2">/</span>
          {index === breadcrumbItems.length - 1 ? (
            <span className="font-semibold text-gray-800">{name}</span>
          ) : (
            // Note: Breadcrumb parts are usually not clickable links, but keeping your styling.
            <span className="hover:text-primary-900 cursor-pointer">{name}</span>
          )}
        </div>
      ))}
    </nav>
  );
};
