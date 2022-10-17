const state = {
	submitUrl : ''
}

function showSpinner() {
	$('#loading-spinner').show();
}
function hideSpinner() {
	$('#loading-spinner').hide();
}

function clearInput() {
	$('#what-went-well-input').text('')
	$('#what-went-wrong-input').text('')
	$('#what-went-well-input').val('')
	$('#what-went-wrong-input').val('')
}

function showError(errorMessage) {
	$('#error-container').text(errorMessage)
	$('#error-container').show()
}

function hideError() {
	$('#error-container').hide()
}

function validateInput() {
	const sessionName = $('#session-label').text()
	const whatWentWell = $('#what-went-well-input').val()
	const whatWentWrong = $('#what-went-wrong-input').val()
	if (!whatWentWell || ! whatWentWrong) {
		showError("Dati mancanti. Compila entrambi i campi e reinvia il modulo.")
	}
	else {
		submitPoll(sessionName, whatWentWell, whatWentWrong)
	}
}

function submitPoll(sessionName, whatWentWell, whatWentWrong) {
	var data = JSON.stringify(
	{
		'sessionName' : sessionName,
		'whatWentWell' : whatWentWell,
		'whatWentWrong' : whatWentWrong
	});

	showSpinner();
    $.ajax({
        type: "POST",
        url: state.submitUrl,
        data: data,
        dataType: "json",
        contentType: "application/json;charset=utf-8"
    }).then((response)=>{
    	hideSpinner();
    	console.log(response)
    	alert('Feedback inviato con successo')
    	clearInput()
    }).catch((error)=>{
    	hideSpinner();
    	alert('Problemi nell\'invio del feedback:\n'+JSON.stringify(error))
    });
}

function getPollData() {
	/*return {
		sessionName: 'Sessione 2',
		sessionTitle: 'Il popo',
		submitUrl: 'http://google.com'
	}*/
	showSpinner();
	return $.ajax({
        type: "GET",
        url: "https://mmy5t06m0i.execute-api.eu-south-1.amazonaws.com/Prod/poll-config",
        dataType: "json",
        contentType: "application/json;charset=utf-8"
    })
}

function displayPollData() {
	let pollData = {}
	getPollData().then((response)=>{
		hideSpinner();
		console.log(JSON.stringify(response))
		pollData = response.data
		state.submitUrl = pollData.poll_submit_url
		$('#session-label').text(pollData.session_name)
		$('#session-title-label').text(pollData.session_title)
		console.log('values have been set')
	});
}

$(document).ready(function() {
    displayPollData();
});