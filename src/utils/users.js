const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room}) =>{
    username = trimAndToLowerCase(username)
    room = trimAndToLowerCase(room)
    const error = checkForEmptity(username) || checkForEmptity(room) || checkForSameUserInSameRoom(username, room)
    if(error){
        return error
    }

    const user = { id, username, room}
    users.push(user)
    return { user }
}

const removeUser = (id) =>{
    const index = users.findIndex((user) => user.id === id)
    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) =>{
    return users.find((user) => user.id === id)
}


const getUsersInRoom = (room) => {
    trimAndToLowerCase(room)
    return users.filter((user) => user.room === room )
}






const trimAndToLowerCase = (data)  => {
    return data.trim().toLowerCase()
}

const checkForEmptity = (data) =>{
    if(!data){
        return {
            error:'Username and room are required!'
        }
    }
}

const checkForSameUserInSameRoom = (username, room) => {
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })
    if(existingUser){
        return {
            error: 'Username is in use!'
        }
    }
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}