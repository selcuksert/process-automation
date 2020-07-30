const testCredentials = [{
	username: 'kieserver',
	password: 'kieserver1!'
}, {
	username: 'pamadmin',
	password: 'redhatpam1!'
}, {
	username: 'hruser',
	password: 'redhatpam1!'
}, {
	username: 'pmuser',
	password: 'redhatpam1!'
}];

const containerName = "evaluation-1.0.0-SNAPSHOT";
const processId = "evaluation";

var dropDownData = [];

var username = testCredentials[0].username;
var password = testCredentials[0].password;

function getProcessData(dataType) {
	let processListElem = $(event.target).parent().find('div.ui.relaxed.divided.list');
	processListElem.empty();
	$.ajax({
		type: "GET",
		url: "/rest/server/containers/" + containerName + "/processes/instances?page=0&pageSize=0&sort=processInstanceId&sortOrder=true",
		dataType: "json",
		headers: {
			"Authorization": "Basic "
				+ btoa(username + ":" + password)
		},
		success: function (data) {
			$("#active-process-list").empty();
			let instanceData = data["process-instance"];
			instanceData.forEach(instance => processListElem.append('<div class="item"><i class="large tasks middle aligned icon"></i><div class="content"><a class="header" onclick="showProcessDetails(\'' + dataType + '\');">' + instance["process-instance-id"] + '</a><div class="description">Started at: ' + new Date(instance["start-date"]["java.util.Date"]).toLocaleString("tr-TR") + '</div></div></div>'));
		}
	});
}

function showProcessDetails(dataType) {
	let processId = event.target.innerText;

	if (dataType === "variables") {
		getVariables(processId);
	}
	else if (dataType === "workitems") {
		getWorkItems(processId);
	}
}

function getVariables(processId) {
	$.ajax({
		type: "GET",
		url: "/rest/server/containers/" + containerName + "/processes/instances/" + processId + "/variables",
		dataType: "json",
		headers: {
			"Authorization": "Basic "
				+ btoa(username + ":" + password)
		},
		success: function (data) {
			$('#details-employee').text(data.employee);
			$('#details-reason').text(data.reason);
			$('#details-performance').text(data.performance);
			$('#details-init-by').text(data.initiator);
			$('#details').modal('show');
		}
	});
}

function getWorkItems(processId) {
	$.ajax({
		type: "GET",
		url: "/rest/server/containers/" + containerName + "/processes/instances/" + processId + "/workitems/" + processId,
		dataType: "json",
		headers: {
			"Authorization": "Basic "
				+ btoa(username + ":" + password)
		},
		success: function (data) {
			$('#workitems-message').html(data["work-item-params"].NotCompletedNotify);
			$('#workitems-reason').html(data["work-item-params"].reason);
			$('#workitems-comment').html(data["work-item-params"].Comment);
			$('#workitems').modal('show');
		}
	});
}

function submitRequest() {
	$.ajax({
		type: "POST",
		url: "/rest/server/containers/" + containerName + "/processes/" + processId + "/instances",
		contentType: "application/json",
		headers: {
			"Authorization": "Basic "
				+ btoa(username + ":" + password)
		},
		data: JSON.stringify({
			employee: $("#employee").val(),
			performance: $("#performance").val(),
			reason: $("#reason").val()
		}),
		statusCode: {
			201: function (data) {
				$('#process-id').text(data.responseText);
				$('#status').modal('show');
				$("#employee").val('');
				$("#performance").val(0);
				$("#reason").val('');
			}
		}
	});
}

function generateDropDownData() {
	testCredentials.forEach(credential => dropDownData.push({ name: credential.username, value: credential.password }))
	dropDownData[0].selected = true;
}

$(document).ready(function () {
	generateDropDownData();

	$('.menu .item').tab();

	$('.ui.dropdown').dropdown({
		onChange: function (value, name) {
			username = name;
			password = value;
		},
		values: dropDownData
	});

	$('#status').modal();
	$('#details').modal();
	$('#workitems').modal();
});
