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
            rotationX: 1,
            rotationY: 1,
            rotationZ: 1,
            translationX: 0,
            translationY: 0,
            translationZ: 0,
        }


        this.saveTransformationToDB = this.saveTransformationToDB.bind(this);

    }


    async componentDidMount(){
        
        
    
        // In Development mode it is mounted twice, set reactStrictMode: false in next.js config file 
        console.log("Component is mounted"+i);
        

        console.log("Getting File");
        const fileData = await this.getFileDataUsingAPI();
        //console.log(fileData);

        const latitude = fileData.latitude;
        const longitude = fileData.longitude;
        const caption = fileData.caption;
        const personName = fileData.personName;
        const addedDate = fileData.addedDate;
        const location = fileData.location;
        const transalateX = fileData.transalateX;
        const transalateY = fileData.transalateY;
        const transalateZ = fileData.transalateZ;
        const rotationX = fileData.rotationX;
        const rotationY = fileData.rotationY;
        const rotationZ = fileData.rotationZ;
        const scaleX = fileData.scaleX;
        const scaleY = fileData.scaleY;
        const scaleZ = fileData.scaleZ;

        //const translateX = 3;
        
        this.setState({
            longitude: longitude,
            latitude: latitude,
            caption: caption,
            location: location,
            personName: personName,
            addedDate: addedDate,
            scaleX: scaleX,
            scaleY: scaleY,
            scaleZ: scaleZ,
            rotationX: rotationX,
            rotationY: rotationY,
            rotationZ: rotationZ,
            translationX: transalateX,
            translationY: transalateY,
            translationZ: transalateZ,
        });

        console.log(this.state);
        
        const fileURL = fileData.fileURL;
        const fileType = fileData.fileURL.split( '.' ).pop().toLowerCase();

        //console.log(fileType);

        
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
            
        const self = this;

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
          
            render: function(gl, matrix){
                //console.log(self.state.translationX);

                const translateX = modelTransform.translateX + parseFloat(self.state.translationX/10000000);
                const translateZ = modelTransform.translateY + parseFloat(self.state.translationZ/10000000);

                const rotateX = modelTransform.rotateY + degrees_to_radians(self.state.rotationY);

                //console.log(translateX);

                const rotationX = new Matrix4().makeRotationAxis(
                new Vector3(1, 0, 0), modelTransform.rotateX);
                const rotationY = new Matrix4().makeRotationAxis(
                new Vector3(0, 1, 0), rotateX);
                const rotationZ = new Matrix4().makeRotationAxis(
                new Vector3(0, 0, 1), modelTransform.rotateZ);
                
                const m = new Matrix4().fromArray(matrix);
                const l = new Matrix4()
                .makeTranslation(
                translateX,
                translateZ,
                modelTransform.translateZ
                )
                .scale(
                new Vector3(
                modelTransform.scale * self.state.scaleX,
                -modelTransform.scale * self.state.scaleX,
                modelTransform.scale * self.state.scaleX)
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
                    location: response.data.files[0].location,
                    transalateX: response.data.files[0].translateX,
                    transalateY: response.data.files[0].translateY,
                    transalateZ: response.data.files[0].translateZ,
                    rotationX: response.data.files[0].rotationX,
                    rotationY: response.data.files[0].rotationY,
                    rotationZ: response.data.files[0].rotationZ,
                    scaleX: response.data.files[0].scaleX,
                    scaleY: response.data.files[0].scaleY,
                    scaleZ: response.data.files[0].scaleZ,
                });
            })
            .catch(function (error) {
                reject(error);
            });
        });

    }

    saveTransformationToDB(event){
        console.log(this.state);


        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "translateX": this.state.translationX,
            "translateY": this.state.translationY,
            "translateZ": this.state.translationZ,
            "rotationX": this.state.rotationX,
            "rotationY": this.state.rotationY,
            "rotationZ": this.state.rotationZ,
            "scaleX": this.state.scaleX,
            "scaleY": this.state.scaleY,
            "scaleZ": this.state.scaleZ,
            "id": this.state.fileId
        });

        
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        
        fetch("https://mongo-3d.herokuapp.com/updateTransformation", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

    }

    
    render(){
        return (
            <>
                <div id="viewer-container"></div>
                <div id="map"></div>

                <div className="viewer-card-listing-main-onlyviewer">
                    <div className="viewer-card-listing-header-onlyviewer">
                        <h3 className="viewer-card-listing-person-name-onlyviewer">Created by {this.state.personName}</h3>
                    </div>
                </div>
            </>
        )
    }
}


const SyncButton = styled(Button)({
    backgroundColor: '#FF5A5F',
    boxShadow: 'none',
    '&:hover':{
      backgroundColor: '#FF5A5F',
      boxShadow: '-1px 0px 40px -15px rgba(0,0,0,0.75)',
    },
    fontSize: '0.95rem',
    padding: '12px 24px',
    width: '100%',
    borderRadius: '16px',
    fontWeight: '600',
    letterSpacing: '1.1px'
})




function OnlyViewer(){
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
            </>
        )
    }
}


export default OnlyViewer



function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}
