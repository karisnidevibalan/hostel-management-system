import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function RoomChart({ data }) {
  const canvasRef = useRef();

  useEffect(() => {
    if (!data.length) return;
    const ctx = canvasRef.current.getContext('2d');
    if (canvasRef.current.chart) {
      canvasRef.current.chart.destroy();
    }
    canvasRef.current.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(r => r.room_number),
        datasets: [
          {
            label: 'Occupied',
            data: data.map(r => r.occupied),
            backgroundColor: 'rgb(59,130,246)',
          },
          {
            label: 'Capacity',
            data: data.map(r => r.capacity),
            backgroundColor: 'rgb(16,185,129)',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
    // Cleanup
    return () => canvasRef.current.chart?.destroy();
  }, [data]);

  return <canvas ref={canvasRef} height={120} />;
}
