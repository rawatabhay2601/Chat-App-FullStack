const btn = document.getElementById('button');
btn.addEventListener('click', sendMessage);

// SENDING MESSAGEs TO DB
async function sendMessage() {

    const chat = document.querySelector('.textarea').value;
    const token = localStorage.getItem('token');

    try{
        const res = await axios.post('http://localhost:4000/chat/addchat',{chat}, {headers : {'Authorization' : token}});
        const {id} = res.data.response;
        
        // adding last message ID
        localStorage.setItem('MessageID',id);
        
        // adding created message to the old chats
        const oldChats = JSON.parse(localStorage.getItem('oldChats')) || [];
        const chatObj = {...res.data.response};
        const addToChats = [...oldChats, chatObj];
        
        // saving the messages to the localStorage
        localStorage.setItem('oldChats',JSON.stringify(addToChats));
        
        // getting the data to the UI
        creatingMessagesHTML(chat);
    }
    catch(err){
        alert('Something went wrong !!');
    }
};

// RELOAD EVENT LISTENER
window.addEventListener('DOMContentLoaded', async() => {
    
    const loadPrevMsg = document.getElementById('loadPrevMessage');
    const parentTag = document.querySelector('.chat');
    const oldChats = JSON.parse(localStorage.getItem('oldChats')) || [];
    const btnDisplay = localStorage.getItem('btn-display');

    // CLEARING THE UI
    parentTag.textContent = '';

    // load the previous 10 messages
    loadPrevMsg.onclick = async() => {
    
        const token = localStorage.getItem('token');
        const parentTag = document.querySelector('.chat'); 
        const prevMessageId = parseInt(localStorage.getItem('MessageID')) - 10;
        console.log(':::::::::::::::::::::::::::::',prevMessageId);

        //loading last 10 messages
        const res = await axios.get(`http://localhost:4000/chat/getchat/${prevMessageId}`, {headers: {'Authorization': token}});
        const messages = res.data.response;
        
        // clearing the parent tag
        parentTag.textContent = '';

        // printing all the messages on the UI
        for(var msg of messages) {
        
            const {isCurrent} = msg;
            const {chat} = msg;
    
            if(isCurrent === 'true') {
                creatingMessagesHTML(chat)
            }
            else {
                creatingMessagesHTMLothers(chat)
            }
        }

        // storing the ID of the last message
        localStorage.setItem('MessageID',msg.id || 0);
    };

    // CHECKING IF WE NEED TO DISPLAY THE BUTTON
    if(btnDisplay === 'true') {
        btnDisplay.style = 'block';
    }

    // DISPLAY CHATS TO UI
    for(var msg of oldChats) {
        
        const {isCurrent} = msg;
        const {chat} = msg;

        if(isCurrent === 'true') {
            creatingMessagesHTML(chat)
        }
        else {
            creatingMessagesHTMLothers(chat)
        }
    }
});

// creating an interval to get data from DB every 2 seconds
setInterval( async() => {

    // selecting all the HTML elements
    const token = localStorage.getItem('token');
    const oldChats = JSON.parse(localStorage.getItem('oldChats')) || [];
    const lastMessageId = parseInt(localStorage.getItem('MessageID')) || 0;
    let addToChats;
    const btnDisplay = localStorage.getItem('btn-display');
    const loadPrevMsg = document.getElementById('loadPrevMessage');

    try{

        const res = await axios.get(`http://localhost:4000/chat/getchat/${lastMessageId}`, {headers: {'Authorization': token}});
        const chats = res.data.response;

        // LIMITING STORAGE CAPACITY IN localStorage
        if(oldChats.length > 10) {
    
            // showing the display button
            if(btnDisplay === 'false') {
    
                // creating tag to add to load previous messages
                loadPrevMsg.style = 'block';
                
                // have to set data in localStorage
                localStorage.setItem('btn-display','true');
            }
    
            // adding new chats to the array
            addToChats = [...chats];
            
            // UPDATING THE localStorage
            localStorage.setItem('oldChats', JSON.stringify(addToChats));
        }
        else{
            // adding old and new chats to the array
            addToChats = [...oldChats, ...chats];
            
            // UPDATING THE localStorage
            localStorage.setItem('oldChats', JSON.stringify(addToChats));
        }
    
        // showing data on the UI
        for(var msg of chats) {
            
            const {isCurrent} = msg;
            const {chat} = msg;
    
            if(isCurrent === 'true') {
                creatingMessagesHTML(chat)
            }
            else {
                creatingMessagesHTMLothers(chat)
            }
        }
    
        // storing the ID of the last message
        if(msg){
            localStorage.setItem('MessageID',msg.id || 0);
        }
    }
    catch(err) {
        console.log(err);
        alert('Something went wrong !!');
    }
    
}, 2000);

// loading previous messages
const loadPrevMsg = document.getElementById('loadPrevMessage');
loadPrevMsg.addEventListener('click', loadPrevMsgFunction);

// load the previous 10 messages
async function loadPrevMsgFunction() {
    
    const token = localStorage.getItem('token');
    const parentTag = document.querySelector('.chat'); 
    const prevMessageId = parseInt(localStorage.getItem('MessageID')) - 10;

    //loading last 10 messages
    const res = await axios.get(`http://localhost:4000/chat/getchat/${prevMessageId}`, {headers: {'Authorization': token}});
    const messages = res.data.response;
    
    // clearing the parent tag
    parentTag.textContent = '';

    // printing all the messages on the UI
    for(var msg of messages) {
    
        const {isCurrent} = msg;
        const {chat} = msg;

        if(isCurrent === 'true') {
            creatingMessagesHTML(chat)
        }
        else {
            creatingMessagesHTMLothers(chat)
        }
    }

    // storing the ID of the last message
    localStorage.setItem('MessageID',msg.id || 0);
};

// -----------------------------------------------------------------------------------------------------------------------
// CREATING ALL THE HELPER FUNCTIONS HERE

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