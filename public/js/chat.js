const socket = io()

const messageForm = document.querySelector('#message-form')

const formInput = messageForm.querySelector('input')

const formButton = messageForm.querySelector('button')

const chatLocation = document.querySelector('#send-location')

const messages = document.querySelector('#messages')

const messageTemplate = document.querySelector('#message-template').innerHTML

const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const {username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoScroll = () => {
    //New Message Elemeent

    const newMessage = messages.lastElementChild

    //Height of new message
    const newMessageStyles = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin

    //Visible Height
    const visibleHieght = messages.offsetHeight

    //Height of messages container
    const containerHeight = messages.scrollHeight

    // How far have I scolled?
    const scrollOffset = messages.scrollTop + visibleHieght

    if(containerHeight - newMessageHeight <= scrollOffset) {
        messages.scrollTop = messages.scrollHeight
    }
}

socket.on('message', (firstMessage) => {
    console.log(firstMessage)
    const html = Mustache.render(messageTemplate, {
    adminName: firstMessage.adminName,
     firstMessage: firstMessage.text,
     createdAt: moment(firstMessage.createdAt).format('h:mm a')
    })

    messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})


socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    console.log(username)
    autoScroll()
})

socket.on('roomData', ({ room, users }) => {

    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })

    document.querySelector('#sidebar').innerHTML = html
    console.log(room)
    console.log(users)
})

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    formButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        formButton.removeAttribute('disabled')
        formInput.value = ''
        formInput.focus()

        if(error) {
            return console.log(error)
        }
        console.log('The message was delivered')
    })
})


chatLocation.addEventListener('click', (e) => {

    e.preventDefault()

    if(!navigator.geolocation) {
        return alert('Geolcation is not support by your browser.')
    }

    chatLocation.setAttribute('disabled', 'disabled')

   navigator.geolocation.getCurrentPosition((position) => {
        
        console.log(position)

        socket.emit('sendLocation', {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
        }, () => {
            chatLocation.removeAttribute('disabled')
            console.log('Location Shared')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if(error) {
        alert(error)
        location.herf = '/'
    }
}) 