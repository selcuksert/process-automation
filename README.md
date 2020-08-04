# process-automation
Sample project on process automation that utilizes [RedHat Process Automation Manager (RHPAM)](https://redhat.com/en/technologies/jboss-middleware/process-automation-manager) and SpringBoot

## Bootified Process Automation Application
RHPAM has the ability to deploy process engines within SpringBoot apps. For details please refer to the [official documentation](https://access.redhat.com/documentation/en-us/red_hat_process_automation_manager/7.7/html-single/creating_red_hat_process_automation_manager_business_applications_with_spring_boot/index).

This project utilizes sample business project on [employee evaluation](/Evaluation_Process) which comes with RHPAM installation:
![Evaluation BPM project](/doc/images/evaluation.bpmn.png)

The project has also a very basic UI based on [Semantic](https://semantic-ui.com/) UI framework that brings the ability to start an evaluation process, query active processes, task parameters and work items:
![UI](/doc/images/ui.png)
