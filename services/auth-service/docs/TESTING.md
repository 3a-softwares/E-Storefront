# Auth Service Testing

## Overview

The auth-service uses Jest for unit and integration testing with comprehensive coverage of authentication flows.

---

## Test Structure

```
tests/
├── setup.ts                    # Test setup and globals
├── __mocks__/                  # Mock implementations
│   └── ...
├── config/                     # Config tests
├── controllers/
│   ├── AuthController.test.ts  # Auth endpoint tests
│   ├── UserController.test.ts  # User endpoint tests
│   └── AddressController.test.ts
├── middleware/                 # Middleware tests
└── utils/                      # Utility tests
```

---

## Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage report
npm run test:coverage

# Run specific file
npm test -- AuthController.test.ts
```

---

## Test Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/index.ts', '!src/config/swagger.ts'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

---

## Mocking Strategy

### Model Mocks

```typescript
jest.mock('../../src/models/User');

(User.findOne as jest.Mock).mockResolvedValue(null);
(User as unknown as jest.Mock).mockImplementation(() => ({
  _id: 'user123',
  email: 'test@example.com',
  save: jest.fn().mockResolvedValue(true),
}));
```

### JWT Mocks

```typescript
jest.mock('../../src/utils/jwt');

(jwt.generateTokens as jest.Mock).mockReturnValue({
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
});

(jwt.verifyRefreshToken as jest.Mock).mockReturnValue({
  userId: 'user123',
  type: 'refresh',
});
```

### Email Service Mocks

```typescript
jest.mock('../../src/services/emailService', () => ({
  sendVerificationEmailTemplate: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmailTemplate: jest.fn().mockResolvedValue(true),
}));
```

---

## Test Patterns

### Controller Test Setup

```typescript
describe('AuthController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });

    mockRequest = {
      body: {},
      params: {},
      user: undefined,
    };
    mockResponse = {
      status: responseStatus,
      json: responseJson,
    };

    jest.clearAllMocks();
  });
});
```

### Success Test

```typescript
it('should register a new user successfully', async () => {
  mockRequest.body = {
    email: 'newuser@example.com',
    password: 'password123',
    name: 'New User',
  };

  (User.findOne as jest.Mock).mockResolvedValue(null);
  (User as unknown as jest.Mock).mockImplementation(() => mockSavedUser);
  (jwt.generateTokens as jest.Mock).mockReturnValue({
    accessToken: 'token',
    refreshToken: 'refresh',
  });

  await authController.register(mockRequest as Request, mockResponse as Response);

  expect(responseStatus).toHaveBeenCalledWith(201);
  expect(responseJson).toHaveBeenCalledWith(
    expect.objectContaining({
      success: true,
      message: 'User registered successfully',
    })
  );
});
```

### Error Test

```typescript
it('should return 400 if user already exists', async () => {
  mockRequest.body = { email: 'existing@example.com' };

  (User.findOne as jest.Mock).mockResolvedValue({ email: 'existing@example.com' });

  await authController.register(mockRequest as Request, mockResponse as Response);

  expect(responseStatus).toHaveBeenCalledWith(400);
  expect(responseJson).toHaveBeenCalledWith({
    success: false,
    message: 'User with this email already exists',
  });
});
```

---

## Test Cases

### AuthController

| Test                             | Description                      |
| -------------------------------- | -------------------------------- |
| `register - success`             | Creates new user with tokens     |
| `register - duplicate`           | Returns 400 for existing email   |
| `register - error`               | Handles database errors          |
| `login - success`                | Returns user and tokens          |
| `login - invalid email`          | Returns 401 for unknown user     |
| `login - invalid password`       | Returns 401 for wrong password   |
| `login - deactivated`            | Returns 403 for inactive account |
| `refreshToken - success`         | Returns new token pair           |
| `refreshToken - invalid`         | Returns 401 for bad token        |
| `logout - success`               | Clears refresh token             |
| `getProfile - success`           | Returns user profile             |
| `updateProfile - success`        | Updates and returns user         |
| `changePassword - success`       | Updates password                 |
| `changePassword - wrong current` | Returns 401                      |
| `forgotPassword - success`       | Sends reset email                |
| `resetPassword - success`        | Updates password with token      |
| `resetPassword - expired`        | Returns 400 for expired token    |
| `verifyEmail - success`          | Marks email verified             |
| `googleAuth - new user`          | Creates user from Google         |
| `googleAuth - existing`          | Logs in existing user            |

### UserController

| Test                       | Description               |
| -------------------------- | ------------------------- |
| `getUsers - admin`         | Returns paginated users   |
| `getUsers - unauthorized`  | Returns 403 for non-admin |
| `getUserById - success`    | Returns user by ID        |
| `updateUser - success`     | Admin updates user        |
| `deactivateUser - success` | Deactivates user account  |

### AddressController

| Test                      | Description            |
| ------------------------- | ---------------------- |
| `getAddresses - success`  | Returns user addresses |
| `createAddress - success` | Creates new address    |
| `updateAddress - success` | Updates address        |
| `deleteAddress - success` | Removes address        |
| `setDefault - success`    | Sets default address   |

---

## Coverage Report

```
----------------------------|---------|----------|---------|---------|
File                        | % Stmts | % Branch | % Funcs | % Lines |
----------------------------|---------|----------|---------|---------|
controllers/                |         |          |         |         |
  AuthController.ts         |   92.3  |    85.7  |   100   |   91.8  |
  UserController.ts         |   88.5  |    82.1  |   100   |   87.9  |
  AddressController.ts      |   90.1  |    80.0  |   100   |   89.5  |
middleware/                 |         |          |         |         |
  auth.ts                   |   95.0  |    90.0  |   100   |   94.7  |
  validator.ts              |  100.0  |   100.0  |   100   |  100.0  |
utils/                      |         |          |         |         |
  jwt.ts                    |   97.2  |    92.3  |   100   |   96.8  |
----------------------------|---------|----------|---------|---------|
All files                   |   91.5  |    85.2  |   100   |   90.8  |
----------------------------|---------|----------|---------|---------|
```

---

## CI Integration

Tests run automatically in GitHub Actions:

```yaml
- name: Run Auth Service Tests
  working-directory: services/auth-service
  run: |
    npm ci
    npm run test:coverage
```

---

## Related

- [API.md](API.md) - API documentation
- [ARCHITECTURE.md](ARCHITECTURE.md) - Service architecture
