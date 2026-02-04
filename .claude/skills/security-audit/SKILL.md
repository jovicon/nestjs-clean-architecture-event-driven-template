---
name: security-audit
description: Comprehensive security audit for OWASP Top 10, secrets detection, and vulnerability analysis. Use when auditing security, checking for vulnerabilities, or preparing for security reviews.
argument-hint: [scope] [module-name]
---

# Security Audit Report

**Scope:** $0 (options: all, owasp, secrets, dependencies, auth, input-validation - default: all)
**Module:** $1 (if empty, audit entire project)

---

## 1. OWASP Top 10 (2021) Analysis

### 1.1 A01:2021 - Broken Access Control

**Check for:**

- ❌ Missing authorization checks in controllers/use cases
- ❌ Insecure direct object references (IDOR)
- ❌ Missing role-based access control (RBAC)
- ❌ Elevation of privilege vulnerabilities

**Analyze:**

```typescript
// ❌ BAD - No authorization check
@Get(':id')
async getOrder(@Param('id') id: string) {
  return this.orderService.findById(id); // Any user can access any order!
}

// ✅ GOOD - Authorization check
@Get(':id')
@UseGuards(JwtAuthGuard, OrderOwnershipGuard)
async getOrder(@Param('id') id: string, @CurrentUser() user: User) {
  return this.orderService.findById(id, user.id);
}
```

**Search patterns:**

- Controllers with @Get, @Post, @Put, @Delete without @UseGuards
- Use cases accepting userId but not validating ownership
- Admin-only operations without role checks

---

### 1.2 A02:2021 - Cryptographic Failures

**Check for:**

- ❌ Passwords stored in plain text
- ❌ Weak hashing algorithms (MD5, SHA1)
- ❌ Sensitive data in logs
- ❌ Unencrypted data transmission
- ❌ Hardcoded secrets/keys

**Analyze:**

```typescript
// ❌ BAD - Plain text password
const user = { password: dto.password };

// ✅ GOOD - Hashed password
const hashedPassword = await bcrypt.hash(dto.password, 10);
const user = { password: hashedPassword };
```

**Search for:**

- `console.log` with sensitive data (passwords, tokens, credit cards)
- Database schemas storing sensitive fields without encryption
- HTTP URLs instead of HTTPS
- JWT secrets in code instead of environment variables

---

### 1.3 A03:2021 - Injection

**Check for:**

- ❌ SQL Injection (if using raw queries)
- ❌ NoSQL Injection (MongoDB query injection)
- ❌ Command Injection (shell commands with user input)
- ❌ Code Injection (eval, Function constructor)

**Analyze:**

**SQL/NoSQL Injection:**

```typescript
// ❌ BAD - NoSQL injection vulnerable
async findByUsername(username: string) {
  return this.model.find({ username: username }); // If username is an object: {$ne: null}
}

// ✅ GOOD - Type validation
async findByUsername(username: string) {
  if (typeof username !== 'string') {
    throw new BadRequestException('Invalid username');
  }
  return this.model.findOne({ username });
}
```

**Command Injection:**

```typescript
// ❌ BAD - Command injection
exec(`convert ${userFileName} output.pdf`); // User input in shell command!

// ✅ GOOD - Parameterized or sanitized
const sanitized = sanitizeFileName(userFileName);
execFile('convert', [sanitized, 'output.pdf']);
```

**Search for:**

- `exec()`, `execSync()`, `spawn()` with user input
- Raw MongoDB queries: `db.collection.find({ $where: ... })`
- String concatenation in database queries
- `eval()`, `Function()` constructor usage

---

### 1.4 A04:2021 - Insecure Design

**Check for:**

- ❌ Missing rate limiting
- ❌ No request throttling
- ❌ Unlimited file upload sizes
- ❌ Missing input validation
- ❌ Lack of defense in depth

**Analyze:**

```typescript
// ❌ BAD - No rate limiting
@Post('login')
async login(@Body() dto: LoginDto) {
  return this.authService.login(dto); // Brute force attack possible!
}

// ✅ GOOD - Rate limiting
@Post('login')
@UseGuards(ThrottlerGuard)
@Throttle(5, 60) // 5 attempts per 60 seconds
async login(@Body() dto: LoginDto) {
  return this.authService.login(dto);
}
```

**Search for:**

- Authentication endpoints without rate limiting
- File upload endpoints without size limits
- Missing CORS configuration
- No request size limits

---

### 1.5 A05:2021 - Security Misconfiguration

**Check for:**

- ❌ Debug mode enabled in production
- ❌ Default credentials
- ❌ Unnecessary features enabled
- ❌ Missing security headers
- ❌ Verbose error messages exposing internals

**Analyze:**

**Error Handling:**

