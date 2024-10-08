import { useState, useEffect } from 'react';
import '../../CSS/toDoItemsColumn.css';
import { GetToDoItems } from '../../JS/GetToDoItems';
import { IoIosArrowDropright } from "react-icons/io";
import { IoIosArrowDropdown } from "react-icons/io";
import { RiDeleteBinLine, RiDeleteBin2Fill } from "react-icons/ri";
import { FaPlus, FaTimes, FaMinus } from 'react-icons/fa';
import { FiEdit } from "react-icons/fi";

const ToDoItems = ({ userid, selectedList, localURL, apiURL, sendSelectedItemToParent, updatedItem, setSelectedTab }) => {
    const [toDoItems, setToDoItems] = useState({});
    const [toggleToDoList, setToggleToDoList] = useState(true);
    const [toggleDoingList, setToggleDoingList] = useState(true);
    const [toggleDoneList, setToggleDoneList] = useState(true);
    const [toggleItemInput, setToggleItemInput] = useState(false);
    const [deleteButton, setDeleteButton] = useState(false);

    const URL = apiURL;

    async function GetToDoItems(userId, listid) {
        if (listid) {
            try {
                let items = {
                    toDo: [],
                    doing: [],
                    done: []
                };

                const response = await fetch(`${URL}/todoitem/${userId}/${listid}`, {
                    method: "GET",
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    data.forEach(item => {
                        if (item.status == 'todo') {
                            items.toDo.push(item);
                        } else if (item.status == 'doing') {
                            items.doing.push(item);
                        } else if (item.status == 'done') {
                            items.done.push(item);
                        }
                    });

                    return items;

                } else {
                    return items;
                    throw new Error(response.statusText);
                }
            } catch (error) {
                // throw error;
            }
        } else {
            return null;
        }

    }

    async function GetToDoItemById(itemid) {
        if (itemid) {
            await fetch(`${URL}/todoitem/${itemid}`, {
                method: "GET",
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            }).then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Failed to fetch the item');
                }
            }).then(data => {
                sendSelectedItemToParent(data);
            }).catch(error => {
                return error;
            })
        }
    }

    async function AddToDoItem(userid, listid, itemname) {
        await fetch(`${URL}/todoitem/${userid}/${listid}/${itemname}`, {
            method: "POST",
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to add list');
            }
        }).then(data => {
            const newItemId = data.newItemId;
            setToDoItems(prevToDoItems => {
                const updatedToDoItems = {
                    ...prevToDoItems,
                    toDo: [
                        ...prevToDoItems.toDo,
                        {
                            item_id: newItemId,
                            item_name: itemname,
                            status: 'todo',
                            due_date: null,
                            complete_date: null
                        }
                    ]
                };
                return updatedToDoItems;
            });
        })
            .catch(error => {
                // return error;
            });
    }

    async function DeleteToDoItemByItemId(itemid) {
        let errorMsg;
        try {
            const response = await fetch(`${URL}/todoitem/${itemid}`, {
                method: "DELETE",
            });

            if (response.ok) {
                console.log('Deleted the item');
                return;
            }

        } catch (error) {
            errorMsg = error;
        }
    }

    const handleToggleToDoList = () => {
        if (toggleToDoList) {
            setToggleToDoList(false);
        } else {
            setToggleToDoList(true);
        }
    }

    const handleToggleDoingList = () => {
        if (toggleDoingList) {
            setToggleDoingList(false);
        } else {
            setToggleDoingList(true);
        }
    }

    const handleToggleDoneList = () => {
        if (toggleDoneList) {
            setToggleDoneList(false);
        } else {
            setToggleDoneList(true);
        }
    }

    const handleToggleDeleteButton = () => {
        if (deleteButton) {
            setDeleteButton(false)
        } else {
            setDeleteButton(true)
        };
    };

    const handleToggleItemInput = () => {
        if (toggleItemInput) {
            setToggleItemInput(false)
        } else {
            setToggleItemInput(true)
        };
    }

    const handleAddNewItem = (e) => {
        console.log(toDoItems);
        e.preventDefault();
        const inputValue = e.target.value;
        AddToDoItem(userid, selectedList.list_id, inputValue)
    }

    const handleDeleteItem = (status, itemid) => {
        if (status === 'todo') {
            setToDoItems(prevToDoItems => {
                const updatedToDoItems = {
                    ...prevToDoItems,
                    toDo: prevToDoItems.toDo.filter((item) => item.item_id !== itemid)
                };
                console.log(updatedToDoItems);
                return updatedToDoItems;
            });
        } else if (status === 'doing') {
            setToDoItems(prevToDoItems => {
                const updatedToDoItems = {
                    ...prevToDoItems,
                    doing: prevToDoItems.doing.filter((item) => item.item_id !== itemid)
                };
                console.log(updatedToDoItems);
                return updatedToDoItems;
            });
        } else if (status === 'done') {
            setToDoItems(prevToDoItems => {
                const updatedToDoItems = {
                    ...prevToDoItems,
                    done: prevToDoItems.doing.filter((item) => item.item_id !== itemid)
                };
                console.log(updatedToDoItems);
                return updatedToDoItems;
            });
        }
        DeleteToDoItemByItemId(itemid);
        sendSelectedItemToParent(null);
    }

    const handleSelectedItem = (itemid) => {
        GetToDoItemById(itemid)
        setSelectedTab('edit')
    }

    useEffect(() => {
        const fetchToDoItems = async () => {
            try {
                const items = await GetToDoItems(userid, selectedList.list_id);
                if (items) {
                    setToDoItems(items);
                } else {
                    setToDoItems({});
                }
                setToggleToDoList(true);
                setToggleDoingList(true);
                setToggleDoneList(true);
            } catch (error) {
                // console.error("Error fetching ToDo Items:", error);
            }
        };
        fetchToDoItems();
    }, [userid, selectedList, updatedItem]);

    function parseDate(dateString) {
        if (dateString == null) {
            return "N/A";
        }

        const date = new Date(dateString);

        const timeZoneOffset = date.getTimezoneOffset();
        const adjustedDate = new Date(date.getTime() + timeZoneOffset * 60 * 1000);

        const adjustedYear = adjustedDate.getFullYear();
        const adjustedMonth = String(adjustedDate.getMonth() + 1).padStart(2, '0');
        const adjustedDay = String(adjustedDate.getDate()).padStart(2, '0');

        const formattedDate = `${adjustedYear}-${adjustedMonth}-${adjustedDay}`;
        return formattedDate;
    }

    return (
        <>
            {/* list-name */}
            <div className='fs-2 fw-bolder list-name text-center mb-2'>{selectedList && selectedList.list_name}</div>

            {/* Tool bar */}
            <div className="d-flex justify-content-between mb-2 border-bottom border-1 tool-bar">
                {toggleItemInput ? <div className='addItem'>
                    <input type="text"
                        placeholder="Add an item" className='add-item-input' id="toDoItemInput" onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleAddNewItem(e);
                                setToggleItemInput(false);
                            }
                        }} />
                </div> : <div className='btn d-flex align-items-center tool-button' id="toDoItemInputButton" onClick={handleToggleItemInput}>
                    <FaPlus />
                    <div className='ms-2 fw-bold'>Add a new item</div>
                </div>
                }
                <div className='btn d-flex align-items-center tool-button' id="toDoItemDeleteButton" onClick={handleToggleDeleteButton}>
                    <RiDeleteBinLine />
                    <div className='ms-2 fw-bold'>Delete items</div>
                </div>
            </div>

            {/* Items */}
            {/* to-do */}
            <div className='d-flex subtitle align-items-center' onClick={handleToggleToDoList}>
                {toggleToDoList ? <IoIosArrowDropdown className='arrowicon ms-3' /> : <IoIosArrowDropright className='arrowicon ms-3' />}
                <div className='fs-6 fw-bolder ms-3'>To do {toDoItems && toDoItems.toDo && `(${toDoItems.toDo.length})`}</div>
            </div>
            {toggleToDoList && (
                <table className='table table-hover table-dark smaller-table'>
                    <thead>
                        <tr>
                            <th scope="col" className='col-1 text-center'></th>
                            <th scope="col" className='col-4 text-center'>Name</th>
                            <th scope="col" className='col-3 text-center'>Due</th>
                            <th scope="col" className='col-3 text-center'>Completed</th>
                            <th scope="col" className='col-1 text-center'></th>
                        </tr>
                    </thead>
                    <tbody id="toDoItemTable">
                        {toDoItems && toDoItems.toDo && toDoItems.toDo.map((item, index) => (
                            <tr key={index} className="todo-item-row">
                                <th scope="row" className='text-end item-number'> {index + 1} </th>
                                <td className='text-center'>{item.item_name}</td>
                                <td className='text-center'>{parseDate(item.due_date)}</td>
                                <td className='text-center'>{parseDate(item.complete_date)}</td>
                                <td>
                                    <div className='d-flex align-content-center justify-content-end'>
                                        <div className='me-2 editButton d-flex text-center align-content-center' onClick={() => handleSelectedItem(item.item_id)}>
                                            <FiEdit />
                                        </div>
                                        {deleteButton && (<div className='deleteButton d-flex text-center align-content-center'
                                            onClick={() => handleDeleteItem(item.status, item.item_id)}>
                                            <RiDeleteBin2Fill
                                            />
                                        </div>

                                        )}

                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* doing */}
            <div className='d-flex subtitle align-items-center my-1' onClick={handleToggleDoingList}>
                {toggleDoingList ? <IoIosArrowDropdown className='arrowicon ms-3' /> : <IoIosArrowDropright className='arrowicon ms-3' />}
                <div className='fs-6 fw-bolder ms-3' >Doing {toDoItems && toDoItems.doing && `(${toDoItems.doing.length})`}</div>
            </div>
            {toggleDoingList && <table className='table table-hover table-dark smaller-table'>
                <thead>
                    <tr>
                        <th scope="col" className='col-1 text-center'></th>
                        <th scope="col" className='col-4 text-center'>Name</th>
                        <th scope="col" className='col-3 text-center'>Due</th>
                        <th scope="col" className='col-3 text-center'>Completed</th>
                        <th scope="col" className='col-1 text-center'></th>
                    </tr>
                </thead>
                <tbody id="doingItemTable">
                    {toDoItems && toDoItems.doing && toDoItems.doing.map((item, index) => (
                        <tr key={index} id={item.item_id} className="doing-item-row">
                            <th scope="row" className='text-end item-number'>{index + 1}</th>
                            <td className='text-center'>{item.item_name}</td>
                            <td className='text-center'>{parseDate(item.due_date)}</td>
                            <td className='text-center'> {parseDate(item.complete_date)}</td>
                            <td>
                                <div className='d-flex align-content-center justify-content-end'>
                                    <div className='me-2 editButton d-flex text-center align-content-center' onClick={() => handleSelectedItem(item.item_id)}>
                                        <FiEdit />
                                    </div>
                                    {deleteButton && (<div className='deleteButton d-flex text-center align-content-center'
                                        onClick={() => handleDeleteItem(item.status, item.item_id)}>
                                        <RiDeleteBin2Fill
                                        />
                                    </div>

                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>}

            {/* done */}
            <div className='d-flex subtitle align-items-center' onClick={handleToggleDoneList}>
                {toggleDoneList ? <IoIosArrowDropdown className='arrowicon ms-3' /> : <IoIosArrowDropright className='arrowicon ms-3' />}
                <div className='fs-6 fw-bolder ms-3' >Done {toDoItems && toDoItems.done && `(${toDoItems.done.length})`}</div>
            </div>
            {toggleDoneList && <table className='table table-hover table-dark smaller-table'>
                <thead>
                    <tr>
                        <th scope="col" className='col-1 text-center'></th>
                        <th scope="col" className='col-4 text-center'>Name</th>
                        <th scope="col" className='col-3 text-center'>Due</th>
                        <th scope="col" className='col-3 text-center'>Completed</th>
                        <th scope="col" className='col-1 text-center'></th>
                    </tr>
                </thead>
                <tbody id="doneItemTable">
                    {toDoItems && toDoItems.done && toDoItems.done.map((item, index) => (
                        <tr key={index} id={item.item_id} className="done-item-row">
                            <th scope="row" className='text-end item-number'>{index + 1}</th>
                            <td className='text-center'>{item.item_name}</td>
                            <td className='text-center'>{parseDate(item.due_date)}</td>
                            <td className='text-center'>{parseDate(item.complete_date)}</td>
                            <td>
                                <div className='d-flex align-content-center justify-content-end'>
                                    <div className='me-2 editButton d-flex text-center align-content-center' onClick={() => handleSelectedItem(item.item_id)}>
                                        <FiEdit />
                                    </div>
                                    {deleteButton && (<div className='deleteButton d-flex text-center align-content-center'
                                        onClick={() => handleDeleteItem(item.status, item.item_id)}>
                                        <RiDeleteBin2Fill
                                        />
                                    </div>

                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>}
        </>
    );
}

export default ToDoItems;
