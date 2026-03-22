# Technical Architecture & Systems Design
### Wallex - AI-Powered Financial Management

## 1. System Topology Overview

Wallex abandons standard monolithic or complex multi-container approaches in favor of a highly optimized, decoupled two-tier architecture injected with third-party Generative AI. 

The architecture entirely revolves around high-speed API execution, strict interface contracts (TypeScript/Zod), and aggressive client-side network abstraction.

```text
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer (Vercel)                  │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐  │
│  │ Framer Motion  │  │   React 18     │  │ Custom Hook   │  │
│  │ (Animations)   │  │  (Components)  │  │  (useApi)     │  │
│  └────────────────┘  └────────────────┘  └───────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │ (Axios HTTP /w Credentials)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 Node.js REST API Layer (Render)             │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐  │
│  │  Zod Schemas   │  │ Express Router │  │  CookieParser │  │
│  │  (Validation)  │  │   (Routing)    │  │  (Auth Guard) │  │
│  └────────────────┘  └───────┬────────┘  └───────────────┘  │
└──────────────────────────────┼──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
 ┌────────────────────┐                ┌─────────────────────┐
 │   MongoDB Atlas    │                │  Google AI Studio   │
 │   (NoSQL Cloud)    │                │    (Gemini LLM)     │
 └────────────────────┘                └─────────────────────┘
```

---

## 2. Infrastructure Evolution (Phase X Shift)

**Deprecation of Python Microservice:**
Initially, the architecture proposed a heavy Python (FastAPI) Docker container housing scikit-learn models for transaction categorization. 
* **The Refactor**: To significantly reduce cloud consumption costs, latency, and operational overhead, the ML-Service was entirely stripped out. Node.js now directly communicates with the `gemini-1.5-flash` LLM model via the `@google/genai` official SDK. 

---

## 3. Security & Authentication Posture

Authentication uses an enterprise-grade Zero-Trust model designed to mitigate Cross-Site Scripting (XSS) attacks entirely.

1. **The Attack Vector Solved**: Traditional apps expose JWT access tokens in the browser's `localStorage` or `sessionStorage`. If an attacker executes javascript (XSS) on the page, they can invisibly steal the token out of localStorage and compromise the session forever.
2. **The Wallex Solution**: 
   - Backend `auth.js` intercepts successful logins and writes the JWT directly onto the HTTP Response Header via `res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' })`.
   - The React frontend receives this response and never touches the token via Javascript. The modern browser implicitly locks the cookie into its vault.
   - For all future requests, the Axios interceptor utilizing `withCredentials: true` tells the browser to automatically attach the locked cookie to the outgoing payload.

---

## 4. Frontend State Abstraction (`useApi`)

To prevent complex prop-drilling or large Redux implementations, asynchronous data fetching across the app operates through a singular Custom Hook engine mimicking the behavior of React Query.

```typescript
// Pattern utilized across all Wallex Pages
export function useApi<T>(apiFunc: (...args: any[]) => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: any[]) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunc(...args);
      setData(result);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  return { data, setData, loading, error, execute };
}
```

---

## 5. Domain Models (Database Schema)

Strict Data Transfer Objects (DTOs) match exactly between Mongoose constraints and TypeScript generic interfaces.

### `User` Collection
Stores both Student and Parent personas, allowing mapping through `linkedUserIds` for nested permission controls.
- `role`: "student" | "parent"
- `email`: Indexed, Unique string
- `segment`: Tracking metric denoting "high-earner", "low-income", etc.
- `onboardingData`: Form constraints initialized at first login.

### `Transaction` Collection
The backbone of the application. Supports the AI Categorization pipeline.
- `amount`: Number (Float allowed strictly)
- `category`: String (Assigned via Gemini LLM or user overwrite)
- `confidence`: Number (AI rating measuring accuracy of categorization)

### `Goal` Collection
Tracks independent micro-saving pots.
- `targetAmount`: Number (Final finish line)
- `currentAmount`: Number (Total saved)
- `progress`: Calculated dynamically via `formatters.ts` unit-tested utility module using `(currentAmount / targetAmount) * 100`.

---

## 6. Testing Pipeline
The frontend relies heavily on **Vitest** for isolated algorithm calculation validation. 
- Validation scripts located in `Frontend/utils/formatters.test.ts`. 
- Tests guarantee application integrity by attempting to force mathematically impossible states (e.g. dividing by zero on Goal completion percentage rendering) and verifying fallback return values to prevent total React unmounting.