```typescript
// ❌ BAD - Exposes stack traces
@Catch()
export class GlobalExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    return {
      message: exception.message,
      stack: exception.stack, // Don't expose stack traces!
    };
  }
}

// ✅ GOOD - Generic error messages
@Catch()
export class GlobalExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    this.logger.error(exception); // Log internally
    return {
      message: 'An error occurred',
      code: exception.code,
    };
  }
}
```

**Security Headers:**

- Helmet.js configured?
- CORS properly restricted?
- CSP (Content Security Policy) set?

**Search for:**

- `NODE_ENV=development` in production
- Default admin passwords
- Enabled Swagger in production
- Missing helmet() middleware

---

### 1.6 A06:2021 - Vulnerable and Outdated Components

**Check for:**

- ❌ Outdated dependencies with known vulnerabilities
- ❌ Unused dependencies
- ❌ Dependencies from untrusted sources

**Run:**

```bash
npm audit
npm outdated
```

**Analyze results:**

- Critical vulnerabilities (fix immediately)
- High vulnerabilities (fix soon)
- Dependency tree depth (supply chain risk)

---

### 1.7 A07:2021 - Identification and Authentication Failures

**Check for:**

- ❌ Weak password requirements
- ❌ No account lockout after failed attempts
- ❌ Session IDs in URLs
- ❌ Missing multi-factor authentication
- ❌ Predictable session tokens

**Analyze:**

```typescript
// ❌ BAD - Weak password validation
@IsString()
password: string; // No strength requirement!

// ✅ GOOD - Strong password requirements
@IsString()
@MinLength(12)
@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
  message: 'Password must contain uppercase, lowercase, number, and special character',
})
password: string;
```

**JWT Security:**

```typescript
// ❌ BAD - Weak JWT configuration
jwt.sign(payload, 'secret', { expiresIn: '30d' }); // Long expiry!

// ✅ GOOD - Secure JWT
jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: '15m',
  algorithm: 'HS256',
});
```

**Search for:**

- Password fields without validation
- JWT tokens without expiration
- Sessions without timeout
- No CSRF protection

---

### 1.8 A08:2021 - Software and Data Integrity Failures

**Check for:**

- ❌ Unsigned/unverified packages
- ❌ Auto-deploy without CI/CD verification
- ❌ Insecure deserialization
- ❌ Missing integrity checks on updates

**Analyze:**

```typescript
// ❌ BAD - Unsafe deserialization
const obj = JSON.parse(userInput); // Can execute code in some scenarios

// ✅ GOOD - Validated deserialization
const schema = z.object({ /* define structure */ });
const obj = schema.parse(JSON.parse(userInput));
```

**Search for:**

- `JSON.parse()` on untrusted input without validation
- `eval()` or `Function()` with external data
- Package-lock.json committed and verified?

---

### 1.9 A09:2021 - Security Logging and Monitoring Failures

**Check for:**

- ❌ No logging of security events
- ❌ Logs with insufficient detail
- ❌ No alerting on suspicious activity
- ❌ Logs stored insecurely

**Analyze:**

```typescript
// ❌ BAD - No security logging
async login(dto: LoginDto) {
  return this.authService.login(dto); // Failed logins not logged!
}

// ✅ GOOD - Security event logging
async login(dto: LoginDto) {
  try {
    const result = await this.authService.login(dto);
    this.logger.log(`Successful login: ${dto.username}`);
    return result;
  } catch (error) {
    this.logger.warn(`Failed login attempt: ${dto.username}`);
    throw error;
  }
}
```

**Log checklist:**

- ✅ Failed login attempts
- ✅ Authorization failures
- ✅ Input validation failures
- ✅ Suspicious patterns (SQL injection attempts)
- ❌ Don't log passwords, tokens, or sensitive data

---

### 1.10 A10:2021 - Server-Side Request Forgery (SSRF)

**Check for:**

- ❌ User-controlled URLs in HTTP requests
- ❌ No URL validation/whitelist
- ❌ Internal network access from user input

**Analyze:**

```typescript
// ❌ BAD - SSRF vulnerable
async fetchUrl(@Body('url') url: string) {
  return axios.get(url); // User can access internal services!
}

// ✅ GOOD - URL validation
async fetchUrl(@Body('url') url: string) {
  const allowed = ['https://api.example.com'];
  const urlObj = new URL(url);

  if (!allowed.includes(urlObj.origin)) {
    throw new BadRequestException('URL not allowed');
  }

  return axios.get(url);
}
```

**Search for:**

- `axios.get(userInput)`
- `fetch(userInput)`
- HTTP requests with user-controlled URLs

---

## 2. Secrets Detection

**Scan for hardcoded secrets:**

### 2.1 Common Secret Patterns

Search codebase for:

