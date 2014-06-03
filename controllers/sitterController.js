module.exports = {
	dashboard: function(req,res){
		if(req.user.role === 'sitter' && req.params.userId === req.user.username){
			res.render('sitter', {user: req.user});
		}
		else{
			res.redirect('/access/denied');
		}
	}
}