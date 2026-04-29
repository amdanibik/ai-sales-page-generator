"use client";

import Link from "next/link";
import { Sparkles, Menu, X, LogOut, LayoutDashboard, Plus } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  userName?: string | null;
}

export function Navbar({ userName }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block">
              SalesGen AI
            </span>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <LayoutDashboard className="w-4 h-4 mr-1" />
                Dashboard
              </Button>
            </Link>
            <Link href="/pages/new">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-1" />
                New Page
              </Button>
            </Link>
            <div className="flex items-center gap-2 ml-2 pl-3 border-l border-gray-200">
              <span className="text-sm text-gray-600">
                Hi, {userName?.split(" ")[0] ?? "User"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-gray-600 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 space-y-2 animate-fade-in">
          <Link href="/dashboard" className="block py-2 text-sm font-medium text-gray-700">
            Dashboard
          </Link>
          <Link href="/pages/new" className="block py-2 text-sm font-medium text-indigo-600">
            + New Sales Page
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="block py-2 text-sm font-medium text-red-600"
          >
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
}
