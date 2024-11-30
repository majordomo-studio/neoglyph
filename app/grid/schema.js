const schema = {
  showToolbar: true, // Toggle toolbar
  showFooter: true, // Toggle footer
  selectedRowCount: false, // Toggle selected row count
  // order: ['size', 'color', 'price', 'rating', 'stock'],
  // defaultSorting: [{ key: 'category', desc: false }],
  sortableColumns: ['title', 'category', 'price'],
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
};

export default schema;
