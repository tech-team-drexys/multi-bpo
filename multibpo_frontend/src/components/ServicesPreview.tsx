import React from 'react'

interface ServiceCardProps {
  icon: string
  title: string
  description: string
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description }) => {
  return (
    <div className="border-2 border-multibpo-blue-100 rounded-lg p-4 hover:border-multibpo-blue-300 transition-all duration-300 hover:shadow-md">
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="font-semibold text-multibpo-blue-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}

const ServicesPreview: React.FC = () => {
  const services = [
    {
      icon: '🧮',
      title: 'Contabilidade Especializada',
      description: 'Departamento Pessoal, Fiscal e Contábil'
    },
    {
      icon: '👥',
      title: 'Recursos Humanos',
      description: 'Gestão completa de pessoal'
    },
    {
      icon: '📊',
      title: 'Relatórios Fiscais',
      description: 'Obrigações acessórias automatizadas'
    },
    {
      icon: '🤖',
      title: 'Automação IA',
      description: 'Processamento inteligente de documentos'
    },
    {
      icon: '📱',
      title: 'Portal do Cliente',
      description: 'Acesso 24/7 aos dados contábeis'
    },
    {
      icon: '🔒',
      title: 'Compliance',
      description: 'Auditoria e conformidade regulatória'
    }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 mb-12">
      <h2 className="text-3xl font-bold text-multibpo-blue-900 text-center mb-8">
        🧮 Serviços BPO Contábeis
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            icon={service.icon}
            title={service.title}
            description={service.description}
          />
        ))}
      </div>
    </div>
  )
}

export default ServicesPreview