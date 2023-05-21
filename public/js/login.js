const btn = document.getElementById('loginform');
btn.addEventListener('submit',loginSubmit);

async function loginSubmit(e){
    e.preventDefault();

    let token;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const obj = {
        email,
        password
    };

    try{
        const res = await axios.post('http://localhost:4000/login/loginUser',obj);
        token = res.data.token;
        localStorage.setItem("token",token.toString());
        // window.location.href = "expense-form.html";
        alert('Succesfull !!');
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