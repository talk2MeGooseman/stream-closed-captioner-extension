---
description: "GitHub Copilot instructions for stream-closed-captioner-extension - driven by actual codebase patterns"
applyTo: "**"
---

# Stream Closed Captioner Extension – GitHub Copilot Instructions

This file guides GitHub Copilot to generate code consistent with the established patterns, architecture, and standards of this project. **All guidance is based on actual patterns observed in the codebase.**

## Priority Guidelines When Generating Code

1. **Version Compatibility:** Respect the exact versions of React (19.0.0), Vite (4.3.5), Vitest (1.0.0), and other technologies in `package.json`
2. **Codebase Patterns First:** When patterns are unclear, scan the codebase for established examples before inventing new approaches
3. **Context Files:** Follow guidance in `.github/instructions/` (a11y, security, performance)
4. **Architectural Consistency:** Maintain the multi-entry Vite build, component-based Redux architecture, and folder organization
5. **Code Quality:** Prioritize **accessibility (WCAG 2.2 AA)**, **security (OWASP)**, **performance**, and **testability**

---

## Project Overview

**Stream Closed Captioner** is a React 19 Twitch extension that displays closed captions for viewers using a Vite-powered multi-entry build system.

- **Repository:** `talk2MeGooseman/stream-closed-captioner-extension`
- **Status:** Vite conversion complete; React 19 active
- **Architecture:** Component-based React frontend with Redux state management
- **Entry Points:** 5 independent HTML/JS bundles (main, config, live_config, mobile, video_overlay)

---

## Detected Technology Versions

**Language & Frameworks:**
- React 19.0.0 (latest, fully active)
- JavaScript with JSX syntax (no TypeScript)
- Redux (@reduxjs/toolkit 2.0.0) for state management
- Apollo Client 3.4.10 for GraphQL

**Build & Development:**
- Vite 4.3.5 (multi-entry build with rollupOptions)
- Vitest 1.0.0 (test runner with **globals enabled**)
- Babel 7.x (JSX/ES2022 transpilation)
- ESLint 8.57.0 with plugins: jsx-a11y, react, react-hooks, testing-library, vitest
- Prettier 2.3.2 (code formatting)
- PostCSS (Autoprefixer for vendor prefixes)

**UI & Styling:**
- React Testing Library 16.0.0 (RTL queries for component testing)
- Styled Components 5.0.0
- Blueprint JS 3.11.0 (UI component library)
- FontAwesome 5.x (SVG icons)

**Key Dependencies:**
- react-redux 9.0.0 (Redux bindings)
- react-draggable 4.1.0 (draggable components)
- ramda 0.27.1 (functional utilities)
- lodash 4.17.21 (common utilities)
- classnames 2.3.1 (conditional CSS classes)
- uuid 8.2.0 (unique ID generation)

**Important:** Vite uses Node polyfills via `vite-plugin-node-polyfills`. Code can use Node APIs in the browser context.

---

## Development Commands

```bash
yarn start        # Vite dev server on https://0.0.0.0:8080
yarn test         # Run all tests once (Vitest)
yarn test:watch   # Continuous test execution
yarn build        # Production build (creates dist/ with 5 bundles)
yarn lint         # ESLint check on src/
```

---

## Project Structure & Architecture

### Folder Organization

```
src/
├── components/          # Reusable React components
│   ├── [Component]/     # Each component in its own folder
│   │   ├── index.js     # REQUIRED: exports public API
│   │   ├── Component.jsx # Component implementation
│   │   ├── Component.css # Component styles (colocated)
│   │   └── __tests__/   # Tests colocated with component
│   └── shared/          # Shared utilities (caption-styles.js, etc.)
├── views/               # Entry-level screen components
├── redux/               # State management
│   ├── [domain]-slice.js # Redux slices organized by domain
│   ├── redux-helpers.js  # Custom hooks (useShallowEqualSelector)
│   ├── reducers/        # Root reducer composition
│   ├── selectors/       # Exported selectors
│   └── __tests__/       # Redux tests
├── hooks/               # Custom React hooks
│   ├── index.js         # Public API exports
│   ├── [hookName].js    # Individual hooks
│   └── __tests__/       # Hook tests
├── utils/               # Shared utilities
│   ├── apollo.js        # Apollo Client setup
│   ├── Authentication.js # Auth utilities
│   ├── Constants.js     # Global constants
│   ├── logger/          # Logging utilities
│   └── index.js         # Public API exports
├── fonts/               # Font assets
├── helpers/             # Domain helper functions
├── setupTests.jsx       # React Testing Library setup
└── mockSetupTests.js    # Global Vitest mocks
```

