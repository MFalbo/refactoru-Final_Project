$(document).ready(function(){
	// Search for pets by name and display results
	$('#searchForm').submit(function(e){
		$('.search-results').empty();
		e.preventDefault();
		var petName = $(this).find($('#petBox')).val();
		var ownerName = $(this).find($('#ownerBox')).val();
		// console.log(searchTerm);
		$.post('/veterinarian/search', {petName: petName, ownerName: ownerName}, function(data){
			// console.log(data);
			if(data.length > 0){
				for(var i =0; i<data.length; i++){
					for(key in data[i]){
						if(key.indexOf("_") === -1 && key !== "medicalHistory"){
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

	// Add symptoms to pet's medicalHistory and display them in pane
	$('.symptom-form').submit(function(e){
		e.preventDefault();
		var petId = $(this).closest($('.tab-content')).find($('.pet-id')).attr('data-id');
		// console.log(petId);
		var symptom = $(this).find($('input')).val();
		var description = $(this).find($('textarea')).val();
		var date = new Date();
		date = date.toLocaleString();
		var symptomLog = $(this);

		$.post('/owner/log', {symptom: symptom, description: description, date: date, _id: petId}, function(data){
			// console.log("response: ", data);
			symptomLog.closest($('.symptom-log')).find($('.log-display')).empty();

			for(var i =0; i < data.medicalHistory.length; i++){
				var div = $('<div>');
				var date = $('<p>' + data.medicalHistory[i]["date"] + '</p>');
				var list = $('<ul class="list-unstyled">');
				var symptom = $('<li><h4>' + data.medicalHistory[i]["symptom"] + '</h4></li>');
				var description = $('<li><p>' + data.medicalHistory[i]["description"] + '</p></li>');

				list.append(symptom);
				list.append(description);
				div.append(list);
				div.append(date);
				// console.log(list);			
				symptomLog.closest($('.symptom-log')).find($('.log-display')).append(div);
			}
		});

		$(this).find($('input')).val("");
		$(this).find($('textarea')).val("");
	});
});