'use client'
import { Bar } from 'react-chartjs-2'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface PredictionChartProps {
  data: Array<{ categoria: string; monto_predicho: number }>
}

export default function PredictionChart({ data }: PredictionChartProps) {
  const chartData = {
    labels: data.map(item => item.categoria),
    datasets: [
      {
        label: 'Monto Predicho',
        data: data.map(item => item.monto_predicho),
        backgroundColor: 'rgba(52, 152, 219, 0.6)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 1,
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Predicción para el próximo mes'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return new Intl.NumberFormat('es-AR', {
              style: 'currency',
              currency: 'ARS'
            }).format(value)
          }
        }
      }
    }
  }

  return (
    <div style={{ height: '300px' }}>
      {data.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <div className="text-center text-muted py-5">
          <i className="fas fa-chart-line fa-3x mb-3"></i>
          <p>No hay datos de predicción disponibles</p>
        </div>
      )}
    </div>
  )
}