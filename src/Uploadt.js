import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { color } from '@mui/system';
import { styled } from '@mui/material/styles';
import { Alert, Dialog, DialogTitle, Snackbar } from '@mui/material';
import { useState } from 'react';

const Uploadt = () => {
    const CaptionTextField = styled(TextField)({
        '& label.Mui-focused': {
            color: '#FF5A5F',
        },
        '& label': {
            color: '#767676',
        },
        '& input': {
            color: '#FF5A5F',
            fontSize: '1.1rem',
            fontWeight: '400'
        },
        '& .MuiOutlinedInput-root': {
            marginBottom: '24px',
            '& fieldset': {
                borderColor: '#767676',
                borderWidth: '2px'
            },
            '&:hover fieldset': {
                borderColor: '#767676',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#FF5A5F'
            },
        },
    });


    const FileTextField = styled(TextField)({
        '& label.Mui-focused': {
            color: '#FF5A5F',
        },
        '& label': {
            color: '#767676',
        },
        '& input': {
            color: '#FF5A5F',
            fontSize: '1.1rem',
            fontWeight: '400'
        },
        '& .MuiOutlinedInput-root': {
            marginBottom: '24px',
            '& fieldset': {
                borderColor: '#767676',
                borderWidth: '2px'
            },
            '&:hover fieldset': {
                borderColor: '#767676',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#FF5A5F'
            },
        },
    });


    const [snackbarOpen, setOpenSnackbar] = useState(false);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenSnackbar(false);
    };

    const [openUploadDialog, setUploadDialog] = useState(false);

    const handleSubmit = async (event) => {
        // Opening Dialog
        setUploadDialog(true);

        // Stop the form from submitting and refreshing the page.
        event.preventDefault();

        const file = event.target.file.value;

        var formdata = new FormData();
        formdata.append("fileData", event.target.file.files[0], file);
        formdata.append("caption", event.target.caption.value);
        formdata.append("location", event.target.location.value);
        formdata.append("latitude", event.target.latitude.value);
        formdata.append("longitude", event.target.longitude.value);
        formdata.append("personName", event.target.personName.value);

        var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
        };

        fetch("http://localhost:9000/uploadS3", requestOptions)
        .then(response => response)
        .then(result => {
            console.log(result);
            // If Uploaded
            if(result.status === 200){
                setUploadDialog(false);

                window.location.href = '/'
            }

            if(result.status === 303){
                setUploadDialog(false);

                setOpenSnackbar(true);
            }
        })
        .catch(error => console.log('error', error));
    }

    return(
        <div className='main-container'>
            <div className='main-header'>
                <h3 className='main-header-title'>Create Magic</h3>
                <h6 className='main-header-subtitle'>Select IFC file to upload and enter map coords.</h6>
            </div>

            <div>
                <form onSubmit={handleSubmit}>
                    <CaptionTextField 
                        id="caption" 
                        name="caption"
                        type="text"
                        label="Property Name" 
                        variant="outlined"
                        required
                        fullWidth
                    />

                    <CaptionTextField 
                        id="location" 
                        name="location"
                        type="text"
                        label="Location Name e.g. Paris" 
                        variant="outlined"
                        required
                        fullWidth
                    />


                    <CaptionTextField 
                        id="latitude" 
                        name="latitude"
                        type="text"
                        label="Latitude" 
                        variant="outlined"
                        required
                        sx={{
                            marginRight: "20px"
                        }}
                    />
                    <CaptionTextField 
                        id="longitude" 
                        name="longitude"
                        type="text"
                        label="Longitude" 
                        variant="outlined"
                        required
                    />

                    <FileTextField 
                        id="file" 
                        name="file"
                        type="file"
                        variant="outlined"
                        required
                        fullWidth
                        // inputProps={{ accept: 'model/glb' }}
                    >
                    </FileTextField>

                    <CaptionTextField 
                        id="personName" 
                        name="personName"
                        type="text"
                        label="Your Name" 
                        variant="outlined"
                        required
                        fullWidth
                    />
                
                    <Button 
                        sx={{
                            float: 'right',
                            backgroundColor: '#0070f3',
                            fontSize: '1.2rem',
                            fontWeight: '700',
                            letterSpacing: '1.3px' 
                        }}
                        type="submit" variant="contained">Upload</Button>
                </form>
            </div>

            <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                Please upload 3D files!
                </Alert>
            </Snackbar>

            <Dialog open={openUploadDialog}>
                <DialogTitle>Upload in Progress</DialogTitle>
            </Dialog>
        </div>
    )
    
}

export default Uploadt






