import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/hero'
import AnalyticsAndMetrics from './components/Analytics'
import Comparison from './components/Comparison'

const page = () => {
  return (
    <div>
    <Navbar/>
    <Hero/>
    <AnalyticsAndMetrics/>
    <Comparison/>
    </div>
  )
}

export default page