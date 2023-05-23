const btn = document.getElementById('button');
btn.addEventListener('click', sendMessage);

// SENDING MESSAGEs TO DB
async function sendMessage(){

    const chat = document.querySelector('.textarea').value;
    const parentTag = document.querySelector('.chat');
    const token = localStorage.getItem('token');

    try{
        await axios.post('http://localhost:4000/chat/addchat',{chat}, {headers : {'Authorization' : token}});
        creatingMessagesHTML(chat);
        parentTag.textContent = '';
    }
    catch(err){
        alert('Something went wrong !!');
    }
};

// RELOAD EVENT LISTENER
window.addEventListener('DOMContentLoaded', async() => {
    const token = localStorage.getItem('token');
    const parentTag = document.querySelector('.chat');
    
    const response = await axios.get('http://localhost:4000/chat/getchat', {headers : {'Authorization' : token}});
    const chats = response.data.response;
    
    // clearing the page
    parentTag.textContent = "";

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

// creating an interval to get data from DB every 2 seconds
setInterval( async() => {
    
    console.log('Running !!!!');
    const token = localStorage.getItem('token');
    const parentTag = document.querySelector('.chat');
    
    const res = await axios.get('http://localhost:4000/chat/getchat', {headers: {'Authorization': token}});
    const chats = res.data.response;
    console.log(chats);
    // clearing the frontend
    parentTag.textContent = "";
    
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
},2000);

// --------------------------------------------------------------------------------------------------------
// CREATING ALL THE HELPER FUNCTIONS HERE

// FUNCTION TO CREATE MESSAGE IN HTML
function creatingMessagesHTML(text){
    const parentTag = document.querySelector('.chat');
    const p = document.createElement('p');
    const divMsg = document.createElement('div');
    const divCard = document.createElement('div');
    const li = document.createElement('li');

    // clearing the messages from the UI
     

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
};

// FUNCTION TO CREATE OTHER'S MESSAGE IN HTML
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
};