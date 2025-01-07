@startuml
skinparam class {
  BackgroundColor #FFFFFF
  ArrowColor #000000
  BorderColor #000000
}

title Auth Service Class Diagram

class AuthController {
    -authService: AuthenticationService
    +login(email: string, password: string): Promise<LoginResponse>
    +logout(token: string): void
    +refreshToken(token: string): Promise<string>
}

class AuthenticationService {
    -tokenService: TokenService
    -userRepository: UserRepository
    +authenticate(email: string, password: string): LoginResponse
    +invalidateToken(token: string): void
    +refreshToken(oldToken: string): string
}

class TokenService {
    +generateToken(userId: string): string
    +verifyToken(token: string): boolean
    +decodeToken(token: string): DecodedToken
}

class UserRepository {
    +findUserByEmail(email: string): User
    +findUserById(userId: string): User
    +updateUserToken(userId: string, token: string): void
}

class User {
    -userId: string
    -email: string
    -passwordHash: string
}

class LoginResponse {
    +userId: string
    +token: string
    +message: string
}

class DecodedToken {
    +userId: string
    +issuedAt: Date
    +expiresAt: Date
}

AuthController --> AuthenticationService : uses
AuthenticationService --> TokenService : uses
AuthenticationService --> UserRepository : reads/writes
UserRepository --> User : manipulates
TokenService --> DecodedToken : returns
AuthenticationService --> LoginResponse : returns
@enduml