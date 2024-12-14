import { todoService } from "../../services/todo.service.js"
import { SET_TODO } from "../reducers/todo.reducer"
import { store } from "../store.js"

export function loadTodos() {
	return todoService
		.query()
		.then((todos) => {
			store.dispatch({ type: SET_TODO, todos })
		})
		.catch((err) => {
			console.log("todo action -> Cannot load todos", err)
			throw err
		})
}
