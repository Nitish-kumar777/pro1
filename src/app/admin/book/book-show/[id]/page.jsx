"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const Page = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    description: "",
    imageUrl: "",
    totalBook: "",
    available: false,
    categoryId: "",
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // Fetch book
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/show-books/${id}`);
        if (!response.ok) throw new Error("Failed to fetch book");
        const data = await response.json();
        setBook(data);
        setForm({
          title: data.title || "",
          author: data.author || "",
          isbn: data.isbn || "",
          description: data.description || "",
          imageUrl: data.imageUrl || "",
          totalBook: data.totalBook || "",
          available: data.available || false,
          categoryId: data.categoryId || "",
        });
        setPreview(data.imageUrl || "");
      } catch (error) {
        setError("Failed to load book details");
        console.error("Error fetching book:", error);
      }
    };
    fetchBook();
  }, [id]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        setError("Failed to load categories");
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle file input and convert to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size should be less than 2MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          imageUrl: reader.result,
        }));
        setPreview(reader.result);
        setError(""); // Clear any previous error
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch(`/api/books/show-books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update book");
      }
      
      setSuccess("Book updated successfully!");
      setTimeout(() => {
        router.push("/admin/book/book-show");
      }, 1500);
    } catch (error) {
      setError(error.message || "An error occurred while updating the book");
      console.error("Error updating book:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!book) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg text-gray-600">Loading book details...</div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Book</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Author *</label>
          <input
            type="text"
            name="author"
            value={form.author}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ISBN */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">ISBN *</label>
          <input
            type="text"
            name="isbn"
            value={form.isbn}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-28"
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Category *</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {form.categoryId && (
            <p className="mt-1 text-sm text-gray-500">
              Current category selected. Change if needed.
            </p>
          )}
        </div>

        {/* Image */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Book Cover</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">Max file size: 2MB</p>
          
          {preview && (
            <div className="mt-3">
              <p className="text-sm text-gray-700 mb-1">Preview:</p>
              <img src={preview} alt="Preview" className="mt-2 h-32 rounded shadow" />
            </div>
          )}
          
          <div className="mt-3">
            <label className="block text-gray-700 font-medium mb-1">Or enter image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        {/* Total Books */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Total Copies *</label>
          <input
            type="number"
            name="totalBook"
            value={form.totalBook}
            onChange={handleChange}
            min="1"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Available */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="available"
            checked={form.available}
            onChange={handleChange}
            className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label className="text-gray-700 font-medium">Available for borrowing</label>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={() => router.push("/admin/book/book-show")}
            className="w-1/3 py-2 px-4 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-2/3 py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;