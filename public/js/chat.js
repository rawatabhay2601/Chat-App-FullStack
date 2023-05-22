const btn = document.getElementById('button');
btn.addEventListener('click', sendMessage);

// SENDING MESSAGEs TO DB
async function sendMessage(){

    const chat = document.querySelector('.textarea').value;
    const token = localStorage.getItem('token');

    try{
        await axios.post('http://localhost:4000/chat/addchat',{chat}, {headers : {'Authorization' : token}});
        creatingMessagesHTML(chat);
        alert('Succesfull');
    }
    catch(err){
        alert('Something went wrong !!');
    }
};

// FUNCTION TO CREATE MESSAGE IN HTML
function creatingMessagesHTML(text){
    const parentTag = document.querySelector('.chat');
    const p = document.createElement('p');
    const divMsg = document.createElement('div');
    const divCard = document.createElement('div');
    const li = document.createElement('li');

    // adding text to p tag
    p.textContent = text;

    // setting classes for all tags
    divCard.className='card';
    divMsg.className='msg';
    li.className='self';

    // appending child tags to parent tags
    divCard.appendChild(p);
    divMsg.appendChild(divCard);
    li.appendChild(divMsg);

    parentTag.appendChild(li);
}