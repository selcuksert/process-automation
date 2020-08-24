## Adding remote Maven server for dependency management
Perform [Artifactory configuration steps](/docker) then append following snippet in pom.xml before project tag close:
```XML
  <distributionManagement>
    <snapshotRepository>
        <id>snapshots</id>
        <name>${NAME}(e.g. lib-snapshot-pam)</name>
        <url>${SNAPSHOT_REPO_URL}(e.g. http://mavenserver:8081/artifactory/pam)</url>
    </snapshotRepository>
  </distributionManagement>
```
To add this snippet via Business Central switch to repository view in Project Explorer:
![BC-1](/doc/images/bc_1.png)
Then click on pom.xml to edit the file:
![BC-2](/doc/images/bc_2.png)

## KJAR Build
To build KJAR just click **Build & Install** under **Build** menu:
![BC-3](/doc/images/bc_3.png)
After successful build the KJAR artifact(s) should be visible in maven repo:
![BC-4](/doc/images/bc_4.png)

![maven_repo](/doc/images/maven_repo.png)
