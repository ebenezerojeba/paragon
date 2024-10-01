import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img src={assets.log2} className="mb-4 w-32" alt="" />
          <p className="w-full md:w-2/3 text-gray-600 capitalize">
          Your go-to destination for premium wears
          </p>
          <div className="flex gap-3 mt-5">
          <a href="https://www.instagram.com/paragon_hub_ng?igsh=MXc5Zm81b2t1OGxwZw=="><img className="w-8" src={assets.instagram} alt="" /></a>
          <a href="https://wa.link/udghcn"><img className="w-8" src={assets.whatsapp} alt="" /></a>
          </div>
        </div>
        {/* <div> */}
          {/* <p className="text-xl font-medium mb-5">COMPANY</p> */}
          {/* <ul className="flex flex-col gap-1 text-gray-600"> */}
            {/* <li>Home</li> */}
            {/* <li>About</li> */}
            {/* <li>Delivery</li> */}
            {/* <li>Privacy Policy</li> */}
          {/* </ul> */}
        {/* </div> */}
        <div>
          <p className="text-xl font-medium -mt-5 mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <a href="tel:07054566210">07054566210</a>
            <a href="mailto:Paragon@gmail.com">Paragon@gmail.com</a>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
  © 2024 Paragon Hub. All rights reserved. <br />
 Developed by <span className="text-blue-400"> <a href="https://ebenezerojeba.vercel.app/" className="underline" target="_blank" rel="noopener noreferrer">Ojeba Ebenezer</a></span>
</p>

      </div>
    </div>
  );
};

export default Footer;
