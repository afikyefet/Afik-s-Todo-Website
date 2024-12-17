import { userService } from "../../services/user.service.js"

export const SIGN_UP = "SIGN_UP"
export const LOG_IN = "LOG_IN"
export const LOG_OUT = "LOG_OUT"
export const UPDATE_USER = "UPDATE_USER"
export const CHANGE_BALANCE = "CHANGE_BALANCE"
export const SET_BALANCE = "SET_BALANCE"
export const ADD_ACTIVITY = "ADD_ACTIVITY"

const initialState = {
	user: null,
}

export function userReducer(state = initialState, cmd = {}) {
	switch (cmd.type) {
		case SIGN_UP:
			return {
				...state,
				user: cmd.user,
			}
		case LOG_IN:
			return {
				...state,
				user: cmd.user,
			}
		case LOG_OUT:
			return {
				...state,
				user: null,
			}
		case UPDATE_USER:
			return {
				...state,
				user: { ...state.user, ...cmd.user },
			}
		case CHANGE_BALANCE:
			return {
				...state,
				user: { ...state.user, balance: state.user.balance + cmd.diff },
			}
		case SET_BALANCE:
			return {
				...state,
				user: { ...state.user, balance: cmd.balance },
			}
		case ADD_ACTIVITY:
			return {
				...state,
				user: {
					...state.user,
					activities: [...state.user.activities, cmd.activity],
				},
			}
		default:
			return state
	}
}
