# **README: DataGrid Component**

The **DataGrid** component is a highly customizable React component for displaying and interacting with tabular data. It provides advanced features like sorting, filtering, inline editing with validation, dynamic schema-based configurations, and seamless integration with your existing UI libraries.

---

## **Table of Contents**

1. [Features](#features)
2. [Installation](#installation)
3. [Props Overview](#props-overview)
4. [Schema Configuration](#schema-configuration)
5. [Editing and Validation](#editing-and-validation)
6. [Using the Component](#using-the-component)
7. [Customizing the Component](#customizing-the-component)
8. [Deployment Instructions](#deployment-instructions)
9. [FAQs and Troubleshooting](#faqs-and-troubleshooting)

---

## **1. Features**

### **Core Features**

- **Dynamic Column Configuration**: Define column order, visibility, alignment, and more via a schema.
- **Inline Editing**: Edit rows directly with support for inputs, dropdowns, switches, and date pickers.
- **Validation**: Validate edits dynamically using Zod schemas for strong typing and custom error handling.
- **Sorting, Filtering, and Pagination**: Includes powerful table controls out of the box.
- **Customizable Toolbar**: Built-in toolbar with global search, column toggles, and filter resets.
- **Responsive Design**: Fully responsive and supports accessibility standards.

---

## **2. Installation**

### **Dependencies**

Ensure the following packages are installed:

- React: `^17.0.0` or higher
- TanStack Table: `@tanstack/react-table`
- Zod: `zod`
- TailwindCSS: Tailwind utilities for styling
- Optional: `lucide-react` for icons and `date-fns` for date manipulation.

### **Installing the Component**

1. Add the `DataGrid` component file to your project:
   ```bash
   npm install @tanstack/react-table zod date-fns lucide-react
   ```

---

## **3. Props Overview**

### **Props Table**

| Prop Name  | Type            | Required | Default | Description                                                     |
| ---------- | --------------- | -------- | ------- | --------------------------------------------------------------- |
| `data`     | `Array<object>` | ✅       | `[]`    | The dataset to be displayed in the table.                       |
| `schema`   | `object`        | ✅       | `null`  | Schema defining column configuration, validation, and behavior. |
| `onSave`   | `function`      | ❌       | `null`  | Callback function invoked when edits are saved.                 |
| `onDelete` | `function`      | ❌       | `null`  | Callback function invoked when a row is deleted.                |

---

## **4. Schema Configuration**

The `schema` prop defines the structure, behavior, and validation of the `DataGrid`. Below are the details:

### **Schema Properties**

| Property               | Type            | Description                                                            |
| ---------------------- | --------------- | ---------------------------------------------------------------------- |
| `order`                | `Array<string>` | Defines the column order.                                              |
| `editableColumns`      | `Array<string>` | Specifies which columns are editable.                                  |
| `zodSchema`            | `object`        | Custom Zod schemas for validation.                                     |
| `filters`              | `Array<string>` | Specifies which columns support filtering.                             |
| `badgeColumns`         | `Array<string>` | Columns that render as badges.                                         |
| `centerAlignedColumns` | `Array<string>` | Columns with center-aligned text.                                      |
| `showToolbar`          | `boolean`       | Toggles the visibility of the toolbar.                                 |
| `showFooter`           | `boolean`       | Toggles the visibility of the footer (pagination controls).            |
| `defaultSorting`       | `Array<object>` | Defines initial sorting. Example: `{ key: 'popularity', desc: true }`. |

---

## **5. Editing and Validation**

### **Inline Editing**

- Users can edit data directly in cells. Supported input types include:
  - Text inputs
  - Numeric inputs
  - Dropdowns
  - Switches
  - Date pickers

### **Validation with Zod**

- The `zodSchema` property in the schema defines validation rules for columns.
- Validation runs on:
  - Cell updates during editing.
  - When the "Save" button is clicked.

#### **Example Zod Schema**

```javascript
zodSchema: {
  popularity: z.number().int().min(18, 'Must be 18 or more'),
  email: z.string().email('Invalid email address'),
  tags: z.array(z.string()),
}
```

### **Error Display**

- Validation errors are displayed below input fields in red text.
- The "Save" button is disabled until all errors are resolved.

---

## **6. Using the Component**

### **Basic Usage**

1. Import the `DataGrid` component:
   ```jsx
   import DataGrid from './components/DataGrid';
   ```
2. Define your `data` and `schema`:

   ```javascript
   const data = [
     { id: 1, title: 'Example', popularity: 50 },
     { id: 2, title: 'Demo', popularity: 30 },
   ];

   const schema = {
     order: ['id', 'title', 'popularity'],
     editableColumns: ['title', 'popularity'],
     zodSchema: {
       popularity: z.number().int().min(18, 'Must be 18 or more'),
     },
   };
   ```

3. Render the component:
   ```jsx
   <DataGrid data={data} schema={schema} />
   ```

### **Handling Save**

Provide a callback function to handle saving edited data:

```jsx
const handleSave = (updatedData) => {
  console.log('Data saved:', updatedData);
};

<DataGrid data={data} schema={schema} onSave={handleSave} />;
```

---

## **7. Customizing the Component**

### **Custom Columns**

To add or reorder columns, update the `order` array in the schema:

```javascript
const schema = {
  order: ['id', 'title', 'tags', 'popularity'],
  badgeColumns: ['tags'],
};
```

### **Filters**

Enable column-level filtering by adding keys to the `filters` array:

```javascript
const schema = {
  filters: ['title', 'popularity'],
};
```

### **Actions**

The component supports default "Edit" and "Delete" actions. To hide these:

```javascript
const schema = {
  showActions: false,
};
```

---

## **8. Deployment Instructions**

1. **Local Setup**:

   - Clone the project and import the `DataGrid` component into your project.
   - Install dependencies:
     ```bash
     npm install
     ```

2. **Testing**:

   - Mock data and schema locally to test features.
   - Test edge cases for validation (e.g., invalid numbers, empty fields).

3. **Production Deployment**:
   - Ensure dependencies are installed in the production environment.
   - Bundle and minify assets for performance optimization.

---

## **9. FAQs and Troubleshooting**

### **Why is validation failing?**

- Check if your `zodSchema` matches the column data types.

### **How can I disable editing for certain rows?**

- Modify the `editableColumns` array dynamically based on row conditions.

### **How do I customize styles?**

- Use Tailwind classes or wrap the component with a custom CSS module.

### **How can I add custom actions?**

- Extend the `actions` column with custom buttons or modals.

---
