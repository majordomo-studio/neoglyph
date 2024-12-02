import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/ui/hover-card';
import {
  Trash,
  Eye,
  EyeOff,
  Maximize2,
  Shuffle,
  Layout,
  ChevronsUpDown,
  Check,
  X,
  MoreHorizontal,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Table, TableRow, TableCell, TableBody } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { DataBricksFacetedFilter } from './DataBricksFacetedFilter';

// Helper function to format keys for display purposes
const formatKey = (key) => {
  if (key.length === 2) {
    return key.toUpperCase(); // Capitalize two-letter keys
  }
  return key
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Convert to title case
};

// Helper function to truncate the description of cards when they are long
const truncateDescription = (text, maxLength = 65) => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

// Helper function to truncate values when they are long
const truncateValue = (text, maxLength = 25) => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5 },
};

const getFilterTest = (filter) => {
  if (!filter || filter.trim() === '*' || filter.trim() === '') {
    return () => true;
  }
  const lowerCaseFilter = filter.toLowerCase();
  return (item) =>
    Object.values(item).some((value) => {
      if (Array.isArray(value)) {
        return value.some((arrayItem) =>
          String(arrayItem).toLowerCase().includes(lowerCaseFilter)
        );
      }
      return String(value).toLowerCase().includes(lowerCaseFilter);
    });
};

const getItemSorter =
  (sortHistory, sortAsc = true) =>
  (a, b) => {
    for (const sortBy of sortHistory) {
      const aValue = a[sortBy] || 0;
      const bValue = b[sortBy] || 0;
      if (aValue > bValue || aValue < bValue) {
        return sortAsc ? (aValue > bValue ? 1 : -1) : aValue > bValue ? -1 : 1;
      }
    }
    return 0;
  };

