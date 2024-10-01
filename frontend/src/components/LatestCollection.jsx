import React, { useEffect, useState } from "react";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(13, 20));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"LATEST"} text2={"COLLECTION"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
        Explore our newest collection and stay ahead of the trends. Discover unique pieces that will elevate your style and make a statement.
        </p>
      </div>
      {/* Rendering Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProducts.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};
export default LatestCollection;
//
// import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/ShopContext";
// import { products } from "../assets/assets";
// import Title from "./Title";
// import ProductItem from "./ProductItem";
//
// const LatestCollection = () => {
// const { product } = useContext(ShopContext);
// const [latestProducts, setLatestProducts] = useState([]);
// const [loading, setLoading] = useState(true);
//
// useEffect(() => {
// const fetchProducts = async () => {
// try {
// Simulate a loading delay
// setTimeout(() => {
// setLatestProducts(product.slice(0, 10));
// setLoading(false);
// }, 500);
// } catch (error) {
// console.error("Failed to fetch products", error);
// setLoading(false);
// }
// };
//
// fetchProducts();
// }, [products]);
//
// return (
// <div className="my-10">
{
  /* <div className="text-center py-8 text-3xl"> */
}
{
  /* <Title text1={"LATEST"} text2={"COLLECTION"} /> */
}
{
  /* <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600"> */
}
{
  /* Explore our newest collection and stay ahead of the trends. Discover */
}
{
  /* unique pieces that will elevate your style and make a statement. */
}
{
  /* </p> */
}
{
  /* </div> */
}
{
  /*  */
}
{
  /* {loading ? ( */
}
// Loading Placeholder
// <div className="flex justify-center items-center h-64">
{
  /* <p className="text-gray-600">Loading...</p> */
}
{
  /* </div> */
}
// ) : (
// Rendering Products
// <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
{
  /* {latestProducts.map((item) => ( */
}
// <ProductItem
// key={item._id}
// id={item._id}
// image={item.image}
// name={item.name}
// price={item.price}
// alt={`Image of ${item.name}`}
// />
// ))}
{
  /* </div> */
}
// )}
{
  /* </div> */
}
// );
// };
//
// export default LatestCollection;
//
