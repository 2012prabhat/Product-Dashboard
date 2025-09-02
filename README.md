Weecom Frontend Task - Product Dashboard
A responsive product dashboard built with React, TailwindCSS, and shadcn/ui components, using the DummyJSON API for product data management.

🚀 Live Demo
[Add your deployed application link here]

📋 Features
Responsive Dashboard Layout: Sidebar + header + main content

Product Management: Full CRUD operations (Create, Read, Update, Delete)

Data Table: Display products with pagination and search functionality

Modern UI: Built with TailwindCSS and shadcn/ui components

State Management: Efficient data handling with TanStack Query (React Query)

🛠️ Technologies Used
React (v18+)

TailwindCSS for styling

shadcn/ui components (Table, Dialog, Button, Card, Input, Badge, Skeleton)

TanStack Query (React Query) for data fetching and mutations

Axios for API requests

React Router DOM (if applicable)

📦 Installation & Setup
Clone the repository

bash
git clone https://github.com/2012prabhat/Product-Dashboard
cd dashboard
Install dependencies

bash
npm install
Start the development server

bash
npm run dev
Open your browser
Navigate to http://localhost:3000 (or the port specified)

🏗️ Project Structure
text
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── TableComp.jsx       # Main product table component
├── lib/                  # Utility functions
└── App.jsx                 # Main application component
🔧 API Integration
The application uses the DummyJSON API with the following endpoints:

GET /products - Fetch products with pagination

GET /products/search - Search products

POST /products/add - Add a new product

PUT /products/{id} - Update a product

DELETE /products/{id} - Delete a product

📱 Features Implementation
Core Functionality
✅ Responsive dashboard layout

✅ Product table with pagination (Next/Previous buttons)

✅ Search functionality to filter products

✅ CRUD operations (Add, Edit, Delete products)

✅ Loading states with skeleton components

✅ Error handling and empty states

shadcn/ui Components Used
Table - For displaying products

Dialog - For add/edit forms and delete confirmation

Button - Throughout the application

Card - For content containers

Input - For forms and search

Badge - For stock status indicators

Skeleton - For loading states

React Query Integration
Data fetching with caching

Pagination and filter management

Mutations for CRUD operations

Auto refetch after mutations

Optimistic updates for better UX

🎨 Bonus Features Implemented
✅ Category filtering dropdown

✅ Total product count display

✅ Current page information

✅ Artificial delay for loading state demonstration

📝 Approach
Component Architecture: Created reusable components with proper separation of concerns

State Management: Used React Query for server state and React hooks for UI state

UI/UX: Focused on responsive design and intuitive user interactions

Error Handling: Implemented comprehensive error boundaries and user feedback

Performance: Optimized re-renders and API calls with proper caching strategies

🔮 Future Enhancements
User authentication and authorization

Advanced filtering and sorting options

Bulk operations on products

Data export functionality

Real-time updates with WebSockets

📄 License
This project is created as part of the Weecom Frontend Task assignment.

