import { userService } from "../../services/user.service.js"

export const SIGN_IN = "SIGN_IN"
export const LOG_IN = "LOG_IN"
export const LOG_OUT = "LOG_OUT"
export const UPDATE_USER = "UPDATE_USER"
export const UPDATE_BALANCE = "UPDATE_BALANCE"
export const ADD_ACTIVITY = "ADD_ACTIVITY"

const initialState = {
	user: {},
}

export function userReducer(state = initialState, cmd = {}) {
	switch (cmd.type) {
		default:
			return state
	}
}