const DataBricks = ({
  items = [],
  filter = '*',
  sortBy = ['original-order'],
  transitionDuration = 300,
  schema = null,
}) => {
  const [filteredItems, setFilteredItems] = useState(items);
  const [sortHistory, setSortHistory] = useState(sortBy);
  const [categoryFilter, setCategoryFilter] = useState(filter);
  const [layoutMode, setLayoutMode] = useState('masonry');
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [fullWidthCardId, setFullWidthCardId] = useState(null);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [columnFilters, setColumnFilters] = useState({});
  const [hiddenItemsExist, setHiddenItemsExist] = useState(false);
  const [localItems, setLocalItems] = useState([]);
  useEffect(() => {
    setLocalItems(
      items.map((item) => ({
        ...item,
        isHidden: item.isHidden || false,
      }))
    );
  }, [items]);

  useEffect(() => {
    const filterTest = getFilterTest(categoryFilter);
    const sortedItems = localItems
      .filter((item) => !item.isHidden)
      .filter((item) => filterTest(item))
      .filter((item) => {
        for (const [key, values] of Object.entries(columnFilters)) {
          if (values.length > 0 && !values.includes(item[key])) {
            return false;
          }
        }
        return true;
      })
      .sort(getItemSorter(sortHistory));

    setFilteredItems(sortedItems);
    setHiddenItemsExist(localItems.some((item) => item.isHidden));
  }, [categoryFilter, sortHistory, columnFilters, localItems]);

  const unhideAllItems = () => {
    setLocalItems((prev) => prev.map((item) => ({ ...item, isHidden: false })));
  };

  const toggleItemVisibility = (id) => {
    setLocalItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isHidden: !item.isHidden } : item
      )
    );
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
    if (layoutMode === 'vertical') {
      setFilteredItems((prevItems) => {
        const clickedItemIndex = prevItems.findIndex(
          (item) => item.id === clickedItemId
        );
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
        setSelectedCardId((prevId) =>
          prevId === clickedItemId ? null : clickedItemId
        );
      }
    }
  };

  const confirmDeleteCard = (id) => {
    setAlertDialogOpen(true);
    setCardToDelete(id);
  };

  const handleDeleteCard = async () => {
    setAlertDialogOpen(false);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLocalItems((prev) => prev.filter((item) => item.id !== cardToDelete));
    setCardToDelete(null);
  };

  const renderKeyValuePairsInTable = (keyValuePairs) => (
    <Table>
      <TableBody>
        {keyValuePairs.map(([key, value]) => (
          <TableRow key={key}>
            <TableCell>{formatKey(key)}</TableCell>
            <TableCell>
              {typeof value === 'boolean' ? (
                value ? (
                  <Check size={16} />
                ) : (
                  <X size={16} />
                )
              ) : typeof value === 'string' && value.length > 35 ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="text-left">{truncateValue(value)}</div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px] p-2 text-sm  shadow-md rounded-md">
                      {value}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                value
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
  const renderKeyValuePairs = (item, isFullWidth, isLargeSize) => {
    const keyValuePairs = reorderKeys(item, schema).filter(
      ([key]) =>
        ![
          'id',
          'title',
          'description',
          'category',
          'isHidden',
          'tags',
        ].includes(key)
    );

    const firstColumn = keyValuePairs.slice(0, 5);
    const secondColumn = keyValuePairs.slice(
      5,
      isLargeSize ? 18 : isFullWidth ? keyValuePairs.length : 0
    );

    return (
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex flex-col space-y-2">
          {renderKeyValuePairsInTable(firstColumn)}
        </div>
        {secondColumn.length > 0 && (isLargeSize || isFullWidth) && (
          <div
            className={cn(
              'flex flex-col space-y-2',
              isFullWidth ? 'ml-[25vw] is-full-width' : 'ml-[160px] is-large'
            )}
          >
            {renderKeyValuePairsInTable(secondColumn)}
          </div>
        )}
      </div>
    );
  };

  const renderItems = () =>
    filteredItems.map((item, index) => {
      const isSelected = selectedCardId === item.id;
      const isFullWidth =
        fullWidthCardId === item.id || layoutMode === 'vertical';
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
            layoutMode === 'vertical'
              ? {
                  position: 'absolute',
                  top: `${index * 20}px`,
                  zIndex: filteredItems.length - index,
                }
              : {}
          }
          className={cn(
            'aspect-square cursor-pointer',
            layoutMode === 'masonry' && 'w-full',
            layoutMode === 'vertical' &&
              'w-full col-span-full row-span-full aspect-square',
            isSelected && 'scale-[2] col-span-2 row-span-2',
            isFullWidth && 'col-span-full row-span-full w-full aspect-square'
          )}
          onClick={() => handleCardClick(item.id)}
        >
          <Card className="shadow relative h-full">
            <div className="absolute top-5 right-5 flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    {item.isHidden ? (
                      <Eye
                        className="cursor-pointer hover:text-blue-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleItemVisibility(item.id);
                        }}
                        size={20}
                      />
                    ) : (
                      <EyeOff
                        className="cursor-pointer hover:text-blue-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleItemVisibility(item.id);
                        }}
                        size={20}
                      />
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    {item.isHidden ? 'Show Item' : 'Hide Item'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Trash
                      className="cursor-pointer hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDeleteCard(item.id);
                      }}
                      size={20}
                    />
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Maximize2
                      className={cn(
                        'cursor-pointer hover:text-green-700',
                        layoutMode === 'vertical' && 'hidden'
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFullWidthCardId((prevId) =>
                          prevId === item.id ? null : item.id
                        );
                        setSelectedCardId(null);
                      }}
                      size={20}
                    />
                  </TooltipTrigger>
                  <TooltipContent>Maximize</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardHeader className="pb-0">
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>
                {item.description.length > 35 ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="text-left">
                          {truncateDescription(item.description)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[300px] p-2 text-sm  shadow-md rounded-md">
                        {item.description}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <div className="pb-2 max-w-[300px]">{item.description}</div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {renderKeyValuePairs(item, isFullWidth, isLargeSize)}
            </CardContent>
            {item.tags && Array.isArray(item.tags) && (
              <CardFooter
                className={cn(
                  'absolute flex flex-wrap gap-2',
                  isFullWidth
                    ? 'bottom-8 left-8'
                    : isLargeSize
                      ? 'bottom-0 left-0'
                      : 'bottom-[-5px] left-0'
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
      <div className="flex justify-between items-center gap-2">
        <div className="flex gap-2">
          <Input
            placeholder="Search"
            value={categoryFilter === '*' ? '' : categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value || '*')}
            className="w-full max-w-sm"
          />
          {/* Render Faceted Filters */}
          {schema?.filters?.map((key) => (
            <DataBricksFacetedFilter
              key={key}
              columnKey={key}
              title={formatKey(key)}
              items={items}
              columnFilters={columnFilters}
              setColumnFilters={setColumnFilters}
            />
          ))}
        </div>
        <div className="flex gap-2">
          {hiddenItemsExist && (
            <Button
              variant="outline"
              className="bg-green-500 text-white"
              onClick={unhideAllItems}
            >
              Unhide All
            </Button>
          )}
          <Button variant="outline" onClick={shuffleItems}>
            <Shuffle />
            Shuffle
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setLayoutMode(layoutMode === 'masonry' ? 'vertical' : 'masonry')
            }
          >
            <Layout />
            Toggle Layout
          </Button>
          <Button variant="outline" onClick={() => setSortHistory(['title'])}>
            <ChevronsUpDown />
            Sort by Title
          </Button>
          <Button
            variant="outline"
            onClick={() => setSortHistory(['category'])}
          >
            <ChevronsUpDown />
            Sort by Category
          </Button>
        </div>
      </div>

      <AnimatePresence>
        <div
          className={cn(
            layoutMode === 'masonry'
              ? 'grid gap-4 grid-cols-[repeat(auto-fit,_minmax(275px,_1fr))]'
              : 'relative h-screen'
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
              Are you sure you want to delete this item? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCard}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DataBricks;
