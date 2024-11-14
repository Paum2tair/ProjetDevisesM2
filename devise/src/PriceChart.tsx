import { useEffect, useState, useRef } from "react";
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, zoomPlugin);

const PriceChart: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const chartRef = useRef<any>(null);  // Référence au composant Chart

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/requete.php/one_currency?id=USD");
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
      // Nettoyage du graphique
      if (chartRef.current) {
        const chartInstance = chartRef.current.chartInstance;
        if (chartInstance) {
          chartInstance.destroy();  // Détruire l'instance du graphique
        }
      }
    };
  }, []);

  const labels = filteredData.map((entry) => entry.date_value);
  const values = filteredData.map((entry) => entry.value);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    return date.toLocaleString('fr-FR', options);
  };

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Évolution du prix',
        data: values,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
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
        text: 'Évolution du prix en fonction du temps',
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          tooltipFormat: 'll HH:mm',
          displayFormats: {
            minute: 'HH:mm',
            hour: 'HH:mm',
          },
        },
        title: {
          display: true,
          text: 'Temps',
        },
        ticks: {
          autoSkip: true,
          maxRotation: 45,
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Prix',
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
      rangeMin: {
        x: 0,
        y: 0,
      },
      rangeMax: {
        x: 100,
        y: 100,
      },
    },
  };

  return (
    <div>
      <Line 
        data={chartData} 
        options={chartOptions}
        width={1200}
        height={600}
        ref={chartRef} // Attache la référence à ce composant
      />
    </div>
  );
};

export default PriceChart;
