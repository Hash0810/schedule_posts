# Build stage
FROM eclipse-temurin:18-jdk as build
WORKDIR /app

# If using Maven Wrapper, copy and use:
# COPY mvnw .
# COPY .mvn .mvn/
# RUN ./mvnw dependency:go-offline -B

# If still installing Maven system-wide:
RUN apt-get update && apt-get install -y maven && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY . .
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:18-jre
WORKDIR /app
ARG JAR_FILE=target/*.jar
COPY --from=build /app/${JAR_FILE} app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]

# Optional healthcheck
# HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD curl --fail http://localhost:8080/actuator/health || exit 1
