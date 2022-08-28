import { Component } from "react";
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

import { Color } from "three";
import { IfcViewerAPI } from "web-ifc-viewer";

import './viewer.css';

let i = 0;

class LocalView extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            fileId: props.fileId
        }
    }

    async componentDidMount(){
        // In Development mode it is mounted twice, set reactStrictMode: false in next.js config file 
        console.log("Component is mounted"+i);
        
        
        const container = document.getElementById('viewer-container');
        const viewer = new IfcViewerAPI({ container, backgroundColor: new Color(0xffffff) }); 
        
        //viewer.grid.setGrid();
        //viewer.axes.setAxes();
        
        this.viewer = viewer;
        
        //console.log(window.location.origin);
        viewer.IFC.setWasmPath("./../../WASM/");

        console.log("Getting File");
        const fileData = await this.getFileDataUsingAPI();
        const fileURL = fileData.fileURL;
        const fileType = fileData.fileURL.split( '.' ).pop().toLowerCase();

        console.log(fileType);

        
        switch (fileType) {
            case 'ifc':
                this.loadIfc(fileURL);
                break;
            default:
                break;
        }

        i++;
    }

    static getInitialProps({ pathname }){
        return { pathname }
    }

    componentWillUnmount() {

    }

    async loadIfc(url) {
		// Load the model

        const model = await this.viewer.IFC.loadIfcUrl(url);

        // Add dropped shadow and post-processing efect
        await this.viewer.shadowDropper.renderShadow(model.modelID);
        this.viewer.context.renderer.postProduction.active = false;
        
    }

    getFileDataUsingAPI(){
        return new Promise((resolve,reject) => {
            var axios = require('axios');

            var config = {
            method: 'get',
            url: `http://localhost:9000/getSingleFileV2/${this.state.fileId}`,
            headers: { }
            };

            axios(config)
            .then(function (response) {
                resolve({
                    fileURL : response.data.files[0].fileURL,
                    fileType : response.data.files[0].type
                });
            })
            .catch(function (error) {
                reject(error);
            });
        });

    }

  
    render(){
        return (
            <div id="viewer-container"></div>
        )
    }
}




function Mview(){
    const { id } = useParams();
    console.log(id);

    const [fileId, setFileId ] = useState("");

    useEffect(() => {
        console.log("FileID"+id); // Alerts 'Someone'
        setFileId(id);
    }, [id]);

    if(fileId){
        return(
            <LocalView fileId={fileId}></LocalView>
        )
    }
}


export default Mview


// export async function getStaticProps(context) {
//     console.log(context);
// }

