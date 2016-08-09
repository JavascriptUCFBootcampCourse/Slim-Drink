$(document).ready(function()
{
	var nutritionixAppId = '66148b0c';
	var nutritionixAppKey = 'fa8f5f681a9b4939d83631e3230ebb6d';
	var queryUrl = 'https://api.nutritionix.com/v1_1/search/%ALCOHOL%?fields=*&appId='+nutritionixAppId+'&appKey='+nutritionixAppKey;
	var weight = 140;
	var maxCalories = 600;
	var alcoholChoice = 'wine';
	var usdaKey = '8XH1PqPkLb7GfZa9BMvfIqM8cpnjaBIzMCQ1pfkB';
	var usdaSearchQueryUrl = 'http://api.nal.usda.gov/ndb/search/?format=json&q=%ALCOHOL%&api_key=' + usdaKey;
	var usdaFoodReportQueryUrl = 'http://api.nal.usda.gov/ndb/reports/?ndbno=%NDBNO%&type=f&format=json&api_key=' + usdaKey;
	var slimDrink = JSON.parse(localStorage.getItem('slimDrink'));
	var currentWeight, currentCalories, gender;


	if(slimDrink != null)
	{
		currentWeight = slimDrink.currentWeight;
		currentCalories = slimDrink.currentCalories;
		gender = slimDrink.gender;
		alcoholChoice = slimDrink.alcoholChoice;
	}

	$('#step1form').submit(function()
	{
		weight = $('#weight').val().trim();
		maxCalories = $('#calories').val().trim();
		console.log('weight = ' + weight);
		console.log('calories = ' + maxCalories);

		localStorage.setItem('slimDrink', JSON.stringify(
			{
				currentWeight: weight,
				currentCalories: maxCalories
			}));

		return false;
	});

	$('.alcohol').click(function()
	{
		alcoholChoice = $(this).attr('id');
		console.log('alcoholChoice = '+alcoholChoice);

		$.ajax({url: usdaSearchQueryUrl.replace('%ALCOHOL%', alcoholChoice), method:'GET'})
		.done(function(response)
		{
			console.log(response);
			var ndbno = response.list.item[1].ndbno;
			$.ajax({url: usdaFoodReportQueryUrl.replace('%NDBNO%', ndbno), method:'GET'})
			.done(function(response2)
			{
				var nutrients = response2.report.food.nutrients;
				for(var i = 0; i < nutrients.length; i++)
				{
					if(nutrients[i].name === 'Alcohol, ethyl' || (nutrients[i].name === 'Energy' && nutrients[i].unit === 'kcal'))
						console.log(nutrients[i]);
				}
			});
		});
	});


})