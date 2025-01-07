@startuml
'skin and styling (optional, but can be included for better visuals)
skinparam class {
  BackgroundColor #FFFFFF
  ArrowColor #000000
  BorderColor #000000
}

title Auth Service Class Diagram

class AuthController {
    -authenticationService: AuthenticationService
    +login(request: Request, response: Response): Token
    +logout(request: Request, response: Response): void
}

class AuthenticationService {
    -tokenService: TokenService
    -userRepository: UserRepository
    +authenticate(username: String, password: String): boolean
    +generateToken(username: String): String
    +validateToken(token: String): boolean
}

class TokenService {
    +createToken(username: String): String
    +verifyToken(token: String): boolean
}

class UserRepository {
    +findUserByUsername(username: String): User
    +saveUser(user: User): User
}

class User {
    -id: Long
    -username: String
    -passwordHash: String
    +getId(): Long
    +getUsername(): String
    +getPasswordHash(): String
}

AuthController --> AuthenticationService : uses
AuthenticationService --> TokenService : uses
AuthenticationService --> UserRepository : uses
UserRepository --> User : returns
@enduml