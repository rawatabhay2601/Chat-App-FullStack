socket.on('chat-image', data => {
    createImgMsgOther(data.link);
});

const form = document.getElementById('imageForm');
form.addEventListener('submit', async(event) => {
    event.preventDefault();
  
    // file input of the image
    const fileInput = document.getElementById('imageInput');
    const selectedFile = fileInput.files[0];
    const token = localStorage.getItem('token');

    if(!selectedFile.type.match("image.*")) {
        alert('Please select image only');
    }
    else {
        // form data used to convert image
        const formData = new FormData();
        formData.append('image', selectedFile);

        // response collecting
        const res = await axios.post('http://35.174.173.248:3000/chat/uploadImage', formData,
        { headers : {"Authorization":token, "Content-Type": "multipart/form-data"} });
        
        // storing the link of the image in a variable
        const chat = res.data.data;
        const groupId = localStorage.getItem('groupId');

        await axios.post('http://35.174.173.248:3000/chat/addImage',{chat,groupId}, { headers : {"Authorization":token}});
        createImgMsgSelf(chat);
        socket.emit('send-chat-image', chat);
    }
});

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