import Navbar from "../Navbar/Navbar";
import ToDoLists from "./ToDoLists";
import '../../CSS/toDoPage.css';

const ToDoPage = ({apiURL, localApiURL}) => {
    const savedUser = sessionStorage.getItem('signedInUser');
    const parsedSavedUser = savedUser ? JSON.parse(savedUser) : {};
    return (
        <>
            <Navbar className="navbar" />
            <ToDoLists className="todocontent" userid={parsedSavedUser.user_id} apiURL={apiURL} localURL={localApiURL}/>
        </>
    );
}

export default ToDoPage;