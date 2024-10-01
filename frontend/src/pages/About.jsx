import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsLetter from '../components/NewsLetter';

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={'ABOUT'} text2={'US'} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="About Paragon Hub" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>At Paragon Hub, we redefine men's fashion by blending style and comfort. Our carefully curated collection is designed to empower men to express their individuality with confidence.</p>
          <p>We take pride in sourcing high-quality pieces that cater to every occasion, from casual outings to formal events. Our mission is to elevate your wardrobe with stylish options that reflect your unique taste.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>Our mission is to provide exceptional quality and a seamless shopping experience, ensuring you find the perfect outfit that resonates with your personal style.</p>
        </div>
      </div>
      <div className="text-4xl py-4">
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>We meticulously select each item in our collection to ensure that you receive only the best. Quality is our top priority, so you can trust that every purchase is worth it.</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience:</b>
          <p className='text-gray-600'>Our user-friendly online platform makes shopping for men's wear easy and enjoyable. With just a few clicks, you can browse our extensive collection and find what you need.</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Our dedicated support team is here to assist you every step of the way. Whether you have questions about sizing or need styling advice, we're just a message away.</p>
        </div>
      </div>
      <NewsLetter />
    </div>
  );
};

export default About;
