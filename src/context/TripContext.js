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
          "date": "2025-09-15",
          "source": "Mine",
          "poNumber": "PO12345",
          "destination": "Abuja",
          "invoice": "INV12345",
          "royaltyWaybill": "RW12345",
          "product": "Cement",
          "company": "Dangote Group",
          "agency": "Logistics Inc.",
          "vehicleNumber": "ABC123XY",
          "vehicleType": "Truck",
          "tyres": "10",
          "capacity": "30 Tons",
          "quantity": "28 Tons",
          "photoEmpty": null,
          "photoLoaded": null,
          "action":"Pending"
        },
        {
          "id": 2,
          "date": "2025-09-16",
          "source": "Port Harcourt",
          "poNumber": "PO54321",
          "destination": "Enugu",
          "invoice": "INV54321",
          "royaltyWaybill": "RW54321",
          "product": "Gravel",
          "company": "Julius Berger",
          "agency": "TransHaul Ltd.",
          "vehicleNumber": "XYZ789GH",
          "vehicleType": "Tipper",
          "tyres": "12",
          "capacity": "25 Tons",
          "quantity": "25 Tons",
          "photoEmpty": null,
          "photoLoaded": null,
          "action":"Approved"
        },
        {
          "id": 3,
          "date": "2025-09-17",
          "source": "Kano",
          "poNumber": "PO67890",
          "destination": "Kaduna",
          "invoice": "INV67890",
          "royaltyWaybill": "RW67890",
          "product": "Sand",
          "company": "Bua Cement",
          "agency": "QuickMove Agency",
          "vehicleNumber": "LMN456JK",
          "vehicleType": "Dump Truck",
          "tyres": "8",
          "capacity": "20 Tons",
          "quantity": "18 Tons",
          "photoEmpty": null,
          "photoLoaded": null,
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
