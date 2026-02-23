---
name: Dependabot Compatibility Analyzer
on: workflow_dispatch
description: |
  Analyzes all open Dependabot pull requests for dependency compatibility risks
  and recommends code changes to ensure project compatibility with new versions.
  This workflow is manually invoked and uses AI to assess the impact of dependency
  updates on the project. It provides detailed compatibility assessments and
  recommends specific code changes needed for each dependency update.

permissions:
  contents: read
  pull-requests: read

engine: copilot

---

# Dependabot Compatibility Analyzer

## Objective
Analyze all open Dependabot pull requests to:
1. Identify potential compatibility issues with the new dependency versions
2. Assess the risk level (critical, high, medium, low)
3. Review the dependency changes and their impact on the project
4. Recommend specific code changes needed for compatibility
5. Identify breaking changes or API modifications
6. Suggest migration path if version has significant changes
7. Provide guidance on testing strategy

## Input Variables
- `analyze_type`: Type of analysis (all, critical-only, or package-specific)
- `specific_package`: Package name when analyzing a specific dependency

## Key Tasks

### 1. Fetch Dependabot PRs
Use the GitHub API to find all open pull requests created by Dependabot.
For each PR:
- Extract the package name and version changes
- Get the PR description and linked dependencies
- Note any breaking change markers or release notes links

### 2. Review Project Context
Understand the project structure:
- This is a Twitch extension using React 19, Vite 4.3.5, and Vitest 1.0.0
- Key dependencies: @reduxjs/toolkit 2.0.0, Apollo Client 3.4.10, styled-components 5.0.0
- The project has accessibility (WCAG 2.2 AA) and security (OWASP) requirements
- Multi-entry Vite build system with Redux state management

### 3. Analyze Each Dependency Change
For each Dependabot PR, analyze:

**Compatibility Assessment:**
- Check if the new version introduces breaking changes
- Identify deprecated APIs or removed functionality
- Look for peer dependency requirements
- Note any license changes

**Risk Level Determination:**
- **Critical**: Breaking changes affecting core functionality or build system
- **High**: API changes requiring code modifications
- **Medium**: Non-breaking updates with behavioral changes
- **Low**: Patch updates and minor improvements

**Impact Analysis:**
- Impacts on React components and hooks
- Effects on Redux state management
- Build/dev tooling changes
- Accessibility or security implications
- Changes to testing setup or dependencies

### 4. Recommend Code Changes
For each PR with detected compatibility issues:

**Provide:**
- Specific files that need modification
- Exact code changes needed (with before/after examples)
- Import path changes if APIs moved
- Configuration changes needed
- Test updates required
- Migration order if multiple PRs have dependencies on each other

**Include:**
- Links to official migration guides
- References to release notes for detailed information
- Common pitfalls to avoid
- Testing recommendations

### 5. Summary Report
Create a comprehensive summary showing:
- Total Dependabot PRs analyzed
- Breakdown by risk level (critical/high/medium/low)
- PRs requiring code changes vs. safe to merge directly
- Recommended merge order for interdependent updates
- Overall compatibility status

## Analysis Guidelines

### For Each PR:
1. **Version Range**: Understand the version change (patch, minor, major)
2. **Release Notes**: Review official changelog for breaking changes
3. **Package Type**:
   - Build tools → May need config changes
   - UI libraries → May affect components
   - Type definitions → Update imports/types
   - Dev dependencies → May not need code changes
4. **Integration Points**: Check where the package is used in the codebase
5. **Type Safety**: For packages affecting types, check TypeScript compatibility

### Code Change Examples:
- Updated import paths: `import X from 'old-path'` → `import X from 'new-path'`
- API changes: `oldMethod()` → `newMethod()` with parameter adjustments
- Config changes: Updates to .js, .json, or .yml configuration files
- Hook changes: Updates to React hooks or custom hooks usage

### Special Considerations:
- **Accessibility**: Ensure no changes break WCAG 2.2 AA compliance
- **Security**: Check for security-related changes or new requirements
- **Performance**: Note any performance improvements or regressions
- **Testing**: Identify necessary test updates or new test coverage

## Output Format
For each analyzed PR, provide:
```
## PR: [PR Title] (#[PR Number])

### Dependency Change
- **Package**: [name]
- **Version**: [old] → [new]
- **Type**: [build-tool/ui-library/babel-plugin/etc]

### Risk Level: [CRITICAL/HIGH/MEDIUM/LOW]

### Breaking Changes
- [List any breaking changes]

### Impact Assessment
- [Describe impact on the project]

### Required Code Changes
1. File: `[path]`
   - Change: [Description]
   - Before: [Old code]
   - After: [New code]

2. File: `[path]`
   ...

### Testing Recommendations
- [Testing strategy for this update]

### Migration Notes
- [Any special considerations or migration guides]

### Safe to Merge?: [YES/NO]
- [Rationale]
```

## Instructions for the AI Agent

You are analyzing Dependabot pull requests with expertise in:
- React ecosystem and modern tooling
- Vite build system and its plugins
- Redux state management
- Dependency versioning and semver
- Breaking changes and API migrations
- Accessibility standards (WCAG 2.2 AA)
- Security best practices (OWASP)

**Process:**
1. Fetch all open PRs created by Dependabot
2. For each PR, analyze the dependency changes thoroughly
3. Assess compatibility risk and required changes
4. Provide actionable recommendations
5. Generate a summary report showing all findings

**Focus Areas:**
- Will the new version work with existing code?
- Are there APIs that need to be updated?
- Does this affect the build process?
- Are there security implications?
- Will this impact accessibility compliance?
- Are there configuration changes needed?

Be thorough but concise. Prioritize critical issues. Provide specific, actionable recommendations.
