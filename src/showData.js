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
            <>
                {props.listItems.map((data) => (
                    
                    <Link
                        to={`/model-viewer/${encodeURIComponent(data._id)}`}
                        key={data._id}
                    >
                            <div className="">
                                <div className="">
                                    <h2>{data.caption}</h2>
                                    {/* <p>{data.filename}</p> */}
                                    <div className="">
                                        <p className="">{moment(new Date(data.createdAt)).format("MMMM D, YYYY")}</p>
                                        <p className="">{getFileType(data.filename)}</p>
                                    </div>
                                </div>
                            </div>
                    </Link>
                ))}
            </>
        );
    }
}

export default ShowData
