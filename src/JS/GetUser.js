export async function GetUser(useremail, password) {
    const localApiURL = "http://localhost:8080";
    const apiURL = "https://national-united-gobbler.ngrok-free.app";
    const user = { useremail, password };
    let errorMsg;

    try {
        const response = await fetch(`${apiURL}/login`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
            },
            body: JSON.stringify({ useremail, password }), 
        })
        
        if (response.ok) {
            const data = await response.json();
            if (data.authenticated) {
                console.log(data.user);
                sessionStorage.setItem('signedInUser', JSON.stringify(data.user));
            } else {
                errorMsg = 'Invalid email or password';
            }
        } else {
            errorMsg = response.statusText;
        }
    } catch (error) {
        errorMsg = error;
    }

    return errorMsg;
}