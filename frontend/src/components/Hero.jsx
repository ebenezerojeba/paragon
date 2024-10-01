// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import { assets } from "../assets/assets";

// const Hero = () => {
//   return (
//     <div className="flex flex-col sm:flex-row border border-gray-400">
//       {/* Hero Left Side */}
//       <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
//         <div className="text-[#414141]">
//           <div className="flex items-center gap-2">
//             <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
//             <p className="font-medium text-sm md:text-base">OUR BESTSELLERS</p>
//           </div>
//           <h1 className="text-3xl sm:py-3 lg:text-5xl leading-relaxed">
//             Latest Arrivals
//           </h1>
//           <div className="flex items-center gap-2">
//             <p className="font-semibold text-sm md:text-base">SHOP NOW</p>
//             <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
//           </div>
//         </div>
//       </div>

//       {/* Hero Right Side */}
//       <div className="w-full sm:w-1/2">
//         <Swiper
//           spaceBetween={30}
//           centeredSlides={true}
//           autoplay={{
//             delay: 2500,
//             disableOnInteraction: false,
//           }}
//           pagination={{
//             clickable: true,
//           }}
//           navigation={false}
//           modules={[Autoplay, Pagination, Navigation]}
//           className="mySwiper"
//         >
//           <SwiperSlide>
//             <img
//               className="w-full h-auto bg-slate-300"
//               src={assets.swiper5}
//               alt="Hero Slide 1"
//             />
//           </SwiperSlide>
//           <SwiperSlide>
//             <img
//               className="w-full h-auto bg-slate-300"
//               src={assets.swiper1}
//               alt="Hero Slide 2"
//             />
//           </SwiperSlide>
//           <SwiperSlide>
//             <img
//               className="w-full h-auto bg-slate-300"
//               src={assets.swiper2}
//               alt="Hero Slide 3"
//             />
//           </SwiperSlide>
//           <SwiperSlide>
//             <img
//               className="w-full h-auto bg-slate-300"
//               src={assets.swiper3}
//               alt="Hero Slide 4"
//             />
//           </SwiperSlide>
//           <SwiperSlide>
//             <img
//               className="w-full h-auto bg-slate-300"
//               src={assets.swiper4}
//               alt="Hero Slide 5"
//             />
//           </SwiperSlide>
//         </Swiper>
//       </div>
//     </div>
//   );
// };

// export default Hero;


import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { assets } from "../assets/assets";
import './Hero.css'

const Hero = () => {
  const renderAnimatedText = (text, animationClass) => {
    return text.split("").map((char, index) => (
      <span
        key={index}
        className={`${animationClass} inline-flex`}
        style={{ animationDelay: `${index * .1}s` }} // Adjust the delay for each letter
      >
        {char}
      </span>
    ));
  };

  return (
    <div className="flex flex-col sm:flex-row border border-gray-400 shadow-lg">
      {/* Hero Left Side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base ">
              {renderAnimatedText("OUR  BESTSELLERS", "animate-letter")}
            </p>
          </div>
          <h1 className="text-3xl sm:py-3 lg:text-5xl leading-relaxed">
            {renderAnimatedText("Latest" + " " + "Arrivals", "animate-letter")}
          </h1>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base">
              {renderAnimatedText("SHOP   NOW", "animate-letter")}
            </p>
            <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
        </div>
        </div>
      </div>

      {/* Hero Right Side */}
      <div className="w-full sm:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 z-10"></div> {/* Overlay Gradient */}
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          effect="fade"
          autoplay={{
            delay: 1500,
            disableOnInteraction: false,
          }}
          fadeEffect={{ crossFade: true }}
          speed={1000}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet custom-bullet", // Custom pagination style
          }}
          navigation={false}
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          className="mySwiper"
        >
          <SwiperSlide>
            <img
              className="w-full h-auto bg-slate-300 transform transition-transform duration-1000 ease-in-out hover:scale-105"
              src={assets.swiper5}
              alt="Hero Slide 1"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="w-full h-auto bg-slate-300 transform transition-transform duration-1000 ease-in-out hover:scale-105"
              src={assets.swiper1}
              alt="Hero Slide 2"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="w-full h-auto bg-slate-300 transform transition-transform duration-1000 ease-in-out hover:scale-105"
              src={assets.swiper2}
              alt="Hero Slide 3"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="w-full h-auto bg-slate-300 transform transition-transform duration-1000 ease-in-out hover:scale-105"
              src={assets.swiper3}
              alt="Hero Slide 4"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="w-full h-auto bg-slate-300 transform transition-transform duration-1000 ease-in-out hover:scale-105"
              src={assets.swiper4}
              alt="Hero Slide 5"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default Hero;
