import { useState, useEffect } from "react";
//import { GetToDoLists } from "../../JS/GetToDoLists";
import '../../CSS/toDoListsColumn.css';
import { FaPlus, FaTimes } from 'react-icons/fa';
// import { AddToDoList } from "../../JS/AddToDoList";
import { RiDeleteBinLine } from "react-icons/ri";
// import { DeleteToDoList } from "../../JS/DeleteToDoList";
import ToDoItems from "./ToDoItems";
import EditToDoItems from "./EditToDoItems";

const ToDoLists = ({ userid, localURL, apiURL }) => {
    const [toToDoLists, setToDoLists] = useState([]);
    const [listInputBox, setListInputBox] = useState(false);
    const [deleteIcon, setDeleteIcon] = useState(false)
    const [selectedList, setSelectedList] = useState({});
    const [addListErr, setAddListErr] = useState('');
    const [selectedItemFromChild, setSelectedItemFromChild] = useState(null);
    const [updatedItem, setUpdatedItem] = useState(false);
    const [selectedListIndex, setSelectedListIndex] = useState(null);

    const handleSelectedItemFromChild = (selectedItem) => {
        setSelectedItemFromChild(selectedItem);
    }

    const handleUpdatedItemFromChild = (updatedMsg) => {
        setUpdatedItem(updatedMsg);
    }


    const URL = apiURL;

    async function GetToDoLists(userid) {
        try {
            const response = await fetch(`${URL}/todolist/${userid}`, {
                method: "GET",
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            throw error;
        }
    }

    async function DeleteToDoList(userid, listid) {
            await fetch(`${URL}/todolist/${userid}/${listid}`, {
                method: "DELETE"
            }).then(response => {
                if (response.ok) {
                    console.log(toToDoLists)
                    if (toToDoLists.length == 0) {
                        setSelectedList([]);
                    }

                    if (toToDoLists[0].list_id == listid) {
                        setSelectedList(toToDoLists[1])
                    } else {
                        setSelectedList(toToDoLists[0])
                    } 
                } else {
                    throw new Error(`Failed to delete to-do list: ${response.statusText}`);
                }
            }).catch(error => {
                setAddListErr(error);
            });
    }

    async function AddToDoList(userid, listname, inputValue) {
        setAddListErr('');
        await fetch(`${URL}/todolist/${userid}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(listname)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to add list');
                }
            })
            .then(data => {
                const newListId = data.newListId;
                console.log("New list ID:", newListId);
                setToDoLists(prevToDoLists => [...prevToDoLists, { list_id: newListId, list_name: inputValue }]);
                return newListId;
            })
            .catch(error => {
                setAddListErr(error);
            });
    }

    const toggleInputBox = () => {
        setListInputBox(true);
    }

    const toggleDeleteIcon = () => {
        if (deleteIcon) {
            setDeleteIcon(false);
        } else {
            setDeleteIcon(true);
        }
    };

    const handleSelectedList = (e, index) => {
        e.preventDefault();
        const selectedItem = toToDoLists[index];
        setSelectedList(selectedItem)
        setSelectedItemFromChild(null);
        setSelectedListIndex(index);

    }

    const handleAddList = async (e) => {
        e.preventDefault();
        const inputValue = e.target.value;
        if (inputValue) {
            try {
                const newListId = await AddToDoList(userid, { listname: inputValue }, inputValue);
                if (newListId) {
                    const lists = await GetToDoLists(userid);
                    setToDoLists(lists);
                }
            } catch (error) {
                console.error('Error adding to-do list:', error);
            }
        }
    }


    const handleDeleteList = (e, index, listid) => {
        e.preventDefault();
        const newList = [...toToDoLists];
        newList.splice(index, 1);
        setToDoLists(newList);
        DeleteToDoList(userid, listid);
    }

    useEffect(() => {
        const fetchToDoList = async () => {
            try {
                const lists = await GetToDoLists(userid);
                setToDoLists(lists);
                setSelectedList(lists[0])
            } catch (error) {
                console.error("Error fetching ToDo lists:", error);
            }
        };
        fetchToDoList();
    }, []);

    return (
        <>
            {/* Entire todo list column */}
            <div className="todo-container d-flex">
                {/* lists */}
                <div className="todo-list-wrapper">
                    <div className='fs-2 fw-bolder text-center lists text-center mb-3'>Lists</div>
                    <div className="todo-list d-flex flex-column align-items-center ">
                        {/* + button */}
                        {listInputBox ? <input className="list-item form-control" onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleAddList(e);
                                setListInputBox(false);
                            }
                        }}></input> :
                            <div className="d-flex justify-content-between mb-2 plusminusflex">
                                <div className="btn btn-secondary d-flex justify-content-center align-items-center mx-2" onClick={toggleInputBox}>
                                    <FaPlus />
                                </div>
                                <div className="btn btn-secondary d-flex justify-content-center align-items-center mx-2" onClick={toggleDeleteIcon}>
                                    <RiDeleteBinLine />
                                </div>
                            </div>
                        }
                        {/* to-do lists rendering */}
                        {toToDoLists && toToDoLists.map((item, index) => (
                            <div className="d-flex my-1 align-items-center justify-content-center list-row" key={index}>
                                <div className={`btn btn-secondary list-item ${selectedListIndex === index ? 'selected' : ''}`} onClick={(e) => handleSelectedList(e, index)}>{item.list_name}</div>
                                {deleteIcon && (
                                    <div className="btn btn-danger deleteicon mx-2" id={item.list_id} onClick={(e) => handleDeleteList(e, index, item.list_id)}>
                                        <FaTimes />
                                    </div>
                                )}
                            </div>
                        ))}
                        {addListErr && <div className="text-danger">{addListErr}</div>}
                    </div>
                </div>

                {/* items */}
                <div className="todo-items-wrapper">
                    <ToDoItems className="todo-item" userid={userid} selectedList={selectedList} localURL={localURL} apiURL={apiURL} 
                    sendSelectedItemToParent={handleSelectedItemFromChild}
                    updatedItem = {updatedItem}
                    />
                </div>

                {/* editItem */}
                <div className={`edit-item-wrapper ${!selectedItemFromChild && 'd-flex'} align-items-center justify-content-center`}>
                    <EditToDoItems localURL={localURL} apiURL={apiURL}
                    sendUpdatedItemFromChild = {handleUpdatedItemFromChild}
                    selectedItem = {selectedItemFromChild}
                    selectedList = {selectedList}
                />
                </div>
            </div>
        </>
    );
};

export default ToDoLists;
