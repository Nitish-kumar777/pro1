"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function BookUploadForm() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    totalBook: "",
    description: "",
    categoryId: ""
  })
  const [image, setImage] = useState(null)
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category")
        if (!res.ok) throw new Error("Failed to fetch categories")
        
        const data = await res.json()
        if (Array.isArray(data)) {
          setCategories(data)
        }
      } catch (err) {
        console.error("Error fetching categories", err)
        setErrors(prev => ({ ...prev, categories: "Failed to load categories" }))
      }
    }
    fetchCategories()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.author.trim()) newErrors.author = "Author is required"
    if (!formData.isbn.trim()) newErrors.isbn = "ISBN is required"
    if (!formData.totalBook || parseInt(formData.totalBook) < 1) 
      newErrors.totalBook = "Must have at least 1 book"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.categoryId) newErrors.categoryId = "Category is required"
    if (!image) newErrors.image = "Book cover image is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setSuccessMessage("")
    
    const submitData = new FormData()
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key])
    })
    submitData.append("image", image)

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        body: submitData,
      })

      const data = await res.json()
      
      if (res.ok) {
        setSuccessMessage("Book uploaded successfully!")
        
        // Reset form
        setFormData({
          title: "",
          author: "",
          isbn: "",
          totalBook: "",
          description: "",
          categoryId: ""
        })
        setImage(null)
        setErrors({})
        
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/admin/book/book-show")
        }, 2000)
      } else {
        setErrors(prev => ({ ...prev, submit: data.error || "Upload failed" }))
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, submit: "An error occurred during upload" }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Upload a New Book</h2>
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
      
      {errors.submit && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Book Title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
          <input
            type="text"
            name="author"
            placeholder="Author Name"
            value={formData.author}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.author ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
        </div>

        {/* ISBN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
          <input
            type="text"
            name="isbn"
            placeholder="ISBN Number"
            value={formData.isbn}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.isbn ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.isbn && <p className="text-red-500 text-sm mt-1">{errors.isbn}</p>}
        </div>

        {/* Total Books */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Books</label>
          <input
            type="number"
            name="totalBook"
            placeholder="Number of copies"
            value={formData.totalBook}
            onChange={handleInputChange}
            min="1"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.totalBook ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.totalBook && <p className="text-red-500 text-sm mt-1">{errors.totalBook}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            placeholder="Book description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.categoryId ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Book Cover Image {!image && <span className="text-red-500">*</span>}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={e => {
              setImage(e.target.files[0])
              if (errors.image) setErrors(prev => ({ ...prev, image: "" }))
            }}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.image ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          {image && (
            <p className="text-green-600 text-sm mt-1">
              Selected: {image.name}
            </p>
          )}
        </div>

        {/* Submit */}
        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
            isLoading 
              ? "bg-blue-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? 'Uploading...' : 'Upload Book'}
        </button>
      </form>
    </div>
  )
}