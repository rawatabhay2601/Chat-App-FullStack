const btn = document.getElementById('signupform');
btn.addEventListener('submit',loginSubmit);

async function signupSubmit(e){
    
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

}