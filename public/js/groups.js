// CREATING GROUP
const createGroup = document.getElementById('createGroupForm');
createGroup.addEventListener('submit', async(e) => {
    
    e.preventDefault();
    
    // name of the group
    const token = localStorage.getItem('token');
    const name = document.getElementById('Groupname').value;

    // sending request to create a new group
    await axios.post('http://54.90.90.205:3000/group/addGroup', {name}, {headers: {'Authorization': token}});
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
        await axios.post('http://54.90.90.205:3000/group/addUserToGroup',obj, {headers: {'Authorization':token}});
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

    if(groupId === 0) return alert('Cannot add user in the free chat !!');

    const obj = {
        userEmail,
        groupId
    };

    try {
        await axios.post('http://54.90.90.205:3000/group/removeUserFromGroup',obj, {headers: {'Authorization':token}});
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