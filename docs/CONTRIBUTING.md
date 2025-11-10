# Contributing to RootsDAO

Thank you for your interest in contributing to RootsDAO! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/rootsdao.github.io.git
cd root5-dao-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 4. Make Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation as needed

### 5. Test Your Changes

```bash
npm run dev
# Test your changes thoroughly
npm run lint
```

### 6. Commit Your Changes

```bash
git add .
git commit -m "feat: add your feature description"
```

### 7. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
# Then create a PR on GitHub
```

## Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **Formatting**: Follow existing code formatting
- **Naming**: Use descriptive, camelCase names
- **Comments**: Add comments for complex logic

### Component Structure

```typescript
// 1. Imports
import React from 'react';
import { SomeHook } from '@/hooks/useSomeHook';

// 2. Types/Interfaces
interface ComponentProps {
  prop1: string;
  prop2?: number;
}

// 3. Component
export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // 4. Hooks
  const { data } = SomeHook();
  
  // 5. Handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `VotingInterface.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useTokenBalance.ts`)
- Utilities: `camelCase.ts` (e.g., `formatAddress.ts`)
- Types: `camelCase.ts` (e.g., `proposal.ts`)

### Git Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new voting mechanism
fix: resolve wallet connection issue
docs: update README with deployment info
style: format code with prettier
refactor: simplify token balance hook
test: add tests for voting component
chore: update dependencies
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## Pull Request Process

### Before Submitting

1. **Update Documentation**
   - Update README if needed
   - Add JSDoc comments for new functions
   - Update architecture docs if structure changes

2. **Test Thoroughly**
   - Test all affected features
   - Test on different browsers
   - Test on mobile devices
   - Check for console errors

3. **Check Linting**
   ```bash
   npm run lint
   ```

4. **Review Your Code**
   - Remove console.logs
   - Remove commented code
   - Check for unused imports
   - Verify TypeScript types

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on mobile
- [ ] All tests pass

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
```

## Areas for Contribution

### High Priority

1. **Smart Contract Integration**
   - Token locking contract
   - Voting contract
   - Treasury management (PDA)

2. **Testing**
   - Unit tests for components
   - Integration tests for hooks
   - E2E tests for workflows

3. **Performance**
   - RPC call optimization
   - Image optimization
   - Code splitting improvements

### Medium Priority

1. **Features**
   - Reputation system
   - Advanced filtering
   - Proposal templates
   - Notification system

2. **UI/UX**
   - Accessibility improvements
   - Mobile optimizations
   - Dark/light theme toggle
   - Animations and transitions

3. **Documentation**
   - API documentation
   - Video tutorials
   - Developer guides

### Low Priority

1. **Enhancements**
   - Multi-language support
   - Advanced analytics
   - Social sharing features
   - Export functionality

## Testing Guidelines

### Unit Tests

```typescript
import { render, screen } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component prop1="test" />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
```

### Integration Tests

Test complete workflows:
- Wallet connection flow
- Proposal creation flow
- Voting flow

### E2E Tests

Use Playwright or Cypress for end-to-end testing.

## Code Review Process

1. **Automated Checks**
   - Linting passes
   - TypeScript compiles
   - No merge conflicts

2. **Review Criteria**
   - Code quality and style
   - Functionality correctness
   - Performance considerations
   - Security implications
   - Documentation completeness

3. **Feedback**
   - Be constructive and specific
   - Suggest improvements
   - Approve when ready

## Reporting Issues

### Bug Reports

Use the GitHub issue template:

```markdown
**Describe the bug**
Clear description of the issue

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable

**Environment**
- Browser: [e.g., Chrome 120]
- OS: [e.g., macOS 14]
- Wallet: [e.g., Phantom 1.0]

**Additional context**
Any other relevant information
```

### Feature Requests

```markdown
**Feature Description**
Clear description of the feature

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other approaches you've thought about
```

## Questions?

- Open a GitHub Discussion
- Join our Discord
- Check existing issues and PRs

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in relevant documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to RootsDAO! 🚀




