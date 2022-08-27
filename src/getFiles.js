import { useEffect, useState } from 'react';
import { ShowData } from './showData';


export default function GetFiles(){ 
    const [listItems, setItem] = useState();
    const dep = [];

    useEffect(() => {
        var axios = require('axios');

        var config = {
        method: 'get',
        url: 'https://mongo-3d.herokuapp.com/getFilesV2',
        headers: { }
        };

        axios(config)
        .then(function (response) {
            setItem(JSON.parse(JSON.stringify(response.data.files)));
        })
        .catch(function (error) {
            console.log(error);
        });
    }, dep);



    if(listItems){
        return (
            <ShowData listItems = {listItems}></ShowData>
        );
    }
}
