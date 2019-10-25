
const users = []

// addUser, removeUser, getUser, getUsersInRoom 


const addUser = ({ id, username, room}) => {

    //Clean the data

    username = username.trim().toLowerCase()

    
    //Vaildate the data 

    if (!username || ! room) {
        return {
            error: 'Username and Room are required'
        }
    }
    //check for existing user

    const exisitngUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //Vaildate username 
    if(exisitngUser) {
        return {
            error: 'Username is in use!'
        }
    }
    //Store user
    const user = { id, username, room }
    users.push(user)

    return {user}
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if(index !== -1 ) {
        return users.splice(index, 1)[0]
    }
}

const getUsers = ( id ) => {
    return users.find((user) => user.id === id )
}


const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room )
}


module.exports = {
    addUser,
    removeUser,
    getUsers,
    getUsersInRoom
}