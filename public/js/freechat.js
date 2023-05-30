const freechat = document.getElementById('freechat');

// adding event listener
freechat.addEventListener('click', async() => {
    
    // groupId for freechat is null
    const groupId = 0;
    const token = localStorage.getItem('token');

    try {
        // sending request to the backend
        const response = await axios.get(`http://54.90.90.205:3000/chat/getLastChat?groupId=${groupId}`, {headers: {'Authorization': token}});
        
       // MESSAGES OF A PARTICULAR GROUP
       const messages = response.data.response;
       creatingUI(messages,creatingMessagesHTML,creatingMessagesHTMLothers);
       
       // STORING IN LOCALSTORAGE
       const {id} = messages[messages.length-1];
       localStorage.setItem('oldChats',JSON.stringify(messages));
       localStorage.setItem('groupId',JSON.stringify(groupId));
       localStorage.setItem('MessageID',JSON.stringify(id));
    }
    catch(err) {
        console.log(err);
        alert('Something went wrong !!');
    }
});

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