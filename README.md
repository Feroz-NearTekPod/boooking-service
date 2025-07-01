# Hotel Booking Service

This project is a full-stack hotel booking application with secure authentication using Keycloak. The application consists of a Spring Boot backend, React frontend, and Keycloak for authentication and authorization.

## Prerequisites

- Java 17 or higher
- Node.js 14 or higher
- Docker and Docker Compose
- PostgreSQL
- Maven

## Project Structure

```
booking-service/
├── backend/          # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/        # Java source files
│   │   │   └── resources/   # Configuration files
│   │   └── test/           # Test files
│   └── pom.xml            # Maven dependencies
├── frontend/         # React frontend
│   ├── src/
│   │   ├── auth/           # Keycloak configuration
│   │   ├── components/     # React components
│   │   └── services/      # API services
│   └── package.json       # Node dependencies
└── docker-compose.yml    # Docker services configuration
```

## Setup Instructions

### 1. Keycloak Setup

1. Start Keycloak using Docker:
```bash
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev
```

2. Access Keycloak Admin Console:
   - Open http://localhost:8080
   - Login with admin/admin credentials
   - **Important**: Make sure to remember these credentials for future administrative tasks

3. Create a new realm:
   - Click "Create Realm" button in the top left dropdown
   - Name it "HotelRealm"
   - Click "Create"
   - **Note**: A realm in Keycloak is a space where you manage users, credentials, roles, and groups

4. Create a new client:
   - Go to Clients → Create Client
   - Client ID: `react-client` (This must match exactly with the clientId in KeycloakService.js)
   - Client Protocol: `openid-connect`
   - Click "Next"
   - Client Authentication: OFF (public client)
   - Click "Next"
   - Valid Redirect URIs: `http://localhost:3000/*`
   - Web Origins: `http://localhost:3000` (for CORS)
   - Click "Save"

5. Create roles (important for authorization):
   - Go to Roles → Create Role
   - Create the following roles:
     * `user` (for basic booking access)
     * `admin` (for administrative access)
   - **Note**: These roles will be used to control access to different parts of your application

6. Create test users:
   - Go to Users → Add User
   - Fill in required fields:
     * Username
     * Email
     * First Name
     * Last Name
   - Click "Save"
   - Go to Credentials tab
   - Set password and disable "Temporary" option
   - Go to Role Mappings tab
   - Assign appropriate roles (user/admin)

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Configure PostgreSQL:
   - Make sure PostgreSQL is running
   - Create a database named 'hoteldb':
```bash
psql -U postgres
CREATE DATABASE hoteldb;
```

3. Verify application.properties configuration:
```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/hoteldb
spring.datasource.username=postgres
spring.datasource.password=postgres

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Server Configuration
server.port=8081

# Keycloak Configuration
spring.security.oauth2.resourceserver.jwt.issuer-uri=http://localhost:8080/realms/HotelRealm
spring.security.oauth2.resourceserver.jwt.jwk-set-uri=http://localhost:8080/realms/HotelRealm/protocol/openid-connect/certs
```

4. Build and run the backend:
```bash
./mvnw clean install
./mvnw spring-boot:run
```

The backend will start on http://localhost:8081

### 3. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Verify Keycloak configuration in `src/auth/KeycloakService.js`:
```javascript
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://localhost:8080',
    realm: 'HotelRealm',
    clientId: 'react-client'
});

export default keycloak;
```
**Important**: Make sure these values match exactly with your Keycloak setup!

4. Start the frontend:
```bash
npm start
```

The frontend will start on http://localhost:3000

## Features

- Secure authentication using Keycloak
- JWT token-based authorization
- Two-factor authentication support
- User role-based access control
- Hotel booking management
- RESTful API endpoints

## Security Features

1. JWT Token Authentication:
   - The backend validates JWT tokens issued by Keycloak
   - All API endpoints under `/api/**` require authentication
   - CORS is configured for frontend access
   - Token refresh is handled automatically by Keycloak

2. Two-Factor Authentication:
   - Can be enabled through Keycloak account settings
   - Path: Account Console → Security → Signing In → Two-Factor Authentication
   - Supports various 2FA methods (OTP, WebAuthn)

## API Endpoints

The backend exposes the following endpoints:

- `POST /api/bookings`: Create a new booking
- `GET /api/bookings`: Get all bookings
- `GET /api/bookings/{id}`: Get booking by ID
- `PUT /api/bookings/{id}`: Update booking
- `DELETE /api/bookings/{id}`: Delete booking

**Note**: All endpoints require a valid JWT token in the Authorization header

## Development

### Running with Docker Compose

The entire application stack can be run using Docker Compose:

```bash
docker-compose up
```

This will start:
- Keycloak on port 8080
- PostgreSQL on port 5432
- Backend on port 8081
- Frontend on port 3000

### Common Issues and Solutions

1. Keycloak Issues:
   - **"Invalid redirect_uri" error**: 
     * Verify the redirect URI in Keycloak client settings matches your frontend URL exactly
     * Make sure to include the trailing /* in the Valid Redirect URIs
   - **"Invalid client_id" error**: 
     * Double-check that the clientId in KeycloakService.js matches the Client ID in Keycloak
   - **"Origin not allowed" error**: 
     * Verify the Web Origins in client settings includes your frontend URL

2. Backend Issues:
   - **Database connection failed**: 
     * Ensure PostgreSQL is running
     * Verify database credentials in application.properties
     * Check if database 'hoteldb' exists
   - **JWT validation failed**: 
     * Verify Keycloak realm name is correct
     * Check if issuer-uri is accessible
     * Ensure Keycloak is running

3. Frontend Issues:
   - **"Keycloak not initialized" error**:
     * Make sure Keycloak server is running before starting frontend
     * Check KeycloakService.js configuration
   - **API calls failing**:
     * Verify backend URL is correct
     * Check if JWT token is being properly attached to requests
     * Ensure user has correct roles assigned

### Security Best Practices

1. Never commit sensitive information:
   - Database credentials
   - Keycloak admin credentials
   - JWT secrets

2. Always use HTTPS in production:
   - Configure SSL for Keycloak
   - Enable HTTPS for backend
   - Use secure cookies

3. Regular updates:
   - Keep Keycloak version updated
   - Update npm packages regularly
   - Maintain Spring Boot version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Additional Resources

- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Spring Security Documentation](https://docs.spring.io/spring-security/reference/index.html)
- [React Documentation](https://reactjs.org/docs/getting-started.html) 