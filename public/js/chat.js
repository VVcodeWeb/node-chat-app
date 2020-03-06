const socket = io()
//Elements
const $messageForm = document.querySelector('#msg-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton  = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const { room, username} = Qs.parse(location.search, {ignoreQueryPrefix: true})




//Functions

//Taken without understanding
const autoscroll = () =>  {
    //New msg elemnt
    const $newMessage = $messages.lastElementChild

    //Heihgt of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //Visible height 
    const visibleHeight = $messages.offsetHeight

    //Height of messages containter
    const containterHeight = $messages.scrollHeight

    //How far have i scroll
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containterHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }

}

socket.on('systemMessage', (message)=>{
    renderMessageToTemplate(message)
    autoscroll()

})

socket.on('spreadToUsersReceivedMessage', (receivedMessage) => {
    renderMessageToTemplate(receivedMessage)
    autoscroll()

})

const renderMessageToTemplate = (message) =>{
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('HH:mm:ss')
    })
    $messages.insertAdjacentHTML("beforeend", html)
}


socket.on('spreadToUsersReceivedLocation', (receivedLocationUrl) => {
    renderLocationToTemplate(receivedLocationUrl)
    autoscroll()

})

const renderLocationToTemplate = (locationUrl) => {
    const html = Mustache.render(locationTemplate, {
        username: locationUrl.username,
        url: locationUrl.url,
        createdAt: moment(location.createdAt).format('HH:mm:ss')
    })
    $messages.insertAdjacentHTML("beforeend", html)

}

socket.on('roomData', ({room, users}) => {
    renderUsersToSidebar(room, users)
})
const renderUsersToSidebar = (room, users) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
}


$messageForm.addEventListener('submit', (e) =>{
    e.preventDefault()
    disableButton($messageFormButton)
    const messageToSend = e.target.elements.message.value

    socket.emit('sendMessage', messageToSend, (error) => {
        clearAndFocusInput($messageFormInput)
        enableButton($messageFormButton)
        
        if(error){
            return console.log(error)
        }
        console.log("Message delivered!")
    })
})

$sendLocationButton.addEventListener('click', () =>{
    checkBrowserSupportGeolocation(navigator)
    disableButton($sendLocationButton)

    navigator.geolocation.getCurrentPosition((position) =>{
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        socket.emit('sendLocation', {latitude, longitude}, (error) =>{
            enableButton($sendLocationButton)
            if(error){
                return console.log(error)
            }
            console.log("Location shared")
        })
    })
})


const disableButton  = (button) =>{
    button.setAttribute('disabled', 'disabled')
}

const enableButton  = (button) => {
    button.removeAttribute('disabled')
}

const clearAndFocusInput = (input) =>{
    input.value = ''
    input.focus()
}

const checkBrowserSupportGeolocation = (navigator) =>{
    if(!navigator.geolocation){
        return alert ('Your browser doesnt support geolocation')
    }
}

 
socket.emit('join', {username, room}, (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})