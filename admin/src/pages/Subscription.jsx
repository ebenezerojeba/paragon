import React, { useState, useEffect } from "react";
import Subtable from "../components/Subtable";
import { backendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";

const Subscription = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}api/subscribe/newsletter`);
      setEmails(response.data.emails);
    } catch (error) {
      toast.error("Failed to fetch emails.");
    } finally {
      setLoading(false);
    }
  };

  const deleteEmail = async (mongoId) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/subscribe/newsletter`,
        {
          params: { id: mongoId },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchEmails();
      } else {
        toast.error("Error deleting email.");
      }
    } catch (error) {
      toast.error("Failed to delete email.");
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
      <h1>All subscriptions</h1>
      <div className="relative max-w-[600px] h-[80vh] overflow-x-auto mt-4 border border-gray-400">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full text-sm text-gray-500">
            <thead className="text-xs text-left text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Email Subscription
                </th>
                <th scope="col" className="hidden sm:block px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {emails.map((item, index) => (
                <Subtable
                  key={index}
                  mongoId={item._id}
                  deleteEmail={deleteEmail}
                  email={item.email}
                  date={item.date}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Subscription;
