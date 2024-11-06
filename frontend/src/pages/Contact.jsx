
import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetter from "../components/NewsLetter";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img
          className="w-full md:max-w-[480px] rounded-lg shadow-lg"
          src={assets.about_3}
          alt="Contact us"
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">Our Store</p>
          <p className="text-gray-500">
            <img className="w-5" src={assets.pin} alt="" />
            Shop 15, Abudu Street, University Road <br /> Abule Oja, Lagos
          </p>
          <p className="text-gray-500">
            <a href="tel:07054566210">
              <img className="w-5" src={assets.phone} alt="" />
              07054566210
            </a>
          </p>
          <p className="text-gray-500">
            <a href="mailto:Paragon@gmail.com">
              {" "}
              <img className="w-5" src={assets.mail} alt="" />
              Paragon@gmail.com
            </a>
          </p>
        </div>
      </div>

      <div className="flex justify-center -mt-20 -mb-20">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1315.9054820001713!2d3.38147413281288!3d6.518942766578235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8cf927f385ad%3A0xff8028d0980d19b8!2sAbudu%20St%2C%20Lagos%20Mainland%2C%20Oyadiran%20Estate%2FAbule-Oja%20101245%2C%20Lagos!5e0!3m2!1sen!2sng!4v1724949677218!5m2!1sen!2sng"
          width="100%"
          height="350"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-lg shadow-lg"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
