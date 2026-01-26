# Authentication & Authorization API Endpoints

## Table of Contents

- [Authentication Endpoints](#authentication-endpoints)
- [Two-Factor Authentication (2FA)](#two-factor-authentication-2fa)
- [OAuth (Google)](#oauth-google)
- [Session Management](#session-management)
- [User Management](#user-management)
- [Security Endpoints](#security-endpoints)

---

## Authentication Endpoints

### 1. Register User (Credentials)

**POST** `/api/v1/auth/register`

Creates a new user account with email/password.

```json
// Request
{
  "email": "user@example.com",
  "password": "SecureP@ss123",
  "first_name": "John",
  "last_name_paternal": "Doe",
  "last_name_maternal": "Smith",
  "role": "support"
}

// Response 201
{
  "success": true,
  "message": "User registered successfully. Please verify your email.",
  "data": {
    "user_id": "uuid",
    "email": "user@example.com",
    "email_verified": false
  }
}
```

### 2. Verify Email

**POST** `/api/v1/auth/verify-email`

Verifies user's email address with token sent via email.

```json
// Request
{
  "token": "verification_token_from_email"
}

// Response 200
{
  "success": true,
  "message": "Email verified successfully"
}
```

### 3. Login (Credentials)

**POST** `/api/v1/auth/login`

Authenticates user with email and password. Returns tokens if 2FA is disabled, or requires 2FA if enabled.

```json
// Request
{
  "email": "user@example.com",
  "password": "SecureP@ss123"
}

// Response 200 (2FA Disabled)
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
      "first_name": "John",
      "last_name_paternal": "Doe",
      "role": "support",
      "two_factor_enabled": false
    }
  }
}

// Response 200 (2FA Enabled - requires verification)
{
  "success": true,
  "requires_2fa": true,
  "data": {
    "temp_token": "temporary_token_for_2fa",
    "message": "Please provide 2FA code"
  }
}

// Response 401 (Invalid credentials)
{
  "success": false,
  "error": "Invalid email or password"
}

// Response 423 (Account locked)
{
  "success": false,
  "error": "Account temporarily locked due to multiple failed attempts",
  "locked_until": "2026-01-26T15:30:00Z"
}
```

### 4. Logout

**POST** `/api/v1/auth/logout`

Invalidates current session and refresh token.

```json
// Request Headers
Authorization: Bearer {access_token}

// Request Body
{
  "refresh_token": "jwt_refresh_token"
}

// Response 200
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 5. Refresh Token

**POST** `/api/v1/auth/refresh`

Gets new access token using refresh token.

```json
// Request
{
  "refresh_token": "jwt_refresh_token"
}

// Response 200
{
  "success": true,
  "data": {
    "access_token": "new_jwt_access_token",
    "token_type": "Bearer",
    "expires_in": 900
  }
}
```

### 6. Request Password Reset

**POST** `/api/v1/auth/password/request-reset`

Sends password reset email to user.

```json
// Request
{
  "email": "user@example.com"
}

// Response 200 (Always returns success to prevent email enumeration)
{
  "success": true,
  "message": "If the email exists, a password reset link has been sent"
}
```

### 7. Reset Password

**POST** `/api/v1/auth/password/reset`

Resets password using token from email.

```json
// Request
{
  "token": "reset_token_from_email",
  "new_password": "NewSecureP@ss456"
}

// Response 200
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## Two-Factor Authentication (2FA)

### 8. Enable 2FA - Step 1: Get QR Code

**POST** `/api/v1/auth/2fa/enable`

Generates TOTP secret and returns QR code for authenticator app.

```json
// Request Headers
Authorization: Bearer {access_token}

// Response 200
{
  "success": true,
  "data": {
    "secret": "base32_encoded_secret",
    "qr_code": "data:image/png;base64,...",
    "setup_token": "temporary_setup_token",
    "backup_codes": [
      "ABCD-1234",
      "EFGH-5678",
      "IJKL-9012",
      // ... 8 more codes
    ]
  }
}
```

### 9. Enable 2FA - Step 2: Verify and Activate

**POST** `/api/v1/auth/2fa/verify-enable`

Verifies TOTP code and activates 2FA.

```json
// Request Headers
Authorization: Bearer {access_token}

// Request Body
{
  "setup_token": "temporary_setup_token",
  "code": "123456"
}

// Response 200
{
  "success": true,
  "message": "Two-factor authentication enabled successfully"
}

// Response 400
{
  "success": false,
  "error": "Invalid verification code"
}
```

### 10. Verify 2FA Code (During Login)

**POST** `/api/v1/auth/2fa/verify`

Verifies 2FA code after successful password authentication.

```json
// Request
{
  "temp_token": "temporary_token_from_login",
  "code": "123456"
}

// Response 200
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
      "first_name": "John",
      "last_name_paternal": "Doe",
      "role": "support",
      "two_factor_enabled": true
    }
  }
}

// Response 400
{
  "success": false,
  "error": "Invalid 2FA code",
  "attempts_remaining": 2
}
```

### 11. Verify Backup Code

**POST** `/api/v1/auth/2fa/verify-backup`

Uses backup code when user doesn't have access to authenticator app.

```json
// Request
{
  "temp_token": "temporary_token_from_login",
  "backup_code": "ABCD-1234"
}

// Response 200
{
  "success": true,
  "message": "Backup code accepted",
  "data": {
    "access_token": "jwt_access_token",
    "refresh_token": "jwt_refresh_token",
    "token_type": "Bearer",
    "expires_in": 900,
    "user": { /* user object */ },
    "warning": "This backup code has been used and cannot be reused"
  }
}
```

### 12. Disable 2FA

**POST** `/api/v1/auth/2fa/disable`

Disables two-factor authentication.

```json
// Request Headers
Authorization: Bearer {access_token}

// Request Body
{
  "password": "CurrentPassword123",
  "code": "123456" // Current 2FA code
}

// Response 200
{
  "success": true,
  "message": "Two-factor authentication disabled"
}
```

### 13. Regenerate Backup Codes

**POST** `/api/v1/auth/2fa/regenerate-backup-codes`

Generates new backup codes (invalidates old ones).

```json
// Request Headers
Authorization: Bearer {access_token}

// Request Body
{
  "code": "123456" // Current 2FA code for verification
}

// Response 200
{
  "success": true,
  "data": {
    "backup_codes": [
      "WXYZ-9876",
      "MNOP-5432",
      // ... 10 codes total
    ]
  }
}
```

---

## OAuth (Google)

### 14. Initiate Google OAuth

**GET** `/api/v1/auth/oauth/google`

Redirects to Google OAuth consent screen.

```
// Query Parameters
?redirect_uri=https://yourapp.com/auth/callback
&state=random_state_token

// Redirects to Google OAuth URL
```

### 15. Google OAuth Callback

**GET** `/api/v1/auth/oauth/google/callback`

Handles OAuth callback from Google.

```
// Query Parameters received from Google
?code=authorization_code
&state=random_state_token

// Response: Redirect to frontend with tokens
https://yourapp.com/auth/success?access_token=...&refresh_token=...

// Or if 2FA is enabled for this account
https://yourapp.com/auth/2fa?temp_token=...
```

### 16. Link Google Account

**POST** `/api/v1/auth/oauth/google/link`

Links Google account to existing user account.

```json
// Request Headers
Authorization: Bearer {access_token}

// Request Body
{
  "google_auth_code": "authorization_code_from_google"
}

// Response 200
{
  "success": true,
  "message": "Google account linked successfully",
  "data": {
    "provider": "google",
    "provider_email": "user@gmail.com"
  }
}
```

### 17. Unlink Google Account

**DELETE** `/api/v1/auth/oauth/google/unlink`

Removes Google OAuth provider from user account.

```json
// Request Headers
Authorization: Bearer {access_token}

// Request Body
{
  "password": "CurrentPassword123" // Required if user has password
}

// Response 200
{
  "success": true,
  "message": "Google account unlinked successfully"
}

// Response 400 (Cannot unlink - no other auth method)
{
  "success": false,
  "error": "Cannot unlink Google account. Please set a password first."
}
```

---

## Session Management

### 18. Get Active Sessions

**GET** `/api/v1/auth/sessions`

Lists all active sessions for current user.

```json
// Request Headers
Authorization: Bearer {access_token}

// Response 200
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "uuid",
        "device_info": {
          "browser": "Chrome",
          "os": "Windows 10",
          "ip_address": "192.168.1.1"
        },
        "created_at": "2026-01-20T10:00:00Z",
        "last_activity_at": "2026-01-26T14:30:00Z",
        "current": true
      },
      {
        "id": "uuid",
        "device_info": {
          "browser": "Safari",
          "os": "iOS",
          "ip_address": "192.168.1.50"
        },
        "created_at": "2026-01-25T09:00:00Z",
        "last_activity_at": "2026-01-25T18:00:00Z",
        "current": false
      }
    ]
  }
}
```

### 19. Revoke Session

**DELETE** `/api/v1/auth/sessions/:session_id`

Revokes a specific session.

```json
// Request Headers
Authorization: Bearer {access_token}

// Response 200
{
  "success": true,
  "message": "Session revoked successfully"
}
```

### 20. Revoke All Sessions

**DELETE** `/api/v1/auth/sessions/all`

Revokes all sessions except current one.

```json
// Request Headers
Authorization: Bearer {access_token}

// Request Body (optional)
{
  "include_current": false // Default: false
}

// Response 200
{
  "success": true,
  "message": "All other sessions revoked successfully",
  "data": {
    "revoked_count": 3
  }
}
```

---

## User Management

### 21. Get Current User

**GET** `/api/v1/auth/me`

Gets current authenticated user info.

```json
// Request Headers
Authorization: Bearer {access_token}

// Response 200
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "email_verified": true,
    "first_name": "John",
    "last_name_paternal": "Doe",
    "last_name_maternal": "Smith",
    "role": "support",
    "active": true,
    "two_factor_enabled": true,
    "oauth_providers": ["google"],
    "has_password": true,
    "created_at": "2026-01-15T10:00:00Z",
    "last_login_at": "2026-01-26T14:00:00Z"
  }
}
```

### 22. Update Profile

**PATCH** `/api/v1/auth/me`

Updates user profile information.

```json
// Request Headers
Authorization: Bearer {access_token}

// Request Body
{
  "first_name": "John",
  "last_name_paternal": "Doe",
  "last_name_maternal": "Smith"
}

// Response 200
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name_paternal": "Doe",
    "last_name_maternal": "Smith"
  }
}
```

### 23. Change Password

**POST** `/api/v1/auth/password/change`

Changes user password (requires current password).

```json
// Request Headers
Authorization: Bearer {access_token}

// Request Body
{
  "current_password": "OldPassword123",
  "new_password": "NewSecureP@ss456"
}

// Response 200
{
  "success": true,
  "message": "Password changed successfully"
}

// Response 400
{
  "success": false,
  "error": "Current password is incorrect"
}
```

### 24. Set Password (OAuth users)

**POST** `/api/v1/auth/password/set`

Sets password for users who registered via OAuth.

```json
// Request Headers
Authorization: Bearer {access_token}

// Request Body
{
  "password": "NewSecureP@ss123"
}

// Response 200
{
  "success": true,
  "message": "Password set successfully"
}
```

---

## Security Endpoints

### 25. Get Login History

**GET** `/api/v1/auth/security/login-history`

Gets recent login attempts for current user.

```json
// Request Headers
Authorization: Bearer {access_token}

// Query Parameters
?limit=20&offset=0

// Response 200
{
  "success": true,
  "data": {
    "total": 45,
    "limit": 20,
    "offset": 0,
    "attempts": [
      {
        "id": "uuid",
        "success": true,
        "ip_address": "192.168.1.1",
        "user_agent": "Mozilla/5.0...",
        "created_at": "2026-01-26T14:00:00Z"
      },
      {
        "id": "uuid",
        "success": false,
        "failure_reason": "invalid_password",
        "ip_address": "192.168.1.1",
        "user_agent": "Mozilla/5.0...",
        "created_at": "2026-01-26T13:55:00Z"
      }
    ]
  }
}
```

### 26. Check Account Status

**GET** `/api/v1/auth/security/status`

Checks if account is locked or has security issues.

```json
// Request
{
  "email": "user@example.com"
}

// Response 200
{
  "success": true,
  "data": {
    "is_locked": false,
    "locked_until": null,
    "failed_attempts": 0
  }
}

// Response 200 (locked account)
{
  "success": true,
  "data": {
    "is_locked": true,
    "locked_until": "2026-01-26T15:30:00Z",
    "failed_attempts": 5,
    "reason": "Multiple failed login attempts"
  }
}
```

---

## Additional Considerations

### Rate Limiting

All endpoints should implement rate limiting:

- **Login**: 5 attempts per 15 minutes per IP
- **2FA Verification**: 3 attempts per 5 minutes
- **Password Reset**: 3 requests per hour per email
- **API calls**: 100 requests per minute per user

### Response Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1643200000
```

### Error Responses

Standardized error format:

```json
{
  "success": false,
  "error": "Error message",
  "error_code": "SPECIFIC_ERROR_CODE",
  "details": {} // Optional additional details
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `423` - Locked (account locked)
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Implementation Order Recommendation

### Phase 1: Basic Authentication

1. Register (endpoint 1)
2. Verify Email (endpoint 2)
3. Login (endpoint 3)
4. Logout (endpoint 4)
5. Refresh Token (endpoint 5)
6. Get Current User (endpoint 21)

### Phase 2: Password Management

7. Request Password Reset (endpoint 6)
8. Reset Password (endpoint 7)
9. Change Password (endpoint 23)

### Phase 3: Two-Factor Authentication

10. Enable 2FA (endpoints 8-9)
11. Verify 2FA (endpoint 10)
12. Backup Codes (endpoints 11, 13)
13. Disable 2FA (endpoint 12)

### Phase 4: OAuth Integration

14. Google OAuth (endpoints 14-17)

### Phase 5: Session & Security

15. Session Management (endpoints 18-20)
16. Security Endpoints (endpoints 25-26)
17. Profile Management (endpoints 22, 24)

---

## Next.js Integration Example

```typescript
// lib/auth.ts
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  verify2FA: async (tempToken: string, code: string) => {
    const response = await fetch("/api/v1/auth/2fa/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ temp_token: tempToken, code }),
    });
    return response.json();
  },

  // ... other methods
};
```
