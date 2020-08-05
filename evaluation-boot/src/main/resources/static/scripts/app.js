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
			instanceData.forEach(instance => processListElem.append('<div class="item"><i class="large cog middle aligned icon"></i><div class="content"><a class="header" onclick="showProcessDetails(\'' + dataType + '\');">' + instance["process-instance-id"] + '</a><div class="description">Started at: ' + new Date(instance["start-date"]["java.util.Date"]).toLocaleString("tr-TR") + '</div></div></div>'));
		},
		error: function(error) {
		    $('#error-message').text(error.responseText);
		    $('#error').modal('show');
		}
	});
}

function getTasks(listElem) {   
    let taskListElem = undefined; 
    
    if(listElem === undefined) {
      	taskListElem = $(event.target).parent().find('div.ui.relaxed.divided.list');
	}
	else {
		taskListElem = listElem;
	}
	
	taskListElem.empty();
	$.ajax({
		type: "GET",
		url: "/rest/server/queries/tasks/instances?page=0&pageSize=0&sortOrder=true",
		dataType: "json",
		headers: {
			"Authorization": "Basic "
				+ btoa(username + ":" + password)
		},
		success: function (data) {
			$("#active-process-list").empty();
			let taskData = data["task-summary"];
			taskData.forEach(task => taskListElem.append('<div class="item"><i class="large tasks middle aligned icon"></i><div class="content"><a class="header" onclick="getTaskDetails('+task["task-id"]+');">' + task["task-id"] + ' | ' + task["task-name"] + ' | ' + task["task-status"] + '</a><div class="description"><div class="ui icon buttons"><button class="ui button" onclick="startTask('+task["task-id"]+');"><i class="play icon"></i></button><button class="ui button" onclick="completeTask('+task["task-id"]+');"><i class="check icon"></i></button></div></div></div></div>'));
		},
		error: function(error) {
		    $('#error-message').text(error.responseText);
		    $('#error').modal('show');
		}
	});	
}

function startTask(taskId) {
    let taskListElem = $(event.target).offsetParent().find('div.ui.relaxed.divided.list');
	$.ajax({
		type: "PUT",
		url: "/rest/server/containers/" + containerName + "/tasks/" + taskId + "/states/started",
		contentType: "application/json",
		data: JSON.stringify({}),
		headers: {
			"Authorization": "Basic "
				+ btoa(username + ":" + password)
		},
		statusCode: {
			201: function (data) {
				getTasks(taskListElem);
			}
		},
		error: function(error) {
		    $('#error-message').text(error.responseText);
		    $('#error').modal('show');
		}
	});
}

function completeTask(taskId) {
    let taskListElem = $(event.target).offsetParent().find('div.ui.relaxed.divided.list');
	$.ajax({
		type: "PUT",
		url: "/rest/server/containers/" + containerName + "/tasks/" + taskId + "/states/completed?auto-progress=true",
		contentType: "application/json",
		data: JSON.stringify({}),
		headers: {
			"Authorization": "Basic "
				+ btoa(username + ":" + password)
		},
		statusCode: {
			201: function (data) {
				getTasks(taskListElem);
			}
		},
		error: function(error) {
		    $('#error-message').text(error.responseText);
		    $('#error').modal('show');
		}
	});
}

function getTaskDetails(taskId) {
	$.ajax({
		type: "GET",
		url: "/rest/server/containers/" + containerName + "/tasks/" + taskId + "?withInputData=true&withOutputData=true&withAssignments=true",
		dataType: "json",
		headers: {
			"Authorization": "Basic "
				+ btoa(username + ":" + password)
		},
		success: function (data) {
		    delete data["task-input-data"].NotCompletedNotify;
		    delete data["task-input-data"].NotStartedNotify;
		    
			$('#task-id').text(data["task-id"]);
			$('#task-name').text(data["task-name"]);
			$('#task-subject').text(data["task-subject"]);
			$('#task-description').text(data["task-description"]);
			$('#task-owner').text(data["task-actual-owner"]);
			$('#task-input').text(JSON.stringify(data["task-input-data"], null, 2));
			$('#task-output').text(JSON.stringify(data["task-output-data"], null, 2));
			$('#task').modal('show');
		},
		error: function(error) {
		    $('#error-message').text(error.responseText);
		    $('#error').modal('show');
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
		},
		error: function(error) {
		    $('#error-message').text(error.responseText);
		    $('#error').modal('show');
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

function getProcessImage() {
	$.ajax({
		type: "GET",
		contentType: "application/svg+xml",
		url: "/rest/server/containers/" + containerName + "/images/processes/" + processId,
		headers: {
			"Authorization": "Basic "
				+ btoa(username + ":" + password)
		},
		success: function (data) {
		    $('#process-image').empty();
		    let svgData = new XMLSerializer().serializeToString(data);	    
			$('#process-image').append(svgData);
		},
		error: function(error) {
		    $('#error-message').text(error.responseText);
		    $('#error').modal('show');
		}
	});}

$(document).ready(function () {
	generateDropDownData();

	$('.menu .item').tab(
	  {
		  onVisible: function(tabName) {
			if(tabName === 'image') {
				getProcessImage();
			}
		  }
	  }
	);

	$('.ui.dropdown').dropdown({
		onChange: function (value, name) {
			username = name;
			password = value;
			$('#get-task-button').html("Get Tasks for " + name);
		},
		values: dropDownData
	});

	$('#status').modal();
	$('#details').modal();
	$('#workitems').modal();
	$('#task').modal();
	$('#error').modal();
});
