import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { userService } from "../services/user.service.js"
import { setUserLoading } from "../store/actions/user.actions.js"

const { useEffect , useState} = React
const { useSelector } = ReactRedux
const { useParams, useNavigate, Link } = ReactRouterDOM

export function UserDetails() {
	const user = useSelector(storeState => storeState.userModule.user)
	const userLoading = useSelector(storeState => storeState.userModule.userLoading)
	const userId = useParams().userId
	const [userPage, setUserPage] = useState(null)

	useEffect(()=>{
		setUserLoading(true)
		userService.getByIdSafe(userId)
		.then(user => {
			setUserPage(userPage => userPage = user)
			showSuccessMsg('user loaded')
		})
		.catch(err => {
			console.error('could not load user' , err);
			showErrorMsg("Could not find user")
		})
		.finally(setUserLoading(false))		
	},[userId])


	
	
	if(userLoading){
		return <div>Loading...</div>
	}else if(user && user._id === userId){
	return <section className="user-details"> 
	<h1>You are the user logged in</h1>
	<h1>{user.fullname}</h1>
	<h2>{user.balance}</h2>
	<ul>
		{user.activities.map((activity, idx)=>(
			<li key={idx}>
				{activity.txt}{"   "}
				<small>{userService.getTimeStamp(activity.at)}</small>
			</li>
		))}
	</ul>
	</section>
	}else if(userPage){
		return <section className="user-details"> 
		<h1>{userPage.fullname}</h1>
		<h2>{userPage.balance}</h2>
		<ul>
			{userPage.activities.map((activity, idx)=>(
				<li key={idx}>
					{activity.txt}{"   "}
					<small>{userService.getTimeStamp(activity.at)}</small>
				</li>
			))}
		</ul>
		</section>
	}
}
