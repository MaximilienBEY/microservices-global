# Movie App Microservices

This project is a microservices-based application for a movie reservation system. It is composed of several services, each with its own responsibility, and is designed to be scalable and easy to maintain. The microservices communicate with each other using Helm, a package manager for Kubernetes that helps you manage Kubernetes applications.

## Services

- **User Service**: Handles user-related operations.
- **Auth Service**: Responsible for authentication and authorization.
- **Reservation Service**: Manages movie reservations.
- **Movie Service**: Manages movie-related operations.
- **Cinema Service**: Handles cinema-related operations.

Each service is a separate application that can be run independently in its own Docker container.

## Installation

This project requires Docker to run. If you don't have Docker installed, you can download it from the [official Docker website](https://www.docker.com/products/docker-desktop).

### Cloning the Repository

To clone the repository, use the following command:

```sh
git clone --recurse-submodules git@github.com:MaximilienBEY/microservices-global.git
```

This command will clone the repository and all its submodules.

### If You've Already Cloned the Repository Without Submodules

If you've already cloned the repository without the `--recurse-submodules` option, you can initialize and update the submodules using the following commands:

```sh
git submodule init
git submodule update
```

These commands will clone all the submodules defined in the `.gitmodules` file.

### Setting Up Environment Variables

This project uses environment variables for configuration. The default values for these variables are stored in the `.env.example` file. To set up your own values, copy the `.env.example` file to a new file named `.env`:

```sh
cp .env.example .env
```

The environment variables in the `.env` file will be used by the Docker Compose configuration to set up the services. You can change everything except the DATABASE_URL and RABBIT_MQ_URL variables. Those need to be changed when deploying the application and not in local environment.

## Development

To start the application in development mode, use the following command:

```sh
npm run dev
```

This command uses Docker Compose to start all the services. Each service is built and run in its own Docker container.

```sh
npm run dev:reset
```

This command needs to be executed when the database schema is changed or a package is added. It will reset the database and install the dependencies for each service.


## Production

To start the application in production mode, use the following command:

```sh
npm run prod
```

This command also uses Docker Compose, but it uses the [`docker-compose.prod.yml`](command:_github.copilot.openRelativePath?%5B%22docker-compose.prod.yml%22%5D "docker-compose.prod.yml") file which is configured for production.

## Admin Account Procedure

This section describes the steps to create an admin account in the system. 

### Registration

First, you need to register a new user account. 

- **Endpoint**: `/auth/register`
- **Method**: POST
- **Access**: Public
- **Request Body**: `{ email: string, password: string, name: string }`
- **Response**: `{ user: UserReadType, tokens: AuthTokensType }`

This will create a new user account and return user details and tokens if successful.

### Login

After registration, you can log in to the system using your credentials.

- **Endpoint**: `/auth/login`
- **Method**: POST
- **Access**: Public
- **Request Body**: `{ email: string, password: string }`
- **Response**: `{ user: UserReadType, tokens: AuthTokensType }`

This will authenticate the user and return user details and tokens if successful.

### Uprank to Admin

Once you are logged in, you can upgrade your user role to admin. 

- **Endpoint**: `/auth/me/admin`
- **Method**: PATCH
- **Access**: Authenticated users only
- **Response**: `UserType`

This will upgrade the user's role to admin and return the updated user details.

## Email Catcher

This project uses an email catcher to capture and display the emails sent by the application during development. This is useful for testing and debugging email-related features without sending actual emails.

The email catcher runs as a separate service in the Docker environment. You can access it by navigating to `http://localhost:1080` in your web browser after starting the application.

## Kubernetes Deployment

