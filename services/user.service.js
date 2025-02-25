import { storageService } from "./async-storage.service.js"

export const userService = {
	getLoggedinUser,
	login,
	logout,
	signup,
	getById,
	query,
	updateUser,
	getByIdSafe,
	getEmptyCredentials,
	getTimeStamp,
}
const STORAGE_KEY_LOGGEDIN = "user"
const STORAGE_KEY = "userDB"

function query() {
	return storageService.query(STORAGE_KEY)
}

function getById(userId) {
	return storageService.get(STORAGE_KEY, userId)
}
function getByIdSafe(userId) {
	return storageService.get(STORAGE_KEY, userId)
	.then(user => {
		delete user.password
		return user
	})
}

function login({ username, password }) {
	return storageService.query(STORAGE_KEY).then((users) => {
		const user = users.find((user) => user.username === username)
		if (user.password === password) {
			return _setLoggedinUser(user)
		} else return Promise.reject("Incorrect password")
	})
}

function updateUser(user) {
	sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(user))
	return storageService.put(STORAGE_KEY, user)
}

async function signup({ username, password, fullname }) {
	const userList = await storageService.query(STORAGE_KEY)
	const exist = userList.some(user => user.username === username)
	
	if(exist){
		return Promise.reject("Username already exists")
	}else{
	const user = { username, password, fullname }
	user.createdAt = user.updatedAt = Date.now()
	user.activities = []
	user.prefs = {color: '#000000', bgColor: '#ffffff'}
	user.balance = 10000
	try {
        const savedUser = await storageService.post(STORAGE_KEY, user)
        _setLoggedinUser(user)
        return savedUser
    } catch (error) {
        console.error("Failed to sign up user", error)
        return Promise.reject("Failed to sign up user")
    }
	}
}

function logout() {
	sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN)
	return Promise.resolve()
}

function getLoggedinUser() {
	return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN))
}

function _setLoggedinUser(user) {
	const userToSave = {
		_id: user._id,
		fullname: user.fullname,
		balance: user.balance,
		activities: user.activities,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
		prefs: user.prefs
	}
	sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(userToSave))
	return userToSave
}

function getEmptyCredentials() {
	return {
		fullname: "",
		username: "muki",
		password: "muki1",
	}
}

function getTimeStamp(time){
	const now = Date.now()
	const timePassed = now - time
	if(timePassed /1000 < 10){
		return "A few seconds ago"
	} else if (timePassed / 1000 < 60){
		return "Less then a minute ago"
	} else if ( timePassed / 1000 / 60 < 50 ){
		const minutes = Math.round(timePassed /1000 /60)
		return minutes + " minutes ago"
	}else if(timePassed / 1000 / 60 / 60 < 24){
		const hours = Math.round(timePassed /1000 /60 / 60)
		return hours + " hours ago"
	}else if(timePassed / 1000 / 60 / 60 / 24 < 356){
		const days = Math.round(timePassed /1000 /60 / 60 / 24)
		return days + " days ago"
	}else { 
		const years = Math.round(timePassed /1000 /60 / 60 / 24 / 356)
		return years + " years ago"
	}
}

// signup({username: 'muki', password: 'muki1', fullname: 'Muki Ja'})
// login({username: 'muki', password: 'muki1'})

// Data Model:
// const user = {
//     _id: "KAtTl",
//     username: "muki",
//     password: "muki1",
//     fullname: "Muki Ja",
//     createdAt: 1711490430252,
//     updatedAt: 1711490430999,
//      balance: 10000,
//  activities: [{txt: 'Added a Todo', at: 1523873242735}]
// }
