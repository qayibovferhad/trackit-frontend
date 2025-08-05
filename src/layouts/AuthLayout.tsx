import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="h-16 px-10 flex items-center justify-between bg-white shadow-sm">
        <div className="text-xl font-bold">⚡ Trackit</div>
        <div className="space-x-4">
          <button className="text-sm text-gray-600 hover:underline">
            Explore Features
          </button>
          <Link to="/register">
            <button className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800">
              Get Started
            </button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          {children}
        </div>

        <div className="text-center text-sm text-gray-400 mt-8">
          © Trackit team
        </div>
      </main>
    </div>
  );
}
