import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Animation Variants
 */
const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Delay between item animations
    },
  },
};

/**
 * Utility functions for filtering and sorting
 */
const getFilterTest = (filter) => {
  if (typeof filter === "function") return filter;
  return (item) => item.category === filter || filter === "*";
};

const getItemSorter = (sortHistory, sortAsc = true) => (a, b) => {
  for (const sortBy of sortHistory) {
    const aValue = a[sortBy] || 0;
    const bValue = b[sortBy] || 0;
    if (aValue > bValue || aValue < bValue) {
      return sortAsc ? (aValue > bValue ? 1 : -1) : (aValue > bValue ? -1 : 1);
    }
  }
  return 0;
};

/**
 * DataBricks Component
 */
const DataBricks = ({
  items = [],
  filter = "*",
  sortBy = ["original-order"],
  transitionDuration = 300,
}) => {
  const [filteredItems, setFilteredItems] = useState(items);
  const [sortHistory, setSortHistory] = useState(sortBy);
  const [categoryFilter, setCategoryFilter] = useState(filter);
  const [layoutMode, setLayoutMode] = useState("masonry"); // Options: masonry, fit-rows, vertical

  // Effect to filter and sort items
  useEffect(() => {
    const filterTest = getFilterTest(categoryFilter);
    const sortedItems = items
      .filter((item) => filterTest(item)) // Apply filter
      .sort(getItemSorter(sortHistory)); // Apply sort

    setFilteredItems(sortedItems);
  }, [categoryFilter, sortHistory, items]);

  // Shuffle items randomly
  const shuffleItems = () => {
    const shuffled = [...filteredItems].sort(() => Math.random() - 0.5);
    setFilteredItems(shuffled);
  };

  // Toggle visibility (hide/reveal)
  const toggleVisibility = (itemId) => {
    setFilteredItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isHidden: !item.isHidden } : item
      )
    );
  };

  // Render items with dynamic layout
  const renderItems = () =>
    filteredItems.map((item) => (
      <motion.div
        key={item.id}
        variants={itemVariants}
        initial="hidden"
        animate={!item.isHidden ? "visible" : "hidden"}
        exit="exit"
        layout
        className={cn(
          "p-4 bg-gray-100 rounded shadow",
          layoutMode === "masonry" && "w-full",
          layoutMode === "fit-rows" && "w-full",
          layoutMode === "vertical" && "w-full"
        )}
      >
        <div className="p-4 bg-white rounded-lg shadow">
          <h4 className="font-bold text-lg">{item.title}</h4>
          <p>{item.description}</p>
          <div className="flex gap-2 mt-2">
            <Button
              variant="destructive"
              onClick={() => setFilteredItems((prev) => prev.filter((i) => i.id !== item.id))}
            >
              Remove
            </Button>
            <Button
              onClick={() => toggleVisibility(item.id)}
              className="bg-blue-500"
            >
              {item.isHidden ? "Show" : "Hide"}
            </Button>
          </div>
        </div>
      </motion.div>
    ));

  return (
    <div className="flex flex-col gap-4">
      {/* Controls */}
      <div className="flex gap-2">
        <Input
          placeholder="Filter by category"
          value={categoryFilter === "*" ? "" : categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value || "*")}
          className="w-full max-w-sm"
        />
        <Button onClick={shuffleItems}>Shuffle</Button>
        <Button onClick={() => setSortHistory(["title"])}>Sort by Title</Button>
        <Button onClick={() => setSortHistory(["category"])}>
          Sort by Category
        </Button>
        <Button
          onClick={() => setLayoutMode(layoutMode === "masonry" ? "vertical" : "masonry")}
        >
          Toggle Layout
        </Button>
      </div>

      {/* Layout Grid */}
      <AnimatePresence>
        <motion.div
          className={cn(
            "grid gap-4",
            layoutMode === "masonry" &&
              "grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))]",
            layoutMode === "fit-rows" && "grid-cols-1",
            layoutMode === "vertical" && "grid-cols-1"
          )}
          style={{
            gridAutoRows: layoutMode === "masonry" ? "masonry" : "auto",
          }}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={containerVariants}
          transition={{ duration: transitionDuration / 1000 }}
        >
          {renderItems()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DataBricks;