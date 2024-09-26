// datatablesource.js

export const driverColumns = [
  { field: "driver_id", headerName: "Driver ID", width: 100 },
  {
    field: "license_number",
    headerName: "License Number",
    width: 150,
  },
  {
    field: "vehicle_number",
    headerName: "Vehicle Number",
    width: 150,
  },
  {
    field: "vehicle_type",
    headerName: "Vehicle Type",
    width: 150,
  },
  {
    field: "earnings",
    headerName: "Earnings",
    width: 150,
  },
  {
    field: "date",
    headerName: "Date",
    width: 120,
  },
];

// Fetch driver data from the backend and populate driverRows dynamically
export let driverRows = [];

export const fetchDriverData = async () => {
  try {
    // Fetching data from the backend (ensure the backend server is running)
    const response = await fetch("http://localhost:5000/api/driver/data");

    if (!response.ok) {
      throw new Error("Failed to fetch driver data");
    }

    // Parse the JSON response
    const data = await response.json();

    // Check if the response contains the drivers data
    if (data.success && data.drivers) {
      // Extract driver information and update the driverRows array
      driverRows = data.drivers.map((driver, index) => ({
        id: index + 1, // For DataGrid to have a unique id for each row
        driver_id: driver.driver_id,
        license_number: driver.license_number,
        vehicle_number: driver.vehicle_number,
        vehicle_type: driver.vehicle_type,
        earnings: data.drivers_history[index]?.earnings, // Match earnings with history data
        date: data.drivers_history[index]?.date,         // Match date with history data
      }));
    } else {
      console.error("No drivers data found in the API response");
    }
  } catch (error) {
    console.error("Error fetching driver data: ", error);
  }
};