### Multi-Entry Build System

Vite is configured to produce 5 independent bundles:

```javascript
// vite.config.js rollupOptions
{
  main: 'index.html',           // Main extension
  config: 'config.html',        // Config panel
  liveConfig: 'live_config.html', // Live config
  mobile: 'mobile.html',        // Mobile view
  videoOverlay: 'video_overlay.html' // Overlay
}
```

**Rule:** Entry points are at the project root. Reference them as relative paths.

---

## Code Patterns by Type

### 1. Index Files (Public API Definition)

**REQUIRED for every component, hook, and utility folder.**

```javascript
// src/components/Captions/index.js
export { default as ClosedCaption } from './ClosedCaption.jsx'
export { default as MobileClosedCaption } from './MobileClosedCaption.jsx'

// src/hooks/index.js
export { useCaptionsHandler } from './useCaptionsHandler'
export { useTwitchAuth } from './useTwitchAuth'
```

**Rule:** Always import from index.js, never from nested files.
- ✅ `import { ClosedCaption } from '@/components/Captions'`
- ❌ `import { ClosedCaption } from '@/components/Captions/ClosedCaption.jsx'`

---

### 2. Component Patterns

**File Structure:**
```
src/components/Captions/
├── index.js              # Exports component
├── ClosedCaption.jsx     # Component implementation
├── ClosedCaption.css     # Colocated styles
├── MobileClosedCaption.jsx
├── helpers.js            # Component-specific helpers
└── __tests__/
    ├── ClosedCaption.test.jsx
    └── MobileClosedCaption.test.jsx
```

**Component Pattern - Observed from ClosedCaption.jsx:**
```javascript
import { useCallback } from 'react'
import Draggable from 'react-draggable'
import { useDispatch } from 'react-redux'

import {
  Captions,
  CaptionsContainer,
  CaptionText,
} from '../shared/caption-styles'
import { useShallowEqualSelector } from '@/redux/redux-helpers'
import { setIsDragged } from '@/redux/settings-slice'
import { FONT_FAMILIES } from '@/utils/Constants'
import { pathOr } from 'ramda'

import './ClosedCaption.css'

function ClosedCaption() {
  const dispatch = useDispatch()
  const configSettings = useShallowEqualSelector(
    (state) => state.configSettings,
  )
  const { interimText, finalTextQueue, translations } = useShallowEqualSelector(
    (state) => state.captionsState,
  )

  const onDragged = useCallback(() => dispatch(setIsDragged()), [dispatch])

  // Component logic...
  return <CaptionsContainer>{/* JSX */}</CaptionsContainer>
}

export default ClosedCaption
```

**Key Patterns:**
- Functional components only (no class components)
- `useShallowEqualSelector` for Redux (prevents re-renders)
- `useCallback` for memoized event handlers
- CSS imported directly into component
- Ramda utility functions (`pathOr`, `prop`) for safe access
- `@/` path alias for all internal imports

---

### 3. Redux State Management

**Organization:** One slice per domain/feature.

**Existing Domains:**
- `captions-slice.js` - Caption text, translations, subscriptions
- `settings-slice.js` - User settings (font, size, colors)
- `products-slice.js` - Twitch bits/products
- `translation-slice.js` - Translation state
- `video-player-context-slice.js` - Video context (latency, etc.)

