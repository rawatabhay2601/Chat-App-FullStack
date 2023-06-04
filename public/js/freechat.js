const freechat = document.getElementById('freechat');

// adding event listener
freechat.addEventListener('click', async() => {
    
    // groupId for freechat is null
    const groupId = 0;
    const parentTag = document.querySelector('.chat');
    const token = localStorage.getItem('token');

    try {
        // sending request to the backend
        const response = await axios.get(`http://localhost:3000/chat/getLastChat?groupId=${groupId}`, {headers: {'Authorization': token}});
        
       // MESSAGES OF A PARTICULAR GROUP
       const messages = response.data.response;
       creatingUI(messages,creatingMessagesHTML,creatingMessagesHTMLothers);
       localStorage.setItem('groupId',groupId);
    }
    catch(err) {
        console.log(err);
        alert('Something went wrong !!');
    }
});

// FUNCTION CREATING UI USING CALLBACK FUNCTIONS AND MESSAGES
function creatingUI(messages) {
    const parentTag = document.querySelector('.chat');

    // clearing the parent tag
    parentTag.textContent = '';

    // printing all the messages on the UI
    // showing data on the UI
    for(var msg of messages) {
            
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