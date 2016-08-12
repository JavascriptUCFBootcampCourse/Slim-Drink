$(document).ready(function()
{
	var slimDrink = JSON.parse(localStorage.getItem('slimDrink')) || {};
	var hours = $('<h1>').text(slimDrink.hours);
	var bac = $('<h3>').text(slimDrink.bac);
	var numDrinks = $('<h3>').text('Number of Drinks = ' + slimDrink.numberOfDrinks);
	
	$('.hoursoutput').append(hours.append(bac).append(numDrinks));
})