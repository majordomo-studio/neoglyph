'use client';

import React, { useEffect, useState } from "react";
import DataBricks from "@/components/DataBricks";
import { fetchData } from "@/api/dataAPI";

export default function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchData();
        setItems(data);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
        <div className="w-full">
          <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">
            DataBricks Demo
          </h1>
          <DataBricks items={items} layoutMode="masonry" />
        </div>
      </main>
    </div>
  );
}
