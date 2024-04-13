export async function GetToDoLists(userid) {
    const localApiURL = "http://localhost:8080";
    const apiURL = "https://national-united-gobbler.ngrok-free.app";

    try {
        const response = await fetch(`${apiURL}/todopage/${userid}`, {
            method: "GET",
            headers: {
                'ngrok-skip-browser-warning': 'true'
            }
        });
        
        if (response.ok) {
            const lists = [];
            const data = await response.json(); 
            data.forEach( item => {
                lists.push(item.list_name)
            });
            console.log(lists)
            return lists; 
        } else {
            throw new Error(response.statusText); 
        }
    } catch (error) {
        throw error;
    }
}