**Redux Slice Pattern - from captions-slice.js:**
```javascript
import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'

const initialState = {
  finalTextQueue: [],
  interimText: '',
  translations: {},
  captionsSubscription: null,
}

const captionsSlice = createSlice({
  initialState,
  name: 'captionsSlice',
  reducers: {
    setCaptionsSubscription: (state, { payload: { subscription } }) => {
      state.captionsSubscription = subscription
    },
    updateCCText(state, action) {
      state.interimText = action.payload.interim

      const lastText = state.finalTextQueue[state.finalTextQueue.length - 1] || {}

      if (lastText.text !== action.payload.final) {
        state.finalTextQueue.push({ id: uuid(), text: action.payload.final })

        if (state.finalTextQueue.length > TEXT_QUEUE_SIZE) {
          state.finalTextQueue.shift()
        }
      }
    },
  },
})

export const { setCaptionsSubscription, updateCCText } = captionsSlice.actions
export default captionsSlice.reducer
```

**Selectors Pattern:**
```javascript
// src/redux/selectors/index.js
export const selectCaptions = (state) => state.captionsState
export const selectSettings = (state) => state.configSettings
```

**Custom Hook Pattern - redux-helpers.js:**
```javascript
import { useSelector, shallowEqual, useDispatch } from 'react-redux'

export function useShallowEqualSelector(selector) {
  return useSelector(selector, shallowEqual)  // Prevents re-renders
}

export function useReduxCallbackDispatch(action) {
  const dispatch = useDispatch()
  return useCallback(() => dispatch(action), [dispatch, action])
}
```

---

### 4. Custom Hooks

**Naming:** `use[Feature]` pattern.

**Hook Pattern - from useCaptionsHandler.js:**
```javascript
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { updateCCText } from '../redux/captions-slice'
import { useShallowEqualSelector } from '../redux/redux-helpers'
import { SECOND } from '../utils/Constants'

export function useCaptionsHandler() {
  const dispatch = useDispatch()
  const videoPlayerContext = useShallowEqualSelector(
    (state) => state.videoPlayerContext,
  )

  const onUpdateCCText = useCallback(
    (state) => dispatch(updateCCText(state)),
    [dispatch],
  )

  const displayClosedCaptioningText = useCallback(
    (message) => {
      const { hlsLatencyBroadcaster } = videoPlayerContext
      let delayTime = hlsLatencyBroadcaster * SECOND

      if (message.delay) {
        delayTime -= message.delay * SECOND
      }

      setTimeout(() => {
        onUpdateCCText(message)
      }, delayTime)
    },
    [onUpdateCCText, videoPlayerContext],
  )

  return useCallback(
    (target, contentType, message) => {
      let parsedMessage = null
      try {
        parsedMessage = JSON.parse(message)
      } catch (error) {
        parsedMessage = { interim: message }
      }
      displayClosedCaptioningText(parsedMessage)
    },
    [displayClosedCaptioningText],
  )
}
```

**Key Patterns:**
- Extensive use of `useCallback` for memoization
- All dependencies included in dependency arrays
- Hooks handle business logic, dispatch Redux actions
- Most hooks either dispatch actions or read from Redux state
- Return functions or data

---

### 5. Testing Patterns

**Test Framework:** Vitest 1.0.0 with globals enabled (no imports needed).

**Setup Files:**
- `src/setupTests.jsx` - React Testing Library + Redux provider
- `src/mockSetupTests.js` - Global mocks for APIs

**Hook Test Pattern - from useCaptionsHandler.test.jsx:**
```javascript
import { screen, fireEvent } from '@testing-library/react'
import { useDispatch } from 'react-redux'
import { beforeEach, afterEach, describe, test, expect, vi } from 'vitest'

import { useCaptionsHandler } from '../useCaptionsHandler'
import { renderWithRedux } from '@/setupTests'

describe('useCaptionsHandler', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  const TestComponent = () => {
    const handler = useCaptionsHandler()
    const onMessage = (e) => {
      handler(null, null, e.target.value)
    }

    return (
      <label>
        Caption Message
        <input onChange={onMessage} type="text" />
      </label>
    )
  }

  test('receive a message and delay it by HLS timing', () => {
    vi.spyOn(global, 'setTimeout')
    renderWithRedux(<TestComponent />)

    const messageInput = screen.getByLabelText('Caption Message')
    fireEvent.change(messageInput, { target: { value: 'A' } })

    expect(setTimeout).toHaveBeenCalled()
  })
})
```

