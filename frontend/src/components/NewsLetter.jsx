import React, { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const NewsLetter = () => {
  const { backendUrl } = useContext(ShopContext);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}api/subscribe/newsletter`,
        { email }
      );

      toast.success(response.data.message || "Subscribed successfully!");
      setEmail(""); // Clear email input after success
      // sendMail(email)
    } catch (error) {
      console.error("API Error:", error); // Log the error for debugging
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }

    setIsLoading(false);
  };

  return (
    <div className="text-center p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-medium text-gray-800 mb-2">
        Subscribe now & get 20% off your first order
      </h2>
      <p className="text-gray-600 mb-6">
        Join our community for exclusive deals, style tips, and first access to
        new collections.
      </p>
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col sm:flex-row items-center gap-3"
      >
        <div className="relative w-full">
          <input
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin h-5 w-5 text-gray-400" />
          )}
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
    </div>
  );
};
export default NewsLetter;
