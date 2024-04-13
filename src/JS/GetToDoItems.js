export async function GetToDoItems(userId, listname) {
    const localApiURL = "http://localhost:8080";
    const apiURL = "https://national-united-gobbler.ngrok-free.app";

    if (listname) {
        try {
            let items = {
                toDo: [],
                doing: [],
                done: []
            };

            const response = await fetch(`${apiURL}/todoitem/${userId}/${listname}`, {
                method: "GET",
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            });
            
            if (response.ok) {
                const data = await response.json(); 
                console.log(data);
                data.forEach( item => {
                    if (item.status == 'todo') {
                        items.toDo.push(item.item_name);
                    } else if (item.status == 'doing') {
                        items.doing.push(item.item_name);
                    } else if (item.status == 'done') {
                        items.done.push(item.item_name);
                    }
                });
 
                console.log(items)
                return items; 
                
            } else {
                return items; 
                throw new Error(response.statusText); 
            }
        } catch (error) {
            throw error;
        }
    } else {
        return null;
    }
   
}

