const btn = document.getElementById('signupform');
btn.addEventListener('submit',signupSubmit);

async function signupSubmit(e){
    
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    
    const obj = {
        email,
        name,
        password
    }

    try{
        await axios.post('http://3.82.236.167:3000/user/addUser',obj);
        window.location.href = "login.html";
    }
    catch(err){
        // getting failed status from the error response
        const status = err.response.status || 510;

        if(status === 501){
            alert('There was some issue creating the user !!');
        }
        else if(status === 502) {
            alert('User already Exists !!');
        }
        else{
            alert('Something went wrong !!');
        }
    }
}