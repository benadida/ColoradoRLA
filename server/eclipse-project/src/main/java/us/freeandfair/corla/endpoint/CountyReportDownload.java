/*
 * Free & Fair Colorado RLA System
 * 
 * @title ColoradoRLA
 * @created Jul 27, 2017
 * @copyright 2017 Colorado Department of State
 * @license GNU Affero General Public License v3 with Classpath Exception
 * @creator Daniel M. Zimmerman <dmz@freeandfair.us>
 * @description A system to assist in conducting statewide risk-limiting audits.
 */

package us.freeandfair.corla.endpoint;

import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;

import javax.persistence.PersistenceException;

import org.apache.cxf.attachment.Rfc5987Util;

import spark.Request;
import spark.Response;

import us.freeandfair.corla.Main;
import us.freeandfair.corla.report.CountyReport;
import us.freeandfair.corla.util.SparkHelper;

/**
 * The county report download endpoint.
 * 
 * @author Daniel M. Zimmerman <dmz@freeandfair.us>
 * @version 1.0.0
 */
@SuppressWarnings("PMD.AtLeastOneConstructor")
public class CountyReportDownload extends AbstractEndpoint {
  /**
   * {@inheritDoc}
   */
  @Override
  public EndpointType endpointType() {
    return EndpointType.GET;
  }
  
  /**
   * {@inheritDoc}
   */
  @Override
  public String endpointName() {
    return "/county-report";
  }

  /**
   * This endpoint requires any kind of authentication.
   */
  @Override
  public AuthorizationType requiredAuthorization() {
    return AuthorizationType.COUNTY;
  }
  
  /**
   * {@inheritDoc}
   */
  @Override
  // necessary to break out of the lambda expression in case of IOException
  @SuppressWarnings("PMD.ExceptionAsFlowControl")
  public String endpoint(final Request the_request, final Response the_response) {
    final boolean pdf = "pdf".equalsIgnoreCase(the_request.queryParams("file_type"));
    final CountyReport cr = 
        new CountyReport(Main.authentication().authenticatedCounty(the_request));
    byte[] file = new byte[0];
    String filename = "";
    
    if (pdf) {
      the_response.type("application/pdf");
      filename = cr.filenamePDF();
      file = cr.generatePDF();
    } else {
      the_response.type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      filename = cr.filenameExcel();
      try {
        file = cr.generateExcel();
      } catch (final IOException e) {
        serverError(the_response, "Unable to generate Excel file");
      }
    }
    
    try {
      the_response.raw().setHeader("Content-Disposition", "attachment; filename=\"" + 
          Rfc5987Util.encode(filename, "UTF-8") + "\"");
    } catch (final UnsupportedEncodingException e) {
      serverError(the_response, "UTF-8 is unsupported (this should never happen)");
    }
    
    try (OutputStream os = SparkHelper.getRaw(the_response).getOutputStream();
         BufferedOutputStream bos = new BufferedOutputStream(os)) {
      bos.write(file);
      bos.flush();
      ok(the_response);
    } catch (final IOException | PersistenceException e) {
      serverError(the_response, "Unable to stream response");
    }
    
    return my_endpoint_result.get();
  }
}
