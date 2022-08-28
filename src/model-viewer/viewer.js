import { Component, createRef } from "react";
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import styled from '@emotion/styled';
import { Button } from '@mui/material';
import { Matrix4, Vector3,
    DirectionalLight, AmbientLight,
    PerspectiveCamera,
    Scene, WebGLRenderer,
    BoxHelper
  } from "three";
import { IFCLoader } from "web-ifc-three/IFCLoader"; 

import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer"

import mapboxgl from 'mapbox-gl'; 
import moment from "moment";
import { useNavigate } from 'react-router-dom';
import './viewer.css';

let i = 0;


const BackButton = styled(Button)({
    backgroundColor: '#FF5A5F',
    boxShadow: 'none',
    '&:hover':{
      backgroundColor: '#FF5A5F',
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
            addedDate: ""
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



        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/manevishwajeet1/cl7d89k8r000514pchd2e1haw',
            zoom: 20.5,
            center: [latitude, longitude],
            pitch: 75,
            bearing: -80,
            antialias: true
        });
        const modelOrigin = [latitude, longitude];
        const modelAltitude = 0;
        const modelRotate = [Math.PI / 2, .72, 0];
        
        const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude);
        
        const modelTransform = {
        translateX: modelAsMercatorCoordinate.x,
        translateY: modelAsMercatorCoordinate.y,
        translateZ: modelAsMercatorCoordinate.z,
        rotateX: modelRotate[0],
        rotateY: modelRotate[1],
        rotateZ: modelRotate[2],
        scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
        };
        
        const scene = new Scene(); 
        this.scene = scene;

        const camera = new PerspectiveCamera();
        this.camera = camera;

        const renderer = new WebGLRenderer({
            canvas: map.getCanvas(),
            antialias: true,
        });
        renderer.autoClear = false;

        //const labelRenderer = new CSS2DRenderer();
        //labelRenderer.domElement = renderer.domElement;
            


        const customLayer = {

            id: '3d-model',
            type: 'custom',
            renderingMode: '3d',
          
            onAdd: () => {
                const ifcLoader = new IFCLoader();
                ifcLoader.ifcManager.setWasmPath('./../../WASM/');

                switch (fileType) {
                    case 'ifc':
                        //this.loadIfc(fileURL);
                        ifcLoader.load( fileURL , ( model ) => {
                            scene.add( model );
                            this.mainIFCModel = model;

                            // const box = new BoxHelper( model, 0xffff00 );
                            // this.scene.add( box );

                        });
                        break;
                    default:
                        break;
                }
            
                const directionalLight = new DirectionalLight(0x404040);
                const directionalLight2 = new DirectionalLight(0x404040);
                const ambientLight = new AmbientLight( 0x404040, 3 ); 
            
                directionalLight.position.set(0, -70, 100).normalize();
                directionalLight2.position.set(0, 70, 100).normalize();
            
                scene.add(directionalLight, directionalLight2, ambientLight);
            },
          
            render: function (gl, matrix) {
                const rotationX = new Matrix4().makeRotationAxis(
                new Vector3(1, 0, 0), modelTransform.rotateX);
                const rotationY = new Matrix4().makeRotationAxis(
                new Vector3(0, 1, 0), modelTransform.rotateY);
                const rotationZ = new Matrix4().makeRotationAxis(
                new Vector3(0, 0, 1), modelTransform.rotateZ);
                
                const m = new Matrix4().fromArray(matrix);
                const l = new Matrix4()
                .makeTranslation(
                modelTransform.translateX,
                modelTransform.translateY,
                modelTransform.translateZ
                )
                .scale(
                new Vector3(
                modelTransform.scale,
                -modelTransform.scale,
                modelTransform.scale)
                )
                .multiply(rotationX)
                .multiply(rotationY)
                .multiply(rotationZ);
                
                camera.projectionMatrix = m.multiply(l);
                renderer.resetState();
                renderer.render(scene, camera);
                
                //labelRenderer.render( scene, camera );
                

                map.triggerRepaint();
            }
        };


        map.on('style.load', () => {
            map.addLayer(customLayer, 'waterway-label');
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
            </>
        )
    }
}





function Mview(){
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


export default Mview


// export async function getStaticProps(context) {
//     console.log(context);
// }

