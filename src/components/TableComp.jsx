import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Import Shadcn components with proper exports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Custom Pagination component to avoid import issues
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  isLoading,
  searchTerm,
  debouncedSearchTerm 
}) => {
  const isDisabled = isLoading || searchTerm !== debouncedSearchTerm;
  
  return (
    <div className="flex items-center justify-between mt-6">
      <div className="flex-1 hidden sm:block">
        <p className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isDisabled}
        >
          Previous
        </Button>
        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNumber;
            if (totalPages <= 5) {
              pageNumber = i + 1;
            } else if (currentPage <= 3) {
              pageNumber = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + i;
            } else {
              pageNumber = currentPage - 2 + i;
            }

            return (
              <Button
                key={pageNumber}
                variant={currentPage === pageNumber ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNumber)}
                disabled={isDisabled}
                className="w-8 h-8 p-0"
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isDisabled}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

function TableComp({ sideBarDis }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    category: "",
    stock: "",
    rating: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const queryClient = useQueryClient();
  const itemsPerPage = 10;
  const skip = (currentPage - 1) * itemsPerPage;

  // Debounce function
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  const getProducts = async () => {
    const response = await axios.get(
      `https://dummyjson.com/products/search?q=${debouncedSearchTerm}&limit=${itemsPerPage}&skip=${skip}`
    );
    return response.data;
  };

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["products", currentPage, debouncedSearchTerm],
    queryFn: getProducts,
    keepPreviousData: true,
  });

  // Add new product mutation
  const addProductMutation = useMutation({
    mutationFn: async (product) => {
      const response = await axios.post(
        "https://dummyjson.com/products/add",
        product
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setNewProduct({ title: "", price: "", category: "", stock: "", rating: "" });
      setIsAddDialogOpen(false);
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async (product) => {
      const response = await axios.put(
        `https://dummyjson.com/products/${product.id}`,
        product
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditingProduct(null);
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (productId) => {
      const response = await axios.delete(
        `https://dummyjson.com/products/${productId}`
      );
      return response.data;
    },
    onSuccess: (_, productId) => {
      // Remove the product from the frontend immediately
      queryClient.setQueryData(
        ["products", currentPage, debouncedSearchTerm],
        (oldData) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            products: oldData.products.filter(product => product.id !== productId),
            total: oldData.total - 1
          };
        }
      );
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    },
  });

  const totalPages = data ? Math.ceil(data.total / itemsPerPage) : 0;
  const totalProducts = data?.total || 0;

  const handleEdit = (product) => {
    setEditingProduct({ ...product });
  };

  const handleSave = () => {
    if (editingProduct) {
      updateProductMutation.mutate(editingProduct);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteProductMutation.mutate(productToDelete.id);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const productToAdd = {
      title: newProduct.title,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      stock: parseInt(newProduct.stock),
      rating: parseFloat(newProduct.rating),
    };
    addProductMutation.mutate(productToAdd);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-lg">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-8 transition-all ${sideBarDis && 'pl-58'}`}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Products List</h2>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search products by title, category, or brand..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              {searchTerm !== debouncedSearchTerm && (
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">
                {totalProducts} products found
              </Badge>
              {searchTerm !== debouncedSearchTerm && (
                <span className="text-sm text-blue-600">Searching...</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Product Management</h3>
          <DialogTrigger asChild>
            <Button>Add New Product</Button>
          </DialogTrigger>
        </div>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the details for the new product. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddProduct} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Product Title"
                value={newProduct.title}
                onChange={handleInputChange}
                required
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={handleInputChange}
                required
                step="0.01"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input
                id="category"
                name="category"
                placeholder="Category"
                value={newProduct.category}
                onChange={handleInputChange}
                required
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                Stock
              </Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={handleInputChange}
                required
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rating" className="text-right">
                Rating
              </Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                placeholder="Rating"
                value={newProduct.rating}
                onChange={handleInputChange}
                required
                step="0.1"
                min="0"
                max="5"
                className="col-span-3"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={addProductMutation.isLoading}>
                {addProductMutation.isLoading ? "Adding..." : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[var(--mainCol)] text-white">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the product "{productToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              className="bg-red-900"
              onClick={handleDeleteConfirm}
              disabled={deleteProductMutation.isLoading}
            >
              {deleteProductMutation.isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="sm:max-w-[500px] text-white bg-[var(--mainCol)]">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Make changes to the product here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={editingProduct.title}
                  onChange={handleEditInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-price" className="text-right">
                  Price
                </Label>
                <Input
                  id="edit-price"
                  name="price"
                  type="number"
                  value={editingProduct.price}
                  onChange={handleEditInputChange}
                  step="0.01"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
                  Category
                </Label>
                <Input
                  id="edit-category"
                  name="category"
                  value={editingProduct.category}
                  onChange={handleEditInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-stock" className="text-right">
                  Stock
                </Label>
                <Input
                  id="edit-stock"
                  name="stock"
                  type="number"
                  value={editingProduct.stock}
                  onChange={handleEditInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-rating" className="text-right">
                  Rating
                </Label>
                <Input
                  id="edit-rating"
                  name="rating"
                  type="number"
                  value={editingProduct.rating}
                  onChange={handleEditInputChange}
                  step="0.1"
                  min="0"
                  max="5"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline"
                onClick={handleSave}
                disabled={updateProductMutation.isLoading}
              >
                {updateProductMutation.isLoading ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading state
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  </TableRow>
                ))
              ) : data?.products?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                // Data loaded - show products
                data?.products?.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.title}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell className="capitalize">{product.category}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.stock > 50
                            ? "default"
                            : product.stock > 20
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">⭐</span>
                        {product.rating}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          className="bg-red-600 text-white"
                          size="sm"
                          onClick={() => handleDeleteClick(product)}
                          disabled={deleteProductMutation.isLoading}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={isLoading}
        searchTerm={searchTerm}
        debouncedSearchTerm={debouncedSearchTerm}
      />
    </div>
  );
}

export default TableComp;