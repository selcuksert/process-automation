## Adding remote Maven server for dependency management
Append following in pom.xml before project tag close:
```XML
  <distributionManagement>
    <snapshotRepository>
        <id>snapshots</id>
        <name>libs-snapshots-local</name>
        <url>http://mavenserver:8081/artifactory/libs-snapshot-local</url>
    </snapshotRepository>
  </distributionManagement>
```
## Artifactory LDAP Configuration
![Artifactory-LDAP](/doc/images/artifactory-ldap.png)
