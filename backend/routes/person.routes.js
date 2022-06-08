const {Router} = require('express')
const Person = require('../models/Person')

const router = Router()

router.post('/add', async (req, res) => {
	try {
		const person = req.body
		const newPerson = new Person(person)
		await newPerson.save()

		res.json({message: 'Success'})
	} catch (e) {
		res.status(500).json({
			message: 'Something went wrong. Please try again.'
		})
	}
})

module.exports = router