**Redux Slice Test Pattern - from settingsSlice.test.js:**
```javascript
import settings, { updateBroadcasterSettings, initialState } from '../settings-slice'
import { CAPTIONS_SIZE } from '@/utils/Constants'

describe('settingsSlice', () => {
  test('should handle initial state', () => {
    expect(settings(undefined, {})).toStrictEqual(initialState)
  })

  describe('updateBroadcasterSettings', () => {
    test('width is properly set when broadcaster chooses box size', () => {
      expect(
        settings(
          {},
          {
            payload: { ccBoxSize: true },
            type: updateBroadcasterSettings.type,
          },
        ),
      ).toStrictEqual({
        captionsWidth: CAPTIONS_SIZE.defaultBoxWidth,
        ccBoxSize: true,
      })
    })
  })
})
```

**Test Organization:**
- Colocated in `__tests__/` folders next to implementation
- Use `renderWithRedux` helper for component tests with Redux
- Use React Testing Library queries: `getByRole`, `getByLabelText`, `getByText`
- Mock timers and global functions with `vi`
- Clean up after each test

---

### 6. Import Organization

**Standard Pattern - Observed Throughout Codebase:**

```javascript
// 1. External libraries (React, Redux, third-party)
import { useCallback } from 'react'
import Draggable from 'react-draggable'
import { useDispatch } from 'react-redux'

// 2. Internal components/hooks/utilities (using @/ alias)
import {
  Captions,
  CaptionsContainer,
  CaptionText,
} from '../shared/caption-styles'
import { useShallowEqualSelector } from '@/redux/redux-helpers'
import { setIsDragged } from '@/redux/settings-slice'
import { FONT_FAMILIES } from '@/utils/Constants'
import { pathOr } from 'ramda'

// 3. Styles (always last)
import './ClosedCaption.css'
```

**Rules:**
- Always use `@/` alias for imports from `src/`
- Never import from nested files without going through index.js
- External libs first, internal second, styles last

---

### 7. Naming Conventions

**Components:** PascalCase matching file name
- ✅ `ClosedCaption.jsx`, `ConfigPage.jsx`, `VideoOverlay.jsx`

**Hooks:** camelCase with `use` prefix
- ✅ `useCaptionsHandler`, `useTwitchAuth`, `useTwitchBits`

**Redux:**
- Actions: `setCaptionsSubscription`, `updateCCText`
- Slices: `captionsSlice`, `settingsSlice`
- Selectors: `selectCaptions`, `selectSettings`

**Constants:** UPPER_SNAKE_CASE (in `src/utils/Constants.js`)
- ✅ `FONT_FAMILIES`, `TEXT_QUEUE_SIZE`, `SECOND`

**Variables/Functions:** camelCase
- ✅ `configSettings`, `finalTextQueue`, `onDragged`, `getTranslationQueue()`

**CSS classes:** kebab-case
- ✅ `.captions-container`, `.caption-text`

---

### 8. Utility Libraries

**Ramda** (functional programming):
```javascript
import { pathOr, prop, filter, map } from 'ramda'

const queue = pathOr([], ['viewerLanguage', 'textQueue'], translations)
const value = prop('key', object)
```

**Lodash**:
```javascript
import { debounce, throttle } from 'lodash'
```

**classnames** (conditional CSS):
```javascript
import classNames from 'classnames'
<div className={classNames('caption', { 'is-hidden': isHidden })}>
```

**UUID** (unique IDs):
```javascript
import { v4 as uuid } from 'uuid'
const id = uuid()
```

---

## ESLint & Code Quality Standards

### Enabled Plugins
- `eslint-plugin-jsx-a11y` - Accessibility enforcement
- `eslint-plugin-react` - React best practices
- `eslint-plugin-react-hooks` - Hook dependencies
- `eslint-plugin-testing-library` - RTL best practices
- `eslint-plugin-vitest` - Test best practices
- `eslint-plugin-prettier` - Auto-formatting

**Rules:** ESLint violations must be fixed, not disabled.

**When Disabling:** Include justification comment
```javascript
// ❌ Wrong
// eslint-disable-next-line complexity

// ✅ Correct
// eslint-disable-next-line complexity
// Multiple caption language states require complex conditional logic
function updateCCText(state, action) {
  // ...
}
```

