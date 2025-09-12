"use client"

import { useState } from "react"

export default function BookUploadForm() {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [isbn, setIsbn] = useState("")
  const [totalBook, setTotalBook] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData()
    formData.append("title", title)
    formData.append("author", author)
    formData.append("isbn", isbn)
    formData.append("totalBook", totalBook)
    formData.append("description", description) 
    if (image) formData.append("image", image)

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (res.ok) {
        alert("Book uploaded successfully!")
        // Reset form
        setTitle("")
        setAuthor("")
        setIsbn("")
        setTotalBook("")
        setDescription("")
        setImage(null)
      } else {
        alert(data.error || "Upload failed")
      }
    } catch (error) {
      alert("An error occurred during upload")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Upload a New Book</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            placeholder="Book Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
          <input
            type="text"
            placeholder="Author Name"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
          <input
            type="text"
            placeholder="ISBN Number"
            value={isbn}
            onChange={e => setIsbn(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Books</label>
          <input
            type="number"
            placeholder="Number of copies"
            value={totalBook}
            onChange={e => setTotalBook(e.target.value)}
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            placeholder="Book description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Book Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files[0])}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors`}
        >
          {isLoading ? 'Uploading...' : 'Upload Book'}
        </button>
      </form>
    </div>
  )
}