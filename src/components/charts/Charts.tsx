import React from 'react';
import { useSelector } from 'react-redux';

import { Chart } from 'primereact/chart';

import { selectMatrixBoiler } from '../../utils/matrixBoilerSlice';

export default function Charts() {
  const matrixBoiler = useSelector(selectMatrixBoiler);

  if (!matrixBoiler.isDataInitialized || !matrixBoiler.isDataComplete) {
    return (
      <>
        <h1>Wykres</h1>
        <h2>Brak danych lub plik niewłaściwy</h2>
      </>
    );
  }

  // eslint-disable-next-line prefer-spread
  const labels = Array.apply(null, Array(10)).map(
    (_value, index) => `${index + 1}. obserwacja`
  );

  const lineStylesData = {
    labels,
    datasets: [
      {
        label: 'Model',
        data: matrixBoiler.matrix.getColumn(0).map((val) => val.toFixed(4)),
        fill: false,
        borderColor: '#42A5F5',
        lineTension: 0,
      },
      {
        label: 'Pomiar',
        data: matrixBoiler.estimatedYs.map((val) => val.toFixed(4)),
        fill: false,
        borderDash: [5, 5],
        borderColor: '#66BB6A',
        lineTension: 0,
      },
    ],
  };

  const multiAxisOptions = {
    responsive: true,
    hoverMode: 'index',
    stacked: false,
    scales: {
      xAxes: [
        {
          ticks: {
            fontColor: '#495057',
          },
          gridLines: {
            color: '#ebedef',
          },
        },
      ],
      yAxes: [
        {
          type: 'linear',
          display: true,
          position: 'left',
          id: 'y-axis-1',
          ticks: {
            fontColor: '#495057',
          },
          gridLines: {
            color: '#ebedef',
          },
        },
      ],
    },
    legend: {
      position: 'bottom',
      labels: {
        fontColor: '#495057',
      },
    },
  };
  return (
    <div className="p-grid">
      <div className="p-col-12">
        <h1>Wykres</h1>

        <Chart type="line" data={lineStylesData} options={multiAxisOptions} />
      </div>
    </div>
  );
}
