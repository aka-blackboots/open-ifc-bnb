import { Card } from "@mui/material";
import CardMedia from '@mui/material/CardMedia';
import moment from "moment";
import { Link } from "react-router-dom";

export const ShowData = (props) => {
    console.log(props.listItems);
    console.log("hey7")
    const getFileType = (filename) => {
        return filename.slice(filename.lastIndexOf('.') + 1);
    }

    if(props.listItems !== undefined){
        return (
            <div className="main-listing-region">

                {props.listItems.map((data) => (
                    <div key={data._id} className="listing-card">
                        <Link
                        to={`/model-viewer/${encodeURIComponent(data._id)}`}
                        >
                            <div className="listing-card-img-container">
                                <img className="listing-card-img" src="https://picsum.photos/seed/picsum/200/300"></img>
                                <h4 className="listing-card-location">{data.location}</h4>
                            </div>
                            
                            <div className="listing-card-img-div-overlay">
                                <div className="">
                                    <h2 className="listing-card-ppname">{data.caption}</h2>
                                    {/* <p>{data.filename}</p> */}
                                    <div className="list-card-footer">
                                        <h4 className="listing-card-pname">Added by {data.personName}</h4>
                                        <p className="listing-card-date">Added on {moment(new Date(data.createdAt)).format("MMMM D, YYYY")}</p>
                                        {/* MOST IMP THING
                                        <p className="">{getFileType(data.filename)}</p> */}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div> 
                ))}

            </div>
        );
    }
}

export default ShowData
