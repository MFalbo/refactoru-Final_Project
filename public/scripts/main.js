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

	$('.symptom-form').submit(function(e){
		e.preventDefault();
		var petId = $(this).closest($('#pet-container')).find($('#info')).attr('data-id');
		// console.log(petId);
		var symptom = $(this).find($('input')).val();
		var description = $(this).find($('textarea')).val();
		var date = new Date();
		date = date.toLocaleString();

		$.post('/owner/log', {symptom: symptom, description: description, date: date, _id: petId}, function(data){
			console.log("response: ", data);
		});

		$(this).find($('input')).val("");
		$(this).find($('textarea')).val("");
	});
});