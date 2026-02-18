import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/hero'
import AnalyticsAndMetrics from './components/Analytics'

const page = () => {
  return (
    <div>
    <Navbar/>
    <Hero/>
    <AnalyticsAndMetrics/>
    </div>
  )
}

export default page