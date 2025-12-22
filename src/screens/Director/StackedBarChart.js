import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const StackedBarChart = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        data: [20, 30, 40, 50, 60], // First data set (bottom stack)
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red color for first stack
      },
      {
        data: [10, 20, 30, 40, 50], // Second data set (top stack)
        color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // Green color for second stack
      },
      {
        data: [5, 15, 25, 35, 45], // Third data set (top stack)
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Blue color for third stack
      },
    ],
  };

  return (
    <ScrollView horizontal={true}>
      <BarChart
        data={data}
        width={500} // Adjust chart width for larger data
        height={300}
        yAxisLabel="$"
        chartConfig={{
          // backgroundColor: '#e26a00',
          backgroundGradientFrom: 'white',
          backgroundGradientTo: 'white',
          decimalPlaces: 2, // Optional, controls the number of decimal places
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </ScrollView>
  );
};

export default StackedBarChart;
