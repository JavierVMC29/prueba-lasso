import { HomeIcon, ScrollText } from "lucide-react";

export interface SidebarLink {
  name: string;
  to?: string;
  icon?: React.ReactNode;
  children?: { name: string; to: string }[];
}

export const SIDEBAR_LINKS: SidebarLink[] = [
  { name: "Home", to: "/", icon: <HomeIcon className="w-6 h-6" /> },
  {
    name: "Grants",
    to: "/grants",
    icon: <ScrollText className="w-6 h-6" />,
    children: [
      { name: "Explore Grants", to: "/grants/view" },
      { name: "Add New Grants", to: "/grants/add" },
    ],
  },
];
