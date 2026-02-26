import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/hero'
import AnalyticsAndMetrics from './components/Analytics'
import Comparison from './components/Comparison'
import GenerateReports from './components/GenerateReports'

const page = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <AnalyticsAndMetrics />
      <Comparison />
      <GenerateReports />
    </div>
  )
}

export default page