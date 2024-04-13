export async function DeleteToDoList(userid, listname) {
    const localApiURL = "http://localhost:8080";
    const apiURL = "https://national-united-gobbler.ngrok-free.app"; // Update with your API URL

    try {
        const response = await fetch(`${apiURL}/todolist/${userid}/${listname}`, {
            method: "DELETE"
        });

        if (response.ok) {
            return true; 
        } else {
            throw new Error(`Failed to delete to-do list: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error deleting to-do list:", error);
        return false; // Return false if an error occurs
    }
}
