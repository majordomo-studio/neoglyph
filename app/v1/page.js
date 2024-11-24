'use client';

import React, { useState } from "react";
import DataBricks from "@/components/DataBricks";

const data = [
  { id: 1, title: "Item 1", description: "This is a square card.", category: "A", size: "square" },
  { id: 2, title: "Item 2", description: "This is a wide card.", category: "B", size: "wide" },
  { id: 3, title: "Item 3", description: "This is a tall card.", category: "A", size: "tall" },
  { id: 4, title: "Item 4", description: "This is a square card.", category: "C", size: "square" },
  { id: 5, title: "Item 5", description: "Another wide card.", category: "A", size: "wide" },
  { id: 6, title: "Item 6", description: "Another tall card.", category: "B", size: "tall" },
  { id: 7, title: "Item 7", description: "Another square card.", category: "A", size: "square" },
  { id: 8, title: "Item 8", description: "A tall card with more details.", category: "C", size: "tall" },
];


export default function Home() {
  const [items, setItems] = useState(data);

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
