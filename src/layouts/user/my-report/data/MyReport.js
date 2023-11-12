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
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Button from '@mui/material/Button';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@mui/material/TextField'; import Tooltip from '@mui/material/Tooltip';


export default function data() {
  const [feedbacks, setFeedbacks] = useState([]);
  // Add this line to create a new state variable
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  // Modify your handleEditClick function to update the selectedFeedback state
  const handleEditClick = (feedback) => {
    setSelectedFeedback(feedback);
  }
  const [imageUrls, setImageUrls] = useState([]);
  const fetchImageUrls = async (feedbackId) => {
    console.log('Fetching image URLs for feedback:', feedbackId);
    const response = await fetch(`https://localhost:7157/api/Feedbacks/GetFile?feedbackId=${feedbackId}`);
    const data = await response.json();
    console.log('Fetched image URLs:', data);
    setImageUrls(data);
  };

  useEffect(() => {
    console.log('Selected feedback:', selectedFeedback);
    if (selectedFeedback) {
      fetchImageUrls(selectedFeedback.feedbackId);
    }
  }, [selectedFeedback]);

  useEffect(() => {
    // Define the URL of your API endpoint
    const apiUrl = "https://localhost:7157/api/Feedbacks/User/" + localStorage.getItem('userID');

    // Make a GET request to your API endpoint
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setFeedbacks(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  

  const handleRemoveReport = (feedbackId) => {
    var option = {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Removed" }),
    };
    fetch("https://localhost:7157/api/Feedbacks/RemoveFeedback/" + feedbackId, option)
      .then((response) => { response.text() })
      .then((data) => {
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.map((prevFeedback) =>
            prevFeedback.feedbackId === feedbackId
              ? { ...prevFeedback, status: "Removed" }
              : prevFeedback
          )
        );
      })
      .catch((error) => {
        console.error("Error: " + error.message);
      });
  }


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

  const Time = ({ day, expire }) => {
    // Create a new Date object
    const date = new Date(day);

    // Format the date as DD/MM/YY
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().substr(-2)}`;

    // Format the time as HH:MM
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    return (
      <MDBox lineHeight={1} textAlign="left">
        <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
          {formattedDate}
        </MDTypography>
        <MDTypography variant="caption">
          {formattedTime}
        </MDTypography>
      </MDBox>
    );
  };

  const feedbackRows = feedbacks
    .sort((a, b) => {
      new Date(a.dateTime) - new Date(b.dateTime);
    })
    .map((feedback) => ({
      author: <Author name={feedback.user.username} user={feedback.user.role.description} />,
      title: <Link><h4>{feedback.title}</h4></Link>,
      info: <Info category={feedback.cate.description} location={feedback.locationId} />,
      status: (
        <MDBox ml={-1}>
          {(() => {
            switch (feedback.status) {
              case "Waiting":
                return (
                  <MDBadge badgeContent={feedback.status} color="light" variant="gradient" size="sm" />
                );
              case "Processing":
                return (
                  <MDBadge badgeContent={feedback.status} color="warning" variant="gradient" size="sm" />
                );
              case "Responded":
                return (
                  <MDBadge badgeContent={feedback.status} color="inherit" variant="gradient" size="sm" />
                );
              case "Closed":
                return (
                  <MDBadge badgeContent={feedback.status} color="success" variant="gradient" size="sm" />
                );
              case "Rejected":
                return (
                  <MDBadge badgeContent={feedback.status} color="error" variant="gradient" size="sm" />
                );
              default:
                return (
                  <MDBadge badgeContent={feedback.status} color="dark" variant="gradient" size="sm" />
                );
            }
          })()}
        </MDBox>
      ),
      time: <Time day={feedback.dateTime} /*expire="48 hours"*/ />,
      action: (
        <MDBox ml={-1}>
          {(() => {
            switch (feedback.status) {
              case "Waiting":
                return (
                  <div>

                    <a href='#updateReport' id='openPopUp' onClick={() => handleEditClick(feedback)}>
                      <IconButton>
                        <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
                          Edit
                        </MDTypography>
                      </IconButton>
                    </a>
                    <IconButton onClick={() => handleRemoveReport(feedback.feedbackId)}>
                      <MDTypography component="a" variant="caption" color="error" fontWeight="medium">
                        Remove
                      </MDTypography>
                    </IconButton>
                  </div>
                );
            }
          })()}
          <div id='updateReport' className='overlay'>
            <Box sx={{ backgroundColor: 'white' }} className='update-report'>
              <a className='update-report-close' href='#updateReport-close'><HighlightOffIcon /></a>
              <TextField
                inputProps={{ maxLength: 40 }}
                fullWidth
                required
                id="outlined-required"
                label="Title"
                value={selectedFeedback ? selectedFeedback.title : ''}
              />
              <div style={{ marginTop: "1rem" }}>
                <TextField
                  inputProps={{ maxLength: 30 }}
                  sx={{ width: '50%', paddingRight: '3px' }}
                  required
                  id="outlined-required"
                  label="Campus"
                  value=''
                />
                <TextField
                  inputProps={{ maxLength: 4 }}
                  sx={{ width: '50%', paddingLeft: '3px' }}
                  required
                  id="outlined-required"
                  label="Room"
                  value={selectedFeedback ? selectedFeedback.locationId : ''}
                />
              </div>
              <div style={{ marginTop: "1rem" }}>
                <TextField
                  sx={{ width: '50%', paddingRight: '3px' }}
                  fullWidth
                  required
                  id="outlined-required"
                  label="Category"
                  value={selectedFeedback ? selectedFeedback.cate.description : ''}
                />

              </div>
             
              <TextField
                inputProps={{ maxLength: 300 }}
                style={{ marginTop: "1rem" }}
                fullWidth
                required
                multiline
                id="outlined-required outlined-multiline-static"
                label="More details"
                value={selectedFeedback ? selectedFeedback.description : ''}
                rows={6}
              />
               <div style={{ marginTop: "1rem" }}>
  <h3>Image</h3>
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridGap: '40px', overflowY: 'auto', maxHeight: '100px' }}>
    {imageUrls.map((url, index) => (
      <img key={index} src={url} alt={`Feedback ${index}`} style={{ width: '100%', padding: '3px' }} />
    ))}
  </div>
</div>
              <Button
                style={{ marginTop: "1rem" }}
                fullWidth
                variant="contained"
                startIcon={<UpgradeIcon />}
                onClick=''
              >
                Update Report
              </Button>
            </Box>
          </div>
        </MDBox>
      ),
    }));

  return {
    columns: [
      { Header: "", accessor: "space", align: "center", width: "0%" },
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
