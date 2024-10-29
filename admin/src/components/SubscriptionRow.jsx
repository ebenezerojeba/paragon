import axios from "axios";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { backendUrl } from "../App"; // Ensure backendUrl is properly defined

const SubscriptionRow = ({ email }) => {

  const onDelete = async (emailId) => {
    try {
      // Make the DELETE request to the backend
      const response = await axios.delete(`${backendUrl}api/subscribe/unsubscribe`, {
        data: { email: emailId }, // Correctly pass the email
      });

      if (response.status === 200) {
        toast.success("Subscriber deleted successfully");
        fetchEmails(); // Refresh the email list after deletion (make sure this function is available)
      } else {
        toast.error("Failed to delete subscriber");
      }
    } catch (error) {
      console.log("An error occurred while deleting the subscriber");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    try {
      return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <tr className="bg-white border-b hover:bg-gray-50">
      <td className="px-6 py-4 font-medium text-gray-900">
        {email.email || "N/A"}
      </td>
      <td className="px-6 py-4 hidden md:table-cell">
        {formatDate(email.date)}
      </td>
      <td className="px-6 py-4">
        <button
          onClick={() => onDelete(email.email)} // Pass the correct email to the onDelete function
          className="text-red-600 hover:text-red-800 transition-colors"
          aria-label={`Delete ${email.email}`}
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
};

export default SubscriptionRow;
