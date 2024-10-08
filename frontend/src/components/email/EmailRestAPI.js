import React, { useState } from 'react';
import axios from 'axios';
import emailjs from 'emailjs-com';
import { TextField, Button, Typography, Snackbar, Alert, Grid, Paper, Box } from '@mui/material';

const EmailRestAPI = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openFileSnackbar, setOpenFileSnackbar] = useState(false);
  const [file, setFile] = useState(null);

  // State for errors
  const [error, setError] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Function to handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Validate form fields
  const validateForm = () => {
    let valid = true;
    let newError = { name: '', email: '', message: '' };

    // Validate name
    if (formData.name.trim() === '') {
      newError.name = 'Name is required.';
      valid = false;
    }

    // Validate email
    if (!validateEmail(formData.email)) {
      newError.email = 'Please enter a valid email address.';
      valid = false;
    }

    // Validate message
    if (formData.message.trim() === '') {
      newError.message = 'Message is required.';
      valid = false;
    }

    setError(newError);
    return valid;
  };

  // Function to handle file upload
  const handleFileUpload = async () => {
    if (!file) {
      console.error('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5001/uploadFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadedFileUrl(`http://localhost:5001${response.data.file}`);
      console.log('File uploaded successfully:', response.data.file);

      // Show success snackbar for file upload
      setOpenFileSnackbar(true);

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // Function to handle form submission and send email using EmailJS
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    const { name, email, message } = formData;

    if (!uploadedFileUrl) {
      console.error('Please upload a file first.');
      return;
    }

    // Prepare email template parameters for EmailJS
    const templateParams = {
      to_name: 'Web Wizard',
      from_name: name,
      from_email: email,
      message: message,
      attachment_url: uploadedFileUrl,
    };

    try {
      // Using emailjs to send email from the client side
      const response = await emailjs.send(
        'service_cxrroqf', // Your EmailJS service ID
        'template_dorbgjd', // Your EmailJS template ID
        templateParams,
        'o5MLS1yF53Sj3iw2X' // Your EmailJS user ID
      );

      console.log('Email sent successfully:', response.status, response.text);

      // Clear the form data
      setFormData({ name: '', email: '', message: '' });
      setUploadedFileUrl('');

      // Show success snackbar for email sending
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  // Handle Snackbar close for email success
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Handle Snackbar close for file upload success
  const handleCloseFileSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenFileSnackbar(false);
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh', padding: 2 }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Send an Email
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <input type="file" onChange={handleFileChange} />
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleFileUpload}
            >
              Upload File
            </Button>
            <TextField
              label="Your Name"
              name="name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              error={!!error.name}
              helperText={error.name}
              required
            />
            <TextField
              label="Your Email"
              name="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              error={!!error.email}
              helperText={error.email}
              required
            />
            <TextField
              label="Your Message"
              name="message"
              variant="outlined"
              fullWidth
              multiline
              rows={6}
              margin="normal"
              value={formData.message}
              onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
              error={!!error.message}
              helperText={error.message}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Send Email
            </Button>
          </Box>
        </Paper>
      </Grid>

      {/* Snackbar for email success */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Email sent successfully!
        </Alert>
      </Snackbar>

      {/* Snackbar for file upload success */}
      <Snackbar
        open={openFileSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseFileSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseFileSnackbar} severity="success">
          File uploaded successfully!
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default EmailRestAPI;


// import React, { useState } from 'react';
// import axios from 'axios';
// import emailjs from 'emailjs-com';
// import { TextField, Button, Typography, Snackbar, Alert, Grid, Paper, Box } from '@mui/material';

// const EmailRestAPI = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     message: '',
//   });

//   const [uploadedFileUrl, setUploadedFileUrl] = useState('');
//   const [openSnackbar, setOpenSnackbar] = useState(false);  // For email success
//   const [openFileSnackbar, setOpenFileSnackbar] = useState(false); // For file upload success
//   const [file, setFile] = useState(null);

//   // Function to handle file selection
//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   // Function to handle file upload
//   const handleFileUpload = async () => {
//     if (!file) {
//       console.error('Please select a file to upload.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await axios.post('http://localhost:5001/uploadFile', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       setUploadedFileUrl(`http://localhost:5001${response.data.file}`);
//       console.log('File uploaded successfully:', response.data.file);

//       // Show success snackbar for file upload
//       setOpenFileSnackbar(true);

//     } catch (error) {
//       console.error('Error uploading file:', error);
//     }
//   };

//   // Function to handle form submission and send email using EmailJS
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { name, email, message } = formData;

//     if (!uploadedFileUrl) {
//       console.error('Please upload a file first.');
//       return;
//     }

//     // Prepare email template parameters for EmailJS
//     const templateParams = {
//       to_name: 'Web Wizard',
//       from_name: name,
//       from_email: email,
//       message: message,
//       attachment_url: uploadedFileUrl,
//     };

//     try {
//       // Using emailjs to send email from the client side
//       const response = await emailjs.send(
//         'service_cxrroqf', // Your EmailJS service ID
//         'template_dorbgjd', // Your EmailJS template ID
//         templateParams,
//         'o5MLS1yF53Sj3iw2X' // Your EmailJS user ID
//       );

//       console.log('Email sent successfully:', response.status, response.text);

//       // Clear the form data
//       setFormData({ name: '', email: '', message: '' });
//       setUploadedFileUrl('');

//       // Show success snackbar for email sending
//       setOpenSnackbar(true);
//     } catch (error) {
//       console.error('Error sending email:', error);
//     }
//   };

//   // Handle Snackbar close for email success
//   const handleCloseSnackbar = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setOpenSnackbar(false);
//   };

//   // Handle Snackbar close for file upload success
//   const handleCloseFileSnackbar = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setOpenFileSnackbar(false);
//   };

//   return (
//     <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh', padding: 2 }}>
//       <Grid item xs={12} sm={8} md={6} lg={4}>
//         <Paper elevation={3} sx={{ padding: 4 }}>
//           <Typography variant="h4" align="center" gutterBottom>
//             Send an Email
//           </Typography>
//           <Box component="form" onSubmit={handleSubmit} noValidate>
//             <input type="file" onChange={handleFileChange} />
//             <Button
//               variant="contained"
//               color="secondary"
//               fullWidth
//               sx={{ mt: 2 }}
//               onClick={handleFileUpload}
//             >
//               Upload File
//             </Button>
//             <TextField
//               label="Your Name"
//               name="name"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               value={formData.name}
//               onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
//               required
//             />
//             <TextField
//               label="Your Email"
//               name="email"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               value={formData.email}
//               onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
//               required
//             />
//             <TextField
//               label="Your Message"
//               name="message"
//               variant="outlined"
//               fullWidth
//               multiline
//               rows={6}
//               margin="normal"
//               value={formData.message}
//               onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
//               required
//             />
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               fullWidth
//               sx={{ mt: 2 }}
//             >
//               Send Email
//             </Button>
//           </Box>
//         </Paper>
//       </Grid>

//       {/* Snackbar for email success */}
//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity="success">
//           Email sent successfully!
//         </Alert>
//       </Snackbar>

//       {/* Snackbar for file upload success */}
//       <Snackbar
//         open={openFileSnackbar}
//         autoHideDuration={6000}
//         onClose={handleCloseFileSnackbar}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert onClose={handleCloseFileSnackbar} severity="success">
//           File uploaded successfully!
//         </Alert>
//       </Snackbar>
//     </Grid>
//   );
// };

// export default EmailRestAPI;

