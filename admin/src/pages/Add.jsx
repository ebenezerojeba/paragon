// import React, { useState } from "react";
// import { assets } from "../assets/assets";
// import axios from "axios";
// import { backendUrl } from "../App";
// import { toast } from "react-toastify";

// const Add = ({ token }) => {
//   const [image1, setImage1] = useState(false);
//   const [image2, setImage2] = useState(false);
//   const [image3, setImage3] = useState(false);
//   const [image4, setImage4] = useState(false);

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [subCategory, setSubcategory] = useState("Polo");
//   const [category, setCategory] = useState("Tops");
//   const [bestSeller, setBestseller] = useState(false);
//   const [sizes, setSizes] = useState([]);

//   const formatNaira = (number) => {
//     return new Intl.NumberFormat('en-NG', {
//       style: 'currency',
//       currency: 'NGN',
//       minimumFractionDigits: 0,
//     }).format(number);
//     };

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData();

//       formData.append("name", name);
//       formData.append("description", description);
//       formData.append("price", price);
//       formData.append("category", category);
//       formData.append("subCategory", subCategory);
//       formData.append("bestSeller", bestSeller);
//       formData.append("sizes", JSON.stringify(sizes));

//       image1 && formData.append("image1", image1);
//       image2 && formData.append("image2", image2);
//       image3 && formData.append("image3", image3);
//       image4 && formData.append("image4", image4);

//       const response = await axios.post(
//         backendUrl + "api/product/add",
//         formData,
//         { headers: { token } }
//       );

//       if (response.data.success) {
//         toast.success(response.data.message);
//         setName("");
//         // setDescription("");
//         setImage1("");
//         setImage2("");
//         setImage3("");
//         setImage4("");
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   };

//   return (
//     <form
//       onSubmit={onSubmitHandler}
//       className="flex flex-col w-full items-start gap-3"
//     >
//       <div>
//         <p className="mb-2">Upload Image</p>
//         <div className="flex gap-2">
//           <label htmlFor="image1">
//             <img
//               className="w-20"
//               src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
//               alt=""
//             />
//             <input
//               onChange={(e) => setImage1(e.target.files[0])}
//               type="file"
//               id="image1"
//               hidden
//             />
//           </label>

//           <label htmlFor="image2">
//             <img
//               className="w-20"
//               src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
//               alt=""
//             />
//             <input
//               onChange={(e) => setImage2(e.target.files[0])}
//               type="file"
//               id="image2"
//               hidden
//             />
//           </label>

//           <label htmlFor="image3">
//             <img
//               className="w-20"
//               src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
//               alt=""
//             />
//             <input
//               onChange={(e) => setImage3(e.target.files[0])}
//               type="file"
//               id="image3"
//               hidden
//             />
//           </label>

//           <label htmlFor="image4">
//             <img
//               className="w-20"
//               src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
//               alt=""
//             />
//             <input
//               onChange={(e) => setImage4(e.target.files[0])}
//               type="file"
//               id="image4"
//               hidden
//             />
//           </label>
//         </div>
//       </div>
//       <div className="w-full">
//         <p className="mb-2">Product Name</p>
//         <input
//           onChange={(e) => setName(e.target.value)}
//           value={name}
//           className="w-full max-w-[500px] px-3 py-2"
//           type="text"
//           placeholder="Type here"
//           required
//         />
//       </div>
//       <div className="w-full">
//         <p className="mb-2">Product Description</p>
//         <textarea
//           onChange={(e) => setDescription(e.target.value)}
//           value={description}
//           className="w-full max-w-[500px] px-3 py-2"
//           type="text"
//           placeholder="Write content here"
//           required
//         />
//       </div>
//       <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-6">
//         <div>
//           <p className="mb-2">Product Category</p>
//           <select
//             onChange={(e) => setCategory(e.target.value)}
//             value={category}
//             className="w-full px-3 py-2"
//           >
//             <option value="Tops">Tops</option>
//             <option value="Bottoms">Bottoms</option>
//             <option value="Outerwears">Outerwears</option>
//           </select>
//         </div>
//         <div>
//           <p className="mb-2">Sub Category</p>
//           <select
//             onChange={(e) => setSubcategory(e.target.value)}
//             value={subCategory}
//             className="w-full px-3 py-2"
//           >
//             <option value="Polo">Polo</option>
//             <option value="Shorts">Shorts</option>
//             <option value="Jackets">Jackets</option>
//             <option value="Hoodies">Hoodies</option>
//             <option value="Cargo">Cargo</option>
//             <option value="Pants">Pants</option>
//             <option value="Jeans">Jeans</option>
//             <option value="Sweatshirt">Sweatshirt</option>
//           </select>
//         </div>

