const { createStore, combineReducers } = Redux
import { todoReducer } from "./reducers/todo.reducer.js"
import { userReducer } from "./reducers/user.reducer.js"
// import rootReducer from "./reducers"

// const store = appReducer()
const rootReducer = combineReducers({
	todoModule: todoReducer,
	userModule: userReducer,
})

const middleware =
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
export const store = createStore(rootReducer, middleware)
