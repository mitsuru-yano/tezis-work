import React from 'react'
import {useHttp} from '../hooks/http.hook'

const Login = ({handler}) => {
	const [name, setName] = React.useState('')
	const {request} = useHttp()
	const handlerSetName = (e) => {
		setName(e.target.value)
	}

	const handlerLogin = async () => {
		try {
			if (name.length < 3) {
				throw new Error('Something went wrong')
			} else {
				const data = await request('/api/person/add', 'POST', {
					organization: name
				})
				handler()
			}
		} catch (e) {
			console.log(e)
		}
	}

	return (
		<div className='login-page'>
			<div>
				<h1>Вход</h1>
				<label>
					Введите вашу специальность
					<input
						onChange={handlerSetName}
						value={name}
						type='text'
						placeholder='Введите вашу специальность'
					/>
				</label>
				<button onClick={handlerLogin}>Войти</button>
			</div>
		</div>
	)
}
export default Login
