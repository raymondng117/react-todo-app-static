import Navbar from "../Navbar/Navbar";
import ToDoLists from "./ToDoLists";
import { useParams } from "react-router-dom";
import '../../CSS/toDoPage.css';

const ToDoPage = ({apiURL, localApiURL}) => {
    const savedUser = sessionStorage.getItem('signedInUser');
    const parsedSavedUser = savedUser ? JSON.parse(savedUser) : {};
    console.log(parsedSavedUser.user_id);

    return (
        <>
            <Navbar className="navbar" />
            <ToDoLists className="todocontent" userid={parsedSavedUser.user_id} apiURL={apiURL} localURL={localApiURL}/>
        </>
    );
}

export default ToDoPage;