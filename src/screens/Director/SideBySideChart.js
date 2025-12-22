import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const SideBySideChart = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        data: [20, 30, 40, 50, 60],
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red
      },
      {
        data: [10, 20, 30, 40, 50],
        color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // Green
      },
      {
        data: [5, 15, 25, 35, 45],
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Blue
      },
    ],
  };

  return (
    <ScrollView horizontal={true}>
      <BarChart
        data={data}
        width={500} // Adjust for side-by-side bars
        height={300}
        yAxisLabel="$"
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffc107',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        fromZero={true} // To make sure bars start from 0
        showValuesOnTopOfBars={true}
        withInnerLines={false}
        withOuterLines={false}
        barPercentage={0.6} // Adjust bar width
        groupedBars={true} // Enable side-by-side bars
      />
    </ScrollView>
  );
};

export default SideBySideChart;
