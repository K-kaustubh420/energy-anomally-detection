import React, { Suspense } from 'react'
import Dashboard from './dashboard'

const page = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-[#050505]"></div>}>
      <Dashboard/>
    </Suspense>
  )
}

export default page