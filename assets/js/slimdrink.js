$(document).ready(function()
{
	var weight;
	var maxCalories;
	var alcoholChoice;

	$('#step1submit').click(function()
	{
		weight = $('#weight').val().trim();
		maxCalories = $('#calories').val().trim();
	});

	$('.alcohol').click(function()
	{
		alcoholChoice = $(this).attr('id');
	});
})