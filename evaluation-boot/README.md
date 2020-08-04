# Spring Boot Based KIE Server
This module is an implementation of unmanaged KIE Server instance that uses external LDAP and Maven server instances. Due to the unmanaged nature the project does not use an external RHPAM controller. To enable this one should uncomment relevant configuration parameters in [application.yml](/evaluation-boot/src/main/resources/application.yml).

This implementation uses embedded H2 DB for process data persistence where it can be changed within [application.yml](/evaluation-boot/src/main/resources/application.yml) using `spring.datasource.*` and `spring.jpa.*` properties.

## Sample UI
The project comes with a primitive UI based on [Semantic](https://semantic-ui.com/) UI framework reached via `${APP_PROTOCOL}`://`${APP_HOST}`:`${APP_PORT}` that brings the ability to start an evaluation process, query active processes, task parameters and work items:
![UI](/doc/images/ui.png)

## Configuration
Both environment variables and the KIE SpringBoot auto-configuration parameters are used defined in [`KieServerProperties`](https://github.com/kiegroup/droolsjbpm-integration/blob/master/kie-spring-boot/kie-spring-boot-autoconfiguration/kie-server-spring-boot-autoconfiguration/src/main/java/org/kie/server/springboot/autoconfiguration/KieServerProperties.java). There are several configuration parameters need to be considered:
| Parameter Name | Default Value | [application.yml](/evaluation-boot/src/main/resources/application.yml) property | Description |
| ----------- | ----------- | ----------- | ----------- |
| org.jbpm.ht.callback | ldap | Permanently set in [main class](/evaluation-boot/src/main/java/com/corp/concepts/process/automation/evaluation/EvaluationApplication.java) | JBPM property that specifies the implementation of [`UserGroupCallback`](https://github.com/kiegroup/droolsjbpm-knowledge/blob/master/kie-api/src/main/java/org/kie/api/task/UserGroupCallback.java) to be used. Here LDAP version is used. It is also possible to use a custom version with just setting `org.jbpm.ht.custom.callback` property with the FQDN of custom class (e.g. [`CustomUserGroupCallback`](/evaluation-boot/src/main/java/com/corp/concepts/process/automation/evaluation/security/CustomUserGroupCallback.java)).|
| org.jbpm.ht.userinfo | ldap | Permanently set in [main class](/evaluation-boot/src/main/java/com/corp/concepts/process/automation/evaluation/EvaluationApplication.java) | JBPM property that specifies the implementation of [`UserInfo`](https://github.com/kiegroup/droolsjbpm-knowledge/blob/master/kie-api/src/main/java/org/kie/api/task/UserInfo.java) to be used. Here LDAP version is used. It is also possible to use a custom version with just setting `org.jbpm.ht.custom.userinfo` property with the FQDN of custom class |
| KJAR_GROUP_ID | evaluation | Set in [main class](/evaluation-boot/src/main/java/com/corp/concepts/process/automation/evaluation/EvaluationApplication.java) | Maven group ID of KJAR artifact |
| KJAR_ARTIFACT_ID | evaluation | Set in [main class](/evaluation-boot/src/main/java/com/corp/concepts/process/automation/evaluation/EvaluationApplication.java) | Maven artifact ID of KJAR artifact |
| KJAR_VERSION | 1.0.0-SNAPSHOT | Set in [main class](/evaluation-boot/src/main/java/com/corp/concepts/process/automation/evaluation/EvaluationApplication.java) | Maven version of KJAR artifact |
| LDAP_PROTOCOL | ldap | custom.ldap.url | LDAP connection protocol. For secure communication this should be ldaps. |
| LDAP_HOST | localhost | custom.ldap.url | Hostname of LDAP server instance |
| LDAP_PORT | 389 | custom.ldap.url | Port of LDAP server instance |
| APP_PROTOCOL | http | kieserver.location | Communication protocol of KIE server instance. The application.yml property is the URL of the KIE Server instance used by the RHPAM controller to call back on this server. |
| APP_HOST | localhost | kieserver.location | Hostname of KIE server instance. The application.yml property is the URL of the KIE Server instance used by the RHPAM controller to call back on this server. |
| APP_PORT | 8090 | kieserver.location | Port of KIE server instance. The application.yml property is the URL of the KIE Server instance used by the RHPAM controller which is integrated with Business Central to call back on this server. |
| CONTROLLER_PROTOCOL | http | kieserver.controllers | Communication protocol of KIE controller instance. The application.yml property is the URL of the RHPAM controller REST endpoint. |
| CONTROLLER_HOST | localhost | kieserver.controllers | Hostname of KIE server instance. The application.yml property is the URL of the RHPAM controller REST endpoint. |
| CONTROLLER_PORT | 8080 | kieserver.controllers | Port of KIE server instance. The application.yml property is the URL of the RHPAM controller REST endpoint. |
| CONTROLLER_USER | pamadmin | kieserver.addons.controller.user | The user name to connect to the RHPAM controller REST API. Setting this property is required when using a RHPAM controller. |
| CONTROLLER_PWD | redhatpam1! | kieserver.addons.controller.pwd | The password to connect to the RHPAM controller REST API. Setting this property is required when using a RHPAM controller. |
| KIE_USER | kieserver | kieserver.addons.user | The user name used to connect with the KIE Server from the RHPAM controller, required when running in managed mode. |
| KIE_PWD | kieserver1! | kieserver.addons.pwd | The password used to connect with the KIE Server from the RHPAM controller, required when running in managed mode. |
| KIE_MODE | development | kieserver.addons.mode | KIE Server environment mode. You can set KIE Server to run in `production` mode or in `development` mode. Development mode provides a flexible deployment policy that enables to update existing deployment units (KIE containers) while maintaining active process instances for small changes. It also enables to reset the deployment unit state before updating active process instances for larger changes. Production mode is optimal for production environments, where each deployment creates a new deployment unit. |

## Authentication and Authorization
The project uses LDAP for user base and AuthN & AuthZ purposes. The users are defined using [LDAP configuration file](https://github.com/selcuksert/docker-images/blob/master/redhat/pam/ldapserver/config/ldif/bootstrap.ldif). The custom `WebSecurityConfigurerAdapter` implementation [`AppWebSecurityConfig`](/evaluation-boot/src/main/java/com/corp/concepts/process/automation/evaluation/config/AppWebSecurityConfig.java) enables a configuration that uses group names defined in LDAP as roles:
```
Checking match of request : '/rest/server/containers/evaluation-1.0.0-SNAPSHOT/processes/instances'; against '/rest/**'
Secure object: FilterInvocation: URL: /rest/server/containers/evaluation-1.0.0-SNAPSHOT/processes/instances?page=0&pageSize=0&sort=processInstanceId&sortOrder=true; Attributes: [authenticated]
Previously Authenticated: org.springframework.security.authentication.UsernamePasswordAuthenticationToken@99acafb5: Principal: org.springframework.security.ldap.userdetails.LdapUserDetailsImpl@d095923c: Dn: uid=kieserver,ou=People,dc=corp,dc=com; Username: kieserver; Password: [PROTECTED]; Enabled: true; AccountNonExpired: true; CredentialsNonExpired: true; AccountNonLocked: true; Granted Authorities: KIE-SERVER; Credentials: [PROTECTED]; Authenticated: true; Details: org.springframework.security.web.authentication.WebAuthenticationDetails@b364: RemoteIpAddress: 0:0:0:0:0:0:0:1; SessionId: null; Granted Authorities: KIE-SERVER
Voter: org.springframework.security.web.access.expression.WebExpressionVoter@638365f5, returned: 1
Authorization successful
```

<b>It is important to note that this custom class uses insecure methods such as `NoOpPasswordEncoder`, wildcard paths for CORS configuration. For enterprise and/or production usages this class should be re-implemented using best practices, configurations and measures in application security.</b>

## Swagger Interface
This implementation enables Swagger (`kieserver.swagger.enabled` property in application.yml). One can reach the Swagger UI via (AuthN needed using KIE Server users defined in ldap config file):
`${APP_PROTOCOL}`://`${APP_HOST}`:`${APP_PORT}`/rest/api-docs/`${APP_PROTOCOL}`://`${APP_HOST}`:`${APP_PORT}`/rest/swagger.json