- ❌ API keys: `api_key`, `apiKey`, `API_KEY`
- ❌ Passwords: `password =`, `pwd =`
- ❌ JWT secrets: `jwt.sign(*, 'secret')`
- ❌ Database URLs: `mongodb://user:pass@`
- ❌ AWS credentials: `AKIA[0-9A-Z]{16}`
- ❌ Private keys: `BEGIN PRIVATE KEY`
- ❌ OAuth tokens: `access_token`, `refresh_token`

### 2.2 Environment Variables

**Check `.env` files:**

```bash
# ❌ BAD - .env committed to git
git ls-files | grep '\.env$'

# ✅ GOOD - .env in .gitignore
.env
.env.local
.env.*.local
```

**Verify all secrets use environment variables:**

```typescript
// ❌ BAD - Hardcoded secret
const secret = 'my-secret-key-12345';

// ✅ GOOD - Environment variable
const secret = process.env.JWT_SECRET;

// ✅ BEST - With validation
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}
```

### 2.3 Git History

**Check for secrets in git history:**

```bash
# Search git history for potential secrets
git log -p | grep -i 'password\|secret\|api_key'
```

---

## 3. Input Validation

**Check all entry points:**

### 3.1 HTTP Controllers

**Verify DTOs have validation:**

```typescript
// ❌ BAD - No validation
export class CreateOrderDto {
  customerId: string; // No decorators!
  items: any[]; // Any type!
}

// ✅ GOOD - Comprehensive validation
export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  customerId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNumber()
  @Min(0)
  @Max(1000000)
  total: number;
}
```

### 3.2 Validation Gaps

**Search for:**

- Controllers without `ValidationPipe`
- DTOs without `class-validator` decorators
- Any type usage: `any`, `object`
- Missing sanitization on string inputs

---

## 4. Authentication & Authorization

### 4.1 Authentication Review

**Check:**

- ✅ Passport strategy configured correctly?
- ✅ JWT tokens properly validated?
- ✅ Password hashing uses bcrypt/argon2?
- ❌ Passwords stored in plain text?
- ❌ Session fixation vulnerabilities?

### 4.2 Authorization Review

**Check:**

- ✅ Guards applied to protected routes?
- ✅ Role-based access control implemented?
- ✅ Resource ownership verified?
- ❌ Missing authorization checks?
- ❌ Privilege escalation possible?

**Pattern to check:**

```typescript
// ❌ BAD - No guard
@Delete(':id')
async delete(@Param('id') id: string) {
  return this.service.delete(id); // Anyone can delete!
}

// ✅ GOOD - Guard + ownership check
@Delete(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'owner')
async delete(@Param('id') id: string, @User() user) {
  return this.service.delete(id, user.id);
}
```

---

## 5. Dependency Security

### 5.1 NPM Audit

Run security audit:

```bash
npm audit --json
```

**Analyze:**

- Critical: Fix immediately
- High: Fix within 1 week
- Medium: Fix within 1 month
- Low: Monitor and fix when convenient

### 5.2 Known Vulnerabilities

**Check:**

- `npm ls` for dependency tree
- Vulnerable packages identified
- Unused dependencies removed

---

## 6. Infrastructure Security

### 6.1 CORS Configuration

```typescript
// ❌ BAD - CORS wide open
app.enableCors({ origin: '*' }); // Any origin allowed!

// ✅ GOOD - Restricted CORS
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
});
```

### 6.2 Rate Limiting

```typescript
// ✅ Check ThrottlerModule configured
imports: [
  ThrottlerModule.forRoot({
    ttl: 60,
    limit: 10,
  }),
]
```

---

## Output Format

### 🔒 Security Score

**Overall:** 0-100%

- OWASP Compliance: X%
- Secrets Detection: Pass/Fail
- Input Validation: X%
- Authentication: X%
- Dependencies: X vulnerabilities

### 🚨 Critical Issues (Fix Immediately)

For each critical issue:

```
Severity: CRITICAL
Category: [OWASP Category]
Location: src/path/to/file.ts:line
Issue: [Description]
Impact: [Security impact]
Exploit: [How this can be exploited]
Fix: [Specific fix with code example]
```

### ⚠️ High Priority Issues

### 🔔 Medium Priority Issues

### 💡 Recommendations

### 📋 Compliance Checklist

- [ ] OWASP A01: Broken Access Control
- [ ] OWASP A02: Cryptographic Failures
- [ ] OWASP A03: Injection
- [ ] OWASP A04: Insecure Design
- [ ] OWASP A05: Security Misconfiguration
- [ ] OWASP A06: Vulnerable Components
- [ ] OWASP A07: Authentication Failures
- [ ] OWASP A08: Data Integrity Failures
- [ ] OWASP A09: Logging/Monitoring
- [ ] OWASP A10: SSRF

---

**Provide actionable security report with:**

- Specific file locations and line numbers
- Code examples showing vulnerabilities
- Fixed code examples
- Commands to run for remediation
- Priority ranking for fixes
