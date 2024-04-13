import React, { useEffect, useState } from 'react';
import '../../CSS/editItemForm.css';
import { LuClipboardEdit } from "react-icons/lu";

const EditToDoItems = ({ selectedItem, apiURL, sendUpdatedItemFromChild, selectedList }) => {
    const [formData, setFormData] = useState({});
    const [originalData, setOriginalData] = useState({})
    const [savedMsg, setSavedMsg] = useState('');
    const [reset, setReset] = useState(false);
    const [changedList, setChangedList] = useState(false);

    let item = selectedItem;
    const URL = apiURL;

    const handleInputChange = (e) => {
        setSavedMsg('');
        setReset(false);
        sendUpdatedItemFromChild(false);
        const { name, value } = e.target;

        if (name === 'status' && (value === 'todo' || value === 'doing')) {
            setFormData({ ...formData, [name]: value, complete_date: null });
        } else if (name === 'status' && value === 'done') {
            setFormData({ ...formData, [name]: 'done', complete_date: parseDate(new Date()) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmitUpdatedItem = async (e) => {
        e.preventDefault();

        const itemId = item[0].item_id;
        await fetch(`${URL}/todoitem/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).then(res => {
            if (res.ok) {
                setSavedMsg('Item has been updated.')
                sendUpdatedItemFromChild(true);
            }
        })
    };

    const handleReset = () => {
        setReset(true);
        setFormData(originalData);
    };

    function parseDate(dateString) {
        if (dateString == null) {
            return null;
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
            }).then(selectedItem => {
                setFormData({
                    item_name: selectedItem[0].item_name,
                    status: selectedItem[0].status,
                    due_date: parseDate(selectedItem[0].due_date),
                    complete_date: parseDate(selectedItem[0].complete_date)
                })
                setOriginalData(
                    {
                        item_name: selectedItem[0].item_name,
                        status: selectedItem[0].status,
                        due_date: parseDate(selectedItem[0].due_date),
                        complete_date: parseDate(selectedItem[0].complete_date)
                    }
                )
                setChangedList(false);
            }).catch(error => {
                return error;
            })
        }
    }

    useEffect(() => {
        const fetchToDoItemsById = async () => {
            try {
                await GetToDoItemById(item[0].item_id);
            } catch (error) {
                console.error("Error fetching ToDo Items:", error);
            }
        };
        fetchToDoItemsById();
        setSavedMsg('');
    }, [selectedItem]);

    useEffect(() => {
        setChangedList(true)
    }, [selectedList])

    return (
        <div>
            {
                item && !changedList ? (
                    <>
                        <div className='fs-2 fw-bolder text-center lists text-center mb-3'>{formData.item_name}</div>

                        <form className='editform container align-content-center justify-content-center' onSubmit={handleSubmitUpdatedItem}>
                            <div className="mb-3">
                                <label htmlFor="itemName" className="form-label">Name</label>
                                <input type="text" className="form-control" id="itemName" name="item_name" defaultValue={formData.item_name} value={reset ? originalData.item_name : formData.item_name} onChange={handleInputChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="itemStatus" className="form-label">Status</label>
                                <select className="form-select" id="itemStatus" name="status" value={formData.status} onChange={handleInputChange}>
                                    <option value="todo">To Do</option>
                                    <option value="doing">Doing</option>
                                    <option value="done">Done</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="dueDate" className="form-label">Due Date</label>
                                <input type="date" className="form-control" id="dueDate" name="due_date" defaultValue={formData.due_date} value={reset ? originalData.due_date : formData.due_date} onChange={handleInputChange} />
                            </div>
                            {formData.complete_date && <div className="mb-3">
                                <label htmlFor="completeDate" className="form-label">Complete Date</label>
                                <input type="date" className="form-control" id="completeDate" name="complete_date" defaultValue={formData.complete_date} value={reset ? originalData.complete_date : formData.complete_date} onChange={handleInputChange} />
                            </div>}
                            <div className='d-flex justify-content-around mt-4'>
                                <button type="submit" className='btn btn-primary'>Save</button>
                                <div className='btn btn-secondary' onClick={handleReset}>Reset</div>
                            </div>
                            {savedMsg && <div className='mt-3 text-center fs-6 fw-bold text-white'>{savedMsg}</div>}
                        </form>
                    </>
                ) : (
                    <div className='d-flex align-items-center justify-content-center'>
                        <div className='d-flex flex-column align-items-center justify-content-center'>
                            <LuClipboardEdit className='editIcon-item' />
                            <h3>Select an item to edit</h3>
                        </div>
                    </div>
                )}
        </div >
    );
}

export default EditToDoItems;
