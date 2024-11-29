
# **README: DataBricks Component**

The **DataBricks** component is a flexible, dynamic React component designed to display key-value pair data in a card-based layout. It supports features like filtering, sorting, animations, schema-based data reordering, and more. This README provides comprehensive instructions for using, deploying, and customizing the component.

---

## **Table of Contents**
1. [Features](#features)
2. [Installation](#installation)
3. [Props Overview](#props-overview)
4. [Using the Component](#using-the-component)
5. [Schema for Key Reordering](#schema-for-key-reordering)
6. [Customizing Styles](#customizing-styles)
7. [Advanced Features](#advanced-features)
8. [Deployment Instructions](#deployment-instructions)
9. [Common Use Cases](#common-use-cases)
10. [FAQs and Troubleshooting](#faqs-and-troubleshooting)

---

## **1. Features**

### **Core Features**
- **Dynamic Layouts**: Toggle between masonry and vertical layouts.
- **Filtering**: Filter cards based on a keyword or wildcard search.
- **Sorting**: Sort items using specified keys.
- **Animations**: Smooth transitions for card actions using `framer-motion`.
- **Schema-based Reordering**: Customize the order of key-value pairs in cards with an external schema.
- **Card Customization**: Customize CSS for individual elements like tags, key-value pairs, or card headers.
- **User Interaction**:
  - Maximize cards.
  - Show/Hide items.
  - Confirm deletions with an alert dialog.

---

## **2. Installation**

### **Dependencies**
Ensure your project includes the following dependencies:
- React: `^17.0.0` or higher
- TailwindCSS
- Framer Motion: `^4.1.17`
- Lucide Icons: `^0.7.0`
- Your UI library, e.g., `@shadcn/ui` or equivalent for components like buttons, inputs, tooltips, etc.

### **Installing the Component**
1. Copy the `DataBricks` component file into your `src/components` directory.
2. Install required packages:
   ```bash
   npm install framer-motion lucide-react
   ```

---

## **3. Props Overview**

### **Props Table**
| Prop Name           | Type               | Default                | Description                                                                                      |
|---------------------|--------------------|------------------------|--------------------------------------------------------------------------------------------------|
| `items`             | `Array`           | `[]`                   | An array of objects representing the data to display.                                           |
| `filter`            | `String`          | `"*"`                  | A keyword or wildcard to filter the items.                                                     |
| `sortBy`            | `Array<String>`   | `["original-order"]`   | Keys to sort the items by.                                                                      |
| `transitionDuration`| `Number`          | `300`                  | Transition duration (in ms) for animations.                                                    |
| `schema`            | `Object`          | `null`                 | A schema for reordering key-value pairs (details below).                                        |

---

## **4. Using the Component**

### **Basic Usage**
1. Import the component:
   ```jsx
   import DataBricks from "@/components/DataBricks";
   ```
2. Pass the required `items` array:
   ```jsx
   const items = [
     { id: 1, title: "Item 1", description: "Description of item 1", category: "Category A" },
     { id: 2, title: "Item 2", description: "Description of item 2", category: "Category B" },
   ];

   <DataBricks items={items} />;
   ```

### **Optional Schema**
To reorder keys in cards, pass a `schema` object:
```jsx
const schema = {
  order: ["title", "category", "description"], // Specify desired key order
};

<DataBricks items={items} schema={schema} />;
```

---

## **5. Schema for Key Reordering**

The `schema` object lets you define the display order for key-value pairs:
1. **Order Definition**:
   - The `order` array in the schema specifies the preferred key order.
   - Unspecified keys will appear at the end in their original order.

   Example schema:
   ```javascript
   const schema = {
     order: ["title", "category", "description"], // Arrange keys
   };
   ```

2. **Default Behavior**:
   If no schema is provided or if a key is not specified in the schema, the component displays keys in their original order.

3. **Passing the Schema**:
   Pass the schema as a prop:
   ```jsx
   <DataBricks items={items} schema={schema} />;
   ```

---

## **6. Customizing Styles**

### **Key-Value Pairs**
Customize the `keyValuePairs` layout with TailwindCSS:
- Each key-value pair can be targeted by its CSS class, which uses the key name.
  Example:
  ```css
  .title_field {
    font-weight: bold;
    color: blue;
  }
  .category_field {
    font-style: italic;
  }
  ```

### **Tags**
Tags are styled using the `Badge` component. To customize:
- Modify the `Badge` component's CSS classes in your project.
- Adjust positioning via Tailwind classes in the `CardFooter`.

### **Custom Transitions**
The `framer-motion` animations can be updated by modifying the `itemVariants` object.

---

## **7. Advanced Features**

### **Filtering**
The `filter` prop accepts:
- A string to match against any value in the data objects.
- Use `*` for wildcard matches.

Example:
```jsx
<DataBricks items={items} filter="category A" />;
```

### **Sorting**
Sort items dynamically with the `sortBy` prop:
```jsx
<DataBricks items={items} sortBy={["category", "title"]} />;
```

---

## **8. Deployment Instructions**

1. **Local Development**:
   - Import the component into your project and test it with mock data.
   - Use Tailwind's utility-first classes for rapid style adjustments.

2. **Production Build**:
   - Ensure dependencies are properly installed in the production environment.
   - Minify the component's styles and assets.

3. **Integration in Larger Projects**:
   - If using a schema, store it in a separate file for modularity.
   - Ensure reusable CSS or Tailwind presets for consistency across your project.

---

## **9. Common Use Cases**

### **Dynamic Data**
Use the component with fetched data:
```jsx
import { useEffect, useState } from "react";
import DataBricks from "@/components/DataBricks";

const MyPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((fetchedData) => setData(fetchedData));
  }, []);

  return <DataBricks items={data} />;
};
```

### **Customized Display**
Apply a schema and custom CSS for tailored layouts:
```jsx
import schema from "@/schemas/customSchema";

<DataBricks items={data} schema={schema} />;
```

---

## **10. FAQs and Troubleshooting**

### **Why aren’t items displaying?**
- Check that the `items` prop is a valid array.
- Ensure each item has unique `id` keys.

### **Why is filtering not working?**
- Verify that the `filter` string matches existing key-value pairs.

### **How do I change the animation speed?**
- Adjust the `transitionDuration` prop or `itemVariants` settings.

---

Feel free to request clarification or additional examples if needed!

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
