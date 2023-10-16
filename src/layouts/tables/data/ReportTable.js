/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";

//MUI
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import SwitchStar from "./SwitchStar";

export default function data() {
  const badgeContent = "waiting"; // Replace this with the actual badge content
  const [feedbacks, setFeedbacks] = useState([]);
  useEffect(() => {
    // Define the URL of your API endpoint
    const apiUrl = "https://localhost:7157/api/Feedbacks";

    // Make a GET request to your API endpoint
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setFeedbacks(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const Author = ({ name, user }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={0} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{user}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Info = ({ category, location }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {category}
      </MDTypography>
      <MDTypography variant="caption">{location}</MDTypography>
    </MDBox>
  );

  const Time = ({ day, expire }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {day}
      </MDTypography>
      <MDTypography variant="caption" color="error">
        {expire}
      </MDTypography>
    </MDBox>
  );
  
  const feedbackRows = feedbacks
    .filter((feedback) => feedback.status === 0 || feedback.status === 1)
    .map((feedback) => ({
      star: (
        <Box sx={{ mr: -3, ml: 0 }}>
          <SwitchStar />
        </Box>
      ),
      author: <Author name={feedback.userId} user={feedback.userId} />,
      title: <Link><h4>{feedback.title}</h4></Link>,
      info: <Info category={feedback.cateId} location={feedback.locationId} />,
      status: (
        <MDBox ml={-1}>
          <MDBadge
            badgeContent={feedback.status === 0 ? "waiting" : "processing"}
            color={feedback.status === 0 ? "light" : "warning"}
            variant="gradient"
            size="sm"
          />
        </MDBox>
      ),
      time: <Time day={feedback.dateTime} expire="48 hours" />,
      action: feedback.status === 0 ? (
        <div>
          <IconButton>
            <MDTypography component="a" variant="caption" color="success" fontWeight="medium">
              Accept
            </MDTypography>
          </IconButton>
          <IconButton>
            <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
              Reject
            </MDTypography>
          </IconButton>
        </div>
      ) : (
        <div>
          <IconButton>
            <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
              Cancel
            </MDTypography>
          </IconButton>
        </div>
      ),
    }));

  return {
    columns: [
      // {
      //   Header: "",
      //   accessor: "checkBox",
      //   align: "right",
      //   width: "0%",
      // },
      { Header: "", accessor: "star", align: "center", width: "0%" },
      { Header: "author", accessor: "author", align: "left" },
      { Header: "title", accessor: "title", align: "left" },
      { Header: "cat/loc", accessor: "info", align: "left" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "time/expire", accessor: "time", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: feedbackRows,
  };
}
