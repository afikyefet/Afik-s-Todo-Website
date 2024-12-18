const { useState, useEffect } = React
const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter

import { userService } from "../services/user.service.js"
import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from "./LoginSignup.jsx"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { setLoggedInUser, userLogout } from "../store/actions/user.actions.js"
const { useSelector } = ReactRedux

export function AppHeader() {
	const navigate = useNavigate()
	const user = useSelector((storeState) => storeState.userModule.user)

	useEffect(() => {
		setLoggedInUser()
	}, [])

	// const [user, setUser] = useState(userService.getLoggedinUser())

	function onLogout() {
		userLogout().catch((err) => {
			showErrorMsg("OOPs try again")
		})
	}

	return (
		<header className="app-header full main-layout">
			<section className="header-container">
				<h1>
					<Link to="/">Afik Todo App</Link>
				</h1>
				{user ? (
					<section>
						<Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
						<span> {user.balance}</span>
						<button onClick={onLogout}>Logout</button>
					</section>
				) : (
					<section>
						<LoginSignup />
					</section>
				)}
				<nav className="app-nav">
					<NavLink to="/">Home</NavLink>
					<NavLink to="/about">About</NavLink>
					<NavLink to="/todo">Todos</NavLink>
					<NavLink to="/dashboard">Dashboard</NavLink>
				</nav>
			</section>
			<UserMsg />
		</header>
	)
}
