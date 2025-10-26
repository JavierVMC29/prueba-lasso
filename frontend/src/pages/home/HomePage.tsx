import React from "react";
import { Link } from "react-router";
import { Search, PlusCircle } from "lucide-react";

const HomePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* --- Header Section --- */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to the Grant Tagging System</h1>
        <p className="text-lg text-slate-600">Your central hub for managing, tagging, and discovering grant opportunities.</p>
      </div>

      {/* --- Call-to-Action Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: View Grants */}
        <Link
          to="/grants/view"
          className="group block p-8 bg-white rounded-lg shadow-lg border border-slate-200 
                     transition duration-300 ease-in-out 
                     hover:shadow-xl hover:border-green-500 hover:-translate-y-1"
        >
          <div className="flex items-center gap-5">
            {/* Icon */}
            <Search
              className="w-12 h-12 text-green-600 transition duration-300 
                         group-hover:scale-110"
            />
            {/* Text Content */}
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Explore Grants</h2>
              <p className="text-slate-500 mt-1">View, filter, and search all tagged grants in the system.</p>
            </div>
          </div>
        </Link>

        {/* Card 2: Add New Grants */}
        <Link
          to="/grants/add"
          className="group block p-8 bg-white rounded-lg shadow-lg border border-slate-200 
                     transition duration-300 ease-in-out 
                     hover:shadow-xl hover:border-green-500 hover:-translate-y-1"
        >
          <div className="flex items-center gap-5">
            {/* Icon */}
            <PlusCircle
              className="w-12 h-12 text-green-600 transition duration-300 
                         group-hover:scale-110"
            />
            {/* Text Content */}
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Add New Grants</h2>
              <p className="text-slate-500 mt-1">Add grants manually or by uploading a JSON file.</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
