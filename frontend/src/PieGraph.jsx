import React, { useState, useEffect } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import instance from './api/api';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const App = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get('http://localhost:5000/getUser');
        const { token, userData } = response.data;


        console.log(userData);
        setUserData(userData);
      } catch (error) {
        console.error('Error fetching authentication data:', error);
      }
    };

    fetchData();
  }, []);

  const sum = userData ? userData.C431_12_1 + userData.C431_12_2 + userData.C431_12_3 + userData.C431_12_4 : 0;

  const options = {
    exportEnabled: true,
    animationEnabled: true,
    title: {
      text: 'Course Outcome Breakup',
    },
    data: [
      {
        type: 'pie',
        startAngle: 75,
        toolTipContent: '<b>{label}</b>: {y}%',
        showInLegend: 'true',
        legendText: '{label}',
        indexLabelFontSize: 16,
        indexLabel: '{label} - {y}%',
        dataPoints: userData
          ? [
              { y: userData.C431_12_1 *100/ sum, label: 'CO1' },
              { y: userData.C431_12_2 *100/ sum, label: 'CO2' },
              { y: userData.C431_12_3 *100/ sum, label: 'CO3' },
              { y: userData.C431_12_4 *100/ sum, label: 'CO4' },
            ]
          : [],
      },
    ],
  };

  return (
    <div>
      <CanvasJSChart options={options} />
    </div>
  );
};

export default App;
