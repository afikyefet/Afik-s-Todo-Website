import { todoService } from "../../services/todo.service.js"
import {
	ADD_TODO,
	GET_TODO,
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

export async function saveTodo(todo) {
	const type = todo._id ? UPDATE_TODO : ADD_TODO
	return todoService
		.save(todo)
		.then((todo) => {
			store.dispatch({ type, todo })
			return todo
		})
		.catch((err) => {
			console.log("todo action -> could not save todo")
			throw err
		})
}

export function setFilterBy(filterBy) {
	return store.dispatch({ type: SET_FILTER, filterBy })
}

export function setSelectedTodo(todoId) {
	const todos = store.getState().todoModule.todos
	const todo = todos.find((todo) => todo._id === todoId)

	const todoIdx = todos.findIndex((currTodo) => currTodo._id === todo._id)
	const nextTodo = todos[todoIdx + 1] ? todos[todoIdx + 1] : todos[0]
	const prevTodo = todos[todoIdx - 1]
		? todos[todoIdx - 1]
		: todos[todos.length - 1]
	todo.nextTodoId = nextTodo._id
	todo.prevTodoId = prevTodo._id

	return store.dispatch({ type: GET_TODO, todo })
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
