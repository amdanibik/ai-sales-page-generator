"use client";

import { useState } from "react";
import { SalesPageCard } from "@/components/sales-page-card";
import { SalesPage } from "@/types";

export default function DashboardClient({ pages: initialPages }: { pages: SalesPage[] }) {
  const [pages, setPages] = useState<SalesPage[]>(initialPages);

  const handleDelete = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {pages.map((page) => (
        <SalesPageCard key={page.id} page={page} onDelete={handleDelete} />
      ))}
    </div>
  );
}
