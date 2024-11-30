const schema = {
  // order: ['size', 'color', 'price', 'rating', 'stock'],
  filters: ['category', 'size'],
  badgeColumns: ['price', 'shipping_cost'],
  centerAlignedColumns: [
    'category',
    'size',
    'color',
    'rating',
    'stock',
    'created_at',
    'updated_at',
    'popularity',
  ],
  sortableColumns: ['title', 'category', 'price'],
};

export default schema;
