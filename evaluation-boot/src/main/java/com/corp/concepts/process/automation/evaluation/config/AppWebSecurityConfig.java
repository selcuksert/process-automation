package com.corp.concepts.process.automation.evaluation.config;

import java.util.Arrays;

//import org.kie.api.task.UserGroupCallback;
//import org.kie.internal.identity.IdentityProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

//import com.corp.concepts.process.automation.evaluation.security.CustomUserGroupCallback;

@Configuration("kieServerSecurity")
@EnableWebSecurity
@SuppressWarnings("deprecation")
public class AppWebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Value("${custom.ldap.url}")
	private String ldapUrl;

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.csrf().disable().authorizeRequests().antMatchers("/rest/**").authenticated().and().httpBasic();
	}

	/**
	 * Used {@link NoOpPasswordEncoder} for testing purposes. Must be replaced with
	 * a more secure one in production usage.
	 * 
	 * @return PasswordEncoder
	 */
	@Bean
	public static PasswordEncoder passwordEncoder() {
		return NoOpPasswordEncoder.getInstance();
	}

	/* 
	@Bean("userGroupCallback")
	public UserGroupCallback getUserGroupCallback(IdentityProvider identityProvider) {
		return new CustomUserGroupCallback(identityProvider);
	}
	*/
	
	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration corsConfiguration = new CorsConfiguration();
		corsConfiguration.setAllowedOrigins(Arrays.asList("*"));
		corsConfiguration.setAllowCredentials(true);
		corsConfiguration.setAllowedMethods(Arrays.asList(HttpMethod.GET.name(), HttpMethod.HEAD.name(),
				HttpMethod.POST.name(), HttpMethod.DELETE.name(), HttpMethod.PUT.name()));
		corsConfiguration.applyPermitDefaultValues();
		source.registerCorsConfiguration("/**", corsConfiguration);
		return source;
	}

	@Override
	public void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.ldapAuthentication().groupRoleAttribute("cn").userSearchBase("ou=People,dc=corp,dc=com")
				.userSearchFilter("(uid={0})").groupSearchBase("ou=Groups,dc=corp,dc=com")
				.groupSearchFilter("(uniqueMember={0})").rolePrefix("").contextSource().url(ldapUrl);
	}

}
