import { todoService } from "../../services/todo.service.js"
import {
	ADD_TODO,
	GET_TODO,
	IS_LOADING,
	REMOVE_TODO,
	SET_FILTER,
	SET_PROGRESS,
	SET_TODO,
	UPDATE_TODO,
} from "../reducers/todo.reducer.js"
import { store } from "../store.js"
import { userAddActivity } from "./user.actions.js"
const user = store.getState().userModule.user

export function loadTodos(filterBy = {}) {
	return todoService
		.query(filterBy)
		.then((todos) => {
			store.dispatch({ type: SET_TODO, todos })
			setProgressPercentage()
			return todos
		})
		.catch((err) => {
			console.log("todo action -> Cannot load todos", err)
			throw err
		})
}

export function setIsLoading(isLoading) {
	store.dispatch({ type: IS_LOADING, isLoading })
}

export async function saveTodo(todo, isUpdate = true) {
	const type = todo._id && isUpdate ? UPDATE_TODO : ADD_TODO

	try {
		const savedTodo = await todoService.save(todo, isUpdate)
		store.dispatch({ type, todo: savedTodo })
		if (type === UPDATE_TODO &&  isUpdate) {
			userAddActivity("Updated a todo: "+ todo.txt)
		} else if (type === ADD_TODO) {
			userAddActivity("Added a todo: "+ todo.txt)
		}
		return savedTodo
	} catch (err) {
		console.log("todo action -> could not save todo")
		throw err
	}
}

export function setFilterBy(filterBy) {
	return store.dispatch({ type: SET_FILTER, filterBy })
}

export function setSelectedTodo(todoId) {
	loadTodos()
		.then((todos) => {
			const todo = todos.find((todo) => todo._id === todoId)
			if (!todo) {
				console.error("Todo not found:", todoId)
				return
			}

			const todoIdx = todos.findIndex((currTodo) => currTodo._id === todo._id)
			const nextTodo = todos[todoIdx + 1] ? todos[todoIdx + 1] : todos[0]
			const prevTodo = todos[todoIdx - 1]
				? todos[todoIdx - 1]
				: todos[todos.length - 1]
			todo.nextTodoId = nextTodo._id
			todo.prevTodoId = prevTodo._id
			return store.dispatch({ type: GET_TODO, todo })
		})
		.catch((err) => {
			console.error("todo action -> could not get todo", err)
			throw err
		})
}

export async function removeTodo(todoId) {
	const todo =  await todoService.get(todoId)
	
	return todoService
		.remove(todoId)
		.then(() => {
			if(user) userAddActivity("Deleted a todo: "+ todo.txt)
			store.dispatch({ type: REMOVE_TODO, todoId })
			return todoId
		})
		.catch((err) => {
			console.log("todo action -> could not delete todo", err)
			throw err
		})
}

export function setProgressPercentage(todos) {
	todoService.query({})
	.then((todos)=>{
		const percentage = todoService.getProgressPercentage(todos)
		return store.dispatch({ type: SET_PROGRESS, percentage })
	})
}
