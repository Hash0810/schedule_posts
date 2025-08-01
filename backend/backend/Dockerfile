# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy source code
COPY . .

# Build with Maven, skipping tests
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:18-jre
WORKDIR /app

# Copy the jar from the build stage
COPY --from=build /app/target/demo-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]

# Optional healthcheck
# HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD curl --fail http://localhost:8080/actuator/health || exit 1
