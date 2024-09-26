import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { driverColumns, driverRows, fetchDriverData } from "../../datatablesource"; // Import fetchDriverData
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Datatable = () => {
  const [data, setData] = useState(driverRows); // State to hold the driver data

  // Fetch driver data when the component mounts
  useEffect(() => {
    const getDriverData = async () => {
      await fetchDriverData(); // Fetch data from the API
      setData(driverRows);     // Set the fetched data into the state
    };
    getDriverData();
  }, []);

  // Function to handle deletion of a driver
  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  // Column definition for actions (View and Delete)
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to="/drivers/test" style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Add New Driver
        <Link to="/drivers/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data} // Use the state data which is fetched from API
        columns={driverColumns.concat(actionColumn)} // Combine driverColumns with actionColumn
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default Datatable;
