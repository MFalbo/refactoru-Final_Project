$(document).ready(function(){

	// compile Handlebars templates
	var searchResults = $('#search-results');
	var searchText = searchResults.html();
	var search = Handlebars.compile(searchText);

	var symptomTemplate = $('#log-display');
	var symptomText = symptomTemplate.html();
	var symptomCompiled = Handlebars.compile(symptomText);

	var schedTemplate = $('#schedule-list');
	var schedText = schedTemplate.html();
	var schedCompiled = Handlebars.compile(schedText);

	// Search for pets by name and display results
	$('#searchForm').submit(function(e){
		$('.search-results').empty();
		$('.current-symptoms').empty();
		e.preventDefault();
		var petName = $(this).find($('#petBox')).val();
		var ownerName = $(this).find($('#ownerBox')).val();
		// console.log(searchTerm);
		$.post('/veterinarian/search', {petName: petName, ownerName: ownerName}, function(data){
			console.log(data);
			if(data.length > 0){
				for(var i =0; i<data.length; i++){
					
					// Appends selected data to search results box.  Can create template for diff parts of page using diff data
					$('.search-results').append(search(data[i]));
								// append pets medical history to page
					for(var j = 0; j < data[i].medicalHistory.length; j++){

						$('.current-symptoms').append(symptomCompiled(data[i].medicalHistory[j]));

					}
				}
			}
			else{
				$('.search-results').append($('<div class="search-results">No Search Results Found!</div>'));
				// $('#searchForm').find($('#searchBox')).val("");
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

				symptomLog.closest($('.symptom-log')).find($('.log-display')).append(symptomCompiled(data.medicalHistory[i]));

			}
		});

		$(this).find($('input')).val("");
		$(this).find($('textarea')).val("");
	});

	$('.add-sched-item').click(function(){
		$(this).siblings('.schedule-form').slideToggle();
	});

	var petSchedule = [];
	$(document).on('click', '.addItem', function(e){
		e.preventDefault();
		$(this).closest($('.schedule-form')).siblings('.schedule-list').empty();
		var time = $(this).closest($('.schedule-form')).find($('input[name="time"]')).val();
		var timeGroup = $(this).closest($('form')).find($('select[name="time-group"]')).val();
		var activity = $(this).closest($('form')).find($('input[name="activity"]')).val();

		var task = {
			time: time,
			timeGroup: timeGroup,
			activity: activity
		}

		petSchedule.push(task);
		console.log(petSchedule);

		for(var i = 0; i<petSchedule.length; i++){
			$(this).closest($('.schedule-form')).siblings('.schedule-list').append(schedCompiled(petSchedule[i]));
		}
		$(this).closest($('.schedule-form')).find($('input[name="time"]')).val("");
		$(this).closest($('form')).find($('input[name="activity"]')).val("");

	});
});