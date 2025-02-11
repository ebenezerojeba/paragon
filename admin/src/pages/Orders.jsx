import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }
    try {
      const response = await axios.post(
        backendUrl + "api/order/list",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "api/order/status",
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(response.data.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {orders.map((order, index) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
            key={index}
          >
            <img className="w-12" src={assets.parcel_icon} alt="parcel-icon" />
            <div>
              <div>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return (
                      <p className="py-0.5" key={index}>
                        {item.name} x {item.quantity}{" "}
                        <span className="font-extrabold">
                          {" "}
                          Size: {item.size}
                        </span>
                      </p>
                    );
                  } else {
                    return (
                      <p className="py-0.5" key={index}>
                        {item.name} x {item.quantity}{" "}
                        <span className="font-extrabold">
                          {" "}
                          Size: {item.size}
                        </span>{" "}
                        ,
                      </p>
                    );
                  }
                })}

              </div>

              {
                order.address ? (
                  <>
                
              




              <p className="mt-3 mb-2 font-medium">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div>
                <p>{order.address.address}</p>
                <p>{order.address.lga}</p>
                <p>{order.address.state}</p>
              </div>
              <p>{order.address.phone}</p>

                 </>
                ) : (
                  <p className="text-red-500">Address deatils unavailable</p>
                )}

            </div>
            <div>
              <p className="text-sm sm:text-[15px]">
                Items : {order.items.length}
              </p>
              <p className="mt-3">Method : {order.paymentMethod}</p>
              <p>
                Payment :{" "}
                {order.paymentMethod === "Online" ? "Paid" : "Pending"}
              </p>
              <p>Date : {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p>Delivery Fee: {order.deliveryFee}</p>
            <p className="text-sm sm:text-[15px] font-bold">
              {" "}
              Total: {order.amount}
            </p>

            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className="p-2 font-semibold"
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
