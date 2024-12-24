import { userService } from "../../services/user.service.js"
import {
	SIGN_UP,
	LOG_IN,
	LOG_OUT,
	UPDATE_USER,
	SET_BALANCE,
	USER_LOADING,
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

export function userLogin(credentials) {
	setUserLoading(true)
	return userService
		.login(credentials)
		.then((user) => {
			store.dispatch({ type: LOG_IN, user })
		})
		.catch((err) => {
			console.error("user action -> could not log in", err)
			throw err
		})
		.finally(setUserLoading(false))
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

export function userUpdate(user) {
	setUserLoading(true)
	return userService
		.updateUser(user)
		.then((user) => {
			store.dispatch({ type: UPDATE_USER, user })
		})
		.catch((err) => {
			console.error("user action -> could not update user ", err)
			throw err
		})
		.finally(setUserLoading(false))
}

export async function userAddActivity(activityTxt) {
	const user = store.getState().userModule.user
	const activity = { txt: activityTxt, at: Date.now() }
	const userToUpdate = { ...user, activities: [...user.activities, activity] }

	return await userUpdate(userToUpdate)
}

export function setUserLoading(isLoading){
	return store.dispatch({type: USER_LOADING, isLoading})
}
