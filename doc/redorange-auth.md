# Auth API Endpoints

Base URL: `http://localhost:8000/api/v1`

## Índice

1. [Auth](#auth)
2. [Password](#password)
3. [2FA](#2fa)
4. [User](#user)
5. [Sessions](#sessions)
6. [OAuth](#oauth)
7. [Security](#security)

---

## Auth

### 1. Register

Registra un nuevo usuario.

**POST** `/auth/register`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John",
  "last_name": "Doe",
  "role": "dev"
}
```

| Campo     | Tipo   | Requerido | Descripción                                         |
| --------- | ------ | --------- | --------------------------------------------------- |
| email     | string | ✓         | Email único del usuario                             |
| password  | string | ✓         | Mínimo 8 caracteres                                 |
| name      | string | ✓         | Nombre del usuario                                  |
| last_name | string | ✓         | Apellido del usuario                                |
| role      | string | ✗         | Rol: `support`, `admin`, `dev` (default: `support`) |

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email.",
  "data": {
    "user_id": "uuid",
    "email": "user@example.com",
    "email_verified": false
  },
  "_dev_verification_token": "token_for_testing"
}
```

**Errors:**

- `400` VALIDATION_ERROR - Campos requeridos faltantes
- `400` PASSWORD_TOO_SHORT - Password menor a 8 caracteres
- `400` INVALID_ROLE - Rol inválido
- `409` EMAIL_ALREADY_EXISTS - Email ya registrado

---

### 2. Verify Email

Verifica el email del usuario con el token enviado.

**POST** `/auth/verify-email`

**Request Body:**

```json
{
  "token": "verification_token"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Errors:**

- `400` INVALID_TOKEN - Token inválido o expirado
- `400` TOKEN_EXPIRED - Token expirado
- `400` ALREADY_VERIFIED - Email ya verificado

---

### 3. Login

Inicia sesión con email y password.

**POST** `/auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200) - Sin 2FA:**

```json
{
  "success": true,
  "data": {
    "access_token": "jwt_access_token",
    "refresh_token": "jwt_refresh_token",
    "token_type": "Bearer",
    "expires_in": 900,
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John",
      "last_name": "Doe",
      "profile": "https://example.com/avatar.jpg",
      "role": "dev",
      "two_factor_enabled": false
    }
  }
}
```

**Response (200) - Con 2FA:**

```json
{
  "success": true,
  "requires_2fa": true,
  "data": {
    "temp_token": "jwt_temp_token",
    "message": "Please provide 2FA code"
  }
}
```

**Errors:**

- `401` INVALID_CREDENTIALS - Email o password incorrecto
- `403` ACCOUNT_INACTIVE - Cuenta inactiva
- `423` ACCOUNT_LOCKED - Cuenta bloqueada temporalmente

---

### 4. Refresh Token

Renueva el access token usando el refresh token.

**POST** `/auth/refresh`

**Request Body:**

```json
{
  "refresh_token": "jwt_refresh_token"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "access_token": "new_jwt_access_token",
    "token_type": "Bearer",
    "expires_in": 900
  }
}
```

**Errors:**

- `401` INVALID_TOKEN - Token inválido
- `401` SESSION_INVALID - Sesión revocada
- `401` SESSION_EXPIRED - Sesión expirada
- `401` USER_INACTIVE - Usuario inactivo

---

### 5. Logout

Cierra la sesión actual.

**POST** `/auth/logout`

**Headers:**

```
Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
  "refresh_token": "jwt_refresh_token"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Password

### 6. Request Password Reset

Solicita un token para resetear el password.

**POST** `/auth/password/request-reset`

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "If the email exists, a password reset link has been sent",
  "_dev_password_reset_token": "token_for_testing"
}
```

> Nota: Siempre retorna éxito para prevenir enumeración de emails.

---

### 7. Reset Password

Resetea el password usando el token.

**POST** `/auth/password/reset`

**Request Body:**

```json
{
  "token": "reset_token",
  "new_password": "newpassword123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Errors:**

- `400` INVALID_TOKEN - Token inválido
- `400` TOKEN_EXPIRED - Token expirado
- `400` VALIDATION_ERROR - Password muy corto

---

### 8. Change Password

Cambia el password del usuario autenticado.

**POST** `/auth/password/change`

**Headers:**

```
Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
  "current_password": "oldpassword123",
  "new_password": "newpassword456"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Errors:**

- `400` VALIDATION_ERROR - Campos faltantes o inválidos
- `400` NO_PASSWORD_SET - Usuario OAuth sin password
- `400` INVALID_PASSWORD - Password actual incorrecto

---

### 9. Set Password

Establece password para usuarios OAuth que no tienen uno.

**POST** `/auth/password/set`

**Headers:**

```
Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
  "password": "mypassword123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password set successfully"
}
```

**Errors:**

- `400` VALIDATION_ERROR - Password muy corto
- `400` PASSWORD_ALREADY_SET - Ya tiene password

---

## 2FA

### 10. Enable 2FA (Get QR)

Inicia el proceso de activación de 2FA.

**POST** `/auth/2fa/enable`

**Headers:**

```
Authorization: Bearer {access_token}
```

**Response (200):**

```json
{
  "success": true,
  "Data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qr_code": "data:image/png;base64,...",
    "setup_token": "setup_token",
    "backup_codes": ["XXXX-XXXX", "YYYY-YYYY", "..."]
  }
}
```

**Errors:**

- `400` 2FA_ALREADY_ENABLED - 2FA ya está activo

---

### 11. Verify Enable 2FA

Completa la activación de 2FA verificando el código TOTP.

**POST** `/auth/2fa/verify-enable`

**Headers:**

```
Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
  "setup_token": "setup_token",
  "code": "123456"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Two-factor authentication enabled successfully"
}
```

**Errors:**

- `400` INVALID_TOKEN - Setup token inválido o expirado
- `400` INVALID_CODE - Código TOTP incorrecto
- `400` 2FA_ALREADY_ENABLED - 2FA ya está activo

---

### 12. Verify 2FA (Login)

Verifica el código 2FA durante el login.

**POST** `/auth/2fa/verify`

**Request Body:**

```json
{
  "temp_token": "jwt_temp_token",
  "code": "123456"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "access_token": "jwt_access_token",
    "refresh_token": "jwt_refresh_token",
    "token_type": "Bearer",
    "expires_in": 900,
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John",
      "last_name": "Doe",
      "profile": null,
      "role": "dev",
      "two_factor_enabled": true
    }
  }
}
```

**Errors:**

- `400` INVALID_CODE - Código incorrecto
- `401` INVALID_TOKEN - Temp token inválido
- `429` TOO_MANY_ATTEMPTS - Demasiados intentos fallidos

---

### 13. Verify Backup Code (Login)

Verifica un código de respaldo durante el login.

**POST** `/auth/2fa/verify-backup`

**Request Body:**

```json
{
  "temp_token": "jwt_temp_token",
  "backup_code": "XXXX-XXXX"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Backup code accepted",
  "data": {
    "access_token": "jwt_access_token",
    "refresh_token": "jwt_refresh_token",
    "token_type": "Bearer",
    "expires_in": 900,
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John",
      "last_name": "Doe",
      "profile": null,
      "role": "dev",
      "two_factor_enabled": true
    },
    "warning": "This backup code has been used..."
  }
}
```

**Errors:**

- `400` INVALID_BACKUP_CODE - Código inválido o ya usado
- `401` INVALID_TOKEN - Temp token inválido

---

### 14. Disable 2FA

Desactiva la autenticación de dos factores.

**POST** `/auth/2fa/disable`

**Headers:**

```
Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
  "password": "password123",
  "code": "123456"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Two-factor authentication disabled"
}
```

**Errors:**

- `400` 2FA_NOT_ENABLED - 2FA no está activo
- `400` INVALID_CODE - Código incorrecto
- `401` INVALID_PASSWORD - Password incorrecto

---

### 15. Regenerate Backup Codes

Genera nuevos códigos de respaldo (invalida los anteriores).

**POST** `/auth/2fa/regenerate-backup-codes`

**Headers:**

```
Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
  "code": "123456"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "backup_codes": ["AAAA-BBBB", "CCCC-DDDD", "..."]
  }
}
```

**Errors:**

- `400` 2FA_NOT_ENABLED - 2FA no está activo
- `400` INVALID_CODE - Código incorrecto

---

### 16. Backup Codes Status

Obtiene el estado de los códigos de respaldo.

**GET** `/auth/2fa/backup-codes/status`

**Headers:**

```
Authorization: Bearer {access_token}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "total_codes": 10,
    "used_codes": 2,
    "remaining_codes": 8
  }
}
```

**Errors:**

- `400` 2FA_NOT_ENABLED - 2FA no está activo

---

## User

### 17. Get Current User

Obtiene información del usuario autenticado.

**GET** `/auth/me`

**Headers:**

```
Authorization: Bearer {access_token}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "email_verified": true,
    "name": "John",
    "last_name": "Doe",
    "profile": "https://example.com/avatar.jpg",
    "role": "dev",
    "active": true,
    "two_factor_enabled": false,
    "oauth_providers": ["google"],
    "has_password": true,
    "created_at": "2024-01-15T10:30:00Z",
    "last_login_at": "2024-01-20T14:45:00Z"
  }
}
```

---

### 18. Update Profile

Actualiza información del perfil.

**PATCH** `/auth/me`

**Headers:**

```
Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
  "name": "Jane",
  "last_name": "Smith",
  "profile": "https://example.com/new-avatar.jpg"
}
```

> Todos los campos son opcionales.

**Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jane",
    "last_name": "Smith",
    "profile": "https://example.com/new-avatar.jpg"
  }
}
```

---

### 19. Delete Profile Image

Elimina la imagen de perfil del usuario.

**DELETE** `/auth/me/profile`

**Headers:**

```
Authorization: Bearer {access_token}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Profile image deleted successfully"
}
```

---

## Sessions

### 20. Get Active Sessions

Lista todas las sesiones activas del usuario.

**GET** `/auth/sessions`

**Headers:**

```
Authorization: Bearer {access_token}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "uuid",
        "device_info": {
          "ip_address": "192.168.1.1",
          "user_agent": "Mozilla/5.0..."
        },
        "created_at": "2024-01-15T10:30:00Z",
        "last_activity_at": "2024-01-20T14:45:00Z",
        "current": true
      }
    ]
  }
}
```

---

### 21. Revoke Session

Revoca una sesión específica.

**DELETE** `/auth/sessions/{session_id}`

**Headers:**

```
Authorization: Bearer {access_token}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Session revoked successfully"
}
```

**Errors:**

- `400` INVALID_SESSION_ID - ID de sesión inválido
- `400` ALREADY_REVOKED - Sesión ya revocada
- `404` SESSION_NOT_FOUND - Sesión no encontrada

---

### 22. Revoke All Sessions

Revoca todas las sesiones del usuario.

**DELETE** `/auth/sessions/all`

**Headers:**

```
Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
  "include_current": false
}
```

| Campo           | Tipo    | Default | Descripción                 |
| --------------- | ------- | ------- | --------------------------- |
| include_current | boolean | false   | Si incluir la sesión actual |

**Response (200):**

```json
{
  "success": true,
  "message": "All other sessions revoked successfully",
  "data": {
    "revoked_count": 3
  }
}
```

---

## OAuth

### 23. Google OAuth Initiate

Inicia el flujo de autenticación con Google.

**GET** `/auth/oauth/google`

**Query Parameters:**
| Param | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| redirect_uri | string | ✓ | URL de callback del frontend |
| state | string | ✗ | Estado para CSRF protection |

**Example:**

```
GET /auth/oauth/google?redirect_uri=http://localhost:3000/auth/callback&state=random123
```

**Response:** Redirect a Google OAuth

---

### 24. Google OAuth Callback

Callback de Google OAuth (manejado automáticamente).

**GET** `/auth/oauth/google/callback`

**Query Parameters:**
| Param | Descripción |
|-------|-------------|
| code | Código de autorización de Google |
| state | Estado original |
| error | Error de Google (si aplica) |

**Response:** Redirect al frontend con tokens o error

**Success Redirect:**

```
{redirect_uri}?access_token=xxx&refresh_token=xxx
```

**2FA Required Redirect:**

```
{redirect_uri}?requires_2fa=true&temp_token=xxx
```

**Error Redirect:**

```
{redirect_uri}?error=error_type
```

---

### 25. Link Google Account

Vincula una cuenta de Google al usuario autenticado.

**POST** `/auth/oauth/google/link`

**Headers:**

```
Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
  "google_auth_code": "code_from_google_oauth"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Google account linked successfully",
  "data": {
    "provider": "google",
    "provider_email": "user@gmail.com"
  }
}
```

**Errors:**

- `400` ALREADY_LINKED - Ya tiene Google vinculado
- `400` INVALID_AUTH_CODE - Código inválido o expirado
- `400` GOOGLE_ALREADY_USED - Google ya vinculado a otra cuenta

---

### 26. Unlink Google Account

Desvincula la cuenta de Google.

**DELETE** `/auth/oauth/google/unlink`

**Headers:**

```
Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
  "password": "password123"
}
```

> Password requerido si el usuario tiene uno configurado.

**Response (200):**

```json
{
  "success": true,
  "message": "Google account unlinked successfully"
}
```

**Errors:**

- `400` NOT_LINKED - No tiene Google vinculado
- `400` NO_OTHER_AUTH_METHOD - No tiene otra forma de autenticación
- `400` PASSWORD_REQUIRED - Password requerido
- `401` INVALID_PASSWORD - Password incorrecto

---

## Security

### 27. Login History

Obtiene el historial de intentos de login.

**GET** `/auth/security/login-history`

**Headers:**

```
Authorization: Bearer {access_token}
```

**Query Parameters:**
| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| limit | int | 20 | Máximo 100 |
| offset | int | 0 | Para paginación |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "total": 50,
    "limit": 20,
    "offset": 0,
    "attempts": [
      {
        "id": "uuid",
        "success": true,
        "failure_reason": null,
        "ip_address": "192.168.1.1",
        "user_agent": "Mozilla/5.0...",
        "created_at": "2024-01-20T14:45:00Z"
      },
      {
        "id": "uuid",
        "success": false,
        "failure_reason": "invalid_password",
        "ip_address": "192.168.1.2",
        "user_agent": "Mozilla/5.0...",
        "created_at": "2024-01-19T10:30:00Z"
      }
    ]
  }
}
```

