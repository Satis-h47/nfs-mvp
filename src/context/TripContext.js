// src/context/TripContext.js
import React, { createContext, useContext, useState } from 'react';

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

  const [trips, setTrips] = useState([...allTrips]);
  const [user, setUser] = useState('Supervisor');

  const addTrip = (trip) => setTrips([...trips, trip]);

    const updateTrip = (id, updates) =>
    setTrips(trips.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    
    const UpdateUser = (user) => setUser(user);

  return (
    <TripContext.Provider value={{ trips, addTrip, user, UpdateUser, updateTrip }}>
      {children}
    </TripContext.Provider>
  );
};
