import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Trash, Eye, EyeOff, Maximize2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5 },
};

const getFilterTest = (filter) => {
  // If the filter is "*" or empty, show all items
  if (!filter || filter.trim() === "*" || filter.trim() === "") {
    return () => true;
  }

  const lowerCaseFilter = filter.toLowerCase();

  return (item) => {
    // Search across all fields, including key-value pairs
    return Object.values(item).some((value) => {
      if (Array.isArray(value)) {
        // If the value is an array (e.g., tags), check if any of the elements match the filter
        return value.some((arrayItem) =>
          String(arrayItem).toLowerCase().includes(lowerCaseFilter)
        );
      }
      // Convert non-array values to strings and check if they include the filter
      return String(value).toLowerCase().includes(lowerCaseFilter);
    });
  };
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

const DataBricks = ({
  items = [],
  filter = "*",
  sortBy = ["original-order"],
  transitionDuration = 300,
  schema = null, // Accept schema as a prop
}) => {
  const [filteredItems, setFilteredItems] = useState(items);
  const [sortHistory, setSortHistory] = useState(sortBy);
  const [categoryFilter, setCategoryFilter] = useState(filter);
  const [layoutMode, setLayoutMode] = useState("masonry");
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [fullWidthCardId, setFullWidthCardId] = useState(null);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);

  useEffect(() => {
    const filterTest = getFilterTest(categoryFilter);
    const sortedItems = items
      .filter((item) => filterTest(item))
      .sort(getItemSorter(sortHistory));

    setFilteredItems(sortedItems);
  }, [categoryFilter, sortHistory, items]);

  const formatKey = (key) => {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const reorderKeys = (item, schema) => {
    if (!schema || !schema.order) return Object.entries(item);
    const orderedKeys = schema.order;
    const keysSet = new Set(orderedKeys);

    const knownKeys = orderedKeys.filter((key) => key in item);
    const unknownKeys = Object.keys(item).filter((key) => !keysSet.has(key));

    return [...knownKeys, ...unknownKeys].map((key) => [key, item[key]]);
  };

  const shuffleItems = () => {
    setFilteredItems((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  const handleCardClick = (clickedItemId) => {
    if (layoutMode === "vertical") {
      setFilteredItems((prevItems) => {
        const clickedItemIndex = prevItems.findIndex((item) => item.id === clickedItemId);
        if (clickedItemIndex === -1) return prevItems;

        const updatedItems = [...prevItems];
        const [clickedItem] = updatedItems.splice(clickedItemIndex, 1);
        updatedItems.push(clickedItem);

        return updatedItems;
      });
    } else {
      if (fullWidthCardId === clickedItemId) {
        setFullWidthCardId(null);
      } else {
        setSelectedCardId((prevId) => (prevId === clickedItemId ? null : clickedItemId));
      }
    }
  };

  const confirmDeleteCard = (id) => {
    setAlertDialogOpen(true);
    setCardToDelete(id);
  };

  const handleDeleteCard = async () => {
    setAlertDialogOpen(false); // Close the dialog
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
    setFilteredItems((prev) => prev.filter((item) => item.id !== cardToDelete));
    setCardToDelete(null); // Clear the card to delete
  };

  const renderKeyValuePairs = (item, isFullWidth, isLargeSize) => {
    const keyValuePairs = reorderKeys(item, schema).filter(
      ([key]) => !["id", "title", "description", "category", "isHidden", "tags"].includes(key) // Exclude "tags"
    );

    const firstColumn = keyValuePairs.slice(0, 5);
    const secondColumn = keyValuePairs.slice(
      5,
      isLargeSize ? 20 : isFullWidth ? keyValuePairs.length : 0
    );

    return (
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex flex-col space-y-2">
          {firstColumn.map(([key, value]) => (
            <div key={key} className={`${key}_field text-sm text-gray-600`}>
              <span className="font-medium">{formatKey(key)}:</span>
              <span> {value}</span>
            </div>
          ))}
        </div>
        {secondColumn.length > 0 && (isLargeSize || isFullWidth) && (
          <div
            className={cn(
              "flex flex-col space-y-2",
              isFullWidth ? "ml-[25vw] is-full-width" : "ml-[160px] is-large"
            )}
          >
            {secondColumn.map(([key, value]) => (
              <div key={key} className={`${key}_field text-sm text-gray-600`}>
                <span className="font-medium">{formatKey(key)}:</span>
                <span> {value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderItems = () =>
    filteredItems.map((item, index) => {
      const isSelected = selectedCardId === item.id;
      const isFullWidth = fullWidthCardId === item.id || layoutMode === "vertical";
      const isLargeSize = isSelected && !isFullWidth;

      return (
        <motion.div
          key={item.id}
          layout
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={
            layoutMode === "vertical"
              ? { position: "absolute", top: `${index * 20}px`, zIndex: filteredItems.length - index }
              : {}
          }
          className={cn(
            "aspect-square cursor-pointer", // Ensure all cards are square and have pointer cursor
            layoutMode === "masonry" && "w-full",
            layoutMode === "vertical" && "w-full col-span-full row-span-full aspect-square",
            isSelected && "scale-[2] col-span-2 row-span-2", // Double size if clicked
            isFullWidth && "col-span-full row-span-full w-full aspect-square" // Full width if maximized
          )}
          onClick={() => handleCardClick(item.id)}
        >
          <Card className="shadow relative h-full">
            <div className="absolute top-5 right-5 flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Trash
                      className="cursor-pointer text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent click event bubbling
                        confirmDeleteCard(item.id);
                      }}
                      size={20}
                    />
                  </TooltipTrigger>
                  <TooltipContent>Remove Item</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    {item.isHidden ? (
                      <Eye
                        className="cursor-pointer text-blue-500 hover:text-blue-700"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent click event bubbling
                          setFilteredItems((prev) =>
                            prev.map((i) =>
                              i.id === item.id ? { ...i, isHidden: !i.isHidden } : i
                            )
                          );
                        }}
                        size={20}
                      />
                    ) : (
                      <EyeOff
                        className="cursor-pointer text-blue-500 hover:text-blue-700"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent click event bubbling
                          setFilteredItems((prev) =>
                            prev.map((i) =>
                              i.id === item.id ? { ...i, isHidden: !i.isHidden } : i
                            )
                          );
                        }}
                        size={20}
                      />
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    {item.isHidden ? "Show Item" : "Hide Item"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Maximize2
                      className={cn(
                        "cursor-pointer text-green-500 hover:text-green-700",
                        layoutMode === "vertical" && "hidden"
                      )}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent click event bubbling
                        setFullWidthCardId((prevId) =>
                          prevId === item.id ? null : item.id
                        );
                        setSelectedCardId(null); // Clear double-size state
                      }}
                      size={20}
                    />
                  </TooltipTrigger>
                  <TooltipContent>Maximize</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 pb-1">
              {renderKeyValuePairs(item, isFullWidth, isLargeSize)}
            </CardContent>
            {item.tags && Array.isArray(item.tags) && (
              <CardFooter
                className={cn(
                  "absolute flex flex-wrap gap-2",
                  isFullWidth
                    ? "bottom-8 left-8"
                    : isLargeSize
                    ? "bottom-0 left-0"
                    : "bottom-[-5px] left-0"
                )}
              >
                {item.tags.map((tag, index) => (
                  <Badge key={index} className="capitalize">
                    {tag}
                  </Badge>
                ))}
              </CardFooter>
            )}
          </Card>
        </motion.div>
      );
    });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search"
          value={categoryFilter === "*" ? "" : categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value || "*")}
          className="w-full max-w-sm"
        />
        <Button onClick={shuffleItems}>Shuffle</Button>
        <Button onClick={() => setSortHistory(["title"])}>Sort by Title</Button>
        <Button onClick={() => setSortHistory(["category"])}>Sort by Category</Button>
        <Button
          onClick={() =>
            setLayoutMode(layoutMode === "masonry" ? "vertical" : "masonry")
          }
        >
          Toggle Layout
        </Button>
      </div>

      <AnimatePresence>
        <div
          className={cn(
            layoutMode === "masonry"
              ? "grid gap-4 grid-cols-[repeat(auto-fit,_minmax(275px,_1fr))]"
              : "relative h-screen"
          )}
        >
          {renderItems()}
        </div>
      </AnimatePresence>

      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCard}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DataBricks;
