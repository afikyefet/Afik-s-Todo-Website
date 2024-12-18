import { userService } from "../../services/user.service.js"

import {
	SIGN_UP,
	LOG_IN,
	LOG_OUT,
	UPDATE_USER,
	CHANGE_BALANCE,
	SET_BALANCE,
	ADD_ACTIVITY,
} from "../reducers/user.reducer.js"
import { store } from "../store.js"

export function userSignup(credentials) {
	return userService
		.signup(credentials)
		.then((user) => {
			store.dispatch({ type: SIGN_UP, user })
			return user
		})
		.catch((err) => {
			console.error("user action -> could not sign up", err)
			throw err
		})
}

export async function setLoggedInUser() {
	const loggedinUser = userService.getLoggedinUser()
	if (loggedinUser) {
		try {
			const user = await userService.getById(loggedinUser._id)

			store.dispatch({ type: LOG_IN, user })
		} catch (error) {
			console.error("Error fetching user by ID:", error)
		}
	}
}

export function userLogin(credentials) {
	return userService
		.login(credentials)
		.then((user) => {
			store.dispatch({ type: LOG_IN, user })
		})
		.catch((err) => {
			console.error("user action -> could not log in", err)
			throw err
		})
}

export function userLogout() {
	return userService
		.logout()
		.then((res) => {
			store.dispatch({ type: LOG_OUT })
		})
		.catch((err) => {
			console.error("user action -> could not logout", err)
			throw err
		})
}

// export function userUpdate(credentials) {}

export function userChangeBalance(num) {
	const user = store.getState().userModule.user
	if (user) {
		store.dispatch({ type: CHANGE_BALANCE, diff: num })
		const updatedUser = store.getState().userModule.user
		userService.updateUser(updatedUser)

		// userService.updateUser(user)
	} else {
		console.log("user action -> could not change user balance by ", num)
	}
}
