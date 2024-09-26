import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import axios from "axios";

const List = () => {
  const [rows, setRows] = useState([]); // Initialize as an empty array

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/driver/data");
        console.log("Fetched data: ", response.data); // Log to check the structure

        // Check if the response contains the necessary data
        if (response.data && response.data.success) {
          const drivers = response.data.drivers; // Get the drivers array
          const driversHistory = response.data.drivers_history; // Get the drivers history array

          // Map the drivers data with their corresponding earnings and date
          const combinedData = drivers.map((driver) => {
            const historyEntry = driversHistory.find(entry => entry.driver_id === driver.driver_id);
            return {
              driver_id: driver.driver_id,
              license_number: driver.license_number,
              vehicle_number: driver.vehicle_number,
              vehicle_type: driver.vehicle_type,
              earnings: historyEntry ? historyEntry.earnings : 0, // Default to 0 if no entry found
              date: historyEntry ? historyEntry.date : '', // Default to empty if no entry found
            };
          });

          setRows(combinedData); // Set the rows with the combined data
        } else {
          console.error("No drivers data found in the API response");
          setRows([]); // Fallback to an empty array if no data
        }
      } catch (error) {
        console.error("Error fetching driver data: ", error);
      }
    };

    fetchDriverData();
  }, []);

  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">Driver ID</TableCell>
            <TableCell className="tableCell">License Number</TableCell>
            <TableCell className="tableCell">Vehicle Number</TableCell>
            <TableCell className="tableCell">Vehicle Type</TableCell>
            <TableCell className="tableCell">Earnings</TableCell>
            <TableCell className="tableCell">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <TableRow key={row.driver_id}>
                <TableCell className="tableCell">{row.driver_id}</TableCell>
                <TableCell className="tableCell">{row.license_number}</TableCell>
                <TableCell className="tableCell">{row.vehicle_number}</TableCell>
                <TableCell className="tableCell">{row.vehicle_type}</TableCell>
                <TableCell className="tableCell">{row.earnings}</TableCell>
                <TableCell className="tableCell">{row.date}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
