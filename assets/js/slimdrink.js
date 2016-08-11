$(document).ready(function()
{
	/*
		TODO: 
		- capture gender
		- potentially fix bac formula
		- create divs for each hours alcohol consumption
	*/
	var nutritionixAppId = '66148b0c';
	var nutritionixAppKey = 'fa8f5f681a9b4939d83631e3230ebb6d';
	var nutritionixQueryUrl = 'https://api.nutritionix.com/v1_1/search/%ALCOHOL%?fields=*&appId='+nutritionixAppId+'&appKey='+nutritionixAppKey;
	var usdaKey = '8XH1PqPkLb7GfZa9BMvfIqM8cpnjaBIzMCQ1pfkB';
	var usdaSearchQueryUrl = 'http://api.nal.usda.gov/ndb/search/?format=json&fg=1400&q=%ALCOHOL%&api_key=' + usdaKey;
	var usdaFoodReportQueryUrl = 'http://api.nal.usda.gov/ndb/reports/?ndbno=%NDBNO%&type=f&format=json&api_key=' + usdaKey;
	var slimDrink = JSON.parse(localStorage.getItem('slimDrink')) || {};

	$('#step1form').submit(function()
	{
		slimDrink.currentWeight = $('#weight').val().trim();
		slimDrink.targetCalories = $('#calories').val().trim();
		slimDrink.gender = 'gender';

		localStorage.setItem('slimDrink', JSON.stringify(slimDrink));

		return false;
	});

	$('.alcohol').click(function()
	{
		var alcoholChoice = $(this).attr('id');
		slimDrink.alcoholChoice = alcoholChoice;
		alcoholChoice = alcoholChoice === 'beer' ? 'regular beer' : alcoholChoice;
		
		$.ajax({url: usdaSearchQueryUrl.replace('%ALCOHOL%', alcoholChoice), method:'GET'})
		.done(function(response)
		{
			console.log(response.list.item);
			var ndbno = response.list.item[0].ndbno;
			$.ajax({url: usdaFoodReportQueryUrl.replace('%NDBNO%', ndbno), method:'GET'})
			.done(function(response2)
			{
				console.log(response2);
				var nutrients = response2.report.food.nutrients;

				for(var i = 0; i < nutrients.length; i++)
				{
					if(nutrients[i].name === 'Alcohol, ethyl')
						slimDrink.alcoholContent = nutrients[i].measures[1].value;
					else if(nutrients[i].name === 'Energy' && nutrients[i].unit === 'kcal')
						slimDrink.alcoholCalories = nutrients[i].measures[1].value;
				}
				localStorage.setItem('slimDrink', JSON.stringify(slimDrink));
			});
		});
	});

	function calculateBAC(hours)
	{
		var standardDrink;
		var genderVar;

		switch(slimDrink.alcoholChoice)
		{
			case 'beer':
				standardDrink = 12;
				break;
			case 'wine':
				standardDrink = 5;
				break;
			case 'liquor':
				standardDrink = 2;
				break;
		}

		standardDrink *= calculateNumberOfDrinks();

		if(slimDrink.gender === 'male')
			genderVar = .68;
		else
			genderVar = .55;

		return (standardDrink * slimDrink.alcoholContent)/(slimDrink.currentWeight * 454 * genderVar) * 100 * hours;
	}

	function calculateNumberOfDrinks()
	{
		return Math.floor(slimDrink.targetCalories / slimDrink.alcoholCalories);
	}
})