---

## Accessibility: WCAG 2.2 Level AA (Non-Negotiable)

**Refer to:** `.github/instructions/a11y.instructions.md` for complete requirements.

### Keyboard Accessibility
- **All interactive elements must be operable via keyboard** (Tab, Shift+Tab, Enter, Escape)
- **Focus is always visible** with at least 3:1 contrast against adjacent colors
- **Tab order follows reading order** (logical, predictable flow)
- **No keyboard traps** (focus can always move away)
- **Static content is not tabbable** (no `tabindex="0"` on non-interactive elements)

### Semantic HTML
- Use landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`
- Use semantic elements: `<button>`, `<input>`, `<label>`, `<select>`
- Exactly one `<h1>` per page for main topic
- Never skip heading levels (h1 → h2 → h3, not h1 → h3)

### Labels & ARIA
- **Every form control has a programmatic label** via `<label for="...">` or `aria-labelledby`
- Use `aria-label` for unlabeled controls
- Use `aria-required="true"` for required fields
- Use `aria-invalid="true"` for invalid fields with error messages

### Color & Contrast
- **Text contrast ≥ 4.5:1** (large text ≥ 3:1)
- **Focus indicators ≥ 3:1** against adjacent colors
- **Never rely on color alone** to convey information (use text or icons too)
- **Avoid `opacity`/`rgba` for text** – use solid colors for guaranteed contrast

### Images & Graphics
- **Informative images:** meaningful `alt` text
- **Decorative images:** `alt=""` or `aria-hidden="true"`
- **SVG icons:** `role="img"` with `aria-label`

### Common Mistakes to Avoid
- ❌ Using `<div>` with ARIA when `<button>`, `<input>`, etc. exist
- ❌ Hiding content with `display: none` while keeping it focusable
- ❌ Inline styles with `opacity` for text (breaks contrast math)
- ❌ Relying on color alone (error in red, success in green)
- ❌ Skipping heading levels
- ❌ Focus indicators with insufficient contrast

---

## Security & OWASP Best Practices

**Refer to:** `.github/instructions/security-and-owasp.instructions.md` for detailed guidance.

### Critical Rules (MUST FOLLOW)

**1. Secrets Management**
- Never hardcode API keys, tokens, or connection strings
- Load from `process.env.*`
- Document sensitive environment variables in comments

```javascript
// ✅ CORRECT
const twitchApiKey = process.env.REACT_APP_TWITCH_API_KEY
// TODO: Ensure REACT_APP_TWITCH_API_KEY is configured in .env

// ❌ WRONG
const twitchApiKey = 'sk_live_12345abcde'
```

**2. Input Validation**
- Validate all user-provided URLs (prevent SSRF)
- Sanitize HTML before rendering with `.innerHTML`
- Use `.textContent` instead of `.innerHTML` when possible

```javascript
// ✅ CORRECT
element.textContent = userProvidedText

