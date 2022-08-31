import { Component, createRef } from "react";
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import styled from '@emotion/styled';
import { Button, TextField } from '@mui/material';
import { Matrix4, Vector3,
    DirectionalLight, AmbientLight,
    PerspectiveCamera,
    Scene, WebGLRenderer,
    BoxHelper
  } from "three";

import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { IFCLoader } from "web-ifc-three/IFCLoader"; 

import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer"

import mapboxgl from 'mapbox-gl'; 

import moment, { max } from "moment";
import { useNavigate } from 'react-router-dom';
import './viewer.css';
import { height } from "@mui/system";


import { Color } from "three";
import { IfcViewerAPI } from "web-ifc-viewer";


let i = 0;


const BackButton = styled(Button)({
    backgroundColor: '#484848',
    boxShadow: 'none',
    '&:hover':{
      backgroundColor: '#484848',
      boxShadow: '-1px 0px 40px -15px rgba(0,0,0,0.75)',
    },
    position: 'fixed',
    left: '1.4rem',
    top: '1.4rem',
    fontSize: '1.2rem',
    padding: '12px 24px',
    borderRadius: '16px',
    fontWeight: '500',
    textTransform: 'capitalize'
  
})


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX;

class LocalView extends Component{
    constructor(props){
        super(props);
        
        //console.log(props);

        this.state = {
            fileId: props.fileId,
            longitude: "",
            latitude: "",
            personName: "",
            caption: "",
            location: "",
            addedDate: "",
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
        }

    }


    async componentDidMount(){
        
        
    
        // In Development mode it is mounted twice, set reactStrictMode: false in next.js config file 
        console.log("Component is mounted"+i);
        

        console.log("Getting File");
        const fileData = await this.getFileDataUsingAPI();
        const latitude = fileData.latitude;
        const longitude = fileData.longitude;
        const caption = fileData.caption;
        const personName = fileData.personName;
        const addedDate = fileData.addedDate;
        const location = fileData.location;
        const translateX = 3;
        
        this.setState({
            longitude: longitude,
            latitude: latitude,
            caption: caption,
            location: location,
            personName: personName,
            addedDate: addedDate
        })
        
        const fileURL = fileData.fileURL;
        const fileType = fileData.fileURL.split( '.' ).pop().toLowerCase();

        console.log(fileType);

        
        i++;

    
        const container = document.getElementById("viewer-container");
        const viewer = new IfcViewerAPI({
            container: container
        });
        console.log(container.childNodes[0])
        const canvas = container.childNodes[0];
        canvas.id = "threejs-canvas-map";

        viewer.axes.setAxes();
        viewer.grid.setGrid();

        //const model = await viewer.IFC.loadIfcUrl(fileURL);
        //viewer.shadowDropper.renderShadow(model.modelID);

            
        const self = this;

        const map = new mapboxgl.Map({
            container: 'map',
            zoom: 5,
            minZoom: 4,
            center: [95.8991, 18.0887],
            // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
            style: 'mapbox://styles/mapbox/streets-v11'
        });

        map.on('load', () => {
            map.addSource('canvas-source', {
                type: 'canvas',
                canvas: 'threejs-canvas-map',
                coordinates: [
                [91.4461, 21.5006],
                [100.3541, 21.5006],
                [100.3541, 13.9706],
                [91.4461, 13.9706]
                ],
                // Set to true if the canvas source is animated. If the canvas is static, animate should be set to false to improve performance.
                animate: true
            });
             
            map.addLayer({
                id: 'canvas-layer',
                type: 'raster',
                source: 'canvas-source'
            });
        });



        window.addEventListener('keydown', (event) => {
            if (event.keyCode === 65) {
              console.log("Grid Toggle");
              viewer.grid.dispose();
            }
            // do something
          });
    }


    static getInitialProps({ pathname }){
        return { pathname }
    }

    componentWillUnmount() {

    }



    getFileDataUsingAPI(){
        return new Promise((resolve,reject) => {
            var axios = require('axios');

            var config = {
            method: 'get',
            url: `https://mongo-3d.herokuapp.com/getSingleFileV2/${this.state.fileId}`,
            headers: { }
            };

            axios(config)
            .then(function (response) {
                
                console.log(response);

                resolve({
                    fileURL : response.data.files[0].fileURL,
                    fileType : response.data.files[0].type,
                    latitude : response.data.files[0].latitude,
                    longitude : response.data.files[0].longitude,
                    personName : response.data.files[0].personName,
                    caption : response.data.files[0].caption,
                    addedDate: response.data.files[0].createdAt,
                    location: response.data.files[0].location
                });
            })
            .catch(function (error) {
                reject(error);
            });
        });

    }

    
    render(){
        const setScaleX = (event) => {
            console.log(event.target.value);

            this.setState({
                scaleX: event.target.value
            });

            console.log(this.state.scaleX);
            
            document.getElementById("scaleY-input").value = event.target.value;
            document.getElementById("scaleZ-input").value = event.target.value;
        }

        return (
            <>
                <div id="viewer-container"></div>
                <div id="map"></div>

                {/* * Other UI * */}
                <div className="viewer-card-listing-main">
                    <div className="viewer-card-listing-header">
                        <h3 className="viewer-card-listing-caption">{this.state.caption}</h3>
                        <h3 className="viewer-card-listing-location">{this.state.location}</h3>
                        <h3 className="viewer-card-listing-added-date">Added on {moment(new Date(this.state.addedDate)).format("MMMM D, YYYY")}</h3>
                        <h3 className="viewer-card-listing-person-name">by {this.state.personName}</h3>
                    </div>
                </div>


                <div className="editor-card-listing">
                    <div>
                        <h3>Uniform Scale</h3>
                            <TextField
                                label="x"
                                id="scaleX-input"
                                defaultValue={this.state.scaleX}
                                size="small"
                                type="number"
                                onChange = {
                                    setScaleX
                                }
                                InputProps={{ inputProps: { min: 0, max: 10 } }}
                                sx={{
                                    margin: '10px 0px',
                                    width: '100%'
                                }}
                            />
                            <TextField
                                label="y"
                                id="scaleY-input"
                                size="small"
                                defaultValue={this.state.scaleX}
                                disabled="true"
                                sx={{
                                    margin: '10px 0px'
                                }}
                            />
                            <TextField
                                label="z"
                                id="scaleZ-input"
                                size="small"
                                defaultValue={this.state.scaleX}
                                disabled="true"
                                sx={{
                                    margin: '10px 0px'
                                }}
                            />
                    </div>
                </div>
            </>
        )
    }
}





function ViewerWebIFC(){
    const { id } = useParams();
    console.log(id);

    const [fileId, setFileId ] = useState("");
    let navigat = useNavigate();
        
    const navigateToHome = () => {
        navigat("/");
    }

    useEffect(() => {
        console.log("FileID"+id); // Alerts 'Someone'
        setFileId(id);
    }, [id]);

    if(fileId){
        return(
            <>
                <LocalView fileId={fileId}></LocalView>
                <BackButton 
                    variant="contained" 
                    disableRipple 
                    className='navigate-to-home-button'
                    onClick={navigateToHome}  
                >Back to Listings</BackButton>
            </>
        )
    }
}


export default ViewerWebIFC


// export async function getStaticProps(context) {
//     console.log(context);
// }

