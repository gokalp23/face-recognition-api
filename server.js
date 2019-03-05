const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors');
const db = require('knex')({
  client: 'pg', //PostgreSQL
  connection: {
    connectionString: process.env.DATABASE_URL,
  	ssl: true,
  }
});
//Controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

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
app.post('/signin', (req,res) => { signin.doSignin(req,res,db,bcrypt)});

// Register route
app.post('/register', (req,res) => { register.doRegister(req,res,db,bcrypt) });

// Profile route
app.get('/profile/:id', (req,res) => { profile.getProfile(req,res,db)});

// Submitting Image route
app.put('/image', (req,res) => { image.putImage(req,res,db)});

// Clarifai Aoi Call
app.post('/imageurl', (req,res) => { image.doApiCall(req,res)});


app.listen(process.env.PORT || 3001, ()=>{
	console.log(`app is listening port ${process.env.PORT} `);
});