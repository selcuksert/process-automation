## Adding remote Maven server for dependency management
Perform [Artifactory configuration steps](/docker) then append following snippet in pom.xml before project tag close:
```XML
  <distributionManagement>
    <snapshotRepository>
        <id>snapshots</id>
        <name>libs-snapshots-local</name>
        <url>http://mavenserver:8081/artifactory/pam</url>
    </snapshotRepository>
  </distributionManagement>
```
