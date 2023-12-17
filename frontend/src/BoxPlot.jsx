import React, { useEffect, useState } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import instance from './api/api';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const App = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get('http://localhost:5000/api/getAllUsers');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchData();
  }, []);

  let options = {
    theme: 'light2',
    animationEnabled: true,
    title: {
      text: 'Marks Distribution',
    },
    axisY: {
      title: 'Marks Percentile',
    },
    data: [],
  };

  if (users && users.length > 0) {
    const t1Values = users.map(user => user.T1);

    const sortedT1Values = t1Values.sort((a, b) => a - b);

    const minimum = sortedT1Values[0];
    const maximum = sortedT1Values[sortedT1Values.length - 1];

    const q1Index = Math.floor(sortedT1Values.length / 4);
    const q2Index = Math.floor(sortedT1Values.length / 2);
    const q3Index = Math.floor((3 * sortedT1Values.length) / 4);

    const q1 = sortedT1Values[q1Index];
    const q2 = sortedT1Values[q2Index];
    const q3 = sortedT1Values[q3Index];

    const t2Values = users.map(user => user.T2);

    const sortedT2Values = t2Values.sort((a, b) => a - b);

    const minimumT2 = sortedT2Values[0];
    const maximumT2 = sortedT2Values[sortedT2Values.length - 1];

    const q1IndexT2 = Math.floor(sortedT2Values.length / 4);
    const q2IndexT2 = Math.floor(sortedT2Values.length / 2);
    const q3IndexT2 = Math.floor((3 * sortedT2Values.length) / 4);

    const q1T2 = sortedT2Values[q1IndexT2];
    const q2T2 = sortedT2Values[q2IndexT2];
    const q3T2 = sortedT2Values[q3IndexT2];

    // console.log('Minimum T2:', minimumT2);
    // console.log('Q1 T2:', q1T2);
    // console.log('Median (Q2) T2:', q2T2);
    // console.log('Q3 T2:', q3T2);
    // console.log('Maximum T2:', maximumT2);

    const t3Values = users.map(user => user.T3);
    // console.log(t3Values);
    const sortedT3Values = t3Values.sort((a, b) => a - b);

    const minimumT3 = sortedT3Values[0];
    const maximumT3 = sortedT3Values[sortedT3Values.length - 1];

    const q1IndexT3 = Math.floor(sortedT3Values.length / 4);
    const q2IndexT3 = Math.floor(sortedT3Values.length / 2);
    const q3IndexT3 = Math.floor((3 * sortedT3Values.length) / 4);

    const q1T3 = sortedT3Values[q1IndexT3];
    const q2T3 = sortedT3Values[q2IndexT3];
    const q3T3 = sortedT3Values[q3IndexT3];

    // console.log('Minimum T3:', minimumT3);
    // console.log('Q1 T3:', q1T3);
    // console.log('Median (Q2) T3:', q2T3);
    // console.log('Q3 T3:', q3T3);
    // console.log('Maximum T3:', maximumT3);

    options.data.push({
      type: 'boxAndWhisker',
      yValueFormatString: '#,##0.# ""',
      dataPoints: [
        { label: 'T1', y: [minimum, q1, q3, maximum, q2] },
        { label: 'T2', y: [minimumT2, q1T2, q3T2, maximumT2, q2T2] },
        { label: 'T3', y: [minimumT3, q1T3, q3T3, maximumT3, q2T3] },
      ],
    });
  }

  return (
    <div>
      <CanvasJSChart options={options} />
    </div>
  );
};

export default App;
