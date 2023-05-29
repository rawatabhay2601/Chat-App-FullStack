const btn = document.getElementById('button');
btn.addEventListener('click', sendMessage);

// SENDING MESSAGEs TO DB
async function sendMessage() {

    const chat = document.querySelector('.textarea').value;
    const token = localStorage.getItem('token');
    const groupId = JSON.parse(localStorage.getItem('groupId')) || 0;

    try{
        const res = await axios.post('http://localhost:4000/chat/addchat',{chat,groupId}, {headers : {'Authorization' : token}});
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
    
    const parentTag = document.querySelector('.chat');
    const oldChats = JSON.parse(localStorage.getItem('oldChats')) || [];

    // CLEARING THE UI
    parentTag.textContent = '';

    // DISPLAY CHATS TO UI
    // showing data on the UI
    for(var msg of oldChats) {
        
        const {isCurrent} = msg;
        const {chat} = msg;

        if(isCurrent === 'true') {
            creatingMessagesHTML(chat);
        }
        else {
            creatingMessagesHTMLothers(chat);
        }
    }
    
    // storing the ID of the last message
    if(msg) {
        localStorage.setItem('MessageID',msg.id);
    }
    
    // creating group Icons if any created
    creatingGroupOptions();
});

// creating an interval to get data from DB every 2 seconds
setInterval( async() => {

    // selecting all the HTML elements
    const token = localStorage.getItem('token');
    const oldChats = JSON.parse(localStorage.getItem('oldChats')) || [];
    const lastMessageId = parseInt(localStorage.getItem('MessageID')) || 0;
    let groupList = JSON.parse(localStorage.getItem('groupList')) || [];
    let addToChats;
    const groupId = JSON.parse(localStorage.getItem('groupId')) || 0;

    try {

        // creating multiple requests
        const requestChats = axios.get(`http://localhost:4000/chat/getchat?lastMsgId=${lastMessageId}&groupId=${groupId}`, {headers: {'Authorization': token}});
        const requestGroups = axios.get(`http://localhost:4000/group/getGroups?groupId=${groupId}`, {headers: {'Authorization': token}});
        
        // using Promise.all() to send multiple requests to the server
        const response = await Promise.all([requestChats, requestGroups]);

        // chats and group names
        const chats = response[0].data.response;
        const names = response[1].data.response;

        // LIMITING STORAGE CAPACITY IN localStorage
        if(oldChats.length > 10) {
    
            // adding new chats to the array
            addToChats = [...chats];
            
            // UPDATING THE localStorage
            localStorage.setItem('oldChats', JSON.stringify(addToChats));
        }
        else {
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
                creatingMessagesHTML(chat);
            }
            else {
                creatingMessagesHTMLothers(chat);
            }
        }
        
        // storing the ID of the last message
        if(msg) {
            localStorage.setItem('MessageID',msg.id);
        }

        // creating group options
        if( !(names.length === groupList.length) ) {
            
            // new groups added to the groupList
            groupList = [...names];

            // localStorage is now updated
            localStorage.setItem('groupList', JSON.stringify(groupList));
        }
    }
    catch(err) {
        alert('Something went wrong !!');
    }
    
}, 2000);

// loading previous messages
const loadPrevMsg = document.getElementById('loadPrevMessage');
loadPrevMsg.addEventListener('click', loadPrevMsgFunction);
// load the previous 10 messages
async function loadPrevMsgFunction() {
    
    // DEFINING ALL THE VARIABLES THAT ARE REQUIRED
    const prevMessages = 10;
    const token = localStorage.getItem('token');
    const parentTag = document.querySelector('.chat');
    const prevMessageId = parseInt(localStorage.getItem('MessageID')) - prevMessages;
    const groupId = parseInt(localStorage.getItem('groupId')) || 0;

    try{
        //loading last 10 messages
        const res = await axios.get(`http://localhost:4000/chat/getchat?lastMsgId=${prevMessageId}&groupId=${groupId}`, {headers: {'Authorization': token}});
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
    }
    catch(err) {
        alert('Something went wrong !!');
    }
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

// FUNCTION CREATING UI USING CALLBACK FUNCTIONS AND MESSAGES
function creatingUI(messages,selfCb,otherCb) {
    const parentTag = document.querySelector('.chat');

    // clearing the parent tag
    parentTag.textContent = '';

    // printing all the messages on the UI
    for(var msg of messages) {
    
        const {isCurrent} = msg;
        const {chat} = msg;

        if(isCurrent === 'true') {
            selfCb(chat);
        }
        else {
            otherCb(chat);
        }
    }
};

// FUNCTION TO CREATE A GROUP BUTTON
async function creatingGroupOptions() {

    // creating tags for the group icon
    const groupData = JSON.parse(localStorage.getItem('groupList')) || [];
    const parentTag = document.querySelector('.dropdown-menu');
    const token = localStorage.getItem('token');

    // EXECUTING FOR LOOP SO THAT EACH GROUP CAN BE PRESENTED TO THE UI
    for(let group of groupData) {

        const li = document.createElement('li');
        const a = document.createElement('a');
        const {name} = group;
        const {id} = group;
        const groupId = parseInt(id);

        // values inserted in 'a' tag
        a.className = 'dropdown-item';
        a.href = '#';
        a.textContent = `${name}`;
        
        // CREATING FUNCTION FOR SELECTING A GROUP
        a.onclick = async(e) => {
            
            try{
                // stroing the group id in the locaStorage for the setTimeout
                localStorage.setItem('groupId',id);
                const groupChats = await axios.get(`http://localhost:4000/chat/getLastChat?groupId=${groupId}`, {headers: {'Authorization': token}});
                
                // MESSAGES OF A PARTICULAR GROUP
                const messages = groupChats.data.response;

                // storing the groupId in the localStorage
                localStorage.setItem('groupID', JSON.stringify(groupId));
                localStorage.setItem('oldChats', JSON.stringify(messages));

                // if messages exists or not
                if(messages.length) {
                    
                    // creating the UI
                    creatingUI(messages,creatingMessagesHTML,creatingMessagesHTMLothers);
                    
                    // LAST MESSAGE ID
                    const {id} = messages[messages.length-1];
                    // STORING IN LOCALSTORAGE 
                    localStorage.setItem('MessageID', JSON.stringify(id));
                }
                else {
                    // STORING IN LOCALSTORAGE
                    const parentTag = document.querySelector('.chat');
                    parentTag.textContent = '';
                    localStorage.setItem('MessageID', '0');
                }
                return;
            }
            catch(err) {
                alert('Something Went Wrong !!');
            }
        };
        
        // appending the tag to the parent tag
        li.appendChild(a);
        parentTag.appendChild(li);
    }
};