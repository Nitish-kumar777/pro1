"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const Page = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [form, setForm] = useState({
        title: "",
        author: "",
        isbn: "",
        description: "",
        imageUrl: "",
        totalBook: "",
        available: false,
    });
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchBook = async () => {
            const response = await fetch(`/api/books/show-books/${id}`);
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
            });
            setPreview(data.imageUrl || "");
        };
        fetchBook();
    }, [id]);

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
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm((prev) => ({
                    ...prev,
                    imageUrl: reader.result,
                }));
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await fetch(`/api/books/show-books/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        setLoading(false);
        router.push("/admin/book/book-show");
    };

    if (!book) return <div>Loading...</div>;

    return (
     <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
  <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Book</h1>
  <form onSubmit={handleSubmit} className="space-y-5">
    <div>
      <label className="block text-gray-700 font-medium mb-1">Title</label>
      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-1">Author</label>
      <input
        type="text"
        name="author"
        value={form.author}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-1">ISBN</label>
      <input
        type="text"
        name="isbn"
        value={form.isbn}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-1">Description</label>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-28"
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-1">Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {preview && (
        <img src={preview} alt="Preview" className="mt-2 h-24 rounded" />
      )}
      <input
        type="text"
        name="imageUrl"
        value={form.imageUrl}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
        placeholder="Or paste image URL"
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-1">Total Book</label>
      <input
        type="number"
        name="totalBook"
        value={form.totalBook}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        name="available"
        checked={form.available}
        onChange={handleChange}
        className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
      />
      <label className="text-gray-700 font-medium">Available</label>
    </div>

    <button
      type="submit"
      disabled={loading}
      className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition disabled:bg-gray-400"
    >
      {loading ? "Saving..." : "Save Changes"}
    </button>
  </form>
</div>

    );
};

export default Page;