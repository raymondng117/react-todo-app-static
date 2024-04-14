import { useState, useEffect } from "react";
//import { GetToDoLists } from "../../JS/GetToDoLists";
import '../../CSS/toDoListsColumn.css';
import { FaPlus, FaTimes } from 'react-icons/fa';
// import { AddToDoList } from "../../JS/AddToDoList";
import { RiDeleteBinLine } from "react-icons/ri";
// import { DeleteToDoList } from "../../JS/DeleteToDoList";
import ToDoItems from "./ToDoItems";
import EditToDoItems from "./EditToDoItems";
import { IoReorderFour } from "react-icons/io5";
import { VscListUnordered } from "react-icons/vsc";

const ToDoLists = ({ userid, localURL, apiURL }) => {
    const [toToDoLists, setToDoLists] = useState([]);
    const [listInputBox, setListInputBox] = useState(false);
    const [deleteIcon, setDeleteIcon] = useState(false)
    const [selectedList, setSelectedList] = useState({});
    const [addListErr, setAddListErr] = useState('');
    const [selectedItemFromChild, setSelectedItemFromChild] = useState(null);
    const [updatedItem, setUpdatedItem] = useState(false);
    const [selectedListIndex, setSelectedListIndex] = useState(null);
    const [editOrderIcon, setEditOrderIcon] = useState(false);
    const [draggingIndex, setDraggingIndex] = useState(null);
    const [selectedTab, setSelectedTab] = useState("lists");


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
                setToDoLists(prevToDoLists => [...prevToDoLists, { list_id: newListId, list_name: inputValue }]);
                return newListId;
            })
            .catch(error => {
                setAddListErr(error);
            });
    }

    const toggleTab = (tab) => {
        setSelectedTab(tab);
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

    const toggoleOrderEdit = () => {
        if (editOrderIcon) {
            setEditOrderIcon(false);
        } else {
            setEditOrderIcon(true);
        }
    }

    const handleSelectedList = (e, index) => {
        e.preventDefault();
        const selectedItem = toToDoLists[index];
        setSelectedList(selectedItem)
        setSelectedItemFromChild(null);
        setSelectedListIndex(index);
        setSelectedTab("items");
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
                // console.error('Error adding to-do list:', error);
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

    const handleDragList = () => {

    }

    const handleDragStart = (index) => {
        setDraggingIndex(index);
    };

    const handleDragOver = (index) => {
        if (draggingIndex === null || draggingIndex === index) return;

        const newLists = [...toToDoLists];
        const draggedItem = newLists[draggingIndex];
        newLists.splice(draggingIndex, 1);
        newLists.splice(index, 0, draggedItem);

        setToDoLists(newLists);
        setDraggingIndex(index);
    };

    const handleDragEnd = () => {
        setDraggingIndex(null);
    };

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
            {/* Title Tabs */}
            {/* Title Tabs for small screens */}
            <div className="row d-sm-none text-center">
                <div className={`col-4 title-tab ${selectedTab === "lists" ? "selected" : ""} fw-bold`} onClick={() => toggleTab("lists")}>Lists</div>
                <div className={`col-4 title-tab ${selectedTab === "items" ? "selected" : ""} fw-bold`} onClick={() => toggleTab("items")}>Items</div>
                <div className={`col-4 title-tab ${selectedTab === "edit" ? "selected" : ""} fw-bold`} onClick={() => toggleTab("edit")}>Edit</div>
            </div>

            {/* Entire todo page*/}
            <div className=" d-flex flex-column flex-sm-row">
                {/* lists */}
                <div className={`todo-list-wrapper col-sm-3 col-12 content-section ${selectedTab === "lists" ? "open" : ""}`}>
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
                                <div className="btn btn-secondary d-flex justify-content-center align-items-center mx-2" onClick={toggoleOrderEdit}>
                                    <VscListUnordered />
                                </div>
                            </div>
                        }
                        {/* to-do lists rendering */}
                        {toToDoLists && toToDoLists.map((item, index) => (
                            <div className="d-flex my-1 align-items-center justify-content-center list-row" key={index}
                            draggable // This makes the element draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={() => handleDragOver(index)}
                            onDragEnd={handleDragEnd}
                            >
                                <div className={`btn btn-secondary list-item ${selectedListIndex === index ? 'selected' : ''}`} onClick={(e) => handleSelectedList(e, index)}>{item.list_name}</div>
                                {deleteIcon && (
                                    <div className="btn btn-danger deleteicon mx-2" id={item.list_id} onClick={(e) => handleDeleteList(e, index, item.list_id)}>
                                        <FaTimes />
                                    </div>
                                )}
                                {editOrderIcon && (
                                    <div className="btn btn-secondary editicon mx-2" id={item.list_id} onClick={() => handleDragList()}>
                                        <IoReorderFour />
                                    </div>
                                )}
                            </div>
                        ))}
                        {addListErr && <div className="text-danger">{addListErr}</div>}
                    </div>
                </div>

                {/* items */}
                <div className={`todo-items-wrapper col-sm-6 col-12 content-section ${selectedTab === "items" ? "open" : ""}`}>
                    <ToDoItems className="todo-item" userid={userid} selectedList={selectedList} localURL={localURL} apiURL={apiURL}
                        sendSelectedItemToParent={handleSelectedItemFromChild}
                        updatedItem={updatedItem} setSelectedTab={setSelectedTab}
                    />
                </div>

                {/* editItem */}
                <div className={`edit-item-wrapper align-items-center justify-content-center ${!selectedItemFromChild && 'd-flex'} content-section ${selectedTab === "edit" ? "open" : ""} col-sm-3 col-12`}>
                    <EditToDoItems localURL={localURL} apiURL={apiURL}
                        sendUpdatedItemFromChild={handleUpdatedItemFromChild}
                        selectedItem={selectedItemFromChild}
                        selectedList={selectedList}
                        setSelectedTab={setSelectedTab}
                    />
                </div>
            </div>
        </>
    );
};

export default ToDoLists;
