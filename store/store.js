const { createStore, combineReducers } = Redux
import { todoReducer } from "./reducers/todo.reducer.js"
// import rootReducer from "./reducers"

// const store = appReducer()
const rootReducer = combineReducers({
	todoModule: todoReducer,
})

export const store = createStore(rootReducer)
