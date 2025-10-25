import React, { useRef } from 'react';
import { View, Text, Dimensions, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { captureRef } from 'react-native-view-shot';
    import { generatePDF } from 'react-native-html-to-pdf';
    import RNFS from 'react-native-fs';

import { BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const data = {
  labels: ['Total Load', 'In Transit', 'Delivered', 'Remaining'],
  datasets: [
    {
      data: [10000, 4500, 4000, 1500],
    },
  ],
};

const pieData = [
  {
    name: 'Total Load',
    population: 10000,
    color: '#c0ca31ff', // orange
    legendFontColor: '#000',
    legendFontSize: 14,
  },
  {
    name: 'In Transit',
    population: 4500,
    color: '#3f14d8ff', // gold
    legendFontColor: '#000',
    legendFontSize: 14,
  },
  {
    name: 'Delivered',
    population: 4000,
    color: '#68b8bcff', // dark orange
    legendFontColor: '#000',
    legendFontSize: 14,
  },
  {
    name: 'Remaining',
    population: 1500,
    color: '#FFA07A', // light salmon
    legendFontColor: '#000',
    legendFontSize: 14,
  },
];
const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  fillShadowGradient: '#ffa500', // orange color
  fillShadowGradientOpacity: 1,
  color: () => '#ffa500',
  labelColor: () => '#000',
  strokeWidth: 2,
  barPercentage: 0.7,
  decimalPlaces: 0,
};

export default function MaterialChart() {
  const chartRefPie = useRef();
  const chartRefBar = useRef();


const exportChartToPDF = async () => {

  try {
    // 1. Capture chart as image
    const uriPie = await captureRef(chartRefPie, {
      format: 'png',
      quality: 1,
    });
    const uriBar = await captureRef(chartRefBar, {
      format: 'png',
      quality: 1,
    });
    // 2. Create HTML content
const htmlContent = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          color: #000;
        }
        h1 {
          text-align: center;
          color: #333;
        }
        p {
          font-size: 14px;
          margin-top: 10px;
          line-height: 1.6;
        }
        h2 {
          margin-top: 30px;
          color: #555;
        }
        img {
          margin-top: 10px;
          width: 100%;
          max-width: 600px;
  max-height: 330px;
        }
          table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
      </style>
    </head>
    <body>
      <h1>Material Management Report</h1>
      <p>
        This report provides an overview of material management, including total load, 
        in-transit materials, delivered materials, and remaining stock levels.
      </p>
      <table>
  <thead>
    <tr>
      <th>Category</th>
      <th>Tonnage</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Total Load</td>
      <td>10000</td>
    </tr>
    <tr>
      <td>In Transit</td>
      <td>4500</td>
    </tr>
    <tr>
      <td>Delivered</td>
      <td>4000</td>
    </tr>
    <tr>
      <td>Remaining</td>
      <td>1500</td>
    </tr>
  </tbody>
</table>
      <h2>Visual Analysis</h2>
      <img src="${uriPie}" />
      <img src="${uriBar}" />
    </body>
  </html>
`;


    // 3. Generate PDF (in app-specific folder)
    const pdfOptions = {
      html: htmlContent,
      fileName: 'material',
      directory: 'Download', // App-specific Download
    };

    const pdf = await generatePDF(pdfOptions);

    const appScopedPath = pdf.filePath; // Actual file path in app-specific storage
    const downloadsPath = `${RNFS.DownloadDirectoryPath}/material.pdf`; // Public Downloads folder

    // 4. Move file to public Downloads folder
    await RNFS.moveFile(appScopedPath, downloadsPath);

    Alert.alert('Success', `PDF saved to:\n${downloadsPath}`);
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Failed to export chart as PDF');
  }
};

  return (
    <View style={styles.container} >
        <View ref={chartRefBar} collapsable={false} style={styles.chartWrapper}>
      <Text style={styles.title}>Material Management (Tonnage)</Text>            
      <BarChart
        data={data}
        width={screenWidth - 30}
        height={300}
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1}
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        fromZero
      />
      <Text style={styles.xLabel}>Category</Text>
      <Text style={styles.yLabel}>Tonnage</Text>

      </View>
      <View ref={chartRefPie} collapsable={false} style={styles.chartWrapper}>
              <PieChart
        data={pieData}
        width={screenWidth - 30}
        height={240}
        chartConfig={{
          color: () => `#000`,
        }}
        accessor={'population'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
      />
      </View>

              <TouchableOpacity style={styles.exportButton} onPress={exportChartToPDF}>
                <Text style={styles.exportButtonText}>Export as PDF</Text>
              </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    // marginTop: 50,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  xLabel: {
    position: 'absolute',
    bottom: 10,
    fontSize: 14,
  },
  yLabel: {
    position: 'absolute',
    left: -5,
    top: 150,
    transform: [{ rotate: '-90deg' }],
    fontSize: 14,
  },
  chartWrapper: {
  backgroundColor: '#fff',
  padding: 10,
  borderRadius: 8,
  alignItems: 'center',
},
  exportButton: {
    backgroundColor: "#ff3d00",
    padding: 10,
    borderRadius: 10,
    marginVertical:10,
    alignSelf: "center",
    width: "90%",
  },
  exportButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
});
