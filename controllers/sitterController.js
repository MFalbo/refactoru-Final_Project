module.exports = {
	dashboard: function(req,res){
		if(req.user.role === 'sitter'){
			res.render('sitter', {user: req.user});
		}
		else{
			res.redirect('/access/denied');
		}
	}
}