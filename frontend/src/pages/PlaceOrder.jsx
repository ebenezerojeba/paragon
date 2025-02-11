import React, { useMemo, useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import PaystackPop from "@paystack/inline-js";
import { ngst, lgasByState } from "../data.js";
import { toast } from "react-toastify";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import {
  Loader2,
  CreditCard,
  Truck,
  ArrowDown,
  ArrowRight,
} from "lucide-react";
import Title from "../components/Title.jsx";

const libraries = ["places"];

const PlaceOrder = () => {
  const {
    navigate,
    cartItems,
    token,
    setCartItems,
    getCartAmount,
    products,
    formatNaira,
    backendUrl,
  } = useContext(ShopContext);
  const [showSummary, setShowSummary] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: "",
    deliveryFee: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedLGA, setSelectedLGA] = useState("");
  const [lgas, setLGAs] = useState([]);

  useEffect(() => {
    if (selectedState && selectedState !== "0") {
      setLGAs(lgasByState[selectedState] || []);
    } else {
      setLGAs([]);
    }
    setSelectedLGA("");
  }, [selectedState]);

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };
  const handleLGAChange = (e) => {
    setSelectedLGA(e.target.value);
  };
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.VITE_GOOGLE_API_KEY,
    libraries,
  });
  const toggleSummary = () => {
    setShowSummary((prev) => !prev);
  };
  const [autocomplete, setAutocomplete] = useState(null);

  const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChanged = (e) => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      setFormData((prev) => ({
        ...prev,
        address: place.formatted_address,
        city:
          place.address_components.find((c) => c.types.includes("locality"))
            ?.long_name || "",
        state:
          place.address_components.find((c) =>
            c.types.includes("administrative_area_level_1")
          )?.long_name || "",
      }));
    }
  };

  const onChangeHandler = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: {
          ...formData,
          state: selectedState,
          lga: selectedLGA,
        },
        items: orderItems,
        subtotal: getCartAmount(),
        deliveryFee: formData.deliveryFee,
        amount: getCartAmount() + formData.deliveryFee,
        shippingMethod: formData.shippingMethod,
      };

      const initPaystack = async (orderData) => {
        if (typeof PaystackPop === "undefined") {
          console.error("Paystack library not loaded.");
          toast.error("Payment service unavailable. Please try again later.");
          return;
        }

        const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY; // Replace with your actual Paystack public key
        const totalAmount = getCartAmount() + formData.deliveryFee;

        const handler = new PaystackPop({
          key: paystackPublicKey,
          email: formData.email, // Customer's email
          amount: totalAmount * 100, // Amount is in kobo
          onSuccess: async (response) => {
            // Handle successful payment
            if (response.status === "success") {
              // Check if the payment is successful
              try {
                const verificationResponse = await axios.get(
                  backendUrl + "api/order/verify",
                  { orderId: orderData.orderId, reference: response.reference }
                );
                // navigate(`/verify?success=true&orderId=${orderData.orderId}`);

                // If verification is successful
                if (verificationResponse.data.success) {
                  // Clear the cart
                  setCartItems({});

                  // Navigate to the orders page
                  navigate("/orders");
                } else {
                  toast.error("Payment verification failed. Please try again.");
                }
              } catch (verificationError) {
                console.error("Verification error:", verificationError);
                toast.error(
                  "An error occurred during payment verification. Please try again."
                );
              }
            } else {
              toast.error("Payment was not successful");
              navigate("/");
            }
          },
          onClose: () => {
            console.log("Payment popup closed.");
            toast.info("Payment process canceled.");
          },
        });

        // Open the Paystack payment modal
        handler.open();
      };

      switch (paymentMethod) {
        case "paystack":
          const response = await axios.post(
            backendUrl + "api/order/paystack",
            orderData,
            { headers: { token } }
          );
          if (response.data.success) {
            initPaystack(response.data.order);
          } else {
            toast.error(response.data.message);
          }
          break;
        case "cash-on-delivery":
          const codResponse = await axios.post(
            backendUrl + "api/order/place",
            orderData,
            { headers: { token } }
          );
          if (codResponse.data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(codResponse.data.message);
          }
          break;
        default:
          toast.error("Please select a valid payment method");
          break;
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.message || "An error occurred while processing your order."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-xl sm:text-2xl my-3">
        <Title text1={"DELIVERY"} text2={"INFORMATION"} />
      </div>
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-6 pt-5 min-h-[80vh] border-t bg-neutral-50"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={onChangeHandler}
            placeholder="First name"
            required
          />
          <input
            className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={onChangeHandler}
            placeholder="Last name"
            required
          />

          <input
            className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            name="email"
            value={formData.email}
            onChange={onChangeHandler}
            placeholder="Email"
            required
          />
          <input
            className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onChangeHandler}
            placeholder="Phone number"
            required
          />
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input
              className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="address"
              value={formData.address}
              onChange={onChangeHandler}
              placeholder="Address"
              required
            />
          </Autocomplete>

          <select
            className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="state"
            value={selectedState}
            onChange={handleStateChange}
            placeholder="State"
            required
          >
            {ngst.map((state) => (
              <option key={state.ID} value={state.ID}>
                {state.Name}
              </option>
            ))}
          </select>
        </div>
        {selectedState && selectedState !== "0" && (
          <select
            className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:"
            type="text"
            name="state"
            value={selectedLGA}
            onChange={handleLGAChange}
            placeholder="State"
            required
          >
            <option value="">select LGA</option>
            {lgas.map((lga) => (
              <option key={lga} value={lga}>
                {lga}
              </option>
            ))}
          </select>
        )}

        {/* Shipping Method */}

        <div className="mt-8">
          <div className=" from-neutral-600text-xl sm:text-2xl my-3">
            <Title text1={"SHIPPING"} text2={"METHOD"} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <label className="flex items-center gap-2 p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="shippingMethod"
                value="lagos"
                checked={formData.shippingMethod === "lagos"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    shippingMethod: "lagos",
                    deliveryFee: 4500,
                  }))
                }
                className="w-4 h-4 flex jsutify-between items-center"
              />
              <Truck className="w-6 h-6" />
              <span>
                Standard (Within Lagos) <p className="font-bold ">₦4,500</p>
              </span>
            </label>
            <label className="flex items-center gap-2 p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="shippingMethod"
                value="southwest"
                checked={formData.shippingMethod === "southwest"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    shippingMethod: "southwest",
                    deliveryFee: 6500,
                  }))
                }
                className="w-4 h-4 flex jsutify-between items-center"
              />
              <Truck className="w-6 h-6" />
              <span>
                South West( Ekiti, Osun, Ondo, Ogun, Oyo){" "}
                <p className="font-bold">₦6,500</p>
              </span>
            </label>
            <label className="flex items-center gap-2 p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="shippingMethod"
                value="southeast"
                checked={formData.shippingMethod === "southeast"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    shippingMethod: "southeast",
                    deliveryFee: 7000,
                  }))
                }
                className="w-4 h-4 flex jsutify-between items-center"
              />
              <Truck className="w-6 h-6" />
              <span>
                South East(Abia, Anambara, Ebonyi, Enugu, Imo){" "}
                <p className="font-bold">₦7,500</p>
              </span>
            </label>
            <label className="flex items-center gap-2 p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="shippingMethod"
                value="abuja"
                checked={formData.shippingMethod === "abuja"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    shippingMethod: "abuja",
                    deliveryFee: 7500,
                  }))
                }
                className="w-4 h-4 flex jsutify-between items-center"
              />
              <Truck className="w-6 h-6" />
              <span>
                Abuja <p className="font-bold">₦7,500</p>
              </span>
            </label>
            <label className="flex items-center gap-2 p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="shippingMethod"
                value="southsouth"
                checked={formData.shippingMethod === "southsouth"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    shippingMethod: "southsouth",
                    deliveryFee: 7500,
                  }))
                }
                className="w-4 h-4 flex jsutify-between items-center"
              />
              <Truck className="w-6 h-6" />
              <span>
                South South(Akwa-Ibom, Bayelsa, Croos-River, Delta, Edo, River){" "}
                <p className="font-bold">₦7,500</p>{" "}
              </span>
            </label>
            <label className="flex items-center gap-2 p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="shippingMethod"
                value="southsouth"
                checked={formData.shippingMethod === "southsouth"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    shippingMethod: "allnorthernstate",
                    deliveryFee: 8000,
                  }))
                }
                className="w-4 h-4 flex jsutify-between items-center"
              />
              <Truck className="w-6 h-6" />
              <span>
                All Northen States <p className="font-bold">₦8,000</p>{" "}
              </span>
            </label>
          </div>
        </div>

        {/* Payment Method */}

        <div className="mt-8">
          <div className="text-xl sm:text-2xl my-3">
            <Title text1={"PAYMENT"} text2={"METHOD"} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center gap-2 p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="paystack"
                checked={paymentMethod === "paystack"}
                onChange={() => setPaymentMethod("paystack")}
                className="w-5 h-5"
              />
              <CreditCard className="w-6 h-6" />
              <span>Pay Online</span>
            </label>
            <label className="flex items-center gap-2 p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="cash-on-delivery"
                checked={paymentMethod === "cash-on-delivery"}
                onChange={() => setPaymentMethod("cash-on-delivery")}
                className="w-5 h-5"
              />
              <Truck className="w-6 h-6" />
              <span>Cash on Delivery</span>
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div></div>
        <div className="mt-8">
          <Title text1={"ORDER"} text2={"TOTAL"} />
          <span
            type="button"
            onClick={toggleSummary}
            className="text-lg ml-3 absolute font-semibold "
          >
            {showSummary ? <ArrowRight /> : <ArrowDown />}
          </span>

          {showSummary && (
            <div className="bg-gray-50 p-6 rounded-lg">
              {/* <h3 className="text-2xl font-semibold mb-4">Order Summary</h3> */}
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span className="font-medium">
                  {formatNaira(getCartAmount())}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Delivery Fee:</span>
                <span className="font-medium">
                  <p>
                    {getCartAmount() === 0
                      ? 0
                      : formatNaira(formData.deliveryFee)}
                  </p>
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                <span>Total:</span>
                <span>
                  {getCartAmount() === 0
                    ? 0
                    : formatNaira(getCartAmount() + formData.deliveryFee)}
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors mt-8 flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Place Order"
          )}
        </button>
      </form>

      <p className="mt-4">
        {" "}
        Don't have an account yet? Kindly{" "}
        <a className="cursor-pointer text-blue-400" href={"/login"}>
          Sign Up
        </a>
      </p>
    </div>
  );
};

export default PlaceOrder;
