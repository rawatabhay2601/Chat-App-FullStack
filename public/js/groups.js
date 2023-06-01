// CREATING GROUP
const createGroup = document.getElementById('createGroupForm');
createGroup.addEventListener('submit', async(e) => {
    
    e.preventDefault();
    
    // name of the group
    const token = localStorage.getItem('token');
    const name = document.getElementById('Groupname').value;
    const groupList = JSON.parse(localStorage.getItem('groupList')) || [];

    try {
        // sending request to create a new group
        const res = await axios.post('http://localhost:3000/group/addGroup', {name}, {headers: {'Authorization': token}});
        createGroupIcon(res.data.data);
        alert('Group created !!');
    }
    catch(err) {
        console.log(err);
        alert('Something went wrong !!');
    }

});

// ADDING USERS TO A GROUP
const addUserToGroup = document.getElementById('addUserGroupForm');
addUserToGroup.addEventListener('submit', async(e) => {
    
    e.preventDefault();

    // getting all the variables
    const token = localStorage.getItem('token');
    const userEmail = document.getElementById('email').value;
    const groupId = JSON.parse(localStorage.getItem('groupId')) || 0;

    if(groupId === 0) return alert('Cannot add user in the free chat !!');

    const obj = {
        userEmail,
        groupId
    };

    try {
        await axios.post('http://localhost:3000/group/addUserToGroup', obj, {headers: {'Authorization':token}});
        alert('User succesfully added !!');
    }
    catch(err) {
        if(err.response) {

            // saving the status code
            const status = err.response.status;
            
            // handling all the errors
            if(status === 502) {
                alert("User does not exists !!");
            }
            else if(status === 503) {
                alert('User is already in the group !!');
            }
            else if(status === 504) {
                alert('Only admin can add a user !!');
            }
            else {
                alert('Something went wrong !!');
            }
        }
        else{
            alert('Something went wrong !!');
        }
    }
});

// ADDING USERS TO A GROUP
const removeUserFromGroup = document.getElementById('removeUserGroupForm');
removeUserFromGroup.addEventListener('submit', async(e) => {
    
    e.preventDefault();

    // getting all the variables
    const token = localStorage.getItem('token');
    const userEmail = document.getElementById('email').value;
    const groupId = JSON.parse(localStorage.getItem('groupId')) || 0;

    if(groupId === 0) return alert('Cannot delete user from the free chat !!');

    const obj = {
        userEmail,
        groupId
    };

    try {
        await axios.post('http://localhost:3000/group/removeUserFromGroup',obj, {headers: {'Authorization':token}});
        alert('User succesfully removed !!');
    }
    catch(err) {
        if(err.response) {

            // saving the status code
            const status = err.response.status;
            
            // handling all the errors
            if(status === 502) {
                alert("User does not exists !!");
            }
            else if(status === 503) {
                alert('User is not in the group !!');
            }
            else if(status === 504) {
                alert('Only admin can delete a user !!');
            }
            else {
                alert('Something went wrong !!');
            }
        }
    }
});

// CREATING ONE GROUP
function createGroupIcon(groupObj) {

    const li = document.createElement('li');
    const parentTag = document.querySelector('.dropdown-menu');
    const a = document.createElement('a');
    const {name} = groupObj;
    const {id} = groupObj;
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
            console.log(err);
            alert('Something Went Wrong !!');
        }
    };
    
    // appending the tag to the parent tag
    li.appendChild(a);
    parentTag.appendChild(li);
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