// ❌ RISKY (requires sanitization)
element.innerHTML = userProvidedHtml  // Use DOMPurify first
```

**3. Database & API Queries**
- Use parameterized queries (Redux/Apollo handle this)
- Never concatenate user input into queries
- Validate against expected types

**4. Authentication & Authorization**
- Follow Twitch OAuth patterns in `src/utils/Authentication.js`
- Enforce least-privilege access control
- Never log sensitive user data

**5. Dependency Security**
- Keep dependencies up-to-date
- Run `npm audit` or `yarn audit` regularly
- Check `package.json` for known vulnerabilities

---

## Performance Optimization Patterns

**Refer to:** `.github/instructions/performance-optimization.instructions.md` for complete guidance.

### React Optimization

**Memoization with useCallback:**
```javascript
// ✅ Prevents function recreation on every render
const onDragged = useCallback(() => dispatch(setIsDragged()), [dispatch])
```

**Shallow Equality Selector:**
```javascript
// ✅ Prevents unnecessary re-renders from Redux
const configSettings = useShallowEqualSelector(
  (state) => state.configSettings,
)
```

**Component Memoization:**
```javascript
// ✅ Prevents re-render if props unchanged
const MemoizedComponent = React.memo(Component)
```

### Redux Optimization
- Use `useShallowEqualSelector` custom hook (not `useSelector`)
- Memoize selectors to prevent recalculation
- Avoid creating new objects in selectors

### CSS & Animation
- Prefer CSS animations over JavaScript
- Use GPU-accelerated properties: `transform`, `opacity`
- Minimize DOM manipulations in loops

### Code Splitting
- Vite automatically splits vendor code
- Use `React.lazy` and `Suspense` for route-based splitting
- Import only what you need (tree-shaking works with `import` statements)

### Performance Checklist
- [ ] No unnecessary re-renders (use memoization patterns)
- [ ] Import only needed dependencies (avoid `import *`)
- [ ] CSS animations used for UI transitions
- [ ] No DOM manipulation in loops
- [ ] Event handlers are memoized with `useCallback`
- [ ] Redux selectors use `shallowEqual`

---

## Common Development Pitfalls

### ❌ DON'T Do This

1. **Hardcode API Keys or Secrets**
   ```javascript
   const apiKey = 'sk_live_12345'  // Never!
   ```

2. **Use Array Indices as React Keys**
   ```javascript
   {data.map((item, index) => <div key={index}>{item}</div>)}  // Wrong!
   ```

3. **Skip Dependency Arrays in Hooks**
   ```javascript
   useCallback(() => {}, [])  // Missing dependencies!
   ```

4. **Import from Nested Files**
   ```javascript
   import { ClosedCaption } from '@/components/Captions/ClosedCaption.jsx'  // Wrong!
   ```

5. **Disable ESLint Rules Without Comments**
   ```javascript
   // eslint-disable-next-line  // No explanation!
   ```

6. **Skip Tests for Components**
   ```javascript
   // Added a new interactive component but no tests – wrong!
   ```

### ✅ DO This Instead

1. **Use Environment Variables**
   ```javascript
   const apiKey = process.env.REACT_APP_API_KEY
   ```

2. **Use Stable Or Meaningful Keys**
   ```javascript
   {data.map((item) => <div key={item.id}>{item}</div>)}
   ```

3. **Include All Dependencies**
   ```javascript
   useCallback(() => {}, [dispatch, videoPlayerContext])
   ```

4. **Import from Index.js**
   ```javascript
   import { ClosedCaption } from '@/components/Captions'
   ```

5. **Explain Rule Disabling**
   ```javascript
   // eslint-disable-next-line complexity
   // Complex reducer handles multiple translation states
   ```

6. **Write Tests for New Features**
   ```bash
   yarn test:watch  # Keep tests running while developing
   ```

---

## Context Engineering for Copilot

### How to Get Better Code Suggestions

1. **Keep Related Files Open in Tabs**
   - Copilot uses open files as context signals
   - Working on captions? Open caption components, Redux slices, hooks

2. **Position Cursor Strategically**
   - Cursor location influences suggestion quality
   - Place it where context matters most

3. **Use Copilot Chat for Complex Changes**
   - Inline completions have minimal context
   - Chat mode sees more files and understands better

4. **Reference Specific Examples**
   - "Follow the pattern in `useCaptionsHandler.js`"
   - "Like the component in `src/components/Captions/ClosedCaption.jsx`"

5. **Be Explicit About Requirements**
   - "Make this accessible (WCAG 2.2 AA)"
   - "Include tests using React Testing Library"
   - "Use the `@/` path alias for all imports"

---

## Before Committing Code

### Quality Gates Checklist

- [ ] **Tests Pass:** `yarn test`
- [ ] **Lint Passes:** `yarn lint` (ESLint + Prettier)
- [ ] **Build Succeeds:** `yarn build`
- [ ] **Accessibility Verified:**
  - [ ] Tab navigation works
  - [ ] Focus is always visible
  - [ ] No keyboard traps
  - [ ] Color contrast ≥ 4.5:1
  - [ ] ARIA labels present where needed
- [ ] **Security Reviewed:**
  - [ ] No hardcoded secrets
  - [ ] Input validated where needed
  - [ ] No XSS vulnerabilities
- [ ] **Performance Checked:**
  - [ ] No unnecessary re-renders
  - [ ] Dependencies properly included
  - [ ] No memory leaks from event listeners

### Pre-Commit Commands
```bash
# Run full test suite
yarn test

