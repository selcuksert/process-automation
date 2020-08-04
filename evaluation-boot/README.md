# Spring Boot Based KIE Server
This module is an implementation of unmanaged KIE Server instance that uses external LDAP and Maven server instances.

## Configuration
There are several configuration parameters need to be considered:
| Parameter Name | Default Value | [application.yml](/evaluation-boot/src/main/resources/application.yml) property | Description |
| ----------- | ----------- | ----------- | ----------- |
| org.jbpm.ht.callback | ldap | Statically set in main class | JBPM property that specifies the implementation of [`UserGroupCallback`](https://github.com/kiegroup/droolsjbpm-knowledge/blob/master/kie-api/src/main/java/org/kie/api/task/UserGroupCallback.java) to be used. Here LDAP version is used. It is also possible to use a custom version with just setting `org.jbpm.ht.custom.callback` property with the FQDN of custom class (e.g. [`CustomUserGroupCallback`](/evaluation-boot/src/main/java/com/corp/concepts/process/automation/evaluation/security/CustomUserGroupCallback.java)).|
| org.jbpm.ht.userinfo | ldap | Statically set in main class | JBPM property that specifies the implementation of [`UserInfo`](https://github.com/kiegroup/droolsjbpm-knowledge/blob/master/kie-api/src/main/java/org/kie/api/task/UserInfo.java) to be used. Here LDAP version is used. It is also possible to use a custom version with just setting `org.jbpm.ht.custom.userinfo` property with the FQDN of custom class |
