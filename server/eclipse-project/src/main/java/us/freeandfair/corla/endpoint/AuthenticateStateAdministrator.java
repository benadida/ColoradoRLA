/*
 * Free & Fair Colorado RLA System
 * 
 * @title ColoradoRLA
 * @created Aug 9, 2017
 * @copyright 2017 Colorado Department of State
 * @license SPDX-License-Identifier: AGPL-3.0-or-later
 * @creator Daniel M. Zimmerman <dmz@galois.com>
 * @description A system to assist in conducting statewide risk-limiting audits.
 */

package us.freeandfair.corla.endpoint;

import static us.freeandfair.corla.model.Administrator.AdministratorType.STATE;

import spark.Request;
import spark.Response;

import us.freeandfair.corla.Main;
import us.freeandfair.corla.auth.AuthenticationInterface;
import us.freeandfair.corla.json.SubmittedCredentials;
import us.freeandfair.corla.model.Administrator;

/**
 * The endpoint for authenticating a state administrator.
 * 
 * @author Daniel M Zimmerman
 * @author Joseph R. Kiniry <kiniry@freeandfair.us>
 * @version 1.0.0
 */
@SuppressWarnings("PMD.AtLeastOneConstructor")
public class AuthenticateStateAdministrator extends AbstractEndpoint {
  /**
   * {@inheritDoc}
   */
  @Override
  public EndpointType endpointType() {
    return EndpointType.POST;
  }
  
  /**
   * {@inheritDoc}
   */
  @Override
  public String endpointName() {
    return "/auth-state-admin";
  }

  /**
   * Attempts to authenticate a state administrator; if the authentication is
   * successful, authentication data is added to the session.
   * 
   * Session query parameters: <tt>username</tt>, <tt>password</tt>, 
   * <tt>second_factor</tt>
   * 
   * @param the_request The request.
   * @param the_response The response.
   */
  @Override
  public String endpointBody(final Request the_request, final Response the_response) {
    final SubmittedCredentials credentials =
        Main.authentication().authenticationCredentials(the_request);
    if (Main.authentication().
        secondFactorAuthenticatedAs(the_request, STATE, credentials.username())) {
      okJSON(the_response, 
             Main.GSON.toJson(Main.authentication().authenticationStatus(the_request)));
    } else {
      if (Main.authentication().
          authenticateAdministrator(the_request, the_response,
                                    credentials.username(),
                                    credentials.password(),
                                    credentials.secondFactor())) {
        final Administrator admin = 
            (Administrator) the_request.session().attribute(AuthenticationInterface.ADMIN); 
        if (admin.type() == STATE) {
          okJSON(the_response, 
                 Main.GSON.toJson(Main.authentication().authenticationStatus(the_request)));
        } else {
          unauthorized(the_response, "Authentication failed");
        } 
      } else {
        unauthorized(the_response, "Authentication failed");
      }
    }
    return my_endpoint_result.get();
  }
}
