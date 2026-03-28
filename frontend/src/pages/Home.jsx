import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import Banner from '../components/Banner'
import NearbyDoctors from '../components/NearbyDoctors'


const Home = () => {
  return (
    <div>
      <Header />
      <SpecialityMenu />
      <NearbyDoctors />
      <Banner />
    </div>
  )
}

export default Home
