module.exports = {
	index: function(req, res) {
		console.log(req.user);
		if(req.user !== undefined){
			res.render('index', {loggedIn: !!req.user, user: req.user});
		}
		else{
			res.render('index');
		}
	}
}