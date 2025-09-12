"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function UserPage() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [role, setRole] = useState("");

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch(`/api/auth/Users/${id}`);
                const data = await response.json();
                setUser(data);
                setRole(data.role);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchUser();
    }, [id]);

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const handleEditRole = async () => {
        try {
            const response = await fetch(`/api/auth/Users/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role }),
            });
            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                setEditMode(false);
                alert("Role updated successfully!");
            } else {
                alert("Failed to update role.");
            }
        } catch (error) {
            alert("Error updating role.");
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            const response = await fetch(`/api/auth/Users/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                alert("User deleted successfully!");
                // Optionally redirect or update UI
            } else {
                alert("Failed to delete user.");
            }
        } catch (error) {
            alert("Error deleting user.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!user || user.message) return <div>User not found.</div>;

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">ID</p>
                        <p className="font-medium text-gray-800">{user.id}</p>
                    </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="font-medium text-gray-800">{user.name}</p>
                    </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium text-gray-800">{user.email}</p>
                    </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500">Role</p>
                        {editMode ? (
                            <select
                                value={role}
                                onChange={handleRoleChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                                <option value="admin">Admin</option>
                                <option value="member">Member</option>
                            </select>
                        ) : (
                            <p className="font-medium text-gray-800 capitalize">{user.role}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8 flex gap-3">
                {editMode ? (
                    <>
                        <button
                            onClick={handleEditRole}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save Changes
                        </button>
                        <button
                            onClick={() => { setEditMode(false); setRole(user.role); }}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setEditMode(true)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Role
                    </button>
                )}
                <button
                    onClick={handleDelete}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete User
                </button>
            </div>
        </div>
    );
}