---

### 28. Account Security Status

Obtiene el estado de seguridad de una cuenta (público).

**POST** `/auth/security/status`

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "exists": true,
    "has_password": true,
    "two_factor_enabled": true,
    "oauth_providers": ["google"],
    "account_locked": false,
    "locked_until": null
  }
}
```

> Nota: Información limitada para prevenir enumeración.

---

## Códigos de Error Comunes

| Código | Error Code          | Descripción                 |
| ------ | ------------------- | --------------------------- |
| 400    | VALIDATION_ERROR    | Error de validación         |
| 400    | INVALID_BODY        | Body JSON inválido          |
| 401    | UNAUTHORIZED        | No autenticado              |
| 401    | INVALID_TOKEN       | Token inválido o expirado   |
| 401    | INVALID_CREDENTIALS | Credenciales incorrectas    |
| 403    | ACCOUNT_INACTIVE    | Cuenta desactivada          |
| 404    | NOT_FOUND           | Recurso no encontrado       |
| 423    | ACCOUNT_LOCKED      | Cuenta bloqueada            |
| 429    | TOO_MANY_ATTEMPTS   | Demasiados intentos         |
| 500    | INTERNAL_ERROR      | Error interno del servidor  |
| 500    | DB_NOT_AVAILABLE    | Base de datos no disponible |

---

## Tokens

### Duraciones

| Token                | Duración   |
| -------------------- | ---------- |
| Access Token         | 15 minutos |
| Refresh Token        | 7 días     |
| Temp Token (2FA)     | 5 minutos  |
| Verification Token   | 24 horas   |
| Password Reset Token | 1 hora     |
| 2FA Setup Token      | 10 minutos |

### Headers de Autenticación

```
Authorization: Bearer {access_token}
```

---

## Flujos de Autenticación

### Login Normal

```
1. POST /auth/login
2. Recibir access_token y refresh_token
3. Usar access_token en headers
4. Cuando expire, usar POST /auth/refresh
```

### Login con 2FA

```
1. POST /auth/login → recibir temp_token
2. POST /auth/2fa/verify con temp_token y código
3. Recibir access_token y refresh_token
```

### OAuth Google

```
1. GET /auth/oauth/google?redirect_uri=...
2. Usuario autoriza en Google
3. Redirect a callback con tokens en URL
4. Frontend extrae tokens de URL
```

### Activar 2FA

```
1. POST /auth/2fa/enable → recibir QR y setup_token
2. Usuario escanea QR en app autenticadora
3. POST /auth/2fa/verify-enable con código
4. Guardar backup_codes en lugar seguro
```
