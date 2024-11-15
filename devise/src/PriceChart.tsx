import { useEffect, useState, useRef } from "react";
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, zoomPlugin);

interface PriceChartProps {
  currency: string; // Nouvelle prop pour recevoir la devise sélectionnée
}

const PriceChart: React.FC<PriceChartProps> = ({ currency }) => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!currency) return; // Ne pas exécuter si aucune devise n'est sélectionnée

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/requete.php/one_currency?id=${currency}`);
        const result = await response.json();

        const transformedData = result.map((item: any) => ({
          date_value: new Date(item.date_value),
          value: item.value
        }));

        setData(transformedData);
        setFilteredData(transformedData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();

    return () => {
      if (chartRef.current) {
        const chartInstance = chartRef.current.chartInstance;
        if (chartInstance) {
          chartInstance.destroy();
        }
      }
    };
  }, [currency]); // Dépendance pour recharger les données quand la devise change

  const labels = filteredData.map((entry) => entry.date_value);
  const values = filteredData.map((entry) => entry.value);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: `Évolution de la valeur de (${currency})`,
        data: values,
        borderColor: '#B03052',
        backgroundColor: '#D76C82',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Évolution du taux de change en euro en fonction du temps',
        color: '#D9D9D9',
      },
      legend: {
        labels: {
          color: '#D9D9D9',
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => `Valeur: ${context.raw}`,
        },
        titleColor: '#D9D9D9',
        bodyColor: '#D9D9D9',
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'dd/MM/yyyy',
          },
        },
        title: {
          display: true,
          text: 'Temps',
          color: '#D9D9D9',
        },
        ticks: {
          color: '#D9D9D9',
          autoSkip: true,
          maxRotation: 45,
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: `valeur d'un ${currency} en EUR`,
          color: '#D9D9D9',
        },
        ticks: {
          color: '#D9D9D9',
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    zoom: {
      enabled: true,
      mode: 'xy',
    },
  };

  return (
    <div>
      <Line 
        data={chartData} 
        options={chartOptions}
        width={1200}
        height={300}
        ref={chartRef}
      />
    </div>
  );
};

export default PriceChart;
