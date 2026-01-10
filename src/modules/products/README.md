# ⚠️ WARNING: Products Module - Known Clean Architecture Violations

> **DO NOT USE THIS MODULE AS A REFERENCE FOR CLEAN ARCHITECTURE**

## 🔴 Status: NOT PRODUCTION READY

This module contains **11 documented violations** of Clean Architecture principles and is kept for educational purposes only.

---

## 📋 Known Issues

### Critical Violations

1. **Cross-Module Dependencies** (8 violations)
   - Imports from `@modules/order` throughout all layers
   - Violates bounded context separation

2. **Not a Real Products Module**
   - Files named `order.*` instead of `product.*`
   - Manages Orders, not Products
   - Copy-paste from Order module

3. **Violates Layer Boundaries** (All layers affected)
   - Domain imports from other modules
   - Application imports domain from other modules
   - Infrastructure imports adapters from other modules

---

## ✅ Use This Instead

For a **correct implementation** of Clean Architecture, refer to:

```bash
src/modules/order/  # ✅ GOOD EXAMPLE
├── domain/         # Pure business logic
├── application/    # Use cases with ports
├── adapters/       # Repository implementations
└── infrastructure/ # NestJS DI wiring
```

---

## 📄 Full Audit Report

See: `PRODUCTS_MODULE_AUDIT.md` in project root for complete details.

---

## 🎯 Recommendations

**If you need a Products module:**

1. **DO NOT** copy this module
2. **DO** follow the pattern from `src/modules/order/`
3. Create proper domain entities:
   - `Product.ts` (aggregate root)
   - `ProductCategory.ts` (value object)
   - `ProductCreated.ts` (domain event)

**If this is a template/example:**

- Consider removing this module
- Or rename to indicate it's a bad example

---

**Last Updated:** 2026-01-10
**Audit Status:** Documented but not fixed
