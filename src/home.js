import styled from '@emotion/styled';
import { Button } from '@mui/material';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import GetFiles from './getFiles'
import './home.css';
import Uploadt from './Uploadt';

const UploadButton = styled(Button)({
  backgroundColor: '#FF5A5F',
  boxShadow: 'none',
  '&:hover':{
    backgroundColor: '#FF5A5F',
    boxShadow: '-1px 0px 40px -15px rgba(0,0,0,0.75)',
  },
  position: 'fixed',
  right: '2.4rem',
  bottom: '2.4rem',
  fontSize: '1.2rem',
  padding: '12px 24px',
  borderRadius: '16px',
  fontWeight: '500',
  textTransform: 'capitalize'
})


function Home() {
  let navigat = useNavigate();

  const navigateToUpload = () => {
    navigat("/upload");
  }

  return (
    <div className='main-container'>
        <div className='main-header'>
          <h3 className='main-header-title'>IFC-bnb</h3>
          <h6 className='main-header-subtitle'>Navigate, Inspect Geolocated Property <br/> and Visualize it like never before.</h6>
        </div>

        <div className="">
          <GetFiles></GetFiles>
        </div>

        <UploadButton 
          variant="contained" 
          disableRipple 
          className='upload-float-button'
          onClick={navigateToUpload}  
        >Upload Property</UploadButton>
    </div>
  )
}

export default Home