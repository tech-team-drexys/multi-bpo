import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="text-center">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-multibpo-blue-900 font-semibold mb-2">
          🚀 MULTIBPO - Fase 1 Implementada com Sucesso!
        </p>
        <p className="text-gray-600 text-sm">
          Acesso: http://192.168.1.4:8082 | Admin: http://192.168.1.4:8082/admin
        </p>
      </div>
    </footer>
  )
}

export default Footer