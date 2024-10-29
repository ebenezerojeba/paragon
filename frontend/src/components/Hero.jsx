import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { ChevronRight } from "lucide-react";
import { assets } from "../assets/assets";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const words = ["EXCLUSIVE", "PREMIUM", "LUXURIOUS"];
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const slides = [
    { img: assets.swiper5, alt: "Hero Slide 1" },
    { img: assets.swiper1, alt: "Hero Slide 2" },
    { img: assets.swiper2, alt: "Hero Slide 3" },
    { img: assets.swiper3, alt: "Hero Slide 4" },
    { img: assets.swiper4, alt: "Hero Slide 5" },
  ];

  return (
    <div className="flex flex-col lg:flex-row border border-gray-400 shadow-lg overflow-hidden min-h-[500px] lg:min-h-[600px]">
      {/* Enhanced Left Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 lg:p-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative w-full max-w-xl">
          {/* Animated Badge */}
          <div
            className={`transform transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="inline-block bg-black text-white text-xs md:text-sm px-4 py-1 rounded-full mb-4 md:mb-6">
              {words[currentWord]}
            </div>
          </div>

          {/* Main Heading */}
          <h1
            className={`text-3xl font-ysabeau md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 md:mb-6 transition-all duration-1000 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <span className="font-ysabeau block">Discover Our</span>
            <span className="font-ysabeau block mt-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Latest Collection
            </span>
          </h1>

          {/* Description */}
          <p
            className={`text-gray-600 text-sm md:text-base lg:text-lg mb-6 md:mb-8 max-w-md transition-all duration-1000 delay-300 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            Elevate your style with our carefully curated selection of premium
            pieces
          </p>

          {/* CTA Button */}
          <button
          
            className={`group flex items-center gap-2 bg-black text-white px-6 py-3 md:px-8 md:py-4 rounded-full 
            transform transition-all duration-300 hover:scale-105 text-sm md:text-base ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
           <a href="#collection"> Explore Now </a>
            <ChevronRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Right Side with Enhanced Swiper */}
      <div className="w-full lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40 z-10"></div>
        <Swiper
          spaceBetween={0}
          centeredSlides={true}
          effect="fade"
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          fadeEffect={{
            crossFade: true,
          }}
          speed={1500}
          pagination={{
            clickable: true,
            dynamicBullets: true,
            bulletClass: "custom-pagination-bullet",
            bulletActiveClass: "custom-pagination-bullet-active",
          }}
          navigation={false}
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          className="h-full [&_.custom-pagination-bullet]:w-2.5 [&_.custom-pagination-bullet]:h-2.5 [&_.custom-pagination-bullet]:inline-block [&_.custom-pagination-bullet]:rounded-full [&_.custom-pagination-bullet]:bg-gray-400/70 [&_.custom-pagination-bullet]:mx-1 [&_.custom-pagination-bullet]:cursor-pointer [&_.custom-pagination-bullet-active]:bg-white [&_.swiper-pagination]:bottom-6 [&_.swiper-pagination]:z-20"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="aspect-[4/3] lg:aspect-auto lg:h-full">
                <img
                  className="w-full h-full object-cover transform transition-transform duration-[2000ms] hover:scale-110"
                  src={slide.img}
                  alt={slide.alt}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Hero;
