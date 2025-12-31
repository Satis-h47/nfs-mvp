import React, { useRef } from 'react';
import { View, Text, Dimensions, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { captureRef } from 'react-native-view-shot';
    import { generatePDF } from 'react-native-html-to-pdf';
    import RNFS from 'react-native-fs';

import { BarChart } from 'react-native-chart-kit';
import PieChart from 'react-native-pie-chart';
import { useTrips } from '../../context/TripContext';

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

const series = [
  { value: 430, color: '#fbd203', label: { text: 'A', fontWeight: 'bold' } },
  { value: 321, color: '#ffb300', label: { text: 'mobile', offsetY: 10, offsetX: 10 } },
  { value: 185, color: '#ff9100', label: { text: '%22', fontSize: 8, fontStyle: 'italic', outline: 'white' } },
  { value: 123, color: '#ff6c00' },
]
export default function MaterialChart({reportsDataPie, reportsDataBar}) {
  const {theme} = useTrips();
  const chartRefPie = useRef();
  const chartRefBar = useRef();
// console.log(reportsDataBar,reportsDataPie)
//   const labels = Object.keys(reportsDataBar).map(key =>
//   key
//     .replace(/([A-Z])/g, ' $1')       // add space before capital letters
//     .replace(/^./, str => str.toUpperCase()) // capitalize first letter
//     .trim()
// );

const chartConfig = {
  backgroundGradientFrom: theme.colors.card,
  backgroundGradientTo: theme.colors.card,
  fillShadowGradient: theme.colors.btnBack, // orange color
  fillShadowGradientOpacity: 1,
  color: () => theme.colors.btnBack,
  labelColor: () => theme.colors.text,
  strokeWidth: 2,
  barPercentage: 0.7,
  decimalPlaces: 0,
};

// Extract values as data
// const dataValues = Object.values(reportsDataBar);
// const barData = {
//   labels: labels,
//   datasets: [
//     {
//       data: dataValues,
//     },
//   ],
// };

// console.log("from api ",reportsDataBar, barData)

  // const pieApiData = reportsDataPie.map(item => ({
  //   name: item.status.replace("_", " "),
  //   population: item.totalQuantity,
  //   color:
  //     item.status === "delivered" ? "#4CAF50" :
  //     item.status === "pending" ? "#FFC107" :
  //     item.status === "in_transit" ? "#2196F3" :
  //     item.status === "planned" ? "#9C27B0" :
  //     "#ccc",
  //   legendFontColor: "#7F7F7F",
  //   legendFontSize: 15
  // }));

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

const now = new Date();

const timestamp =
  now.getFullYear() + "-" +
  String(now.getMonth() + 1).padStart(2, "0") + "-" +
  String(now.getDate()).padStart(2, "0") + "_" +
  String(now.getHours()).padStart(2, "0") + "-" +
  String(now.getMinutes()).padStart(2, "0")+ "-" +
  String(now.getSeconds()).padStart(2, "0");

    const appScopedPath = pdf.filePath; // Actual file path in app-specific storage
    const downloadsPath = `${RNFS.DownloadDirectoryPath}/material_${timestamp}.pdf`; // Public Downloads folder

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
      <Text style={[styles.title,{color: theme.colors.text}]}>Material Management (Tonnage)</Text>            
      <BarChart
        data={reportsDataBar}
        width={screenWidth - 30}
        height={300}
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1}
        chartConfig={chartConfig}
        verticalLabelRotation={-90}
        // horizontalLabelRotation={45}
        fromZero
      />
      <Text style={[styles.xLabel,{color: theme.colors.text}]}>Category</Text>
      <Text style={[styles.yLabel,{color: theme.colors.text}]}>Tonnage</Text>

      </View>
      <View ref={chartRefPie} collapsable={false} style={styles.chartWrapper}>
              {/* Using Chart kit  */}
              {/* <PieChart
        data={pieApiData}
        width={screenWidth - 30}
        height={240}
        chartConfig={{
          color: () => `#000`,
        }}
        accessor={'population'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
        // absolute
      /> */}

      {/* Uisng Pie Chart  */}
      {(reportsDataPie?.length > 0) &&
      <PieChart widthAndHeight={screenWidth - 30} series={reportsDataPie} /> }
          <View style={{
    marginTop: 20,
  }}>
      {reportsDataPie?.map((item, index) => (
        <View key={index} style={{
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  }}>
          <View style={[{
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  }, { backgroundColor: item.color }]} />
          <Text style={{
    fontSize: 16,
    color: theme.colors.text,
  }}>{item.name}</Text>
        </View>
      ))}
    </View>
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
    fontSize: 20,
    marginBottom: 10,
    // color: "#fff",
  },
  xLabel: {
    position: 'absolute',
    bottom: 10,
    fontSize: 14,
    // color: "#fff",
  },
  yLabel: {
    position: 'absolute',
    left: -5,
    top: 150,
    transform: [{ rotate: '-90deg' }],
    fontSize: 14,
    // color: "#fff",
  },
  chartWrapper: {
  // backgroundColor: '#fff',
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
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
  },
});
