'use client';

import React, { useEffect, useState } from 'react';
import DataGrid from '@/components/DataGrid';
import { fetchData } from '@/api/dataAPI';
import schema from './schema';

export default function DataGridPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchData();
        setItems(data);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="m-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
        <div className="w-full">
          <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">
            DataGrid Demo
          </h1>
          <DataGrid data={items} schema={schema} />
        </div>
      </main>
    </div>
  );
}
