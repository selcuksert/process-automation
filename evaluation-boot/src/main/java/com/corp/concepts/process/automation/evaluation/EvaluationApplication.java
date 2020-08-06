package com.corp.concepts.process.automation.evaluation;

import java.util.HashSet;
import java.util.Set;

import org.kie.server.api.KieServerConstants;
import org.kie.server.api.model.KieContainerResource;
import org.kie.server.api.model.KieContainerStatus;
import org.kie.server.api.model.ReleaseId;
import org.kie.server.services.impl.storage.KieServerState;
import org.kie.server.services.impl.storage.file.KieServerStateFileRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import lombok.extern.slf4j.Slf4j;

@SpringBootApplication
@Slf4j
public class EvaluationApplication {
	public static void main(String[] args) {
		setupKie();
		SpringApplication.run(EvaluationApplication.class, args);
	}

	private static void setupKie() {
		// Use org.jbpm.services.task.identity.LDAPUserGroupCallbackImpl
		System.setProperty("org.jbpm.ht.callback", "ldap");
		// Use org.jbpm.services.task.identity.LDAPUserInfoImpl
		System.setProperty("org.jbpm.ht.userinfo", "ldap");
		
		String groupId = System.getProperty("KJAR_GROUP_ID", "evaluation");
		String artifactId = System.getProperty("KJAR_ARTIFACT_ID", "evaluation");
		String version = System.getProperty("KJAR_VERSION", "1.0.0-SNAPSHOT");

		System.setProperty(KieServerConstants.CFG_KIE_MVN_SETTINGS, "classpath:config/settings.xml");
		String controller = System.getProperty(KieServerConstants.KIE_SERVER_CONTROLLER);

		// proceed only when there is no KIE server controller configured
		if (controller != null && !controller.isEmpty()) {
			log.info("Controller is configured: {} - no local kjars can be installed", controller);
			return;
		}

		KieServerStateFileRepository repository = new KieServerStateFileRepository();
		KieServerState currentState = repository.load(artifactId);

		Set<KieContainerResource> containers = new HashSet<KieContainerResource>();

		ReleaseId releaseId = new ReleaseId(groupId, artifactId, version);
		KieContainerResource container = new KieContainerResource(
				releaseId.getArtifactId() + "-" + releaseId.getVersion(), releaseId, KieContainerStatus.STARTED);
		containers.add(container);

		currentState.setContainers(containers);

		repository.store(artifactId, currentState);
	}
}
