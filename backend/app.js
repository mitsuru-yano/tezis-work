const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()

app.use(express.json({extended: true}))
app.use('/api/person', require('./routes/person.routes'))

const PORT = config.get('port') || 5000

async function start() {
	try {
		mongoose.connect(config.get('mongoUri'), {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			autoIndex: true,
			maxPoolSize: 10,
			serverSelectionTimeoutMS: 5000,
			socketTimeoutMS: 45000
		})
		app.listen(PORT, () =>
			console.log(`app has been started on port  ${PORT}...`)
		)
	} catch (err) {
		console.log('Server error', err.message)
		process.exit(1)
	}
}

start()
