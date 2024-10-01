import React, { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const NewsLetter = () => {
  const { backendUrl } = useContext(ShopContext)
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        backendUrl + "api/subscribe/newsletter",
        { email }
      );
      setMessage(response.data.message);
      setEmail("");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
    setIsLoading(false);
  };

  return (
    <div className="text-center p-6">
      <p className="text-2xl font-medium text-gray-800">
        Subscribe now & get 20% off your first order
      </p>
      <p className="text-gray-600 mt-3">
        Join our community for exclusive deals, style tips, and first access to
        new collections.
      </p>
      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3"
      >
        <input
          className="w-full sm:flex-1 outline-none py-2"
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="bg-black text-white text-xs px-10 py-4 hover:bg-gray-800 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "SUBSCRIBING..." : "SUBSCRIBE"}
        </button>
      </form>
      {message && (
        <p
          className={`mt-2 ${
            message.includes("Thank you") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default NewsLetter;
