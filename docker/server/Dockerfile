FROM maven:3.6 as maven

COPY server/eclipse-project /srv/corla/server/eclipse-project

WORKDIR /srv/corla/server/eclipse-project

RUN mvn clean
RUN mvn package

FROM openjdk:8
LABEL maintainer="Democracy Works, Inc. <dev@democracy.works>"

COPY docker/server/docker.properties /srv/corla/docker.properties
COPY --from=maven /srv/corla/server/eclipse-project/target/corla-server-*-shaded.jar \
     /srv/corla/corla.jar

CMD ["java", \
     "-jar", "/srv/corla/corla.jar", \
     "/srv/corla/docker.properties"]
