// connecting a WebSocket
const socket = io('http://localhost:3000');
const loadPrevMsg = document.getElementById('loadPrevMessage');

// taking the name of the user and posting on UI
const joinedName = localStorage.getItem('profileName');
appendJoinMessage('You joined');
socket.emit('new-user', joinedName);

// when a user get connected
socket.on('user-connected', name => {
    appendJoinMessage(`${name} connected`)
});

// when other user sends a message
socket.on('chat-message', data => {
    creatingMessagesHTMLothers(`${data.message}`)
});

// send the message to backend
const btn = document.getElementById('button');
btn.addEventListener('click', addMessage);

// adding message to the UI
function addMessage() {
    const chatArea = document.querySelector('.textarea');
    const chat = chatArea.value;
    creatingMessagesHTML(chat);
    socket.emit('send-chat-message', chat);
    chatArea.value = '';
    addMessageToDB(chat);
};

// RELOAD EVENT LISTENER
window.addEventListener('DOMContentLoaded', async() => {
    
    const token = localStorage.getItem('token');
    const parentTag = document.querySelector('.chat');
    const groupId = JSON.parse(localStorage.getItem('groupId'));

    const resGroup = axios.get(`http://localhost:3000/group/getGroups?groupId=${groupId}`, {headers: {'Authorization': token}});
    const resChats = axios.get(`http://localhost:3000/chat/getLastChat?groupId=${groupId}`, {headers: {'Authorization': token}});

    const response = await Promise.all([resGroup, resChats]);
    const groupNames = response[0].data.response;
    const chats = response[1].data.response;

    // CLEARING THE UI
    parentTag.textContent = '';

    // showing data on the UI
    for(var msg of chats) {
        
        const {isCurrent} = msg;
        const {chat} = msg;
        const {isImage} = msg;
        if(isImage === true) {
            
            // creating UI for all the images
            if(isCurrent === 'true') {
                createImgMsgSelf(chat);
            }
            else {
                createImgMsgOther(chat);
            }
        }
        else {
            // creating UI for all the messages
            if(isCurrent === 'true') {
                creatingMessagesHTML(chat);
            }
            else {
                creatingMessagesHTMLothers(chat);
            }
        }
    }
    
    // creating group Icons if any created
    creatingGroupOptions(groupNames);

    // reseting the previous message
    localStorage.setItem('previousStorage','10');
});


// loading previous messages
loadPrevMsg.addEventListener('click', loadPrevMsgFunction);
// load the previous 10 messages
async function loadPrevMsgFunction() {
    
    // DEFINING ALL THE VARIABLES THAT ARE REQUIRED
    const token = localStorage.getItem('token');
    const parentTag = document.querySelector('.chat');
    const groupId = parseInt(localStorage.getItem('groupId')) || 0;

    try{
        //loading last 10 messages
        const res = await axios.get(`http://localhost:3000/chat/getchat?groupId=${groupId}`, {headers: {'Authorization': token}});
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
function creatingMessagesHTML(text) {
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
function creatingMessagesHTMLothers(text) {
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
async function creatingGroupOptions(groupData) {

    // creating tags for the group icon
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
                const groupChats = await axios.get(`http://localhost:3000/chat/getLastChat?groupId=${groupId}`, {headers: {'Authorization': token}});
                
                // MESSAGES OF A PARTICULAR GROUP
                const messages = groupChats.data.response;

                // storing the oldChats in the localStorage
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

// FUNCTION TO APPEND JOINING MESSAGES
function appendJoinMessage(name) {

    const parentTag = document.getElementById('userName');
    
    // 'div' tag is created
    const div = document.createElement('div');
    div.className = 'col';
    div.style = '';
    div.textContent = name;
     
    parentTag.appendChild(div);
};

// SENDING MESSAGEs TO DB
async function addMessageToDB(chat) {

    const token = localStorage.getItem('token');
    const groupId = JSON.parse(localStorage.getItem('groupId')) || 0;

    try{
        // sending request to save the data
        await axios.post('http://localhost:3000/chat/addchat',{chat,groupId}, {headers : {'Authorization' : token}});
    }
    catch(err){
        console.log(err);
        alert('Something went wrong !!');
    }
};

function createImgMsgSelf(imgLink) {

    // getting the parent Element
    const parentTag = document.querySelector('.chat');
    const p = document.createElement('p');
    const divMsg = document.createElement('div');
    const divCard = document.createElement('div');
    const li = document.createElement('li');

    // creating image tag
    const img = document.createElement('img');
    img.src = imgLink;
    img.alt = 'Image Loading Error';

    // setting classes for all tags
    divCard.className='card';
    divMsg.className='msg';
    li.className='self';

    // appending child tags to parent tags
    divCard.appendChild(img);
    divMsg.appendChild(divCard);
    li.appendChild(divMsg);

    parentTag.appendChild(li);
}

function createImgMsgOther(imgLink) {

    // getting the parent Element
    const parentTag = document.querySelector('.chat');
    const p = document.createElement('p');
    const divMsg = document.createElement('div');
    const divCard = document.createElement('div');
    const li = document.createElement('li');

    // creating image tag
    const img = document.createElement('img');
    img.src = imgLink;
    img.alt = 'Image Loading Error';

    // setting classes for all tags
    divCard.className='card';
    divMsg.className='msg';
    li.className='other';

    // appending child tags to parent tags
    divCard.appendChild(img);
    divMsg.appendChild(divCard);
    li.appendChild(divMsg);

    parentTag.appendChild(li);
}