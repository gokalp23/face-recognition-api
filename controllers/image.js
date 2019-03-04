const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: 'c4e7395741fd49039ee69d3fb4eb928a'
});

const doApiCall = (req,res) => {
	app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
	.then(data => {
		res.json(data);
	})
	.catch(err => res.status(400).json('cannot be connected api'))
}


const putImage = (req,res,db)=>{
	const { id } = req.body;
	db('users').where('id', '=', id)
		.increment('entries',1)
		.returning('entries')
		.then(entries => {
			res.json(entries[0]);
		}).catch(err => res.status(400).json('ERORRRRR!'))
}

module.exports = {
	putImage: putImage,
	doApiCall: doApiCall
}