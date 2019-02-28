const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors');
const db = require('knex')({
  client: 'pg', //Postgres
  connection: {
    host : '127.0.0.1',
    user : 'yourusername',
    password : 'yourpassword',
    database : 'yourdatabse'
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

//Fake database for unit test
const database = {
	users: [
		{
			id: '1',
			name: 'Alper',
			email: 'alper@gmail.com',
			password: '123456',
			entries: 0,
			joined: new Date()
		},
		{
			id: '2',
			name: 'Orkun',
			email: 'orkun@gmail.com',
			password: 'nukro',
			entries: 0,
			joined: new Date()
		}
	]
}

// Home route
app.get('/', (req,res)=>{
	res.send(database.users);
});

// Signin route
app.post('/signin', (req,res)=>{
	db.select('email','hash').from('login')
	.where('email','=',req.body.email)
	.then(data => {
		const isPasswordValid = bcrypt.compareSync(req.body.password,data[0].hash);
		if (isPasswordValid) {
			return db.select('*').from('users')
			.where('email','=',req.body.email)
			.then(user => {
				res.json(user[0]);
			})
			.catch(err => res.status(400).json('not getting a user'))
		} else {
			res.status(400).json('wrong user!')
		}
	})
	.catch(err => res.status(400).json('Erorrr!'))
});

// Register route
app.post('/register', (req,res)=>{
	const { email, password, name} = req.body;
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginedEmail => {
			return trx('users')
				.returning('*')
				.insert({
					email: loginedEmail[0],
					name: name,
					joined: new Date()
				}).then(user => {
					res.json(user[0]);
				})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	
	}).catch(err => res.status(400).json('We have found and error!'))
	
});

// Profile route
app.get('/profile/:id', (req,res)=>{
	const { id } = req.params;
	
	db.select('*').from('users').where({id:id})
	  .then(user => {
	  	if(user.length){
	  		res.json(user[0])
	  	}else {
	  		res.status(400).json('user not found!')
	  	}
	  }).catch(err => res.status(400).json('error!!!'))
	
})

// Submitting Image route
app.put('/image', (req,res)=>{
	const { id } = req.body;
	db('users').where('id', '=', id)
		.increment('entries',1)
		.returning('entries')
		.then(entries => {
			res.json(entries[0]);
		}).catch(err => res.status(400).json('ERORRRRR!'))
})


app.listen(3001, ()=>{
	console.log('app is listening port 3001!');
});