const btn = document.getElementById('loginform');
btn.addEventListener('submit',loginSubmit);

async function loginSubmit(e){
    e.preventDefault();

    let token;
    let name;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const obj = {
        email,
        password
    };

    try{
        // WE HAVE NAME COMING IN AND CAN BE USED TO DISPLAY A MESSAGE
        const res = await axios.post('http://localhost:4000/login/loginUser',obj);
        token = res.data.token;
        // name = res.data.name;
        // localStorage.setItem('name',name);
        const oldChats = null;
        
        // setting up localStorage
        localStorage.setItem('token',token.toString());
        localStorage.setItem('oldChats',JSON.stringify(oldChats));
        localStorage.setItem('btn-display','true');

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