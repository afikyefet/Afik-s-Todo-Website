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
            let selectedTodo = null;
            let pageIndex = null;

            todos.some((todoPage, idx) => {
                const foundTodo = todoPage.find((todo) => todo._id === todoId);
                if (foundTodo) {
                    selectedTodo = foundTodo;
                    pageIndex = idx;
                    return true;
                }
                return false;
            });

            if (!selectedTodo) {
                console.error("Todo not found:", todoId);
                return;
            }

            // Find next and previous todos, considering page boundaries
            const allTodos = todos.flat(); // Flatten array of arrays for easier navigation
            const todoIdx = allTodos.findIndex((todo) => todo._id === selectedTodo._id);
            const nextTodo = allTodos[todoIdx + 1] || allTodos[0]; // Wrap around to the first todo
            const prevTodo = allTodos[todoIdx - 1] || allTodos[allTodos.length - 1]; // Wrap around to the last todo

            // Attach next/prev IDs to the selected todo
            selectedTodo.nextTodoId = nextTodo._id;
            selectedTodo.prevTodoId = prevTodo._id;

            // Dispatch the selected todo
            return store.dispatch({ type: GET_TODO, todo: selectedTodo });
        })
        .catch((err) => {
            console.error("todo action -> could not get todo", err);
            throw err;
        });
}

export async function removeTodo(todoId) {
	// const todo =  await todoService.get(todoId)
	const user = store.getState().userModule.user

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
