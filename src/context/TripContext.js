// src/context/TripContext.js
import React, { createContext, useContext, useState } from 'react';
import {DarkTheme, LightTheme} from '../assets/themes/themes';
import { Platform } from 'react-native';
// Create context
const TripContext = createContext();

// Custom hook to use the TripContext
export const useTrips = () => useContext(TripContext);

// Provider component
export const TripProvider = ({ children }) => {
      const allTrips = [
            {
          "id": 1,
          "date": "12-09-2025, 09:14:15",
          "source": "Pakhar Bauxite Mines",
          "destination": "Yard Pakar",
          "poNumber": "PO12345",
          "invoice": "INV12345",
          "royaltyWaybill": "RW12345",
          "product": "Bauxite",
          "clientName": "Vedanta",
          "transportVendor": "Logistics Inc.",
          "vehicleNumber": "ABC123XY",
          "vehicleType": "Truck",
          "tyres": "10",
          "capacity": "30 Tons",
          "quantity": "28 Tons",
          "photoWithoutLoad": null,
          "photoWithLoad": null,
          "action":"Pending"
        },
        {
          "id": 2,
          "date": "15-09-2025, 14:21:10",
          "source": "Pakhar Bauxite Mines",
          "destination": "Railway Station",
          "poNumber": "PO54321",
          "invoice": "INV54321",
          "royaltyWaybill": "RW54321",
          "product": "Bauxite",
          "clientName": "Hindalco",
          "transportVendor": "TransHaul Ltd.",
          "vehicleNumber": "XYZ789GH",
          "vehicleType": "Tipper",
          "tyres": "12",
          "capacity": "25 Tons",
          "quantity": "25 Tons",
          "photoWithoutLoad": null,
          "photoWithLoad": null,
          "action":"Approved"
        },
        {
          "id": 3,
          "date": "17-09-2025, 20:02:51",
          "source": "Pakhar Bauxite Mines",
          "destination": "Shipyard",
          "poNumber": "PO67890",
          "invoice": "INV67890",
          "royaltyWaybill": "RW67890",
          "product": "Bauxite",
          "clientName": "Vedanta",
          "transportVendor": "QuickMove Agency",
          "vehicleNumber": "LMN456JK",
          "vehicleType": "Dump Truck",
          "tyres": "8",
          "capacity": "20 Tons",
          "quantity": "18 Tons",
          "photoWithoutLoad": null,
          "photoWithLoad": null,
          "action":"Rejected"
        }
      ];

  const [trips, setTrips] = useState([]);
  const [user, setUser] = useState('Manager');
  const [token, setToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1cy1lYXN0LTFfbG9jYWxzdGFjazphZG1pbi11c2VyLTAwMSIsImVtYWlsIjoiYWRtaW5AdHJhbmRhc3lzLmNvbSIsImdpdmVuX25hbWUiOiJTeXN0ZW0iLCJmYW1pbHlfbmFtZSI6IkFkbWluaXN0cmF0b3IiLCJjb2duaXRvOmdyb3VwcyI6WyJBZG1pbmlzdHJhdG9ycyJdLCJjb2duaXRvOnVzZXJuYW1lIjoiYWRtaW5AdHJhbmRhc3lzLmNvbSIsImN1c3RvbTplbnRpdHlBc3NpZ25tZW50cyI6IltdIiwiY3VzdG9tOmlzU3VwZXJBZG1pbiI6InRydWUiLCJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tL3VzLWVhc3QtMV8xMjM0NTY3ODkiLCJhdWQiOiIxMjM0NTY3ODlhYmNkZWYiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzY3MDY5MTM0LCJleHAiOjE3NjcxNTU1MzQsImlhdCI6MTc2NzA2OTEzNH0.GmCc5YTagpq7NEztCkZ-X-ENXU-DRwMy-3d5LZho4JQ');
 const globalApi = Platform.OS === 'ios' ? 'https://g7uptifgme.execute-api.localhost.localstack.cloud:4566/api' : 'http://192.168.1.94:4566/restapis/3iizmbsdom/api/_user_request_'
// console.log(Platform.OS, globalApi)
 const addTrip = (trip) => setTrips([trip, ...trips]);
const deleteTrip = (id) => setTrips(trips.filter((t) => t.id !== id))

    const updateTrip = (id, updated) =>
    setTrips(trips.map((t) => (t.id === id ? updated : t)));
    
    const getTrip = (id) => trips.find(trip => trip.id === id)

    const UpdateUser = (user) => setUser(user);

    const UpdateToken = (token) => setToken(token);


  const [theme, setTheme] = useState(LightTheme);

  const toggleTheme = () => {
    setTheme(prev => prev.dark ? LightTheme : DarkTheme);
  };
  
  return (
    <TripContext.Provider value={{theme, toggleTheme, trips, globalApi,getTrip, addTrip, setTrips, user, UpdateUser, updateTrip, token, UpdateToken, deleteTrip }}>
      {children}
    </TripContext.Provider>
  );
};
