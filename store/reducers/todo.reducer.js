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
	selectedTodo: todoService.getEmptyTodo(),
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
		case GET_TODO:
			return {
				...state,
				selectedTodo: cmd.todo,
			}
			case ADD_TODO:
				return {
					...state,
					todos: state.todos.map((todoPage, idx) =>
						idx === state.todos.length - 1 && todoPage.length < 10
							? [...todoPage, cmd.todo]
							: todoPage
					).concat(state.todos[state.todos.length - 1].length === 10 ? [[cmd.todo]] : []),
				};
				case REMOVE_TODO:
					const updatedTodos = state.todos.map((todoPage, idx) => {
					  const updatedPage = todoPage.filter(todo => todo._id !== cmd.todoId)
				  
					  if (idx < state.todos.length - 1 && state.todos[idx + 1].length > 0) {
						const [movedTodo] = state.todos[idx + 1].splice(0, 1)
						if (movedTodo) {
						  updatedPage.push(movedTodo)
						}
					  }
					  return updatedPage
					})
				  
					if (updatedTodos[updatedTodos.length - 1].length === 0) {
					  updatedTodos.pop();
					}
				  
					return {
					  ...state,
					  todos: updatedTodos,
					};
		case UPDATE_TODO:
				return {
					...state,
					todos: state.todos.map(todoPage =>
						todoPage.map(todo =>
							todo._id === cmd.todo._id ? cmd.todo : todo
					)
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
				isLoading: cmd.isLoading,
			}
		default:
			return state
	}
}
