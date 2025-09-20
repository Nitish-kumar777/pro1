"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session, status } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [preview, setPreview] = useState("/default-avatar.png");
  const [file, setFile] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/me");
        if (res.ok) {
          const data = await res.json();
          setName(data.name || "");
          setEmail(data.email || "");
          setPreview(data.image || "/default-avatar.png");
        } else if (session?.user) {
          setName(session.user.name || "");
          setEmail(session.user.email || "");
          setPreview(session.user.image || "/default-avatar.png");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (session?.user) {
          setName(session.user.name || "");
          setEmail(session.user.email || "");
          setPreview(session.user.image || "/default-avatar.png");
        }
      } finally {
        setIsFetching(false);
      }
    }

    if (status === "authenticated") {
      fetchProfile();
    } else {
      setIsFetching(false);
    }
  }, [status, session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (file) formData.append("file", file);

    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        const updated = await res.json();
        setName(updated.name);
        setEmail(updated.email);
        setPreview(updated.image);
        setIsEditing(false);
        setMessage({ text: "Profile updated successfully!", type: "success" });
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setMessage({ text: "", type: "" });
        }, 3000);
      } else {
        console.error("Failed to update profile");
        setMessage({ text: "Failed to update profile. Please try again.", type: "error" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ text: "An error occurred. Please try again.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
      setPreview(session.user.image || "/default-avatar.png");
    }
    setFile(null);
    setIsEditing(false);
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
            <h1 className="text-2xl font-bold">Profile Settings</h1>
            <p className="text-blue-100">Manage your account information</p>
          </div>
          
          <div className="p-6 md:p-8">
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {message.text}
              </div>
            )}
            
            {!isEditing ? (
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Profile Preview */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold mt-4">{name || "No name"}</h2>
                  <p className="text-gray-500">{email || "No email"}</p>
                </div>
                
                {/* Account Details */}
                <div className="flex-1 border-l-0 md:border-l md:border-gray-200 md:pl-8 pt-4 md:pt-0">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Account Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-gray-800">{name || "Not provided"}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email Address</label>
                      <p className="text-gray-800">{email || "Not provided"}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Account Status</label>
                      <p className="text-green-600 font-medium">Verified</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Profile Picture Upload */}
                  <div className="md:w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                    <div className="flex flex-col items-center">
                      <div className="relative mb-4">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <label htmlFor="file-upload" className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => {
                              setFile(e.target.files[0]);
                              setPreview(URL.createObjectURL(e.target.files[0]));
                            }}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 text-center">Click the camera icon to upload a new photo. Max 2MB.</p>
                    </div>
                  </div>
                  
                  {/* Form Fields */}
                  <div className="md:w-2/3 space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter your email"
                      />
                    </div>
                    
                    <div className="pt-4 flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                      >
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save Changes
                          </>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium flex items-center gap-2 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
        
        {/* Additional Info Section
        {!isEditing && (
          <div className="mt-6 bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Security</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Change Password</h4>
                <p className="text-sm text-gray-500 mb-3">Update your password regularly to keep your account secure</p>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Change Password →
                </button>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500 mb-3">Add an extra layer of security to your account</p>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Enable 2FA →
                </button>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}