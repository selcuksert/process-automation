## Artifactory Configuration
* **LDAP:** You need to change default user settings and configure LDAP to enable full integration of RHPAM ecosystem: 
    * Change the default admin password. The default user will have the following credentials predefined in the system:
        - User: admin
        - Password: password
    * Configure LDAP settings using Admin module left-hand side:
    ![Artifactory-LDAP](/doc/images/artifactory-ldap.png)
    * Logout and login with pamadmin user. Artifactory automatically adds the user to its user DB.
    * Logout and login with admin user. Add deploy permisson to libs-release-local and libs-snapshot-local repos for pamadmin.
* **RedHat repos:** You need to add remote repositories listed in [RedHat repositories](https://access.redhat.com/maven-repository) page.
* **Virtual repo:** You need to add a virtual repo as follows and use that within pom.xml of business project:
   ![Artifactory-Virtual](/doc/images/artifactory-virtual-repo.png)
## RHPAM Maven Integration
* Use custom [`settings.xml`](https://github.com/selcuksert/docker-images/blob/master/redhat/pam/base/config/settings.xml)
* Set `kie.maven.settings.custom` property with `/usr/share/maven/conf/settings.xml` in [`standalone-full.xml`](https://github.com/selcuksert/docker-images/blob/master/redhat/pam/base/config/standalone-full.xml)
* Put the custom file under `/usr/share/maven/conf/settings.xml` during Docker build