# Run linter
yarn lint

# Build for production
yarn build

# Verify no build errors
```

---

## Memory Bank & Task Tracking

The `memory-bank/` folder contains project context:

- `projectbrief.md` - Project goal and scope
- `systemPatterns.md` - Architecture and conventions
- `techContext.md` - Technology versions and setup
- `activeContext.md` - Current focus and recent decisions
- `progress.md` - Completed work and remaining tasks
- `tasks/_index.md` - Task tracking index
- `tasks/TASKID-name.md` - Individual task documentation

**Before Starting Work:**
1. Read memory bank to understand current state
2. Check task index for active work
3. Review `activeContext.md` for recent decisions
4. Update memory bank when making significant changes

---

## Getting Help

### Reference Files

**Custom Instructions (`.github/instructions/`):**
- `a11y.instructions.md` - WCAG 2.2 AA compliance
- `security-and-owasp.instructions.md` - Secure coding
- `performance-optimization.instructions.md` - Performance best practices
- `reactjs.instructions.md` - React conventions
- `context-engineering.instructions.md` - Copilot effectiveness
- `copilot-instructions.md` - This file!

**Key Project Files:**
- `package.json` - Dependencies and scripts
- `vite.config.js` - Build configuration
- `vitest.config.js` - Test configuration
- `.eslintrc` - ESLint rules
- `jsconfig.json` - Path aliases

**Memory Bank:**
- `memory-bank/projectbrief.md` - Project purpose
- `memory-bank/activeContext.md` - Current work
- `memory-bank/systemPatterns.md` - Architecture

---

## Final Checklist for Code Generation

When asking Copilot to generate code, ensure:

### Component Checklist
- [ ] Folder structure: `src/components/[Name]/`
- [ ] Index file exports public API
- [ ] Component file is JSX with functional syntax
- [ ] CSS file colocated with component
- [ ] Tests in `__tests__/[Name].test.jsx`
- [ ] Accessible (keyboard operable, proper labels, contrast ≥ 4.5:1)
- [ ] Uses `@/` path alias for imports
- [ ] Uses `useShallowEqualSelector` for Redux
- [ ] Uses `useCallback` for memoized handlers

### Hook Checklist
- [ ] Named with `use[Feature]` pattern
- [ ] Exported from `src/hooks/index.js`
- [ ] Tests in `src/hooks/__tests__/`
- [ ] All dependencies in dependency arrays
- [ ] Uses `useCallback` for memoization
- [ ] Dispatches Redux actions or reads state

### Redux Checklist
- [ ] Slice file in `src/redux/[domain]-slice.js`
- [ ] Exports actions and reducer
- [ ] Selectors defined in `src/redux/selectors/`
- [ ] Tests in `src/redux/__tests__/`
- [ ] Follows Redux Toolkit patterns
- [ ] Immutable state updates

### Test Checklist
- [ ] Colocated with implementation in `__tests__/`
- [ ] Uses React Testing Library queries
- [ ] Includes accessibility tests
- [ ] Mocks external dependencies
- [ ] Cleans up after each test (`afterEach`)
- [ ] Descriptive test names

---

## Summary

This codebase prioritizes **accessibility**, **security**, **performance**, and **code consistency**. All patterns are based on what actually exists in the codebase. Follow these principles:

1. **Always check existing code** for similar patterns before inventing new ones
2. **Index.js files define public APIs** – import from them, not nested files
3. **Tests are required** for new components and hooks
4. **Accessibility is non-negotiable** – WCAG 2.2 AA compliance is mandatory
5. **Security first** – no hardcoded secrets, validate all inputs
6. **Performance matters** – memoize expensive computations and callbacks
7. **Use the `@/` path alias** for all internal imports
8. **Follow naming conventions** (PascalCase for components, camelCase for functions)

When in doubt about a pattern, **scan the codebase for examples**, open them in tabs, and ask Copilot Chat for guidance with concrete examples.
