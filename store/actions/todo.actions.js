import { todoService } from "../../services/todo.service.js"
import {
	ADD_TODO,
	REMOVE_TODO,
	SET_FILTER,
	SET_TODO,
	UPDATE_TODO,
} from "../reducers/todo.reducer.js"
import { store } from "../store.js"

export function loadTodos() {
	return todoService
		.query(store.getState().todoModule.filterBy)
		.then((todos) => {
			store.dispatch({ type: SET_TODO, todos })
		})
		.catch((err) => {
			console.log("todo action -> Cannot load todos", err)
			throw err
		})
}

export function saveTodo(todo) {
	const type = todo._id ? UPDATE_TODO : ADD_TODO
	return store.dispatch({ type, todo })
}

export function setFilterBy(filterBy) {
	return store.dispatch({ type: SET_FILTER, filterBy })
}

export function removeTodo(todoId) {
	return todoService
		.remove(todoId)
		.then(() => {
			store.dispatch({ type: REMOVE_TODO, todoId })
			return todoId
		})
		.catch((err) => {
			console.log("todo action -> could not delete todo", err)
			throw err
		})
}
