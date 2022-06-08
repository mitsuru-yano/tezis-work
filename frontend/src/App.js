import React from 'react'
import './styles/index.css'
import Constructor from './pages/constructor-page'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './pages/login-page'

const App = () => {
	const [isLogin, setIsLogin] = React.useState(false)

	return (
		<div>
			<Router>
				<Routes>
					{isLogin ? (
						<Route path='/' element={<Constructor />} />
					) : (
						<Route
							path='/'
							element={<Login handler={() => setIsLogin(true)} />}
						/>
					)}
				</Routes>
			</Router>
		</div>
	)
}

export default App
