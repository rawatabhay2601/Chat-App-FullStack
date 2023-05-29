// CREATING GROUP
const createGroup = document.getElementById('createGroupForm');
createGroup.addEventListener('submit', async(e) => {
    
    e.preventDefault();
    
    // name of the group
    const token = localStorage.getItem('token');
    const name = document.getElementById('Groupname').value;

    // sending request to create a new group
    await axios.post('http://localhost:4000/group/addGroup', {name}, {headers: {'Authorization': token}});
    alert('Group created !!');
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
        await axios.post('http://localhost:4000/group/addUserToGroup',obj, {headers: {'Authorization':token}});
        alert('User succesfully added !!');
    }
    catch(err) {
        
        const status = err.statusCode;
        
        if(status === 502) {
            alert("User does not exists !!");
        }
        else if(status === 503) {
            alert('User is already in the group !!');
        }
        else if(status === 504) {
            alert('User does have permission as not part of the group !!');
        }
        else {
            alert('Something went wrong !!');
        }
    }
});