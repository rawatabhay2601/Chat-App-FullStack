const btn = document.getElementById('loginform');
btn.addEventListener('submit',loginSubmit);

// CREATING LOGIN
async function loginSubmit(e){
    e.preventDefault();

    let token;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const profileName = document.getElementById('username').value;

    const obj = {
        email,
        password
    };
    
    try {
        // WE HAVE NAME COMING IN AND CAN BE USED TO DISPLAY A MESSAGE
        const res = await axios.post('http://35.174.173.248:3000/login/loginUser',obj);
        token = res.data.token;
        
        // setting up localStorage
        localStorage.setItem('token',token.toString());
        localStorage.setItem('groupId','0');
        localStorage.setItem('previousStorage','0');
        localStorage.setItem('profileName', profileName);

        // redirecting user to the chat page
        window.location.href = 'chatapp.html';
    }
    catch(err){

        const {status} = err.response;

        if(status === 401){
            alert('Incorrect Password !!');
        }
        else if(status === 404) {
            alert('No such user exitst !!');
        }
        else{
            alert('Something went wrong !!');
        }
    }
};

// CREATING JOINING MESSAGE
function joinMessage(){
    const div = document.createElement('div');
    div.textContent = `${name} has joined the chat !!`;
}