The application is also configured to be deployed on a Kubernetes cluster. The configuration for this is in the [`helm/movie-app`](command:_github.copilot.openRelativePath?%5B%22helm%2Fmovie-app%22%5D "helm/movie-app") directory. The application is currently hosted on Google Cloud at [movie-app.maximilien-bey.com](http://movie-app.maximilien-bey.com).

The process for deploying the application is defined in the github actions workflow files. The workflow files are located in the `.github/workflows` directory.

## Linting

To lint the application, use the following command:

```sh
npm run lint
```

This command runs ESLint on the application code.

## Dependencies

The application uses several dependencies, including NestJS for the backend framework, RabbitMQ for message queuing, PostgreSQL for the database, and Prisma for the ORM. The dependencies for each service are isolated and managed through Docker.

## Conclusion

This project demonstrates a scalable architecture using microservices, Docker, Kubernetes, and Helm. It provides a solid starting point for building a robust, production-ready application.


# Endpoints
## Auth Service Endpoints

The Auth Service provides several endpoints for handling user authentication and authorization. Here are the details of each endpoint:

### `/auth/health`

- **Method**: GET
- **Description**: Checks the health of the Auth Service. Used by the Kubernetes liveness and readiness probes.
- **Access**: Public

### `/auth/login`

- **Method**: POST
- **Description**: Logs in a user. Returns user details and tokens if successful.
- **Access**: Public
- **Request Body**: `{ email: string, password: string }`
- **Response**: `{ user: UserReadType, tokens: AuthTokensType }`

### `/auth/register`

- **Method**: POST
- **Description**: Registers a new user. Returns user details and tokens if successful.
- **Access**: Public
- **Request Body**: `{ email: string, password: string, name: string }`
- **Response**: `{ user: UserReadType, tokens: AuthTokensType }`

### `/auth/refresh`

- **Method**: POST
- **Description**: Refreshes the user's tokens.
- **Access**: Public
- **Request Body**: `{ token: string }`
- **Response**: `{ accessToken: string, refreshToken: string }`

### `/auth/me`

- **Method**: GET
- **Description**: Returns the details of the currently logged-in user.
- **Access**: Authenticated users only
- **Response**: `UserType`

### `/auth/me/admin`

- **Method**: PATCH
- **Description**: Upgrades the user's role to admin.
- **Access**: Authenticated users only
- **Response**: `UserType`

### `/auth/me`

- **Method**: PATCH
- **Description**: Updates the details of the currently logged-in user.
- **Access**: Authenticated users only
- **Request Body**: `{ email: string, name: string }`
- **Response**: `UserType`

### `(RMQ) auth.decode`

- **Method**: POST
- **Description**: Decodes a token.
- **Access**: Internal use only
- **Request Body**: `{ token: string }`
- **Response**: `UserType`
Determining workspace structure

Deciding which workspace information to collect

Gathering workspace info

## User Service Endpoints

The User Service provides several endpoints for handling user-related operations. Here are the details of each endpoint:

### `/user/health`

- **Method**: GET
- **Description**: Checks the health of the User Service. Used by the Kubernetes liveness and readiness probes.
- **Access**: Public

### `/user`

- **Method**: POST
- **Description**: Creates a new user.
- **Access**: Admin users only
- **Request Body**: `{ email: string, name: string, role: 'USER' | 'ADMIN', password: string }`
- **Response**: `UserType`

### `/user`

- **Method**: GET
- **Description**: Returns a list of all users.
- **Access**: Admin users only
- **Response**: `UserType[]`

### `/user/:id`

- **Method**: GET
- **Description**: Returns the details of a specific user.
- **Access**: Admin users only
- **Response**: `UserType`

### `/user/:id`

- **Method**: PATCH
- **Description**: Updates the details of a specific user.
- **Access**: Admin users only
- **Request Body**: `{ email?: string, name?: string, role?: 'USER' | 'ADMIN', password?: string }`
- **Response**: `UserType`

### `/user/:id`

- **Method**: DELETE
- **Description**: Deletes a specific user.
- **Access**: Admin users only
- **Response**: `{ message: string }`

### `(RMQ) user.find.email`

- **Description**: Finds a user by email.
- **Access**: Internal use only
- **Request Body**: `{ email: string }`
- **Response**: `UserType`

### `(RMQ) user.check.admin`

- **Description**: Check if an admin user exists.
- **Access**: Internal use only
- **Response**: `boolean`

### `(RMQ) user.find.id`

- **Description**: Finds a user by ID.
- **Access**: Internal use only
- **Request Body**: `{ id: string }`
- **Response**: `UserType`

### `(RMQ) user.create`

- **Description**: Creates a new user.
- **Access**: Internal use only
- **Request Body**: `{ email: string, name: string, role: 'USER' | 'ADMIN', password: string }`
- **Response**: `UserType`

### `(RMQ) user.update`

- **Description**: Updates a user.
- **Access**: Internal use only
- **Request Body**: `{ email?: string, name?: string, role?: 'USER' | 'ADMIN', password?: string }`
- **Response**: `UserType`

## Movie Service Endpoints

The Movie Service provides several endpoints for handling movie-related operations. Here are the details of each endpoint:

### `/movies/health`

- **Method**: GET
- **Description**: Checks the health of the Movie Service. Used by the Kubernetes liveness and readiness probes.
- **Access**: Public

### `/movies`

- **Method**: GET
- **Description**: Returns a list of all movies.
- **Access**: Authenticated users only
- **Response**: `MovieType[]`

### `/movies/:id`

- **Method**: GET
- **Description**: Returns the details of a specific movie.
- **Access**: Authenticated users only
- **Response**: `MovieType`

### `/movies`

- **Method**: POST
- **Description**: Creates a new movie. Only accessible by admins.
- **Access**: Admins only
- **Request Body**: `{ name: string, description: string, rate: number, duration: number, categories: string[], poster?: file }`
- **Response**: `MovieType`

### `/movies/:id`

- **Method**: PUT
- **Description**: Updates the details of a specific movie. Only accessible by admins.
- **Access**: Admins only
- **Request Body**: `{ name?: string, description?: string, rate?: number, duration?: number, categories?: string[], poster?: file }`
- **Response**: `MovieType`

### `/movies/:id`

- **Method**: DELETE
- **Description**: Deletes a specific movie. Only accessible by admins.
- **Access**: Admins only
- **Response**: `{ message: string }`

### `/movies/:id/reservations`

- **Method**: GET
- **Description**: Returns all reservations for a specific movie. Only accessible by admins.
- **Access**: Admins only
- **Response**: `ReservationType[]`

### `/movies/:id/sceances/:sceanceId/reservations`

- **Method**: GET
- **Description**: Returns all reservations for a specific sceance of a movie. Only accessible by admins.
- **Access**: Admins only
- **Response**: `ReservationType[]`

### `/movies/:id/reservations`

- **Method**: POST
- **Description**: Creates a new reservation for a specific movie.
- **Access**: Authenticated users only
- **Request Body**: `{ nbSeat: number, sceance: string, room: string }`
- **Response**: `ReservationType`

## Cinema Service Endpoints

The Cinema Service provides several endpoints for handling cinema-related operations. Here are the details of each endpoint:

### `/cinema/health`

- **Method**: GET
- **Description**: Checks the health of the Cinema Service. Used by the Kubernetes liveness and readiness probes.
- **Access**: Public

### `/cinema`

- **Method**: GET
- **Description**: Returns a list of all cinemas.
- **Access**: Authenticated users only
- **Response**: `CinemaType[]`

### `/cinema/:id`

- **Method**: GET
- **Description**: Returns the details of a specific cinema.
- **Access**: Authenticated users only
- **Response**: `CinemaType`

### `/cinema`

- **Method**: POST
- **Description**: Creates a new cinema. Only accessible by admins.
- **Access**: Admins only
- **Request Body**: `{ name: string }`
- **Response**: `CinemaType`

### `/cinema/:id`

- **Method**: PUT
- **Description**: Updates the details of a specific cinema. Only accessible by admins.
- **Access**: Admins only
- **Request Body**: `{ name?: string }`
- **Response**: `CinemaType`

### `/cinema/:id`

- **Method**: DELETE
- **Description**: Deletes a specific cinema. Only accessible by admins.
- **Access**: Admins only
- **Response**: `{ message: string }`

### `/cinema/:id/rooms`

- **Method**: GET
- **Description**: Returns all rooms for a specific cinema.
- **Access**: Authenticated users only
- **Response**: `RoomType[]`

### `/cinema/:id/rooms/:roomId`

- **Method**: GET
- **Description**: Returns the details of a specific room in a cinema.
- **Access**: Authenticated users only
- **Response**: `RoomType`

### `/cinema/:id/rooms`

- **Method**: POST
- **Description**: Creates a new room for a specific cinema.
- **Access**: Admins only
- **Request Body**: `{ name: string, seats: number }`

### `/cinema/:id/rooms`

- **Method**: PATCH
- **Description**: Updates the details of a specific room in a cinema.
- **Access**: Admins only
- **Request Body**: `{ name?: string, seats?: number }`

### `/cinema/:id/rooms`

- **Method**: DELETE
- **Description**: Deletes a specific room in a cinema.
- **Access**: Admins only
- **Response**: `{ message: string }`

### `/cinema/:id/rooms/:roomId/sceances`

- **Method**: GET
- **Description**: Returns all sceances for a specific room in a cinema.
- **Access**: Authenticated users only
- **Response**: `SceanceType[]`

### `/cinema/:id/rooms/:roomId/sceances/:sceanceId`

- **Method**: GET
- **Description**: Returns the details of a specific sceance in a room.
- **Access**: Authenticated users only
- **Response**: `SceanceType`

### `/cinema/:id/rooms/:roomId/sceances`

- **Method**: POST
- **Description**: Creates a new sceance for a specific room in a cinema.
- **Access**: Admins only
- **Request Body**: `{ date: string, movie: string }`
- **Response**: `SceanceType`

### `/cinema/:id/rooms/:roomId/sceances/:sceanceId`

- **Method**: PUT
- **Description**: Updates the details of a specific sceance in a room.
- **Access**: Admins only
- **Request Body**: `{ date?: string, movie?: string }`
- **Response**: `SceanceType`

### `/cinema/:id/rooms/:roomId/sceances/:sceanceId`

- **Method**: DELETE
- **Description**: Deletes a specific sceance in a room.
- **Access**: Admins only
- **Response**: `{ message: string }`

## Reservation Service Endpoints

The Reservation Service provides several endpoints for handling reservation-related operations. Here are the details of each endpoint:

### `/reservations/health`

- **Method**: GET
- **Description**: Checks the health of the Reservation Service.
- **Access**: Public

### `/reservations/:id`

- **Method**: GET
- **Description**: Returns the details of a specific reservation.
- **Access**: Owner or admins only
- **Response**: `ReservationType`

### `/reservations/:id/confirm`

- **Method**: POST
- **Description**: Confirms a reservation.
- **Access**: Authenticated users only
- **Response**: `ReservationType`

### `(RMQ) reservations.create`

- **Method**: POST
- **Description**: Creates a new reservation.
- **Access**: Internal use only
- **Request Body**: `{ data: { nbSeats: number, sceance: string, room: string }, userId: string, movieId: string }`
- **Response**: `ReservationType`

### `(RMQ) reservation.movie.list`

- **Method**: GET
- **Description**: Lists all reservations for a specific movie.
- **Access**: Internal use only
- **Request Body**: `{ movieId: string }`
- **Response**: `ReservationType[]`

### `(RMQ) reservation.sceance.list`

- **Method**: GET
- **Description**: Lists all reservations for a specific sceance.
- **Access**: Internal use only
- **Request Body**: `{ movieId: string, sceanceId: string }`
- **Response**: `ReservationType[]`