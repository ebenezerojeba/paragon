import React from 'react'
import Hero from '../components/Hero';
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';
import NewsLetter from '../components/NewsLetter';

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <NewsLetter />
    </div>
  )
}

export default Home;
