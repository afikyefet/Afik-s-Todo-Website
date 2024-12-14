import { todoService } from "../../services/todo.service.js"

export const ADD_TODO = "ADD_TODO"
export const REMOVE_TODO = "REMOVE_TODO"
export const UPDATE_TODO = "UPDATE_TODO"
export const SET_TODO = "SET_TODO"
export const GET_TODO = "GET_TODO"

export const SET_FILTER = "SET_FILTER"

export const IS_LOADING = "IS_LOADING"

const initialState = {
	todos: [],
	filterBy: { txt: "", importance: 0 },
	isLoading: false,
}

export function todoReducer(state = initialState, cmd = {}) {
	switch (cmd.type) {
		case SET_TODO:
			return {
				...state,
				todos: cmd.todos,
			}
		case ADD_TODO:
			return {
				...state,
				todos: [...state.todos, cmd.todo],
			}
		case REMOVE_TODO:
			return {
				...state,
				todos: state.todos.filter((todo) => todo._id !== cmd.todoId),
			}
		case UPDATE_TODO:
			return {
				...state,
				todos: state.todos.map((todo) =>
					todo._id === cmd.todo._id ? cmd.todo : todo
				),
			}
		case SET_FILTER:
			return {
				...state,
				filterBy: { ...state.filterBy, ...cmd.filterBy },
			}
		case IS_LOADING:
			return {
				...state,
				isLoading: !state.isLoading,
			}
		default:
			return state
	}
}
