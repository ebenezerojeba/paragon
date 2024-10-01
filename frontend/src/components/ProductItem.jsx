import React, { useContext } from "react";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
  const formatNaira = (number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <Link
      className="text-gray-700 cursor-pointer"
      to={`/product/${id}`}
      aria-label={`View details for ${name}`}
    >
      <div className="overflow-hidden">
        <img
          className="hover:scale-110 transition ease-in-out"
          src={image.length > 0 ? image[0] : "/path/to/default-image.jpg"} // Fallback image
          alt={`Image of ${name}`}
        />
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium">{formatNaira(price)}</p>
    </Link>
  );
};

export default ProductItem;
