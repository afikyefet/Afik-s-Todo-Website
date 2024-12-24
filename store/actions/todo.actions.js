import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service.js"
import { todoService } from "../../services/todo.service.js"
import {
	ADD_TODO,
	GET_TODO,
	IS_LOADING,
	REMOVE_TODO,
	SET_FILTER,
	SET_TODO,
	UPDATE_TODO,
} from "../reducers/todo.reducer.js"
import { store } from "../store.js"
import { userAddActivity, userUpdate } from "./user.actions.js"

export function loadTodos(filterBy = {}) {
	return todoService
		.query(filterBy)
		.then((todos) => {
			store.dispatch({ type: SET_TODO, todos })
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

export function saveTodo(todo, isUpdate = true) {
	const type = todo._id && isUpdate ? UPDATE_TODO : ADD_TODO
	const user = store.getState().userModule.user
	return todoService.save(todo, isUpdate)
	.then(savedTodo => {
		store.dispatch({ type, todo: todo })
        if (savedTodo && user) {
			if (savedTodo.isDone && user){ 
				userUpdate({ ...user, balance: user.balance + 10 })					
		}
            const actionText = type === UPDATE_TODO
                ? `Updated a todo: ${savedTodo.txt}`
                : `Added a todo: ${savedTodo.txt}`;
            userAddActivity(actionText)
        }
		return savedTodo
	})
	.catch(err => {
		console.log("todo action -> could not save todo")
		throw err
	})
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
	// const todo =  await todoService.get(todoId)
	
	return todoService
	.remove(todoId)
	.then(() => {
			store.dispatch({ type: REMOVE_TODO, todoId })
			if(user) userAddActivity("Deleted a todo: "+ todoId)
			return todoId
		})
		.catch((err) => {
			console.log("todo action -> could not delete todo", err)
			throw err
		})
}

export function onToggleTodo(todo) {
		const todoToSave = { ...todo, isDone: !todo.isDone }
		setIsLoading(true)
		saveTodo(todoToSave)
			.then((savedTodo) => {
				showSuccessMsg(
					`Todo Is ${savedTodo.isDone ? "done" : "back on your list"}`
				)

		})
			.catch((err) => {
				console.log("err:", err)
				showErrorMsg("Cannot toggle todo " + todo._id)
			})
			.finally(setIsLoading(false))
	}
