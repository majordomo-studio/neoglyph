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
  // defaultSorting: [{ key: 'category', desc: false }],
};

export default schema;
