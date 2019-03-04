const doSignin = (req,res, db, bcrypt)=>{
	const { email, password } = req.body;
	if (!email || !password){
		return res.status(400).json('cannot be blank!');
	}
	db.select('email','hash').from('login')
	.where('email','=',email)
	.then(data => {
		const isPasswordValid = bcrypt.compareSync(password,data[0].hash);
		if (isPasswordValid) {
			return db.select('*').from('users')
			.where('email','=',email)
			.then(user => {
				res.json(user[0]);
			})
			.catch(err => res.status(400).json('not getting a user'))
		} else {
			res.status(400).json('wrong user!')
		}
	})
	.catch(err => res.status(400).json('Erorrr!'))
}

module.exports = {
	doSignin: doSignin
}