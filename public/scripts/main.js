$(document).ready(function(){
	$('#searchForm').submit(function(e){
		$('.search-results').empty();
		e.preventDefault();
		var searchTerm = $(this).find($('#searchBox')).val();
		// console.log(searchTerm);
		$.post('/veterinarian/search', {petName: searchTerm}, function(data){
			// console.log(data);
			if(data.length > 0){
				for(var i =0; i<data.length; i++){
					for(key in data[i]){
						if(key.indexOf("_") === -1){
							$('.search-results').append($('<p>' + key + ': ' + data[i][key] + '</p>'));
						}
					}
				}	
			}
			else{
				$('.search-results').append($('<div class="search-results">No Search Results Found!</div>'));
				$('#searchForm').find($('#searchBox')).val("");
			}
			$('#searchForm').find($('#searchBox')).val("");
		});
	});
});