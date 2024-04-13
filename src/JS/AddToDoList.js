export function AddToDoList(userid, listname) {
    const localApiURL = "http://localhost:8080";
    const apiURL = "https://national-united-gobbler.ngrok-free.app";
    let errorMsg;

    try {
        const response = fetch(`${apiURL}/todolist/${userid}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
            },
            body: JSON.stringify(listname)
        });
        
        if (response.ok) {
            return true;
        } 

    } catch (error) {
        errorMsg = error;
    }
}

