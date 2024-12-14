export const ADD_TODO = "ADD_TODO"
export const REMOVE_TODO = "REMOVE_TODO"
export const UPDATE_TODO = "UPDATE_TODO"
export const SET_TODO = "SET_TODO"

const initialState = {
	todos: [],
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
				todos: state.todos.filter((todo) => todo._Id !== cmd.todoId),
			}
		case UPDATE_TODO:
			return {
				...state,
				todos: state.todos.map((todo) =>
					todo._Id === cmd.todo._Id ? cmd.todo : todo
				),
			}
		default:
			return state
	}
}
