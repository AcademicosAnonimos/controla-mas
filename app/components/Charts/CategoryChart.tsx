'use client'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface CategoryChartProps {
  data: Array<{ categoria: string; total: number }>
}

export default function CategoryChart({ data }: CategoryChartProps) {
  const chartData = {
    labels: data.map(item => item.categoria),
    datasets: [
      {
        data: data.map(item => item.total),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
          '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      }
    }
  }

  return (
    <div style={{ height: '300px' }}>
      {data.length > 0 ? (
        <Doughnut data={chartData} options={options} />
      ) : (
        <div className="text-center text-muted py-5">
          <i className="fas fa-chart-pie fa-3x mb-3"></i>
          <p>No hay datos para mostrar</p>
        </div>
      )}
    </div>
  )
}