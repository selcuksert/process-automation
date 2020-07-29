package com.corp.concepts.process.automation.evaluation.security;

import java.util.List;
import java.util.stream.Collectors;

import org.kie.api.task.UserGroupCallback;
import org.kie.internal.identity.IdentityProvider;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CustomUserGroupCallback implements UserGroupCallback {

	private IdentityProvider identityProvider;

	public CustomUserGroupCallback(IdentityProvider identityProvider) {
		this.identityProvider = identityProvider;
	}

	@Override
	public boolean existsUser(String userId) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean existsGroup(String groupId) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public List<String> getGroupsForUser(String userId) {
		List<String> roleList = identityProvider.getRoles();
		roleList = roleList.stream().map(role -> {
			// Kie expects case-sensitive group name for admin operations
			if (role.equalsIgnoreCase("administrators")) {
				role = "Administrators";
			}
			return role;
		}).collect(Collectors.toList());

		log.debug("roleList: {}", roleList);

		return roleList;
	}

}
