"use client"

import React, { useEffect, useState } from 'react'
import ShowBook from '../components/Show-book';

const page = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        async function fetchBooks(){
            try {
                const response = await fetch('/api/books/show-books');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setBooks(data);
            } catch (error) {
                console.error("Failed to fetch books:", error);
            } finally{
                setLoading(false);
            }
        }
        fetchBooks();
    }, []);

    if(loading){
        return <div>Loading...</div>;
    }
  return (
    <div>
      <ShowBook data={books} />
    </div>
  )
}

export default page
