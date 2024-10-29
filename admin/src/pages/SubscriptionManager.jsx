import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { backendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import SubscriptionRow from "../components/SubscriptionRow";

const SubscriptionManager = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}api/subscribe/newsletter`);
      setEmails(response.data.emails);
    } catch (error) {
      toast.error("Failed to fetch subscriptions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };



  


  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Subscription Manager</h2>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Email Subscription
              </th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                </td>
              </tr>
            ) : emails.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8">
                  No subscriptions found
                </td>
              </tr>
            ) : (
              emails.map((item) => (
                <SubscriptionRow
                  key={item._id}
                  email={item}
                  
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscriptionManager;
