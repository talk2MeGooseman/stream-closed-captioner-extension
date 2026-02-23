---
name: Dependabot Compatibility Review

description: |
  Reviews dependabot pull requests to assess compatibility risk and recommend
  code changes to ensure project compatibility with new dependency versions.

on:
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: read
  issues: read
  pull-requests: read

engine: copilot

tools:
  github:
    toolsets: [pull_requests, default]
  bash:
    - "gh"
    - "jq"

safe-outputs:
  add-comment:
    max: 3

strict: true

network:
  allowed:
    - defaults
    - npm

---

# Dependabot Compatibility Review

You are analyzing a dependency update pull request from dependabot. Your task is to assess the compatibility risk and recommend necessary code changes.

## Objective

Review the dependency changes in pull request #${{ github.event.pull_request.number }} and:

1. **Identify Breaking Changes**: Analyze the dependency version bump to identify any breaking changes or API deprecations
2. **Assess Compatibility Risk**: Determine the level of risk (low, medium, high) for the project
3. **Detect Code Impacts**: Identify which parts of the codebase may need updates
4. **Recommend Changes**: Provide specific code changes needed to ensure compatibility

## Analysis Steps

### Step 1: Extract Dependency Information

Fetch the PR details to identify:
- Which dependency was updated
- The old version and new version
- The changelog or migration guide (if available)

### Step 2: Security & Breaking Changes Review

For each updated dependency:
- Check for security fixes
- Identify breaking changes in the changelog
- Look for deprecation warnings
- Review API changes

### Step 3: Codebase Impact Analysis

Examine the project codebase to find:
- Direct imports/usage of the updated package
- Configuration files that reference the package
- Test files that may be affected
- Build or bundler configurations

### Step 4: Compatibility Assessment

Evaluate compatibility by:
- Checking if the project uses deprecated APIs
- Identifying type signature changes (for TypeScript)
- Finding behavior changes that may affect functionality
- Assessing impact on dependent packages

### Step 5: Provide Recommendations

Create a comment with:
- **Compatibility Risk Level**: High 🔴 / Medium 🟡 / Low 🟢
- **Summary**: 2-3 sentence overview of the impact
- **Changes Required**: Bullet list of required code modifications
- **Affected Files**: List of files that need updates
- **Testing Recommendations**: Specific tests to run

## Output Format

When providing your analysis, format your comment as follows:

```
## 🔍 Compatibility Analysis

**Risk Level**: [High/Medium/Low]

### Summary
[2-3 sentences about the impact]

### Breaking Changes Detected
- [Breaking change 1]
- [Breaking change 2]

### Required Code Changes
- [ ] [File path] - [Change description]
- [ ] [File path] - [Change description]

### Files That Need Review
- `[file1.js]` - [brief reason]
- `[file2.jsx]` - [brief reason]

### Testing Recommendations
- Run `[test command]` to verify [what it tests]
- Manual testing: [specific steps]

### Additional Notes
[Any other relevant information]
```

## Notes

- Focus on the specific packages being updated in this PR
- If you find no breaking changes, clearly state that the update is likely safe
- Prioritize high-impact changes that affect core functionality
- Suggest gradual migration paths for complex updates
- Link to official migration guides when relevant
