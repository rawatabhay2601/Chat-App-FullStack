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
// FUNCTION TO CREATE MESSAGE IN HTML
function creatingMessagesHTMLothers(text){
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
    li.className='other';

    // appending child tags to parent tags
    divCard.appendChild(p);
    divMsg.appendChild(divCard);
    li.appendChild(divMsg);

    parentTag.appendChild(li);
}


// RELOAD EVENT LISTENER
window.addEventListener('DOMContentLoaded', async(e) => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:4000/chat/getchat', {headers : {'Authorization' : token}});
    const chats = response.data.response;
    for(let msg of chats){
        const {isCurrent} = msg;
        const {chat} = msg;
        if(isCurrent === 'true'){
            creatingMessagesHTML(chat)
        }
        else{
            creatingMessagesHTMLothers(chat)
        }
    }
});