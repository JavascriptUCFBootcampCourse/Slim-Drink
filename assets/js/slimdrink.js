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
	var slimDrink = JSON.parse(localStorage.getItem('slimDrink')) || {};
	var currentWeight, currentCalories, gender;
	var test = [];


	if(slimDrink != undefined)
	{
		currentWeight = slimDrink.currentWeight;
		maxCalories = slimDrink.maxCalories;
		gender = slimDrink.gender;
		alcoholChoice = slimDrink.alcoholChoice;
	}

	$('#step1form').submit(function(e)
	{
		e.preventDefault();
		weight = $('#weight').val().trim();
		maxCalories = $('#calories').val().trim();
		console.log('weight = ' + weight);
		console.log('calories = ' + maxCalories);

		slimDrink.currentWeight = weight;
		slimDrink.maxCalories = maxCalories;
		slimDrink.gender = 'gender';

		localStorage.setItem('slimDrink', JSON.stringify(slimDrink));

		return false;
	});

	$('.alcohol').click(function()
	{
		alcoholChoice = $(this).attr('id');

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
					if(nutrients[i].name === 'Alcohol, ethyl')
						slimDrink.alcoholContent = nutrients[i].value;
					else if(nutrients[i].name === 'Energy' && nutrients[i].unit === 'kcal')
						slimDrink.maxCalories = nutrients[i].value;
				}
				localStorage.setItem('slimDrink', JSON.stringify(slimDrink));
			});
		});
	});

	function reset()
	{
		currentWeight = 0;
		maxCalories = 0;
		gender = '';
		alcoholChoice = 0;
		calories = 0;
		maxCalories = 0;

	}
})