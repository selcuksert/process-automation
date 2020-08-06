# process-automation
Sample project on process automation that aims to <u>demonstrate</u> [SpringBoot](/evaluation-boot) based [RedHat Process Automation Manager (RHPAM)](https://redhat.com/en/technologies/jboss-middleware/process-automation-manager) utilization.

## Bootified Process Automation Application
RHPAM has the ability to deploy process engines within SpringBoot apps. For details please refer to the [official documentation](https://access.redhat.com/documentation/en-us/red_hat_process_automation_manager/7.7/html-single/creating_red_hat_process_automation_manager_business_applications_with_spring_boot/index).

This project utilizes sample business project on [employee evaluation](/Evaluation_Process) which comes with RHPAM installation:
![Evaluation BPM project](/doc/images/evaluation.bpmn.png)

The project has also a very basic UI based on [Semantic](https://semantic-ui.com/) UI framework that brings the ability to start an evaluation process, query active processes, tasks, task parameters and work items:
![UI](/doc/images/ui.png)

## Architecture
The sample project utilizes [Docker images](/docker) for Maven and LDAP components and integrate them with [SpringBoot encapsulated KIE Server](/evaluation-boot) that digitizes the business process. The KIE Server is in [unmanaged mode](https://access.redhat.com/documentation/en-us/red_hat_process_automation_manager/7.7/html/managing_and_monitoring_kie_server/kie-server-unmanaged-server-config-proc) where KIE instance works in standalone mode (not controlled by an external Business Central instance) using a generated configuration file and to persist the internal server state, in case of container/application restarts. The KIE Server instance uses external LDAP for AuthN & AuthZ and external Maven server to download and use [KJAR](https://developers.redhat.com/blog/2018/03/14/what-is-a-kjar/) artifact.

Here is the architecture model based on Archimate standard:  
![Architecture](/doc/images/architecture.png)
