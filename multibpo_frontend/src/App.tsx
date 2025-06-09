import React from 'react'
import Header from './components/Header'
import StatusCards from './components/StatusCards'
import ServicesPreview from './components/ServicesPreview'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen multibpo-gradient">
      <div className="container mx-auto px-4 py-8">
        <Header />
        <StatusCards />
        <ServicesPreview />
        <Footer />
      </div>
    </div>
  )
}

export default App