//         <div>
//           <p className="mb-2">Product Price</p>
//           <input
//             onChange={(e) => setPrice(e.target.value)}
//             value={price}
//             className="w-full px-3 py-2 sm:w-[120px]"
//             type="Number"
//             placeholder="1,000"
//           />
//         </div>
//       </div>
//       <div>
//         <p className="mb-2">Product Sizes</p>
//         <div className="flex gap-3">
//           {["S", "M", "L", "XL", "XXL","3XL"].map((size) => (
//             <div
//               key={size}
//               onClick={() =>
//                 setSizes((prev) =>
//                   prev.includes(size)
//                     ? prev.filter((item) => item !== size)
//                     : [...prev, size]
//                 )
//               }
//             >
//               <p
//                 className={`${
//                   sizes.includes(size) ? "bg-pink-100" : "bg-slate-200"
//                 } px-3 py-1 cursor-pointer`}
//               >
//                 {size}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="flex gap-2 mt-2">
//         <input
//           onChange={() => setBestseller((prev) => !prev)}
//           checked={bestSeller}
//           type="checkbox"
//           id="bestSeller"
//         />
//         <label className="cursor-pointer" htmlFor="bestSeller">
//           Add to bestseller
//         </label>
//       </div>
//       <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
//         ADD
//       </button>
//     </form>
//   );
// };

// export default Add;


import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [subCategory, setSubcategory] = useState("Polo");
  const [category, setCategory] = useState("Tops");
  const [bestSeller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const formatNaira = (number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(number);
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setImage1(false);
    setImage2(false);
    setImage3(false);
    setImage4(false);
    setSizes([]);
    setBestseller(false);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestSeller", bestSeller);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "api/product/add",
        formData,
        {
          headers: { token },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
  

      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          <label htmlFor="image1">
            <img
              className="w-20"
              src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
              alt=""
            />
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
              hidden
            />
          </label>

          <label htmlFor="image2">
            <img
              className="w-20"
              src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
              alt=""
            />
            <input
              onChange={(e) => setImage2(e.target.files[0])}
              type="file"
              id="image2"
              hidden
            />
          </label>

          <label htmlFor="image3">
            <img
              className="w-20"
              src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
              alt=""
            />
            <input
              onChange={(e) => setImage3(e.target.files[0])}
              type="file"
              id="image3"
              hidden
            />
          </label>

          <label htmlFor="image4">
            <img
              className="w-20"
              src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
              alt=""
            />
            <input
              onChange={(e) => setImage4(e.target.files[0])}
              type="file"
              id="image4"
              hidden
            />
          </label>
        </div>
      </div>
      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          required
        />
      </div>
      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Write content here"
          required
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-6">
        <div>
          <p className="mb-2">Product Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full px-3 py-2"
          >
            <option value="Tops">Tops</option>
            <option value="Bottoms">Bottoms</option>
            <option value="Outerwears">Outerwears</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Sub Category</p>
          <select
            onChange={(e) => setSubcategory(e.target.value)}
            value={subCategory}
            className="w-full px-3 py-2"
          >
            <option value="Polo">Polo</option>
            <option value="Shorts">Shorts</option>
            <option value="Jackets">Jackets</option>
            <option value="Hoodies">Hoodies</option>
            <option value="Cargo">Cargo</option>
            <option value="Pants">Pants</option>
            <option value="Jeans">Jeans</option>
            <option value="Sweatshirt">Sweatshirt</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="Number"
            placeholder="1,000"
          />
        </div>
      </div>
      <div>
        <p className="mb-2">Product Sizes</p>
        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL","3XL"].map((size) => (
            <div
              key={size}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((item) => item !== size)
                    : [...prev, size]
                )
              }
            >
              <p
                className={`${
                  sizes.includes(size) ? "bg-pink-100" : "bg-slate-200"
                } px-3 py-1 cursor-pointer`}
              >
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestSeller}
          type="checkbox"
          id="bestSeller"
        />
        <label className="cursor-pointer" htmlFor="bestSeller">
          Add to bestseller
        </label>
      </div>
      

      <div className="w-full max-w-[500px]">
        {isUploading && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-black h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Uploading product... {uploadProgress}%
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isUploading}
          className={`w-28 py-3 bg-black text-white ${
            isUploading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isUploading ? 'Uploading...' : 'ADD'}
        </button>
      </div>
    </form>
  );
};

export default Add;