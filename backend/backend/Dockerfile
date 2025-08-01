# Build stage
FROM eclipse-temurin:18-jdk as build
WORKDIR /app

# If using Maven Wrapper, copy and use:
# COPY mvnw .
# COPY .mvn .mvn/
# RUN ./mvnw dependency:go-offline -B

# If still installing Maven system-wide:
RUN apt-get update && \
apt-get clean && \
rm -rf /var/lib/apt/lists/*

COPY . .
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:18-jre
WORKDIR /app
COPY --from=build /app/target/demo-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]

# Optional healthcheck
# HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD curl --fail http://localhost:8080/actuator/health || exit 1
