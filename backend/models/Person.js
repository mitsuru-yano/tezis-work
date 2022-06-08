const {Schema, model} = require('mongoose')

const schema = new Schema({
	organization: {type: String, required: true}
})
module.exports = model('Person', schema)
