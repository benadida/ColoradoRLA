/*
 * Free & Fair Colorado RLA System
 * 
 * @title ColoradoRLA
 * @created Aug 8, 2017
 * @copyright 2017 Free & Fair
 * @license GNU General Public License 3.0
 * @author Daniel M. Zimmerman <dmz@galois.com>
 * @description A system to assist in conducting statewide risk-limiting audits.
 */

package us.freeandfair.corla.query;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.PersistenceException;
import javax.persistence.RollbackException;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.hibernate.Session;

import us.freeandfair.corla.Main;
import us.freeandfair.corla.model.Administrator;
import us.freeandfair.corla.model.Contest;
import us.freeandfair.corla.model.County;
import us.freeandfair.corla.persistence.Persistence;

/**
 * Queries having to do with Contest entities.
 * 
 * @author Daniel M. Zimmerman
 * @version 0.0.1
 */
public final class ContestQueries {
  /**
   * Private constructor to prevent instantiation.
   */
  private ContestQueries() {
    // do nothing
  }
  
  /**
   * Obtain a persistent Contest object equivalent to the specified Contest
   * object. If there is not already such a persistent Contest object,
   * one is created and returned.
   *
   * @param the_contest The contest object to match.
   * @return the matched contest object, if one exists.
   */
  // we are checking to see if exactly one result is in a list, and
  // PMD doesn't like it
  @SuppressWarnings("PMD.AvoidLiteralsInIfCondition")
  public static Contest matching(final Contest the_contest) {
    Contest result = null;
    
    try {
      final boolean transaction = Persistence.beginTransaction();
      final Session s = Persistence.currentSession();
      final CriteriaBuilder cb = s.getCriteriaBuilder();
      final CriteriaQuery<Contest> cq = cb.createQuery(Contest.class);
      final Root<Contest> root = cq.from(Contest.class);
      final List<Predicate> conjuncts = new ArrayList<>();
      conjuncts.add(cb.equal(root.get("my_name"), the_contest.name()));
      conjuncts.add(cb.equal(root.get("my_description"), the_contest.description()));
      conjuncts.add(cb.equal(root.get("my_votes_allowed"), the_contest.votesAllowed()));
      cq.select(root).where(cb.and(conjuncts.toArray(new Predicate[conjuncts.size()])));
      final TypedQuery<Contest> query = s.createQuery(cq);
      final List<Contest> query_results = query.getResultList();
      // check to see if the results are really equivalent
      for (final Contest c : query_results) {
        if (c.equals(the_contest)) {
          // we found a match
          result = c;
          break;
        }
      }
      if (result == null) {
        // we need to persist a new object
        Persistence.saveOrUpdate(the_contest);
        result = the_contest;
      }
      if (transaction) {
        try {
          Persistence.commitTransaction();
        } catch (final RollbackException e) {
          Persistence.rollbackTransaction();
        }
      }
    } catch (final PersistenceException e) {
      Main.LOGGER.error("could not query database for contest");
    }
    if (result == null) {
      Main.LOGGER.debug("found no contest matching + " + the_contest);
    } else {
      Main.LOGGER.debug("found contest " + result);
    }
    return result;
  }
  
  /**
   * Obtains the County object that corresponds to the specified administrator ID.
   * 
   * @return the corresponding County. If the results are ambiguous or empty (more 
   * than one match, or no match), returns null.
   */
  // we are checking to see if exactly one result is in a list, and
  // PMD doesn't like it
  @SuppressWarnings("PMD.AvoidLiteralsInIfCondition")
  public static County forAdministrator(final Administrator the_administrator) {
    County result = null;
    
    try {
      final boolean transaction = Persistence.beginTransaction();
      final Session s = Persistence.currentSession();
      final CriteriaBuilder cb = s.getCriteriaBuilder();
      final CriteriaQuery<County> cq = cb.createQuery(County.class);
      final Root<County> root = cq.from(County.class);
      final Expression<Set<Administrator>> admins = root.get("my_administrators");
      final Predicate contains_admin = cb.isMember(the_administrator, admins);
      
      cq.select(root).where(contains_admin);
      final TypedQuery<County> query = s.createQuery(cq);
      final List<County> query_results = query.getResultList();
      // if there's exactly one result, return that
      if (query_results.size() == 1) {
        result = query_results.get(0);
      } 
      if (transaction) {
        try {
          Persistence.commitTransaction();
        } catch (final RollbackException e) {
          Persistence.rollbackTransaction();
        }
      }
    } catch (final PersistenceException e) {
      Main.LOGGER.error("could not query database for county");
    }
    if (result == null) {
      Main.LOGGER.debug("found no county for administrator " + the_administrator);
    } else {
      Main.LOGGER.debug("found county " + result + " for administrator " + the_administrator);
    }
    
    return result;
  }
  
  /**
   * Obtains a County object from a county name or ID string. If the string is 
   * numeric, we assume it is an ID; otherwise, we assume it is a name and match
   * it as closely as we can to a county in the database. 
   * 
   * @param the_string The string.
   * @return the matched County. If the results are ambiguous or empty (more than 
   * one match, or no match), returns null.
   */
  // we are checking to see if exactly one result is in a list, and
  // PMD doesn't like it
  @SuppressWarnings("PMD.AvoidLiteralsInIfCondition")
  public static County fromString(final String the_string) {
    County result = null;
    Integer parsed_id;
    
    try {
      parsed_id = Integer.parseInt(the_string);
    } catch (final NumberFormatException e) {
      parsed_id = -1;
    }
    
    try {
      final boolean transaction = Persistence.beginTransaction();
      final Session s = Persistence.currentSession();
      final CriteriaBuilder cb = s.getCriteriaBuilder();
      final CriteriaQuery<County> cq = cb.createQuery(County.class);
      final Root<County> root = cq.from(County.class);
      cq.select(root).where(cb.or(cb.like(root.get("my_name"), "%" + the_string + "%"),
                                  cb.equal(root.get("my_identifier"), parsed_id)));
      final TypedQuery<County> query = s.createQuery(cq);
      final List<County> query_results = query.getResultList();
      // if there's exactly one result, return that
      if (query_results.size() == 1) {
        result = query_results.get(0);
      } 
      if (transaction) {
        try {
          Persistence.commitTransaction();
        } catch (final RollbackException e) {
          Persistence.rollbackTransaction();
        }
      }
    } catch (final PersistenceException e) {
      Main.LOGGER.error("could not query database for county");
    }
    if (result == null) {
      Main.LOGGER.debug("found no county for string " + the_string);
    } else {
      Main.LOGGER.debug("found county " + result + " for string " + the_string);
    }
    
    return result;
  }
}