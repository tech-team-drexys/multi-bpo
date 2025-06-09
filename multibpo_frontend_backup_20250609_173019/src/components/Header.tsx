import React from 'react'

const Header: React.FC = () => {
  return (
    <header className="text-center mb-16">
      <div className="bg-white rounded-2xl shadow-2xl p-8 mx-auto max-w-4xl">
        <h1 className="text-5xl font-bold text-multibpo-blue-900 mb-4 text-shadow">
          🏢 MULTIBPO
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Plataforma BPO Inteligente para Escritórios de Contabilidade
        </p>
        <div className="inline-block bg-multibpo-blue-900 text-white px-4 py-2 rounded-full text-sm font-semibold">
          🔷 FASE 1 - INFRAESTRUTURA BASE
        </div>
      </div>
    </header>
  )
}

export default Header