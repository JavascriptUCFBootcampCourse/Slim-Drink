$(document).ready(function()
{
	var slimDrink = JSON.parse(localStorage.getItem('slimDrink')) || {};
	console.log('TEST');
	for(var i = 1; i <= 4; i++)
	{
		var div = $('<div>').addClass('hours');
		var h1 = $('<h1>').text(i+(i > 1 ? ' HOURS' : ' HOUR'));
		var h3 = $('<h3>').text('BAC = ' + calculateBAC(i) + '%');
		
		$('.hoursoutput').append(div.append(h1).append(h3));
	}

	function calculateBAC(hours)
	{
		var numberOfDrinks;
		var genderVar;

		numberOfDrinks = calculateNumberOfDrinks();

		if(slimDrink.gender === 'male')
			genderVar = .68;
		else
			genderVar = .55;

		var bac = ((((numberOfDrinks * 14)/(slimDrink.currentWeight * 454 * genderVar)) * 100) - (hours * .015)).toFixed(2)

		return bac > 0 ? bac : 0;
	}

	function calculateNumberOfDrinks()
	{
		return Math.floor(slimDrink.targetCalories / slimDrink.alcoholCalories);
	}

	$('.hours').click(function()
	{
		slimDrink.bac = $(this).find('h3').text();
		slimDrink.hours = $(this).find('h1').text();
		localStorage.setItem('slimDrink', JSON.stringify(slimDrink));

		window.location.replace("four.html");
	})
})