"use client";

import BookFeed from "@/components/BookFeed";
import { useEffect, useState } from "react";

export default function BooksFeedPage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
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
        <>
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <BookFeed data={books}/>
        </div>
        </>
    )
}