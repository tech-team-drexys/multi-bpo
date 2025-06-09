import React from 'react'

interface StatusCardProps {
  icon: string
  title: string
  description: string
}

const StatusCard: React.FC<StatusCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 text-center card-hover">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-semibold text-multibpo-blue-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}

const StatusCards: React.FC = () => {
  const statusItems = [
    {
      icon: '✅',
      title: 'Docker',
      description: '4 Containers Ativos'
    },
    {
      icon: '🗄️',
      title: 'PostgreSQL',
      description: 'Banco de Dados'
    },
    {
      icon: '🐍',
      title: 'Django',
      description: 'Backend API'
    },
    {
      icon: '⚛️',
      title: 'React',
      description: 'Frontend'
    }
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {statusItems.map((item, index) => (
        <StatusCard
          key={index}
          icon={item.icon}
          title={item.title}
          description={item.description}
        />
      ))}
    </div>
  )
}

export default StatusCards