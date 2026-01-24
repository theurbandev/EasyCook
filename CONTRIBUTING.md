# Contributing to EasyCook

Thank you for considering contributing to EasyCook! We welcome contributions from the community.

## How to Contribute

### 1. Fork and Clone
```bash
git fork https://github.com/theurbandev/EasyCook.git
git clone https://github.com/YOUR_USERNAME/EasyCook.git
cd EasyCook
```

### 2. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

**Branch Naming Convention**:
- `feature/` - New features (e.g., `feature/grocery-list`)
- `fix/` - Bug fixes (e.g., `fix/onboarding-crash`)
- `docs/` - Documentation updates
- `design/` - UI/UX improvements

### 3. Make Your Changes

Follow these guidelines:

#### Code Style
- **Swift**: Follow [Swift API Design Guidelines](https://swift.org/documentation/api-design-guidelines/)
- **SwiftUI**: Use declarative patterns, avoid imperative UIKit-style code
- **Formatting**: Use Xcode's default formatter (Ctrl+I)
- **Comments**: Explain "why", not "what" (code should be self-documenting)

#### Design Consistency
- Use `DesignSystem.swift` for all colors, fonts, and spacing
- Maintain the warm, earthy, playful aesthetic
- Test on multiple device sizes (iPhone SE, Pro Max, iPad)

#### AI Prompts
When modifying `AIPersonalizationService`:
- Test with multiple user profiles (dietary restrictions, skill levels)
- Ensure prompts handle edge cases (no preferences, all preferences)
- Validate JSON parsing with malformed responses

### 4. Test Your Changes

**Manual Testing Checklist**:
- [ ] Complete onboarding flow without errors
- [ ] Generate meal plan with your changes
- [ ] Test on iPhone and iPad simulators
- [ ] Verify no crashes or warnings in console
- [ ] Check Dark Mode compatibility (future)

**Unit Tests** (if applicable):
```bash
# Run tests in Xcode
Cmd + U
```

### 5. Commit Your Changes

**Commit Message Format**:
```
<type>: <short description>

<optional body>

<optional footer>
```

**Types**:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Formatting, no code change
- `refactor:` - Code change that neither fixes a bug nor adds a feature
- `perf:` - Performance improvement
- `test:` - Adding tests
- `chore:` - Maintenance tasks

**Example**:
```
feat: add grocery list generation from meal plan

- Extract ingredients from weekly meal plan
- Remove duplicates and combine quantities
- Group by category (produce, dairy, etc.)

Closes #42
```

### 6. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

Then open a pull request on GitHub with:
- Clear title describing the change
- Description of what changed and why
- Screenshots for UI changes
- Link to related issues

## Pull Request Review Process

1. **Automated Checks**: CI will run (future - not yet implemented)
2. **Code Review**: Maintainer will review within 3-5 days
3. **Feedback**: Address any requested changes
4. **Merge**: Once approved, we'll merge your PR

## Development Setup

### Prerequisites
- Xcode 15.0+
- iOS 16.0+ simulator
- Anthropic API key (for testing meal generation)

### Environment Setup
```bash
# Set API key for development
export ANTHROPIC_API_KEY="your-key-here"

# Open project
open EasyCook.xcodeproj
```

### Running the App
1. Select target device (iPhone 15 Pro recommended)
2. Press `Cmd + R` to build and run
3. Complete onboarding in simulator
4. Generate meal plan to test AI integration

## Code Architecture

Familiarize yourself with:
- [ARCHITECTURE.md](ARCHITECTURE.md) - Deep dive into app structure
- [README.md](README.md) - Features and overview
- Models in `EasyCook/Models/` - Data structures
- Services in `EasyCook/Services/` - Business logic

## Reporting Bugs

Use GitHub Issues with the following template:

**Bug Report Template**:
```
### Description
Clear description of the bug

### Steps to Reproduce
1. Go to '...'
2. Tap on '...'
3. See error

### Expected Behavior
What should happen

### Actual Behavior
What actually happens

### Environment
- Device: iPhone 15 Pro / iPad Air
- iOS Version: 17.0
- App Version: 1.0.0

### Screenshots
Attach screenshots if applicable
```

## Feature Requests

Use GitHub Discussions for feature ideas. Include:
- **Problem**: What problem does this solve?
- **Proposed Solution**: How should it work?
- **Alternatives**: Other solutions you considered
- **Additional Context**: Mockups, examples, etc.

## Design Contributions

We welcome design improvements! For UI/UX changes:
1. Open a Discussion with mockups/Figma links
2. Get feedback before implementing
3. Submit PR with screenshots of before/after

## Documentation Contributions

Documentation is just as important as code! You can:
- Fix typos or clarify existing docs
- Add code examples
- Write tutorials
- Translate documentation (future)

## Community Guidelines

- **Be Respectful**: Treat everyone with respect and empathy
- **Be Constructive**: Provide helpful feedback, not just criticism
- **Be Patient**: Maintainers are volunteers with limited time
- **Be Inclusive**: Welcome newcomers and help them contribute

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Questions?

- **General Questions**: [GitHub Discussions](https://github.com/theurbandev/EasyCook/discussions)
- **Bug Reports**: [GitHub Issues](https://github.com/theurbandev/EasyCook/issues)
- **Security Issues**: Email (add email here - not public)

Thank you for helping make EasyCook better! 🍳❤️
