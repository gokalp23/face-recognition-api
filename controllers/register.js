const doRegister = (req,res,db,bcrypt) => {
	const { email, password, name} = req.body;
	if (!email || !name || !password){
		return res.status(400).json('cannot be blank!');
	}
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
	
}

module.exports = {
	doRegister: doRegister
}