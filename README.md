# EasyCook 🍳

**Never guess what to cook again.** Get personalized weekly meal plans powered by AI, tailored to your unique tastes, dietary needs, and cooking skills.

<p align="center">
  <img src="https://img.shields.io/badge/Platform-iOS%2016.0+-orange.svg" alt="Platform">
  <img src="https://img.shields.io/badge/Swift-5.9-orange.svg" alt="Swift">
  <img src="https://img.shields.io/badge/UI-SwiftUI-blue.svg" alt="SwiftUI">
  <img src="https://img.shields.io/badge/AI-Claude%20API-purple.svg" alt="Claude API">
</p>

---

## 🌟 Features

### Deeply Personalized Meal Planning
- **AI-Powered Recommendations**: Uses Claude AI to analyze your preferences and generate meals that match your exact taste
- **Visual Learning**: Upload photos of your favorite meals to help the AI understand your preferences
- **Smart Questionnaire**: Comprehensive onboarding that captures dietary restrictions, skill level, cuisine preferences, and more
- **Personalization Scoring**: Each meal is scored (0-100%) based on how well it matches your profile

### Beautiful, Playful Design
- **Warm & Earthy Colors**: Inviting coral-orange, terracotta, and sage green palette
- **Rounded, Friendly UI**: Approachable design with rounded corners and playful food icons
- **Intuitive Navigation**: Simple, clean interface that makes meal planning effortless
- **Food Icons**: Emojis and icons that bring personality to every meal

### Comprehensive Personalization
- Dietary preferences (Vegetarian, Vegan, Gluten-Free, Keto, etc.)
- Allergies and ingredient dislikes
- Cooking skill level matching
- Time constraints and meal complexity preferences
- Household size considerations
- Favorite ingredients integration

---

## 🏗️ Architecture

### Tech Stack
- **Framework**: SwiftUI (iOS 16.0+)
- **Architecture**: MVVM (Model-View-ViewModel)
- **AI Integration**: Anthropic Claude API (claude-3-5-sonnet)
- **Data Persistence**: UserDefaults (basic), ready for Core Data/CloudKit expansion
- **Language**: Swift 5.9+

### Project Structure
```
EasyCook/
├── Models/
│   ├── UserProfile.swift      # User preferences and profile data
│   └── Meal.swift              # Meal, recipe, and nutrition models
├── Views/
│   ├── OnboardingView.swift   # Comprehensive onboarding flow
│   └── MealPlanView.swift     # Weekly meal plan display
├── ViewModels/
│   └── (Embedded in Views)    # MVVM pattern with @StateObject
├── Services/
│   └── AIPersonalizationService.swift  # Claude API integration
├── Resources/
│   └── DesignSystem.swift     # Colors, fonts, spacing, components
└── Utils/
    └── (Future utilities)
```

### Key Design Decisions

#### 1. **AI-First Personalization**
The core of EasyCook is the `AIPersonalizationService`, which:
- Builds comprehensive prompts from user profiles
- Uses Claude API for intelligent meal generation
- Scores each meal on personalization fit (0.0-1.0)
- Provides context on why meals were chosen

**Prompt Engineering**: The service uses multi-factor prompting to ensure:
- Strict adherence to dietary restrictions and allergies
- Skill-appropriate recipes
- Time and complexity matching
- Cuisine preference alignment
- Ingredient preference incorporation

#### 2. **Comprehensive User Profiling**
The `UserProfile` model captures:
- **Dietary Preferences**: 9 different diet types (Vegetarian, Vegan, Keto, etc.)
- **Skill Level**: 4 tiers (Beginner → Home Chef)
- **Cuisine Preferences**: 12 cuisine types with emoji icons
- **Constraints**: Allergies, dislikes, household size
- **Preferences**: Cooking time, meal complexity, favorite ingredients
- **Visual Data**: Photo uploads for visual preference learning

#### 3. **Playful, Accessible Design**
The `DesignSystem.swift` defines:
- **Color Palette**: Warm coral-orange (#E87461), earthy terracotta (#D4765C), soft sage (#9DB89F)
- **Typography**: Rounded system font for friendliness
- **Spacing System**: Consistent 8pt grid (xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48)
- **Reusable Components**: PrimaryButton, SecondaryButton, CardView

#### 4. **Onboarding Flow**
8-step questionnaire that feels conversational:
1. Welcome & value proposition
2. Name personalization
3. Dietary preferences
4. Cuisine selection
5. Skill level assessment
6. Allergies & dislikes
7. Household & time preferences
8. Photo uploads (optional)

Progress bar and "Back" navigation for user control.

---

## 🚀 Getting Started

### Prerequisites
- **Xcode 15.0+**
- **iOS 16.0+ device or simulator**
- **Anthropic API Key** (for AI-powered meal generation)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/theurbandev/EasyCook.git
   cd EasyCook
   ```

2. **Open in Xcode**
   ```bash
   open EasyCook.xcodeproj
   ```

3. **Set up Anthropic API Key**

   **Option 1: Environment Variable (Development)**
   ```bash
   export ANTHROPIC_API_KEY="your-api-key-here"
   ```

   **Option 2: Xcode Scheme (Recommended)**
   - Edit Scheme → Run → Arguments → Environment Variables
   - Add: `ANTHROPIC_API_KEY` = `your-api-key-here`

   **Option 3: Secure Configuration (Production)**
   - Create a `Config.plist` file (not tracked in git)
   - Load API key from secure keychain storage

   > **Get an API Key**: Visit [Anthropic Console](https://console.anthropic.com/)

4. **Build and Run**
   - Select your target device/simulator
   - Press `Cmd + R` or click the Play button
   - The app will open to the onboarding flow

### Mock Mode (No API Key Required)
If no API key is provided, the app uses mock data for development:
- Sample meal plans are generated locally
- Full UI functionality is available
- Perfect for design iteration and testing

---

## 📱 Usage

### First Launch - Onboarding
1. **Welcome**: Learn about EasyCook's features
2. **Enter your name**: Personalize the experience
3. **Set dietary preferences**: Select any restrictions (Vegan, Gluten-Free, etc.)
4. **Choose cuisines**: Pick your favorite food styles
5. **Set skill level**: Match recipes to your cooking ability
6. **Add allergies/dislikes**: Ensure safe, enjoyable meals
7. **Configure preferences**: Household size, cooking time, complexity
8. **Upload photos** (optional): Help AI learn your visual preferences

### Main App - Meal Planning
- **Weekly View**: See your personalized 7-day meal plan
- **Expand Days**: Tap to see breakfast, lunch, and dinner
- **Meal Details**: Tap any meal to see:
  - Full recipe with ingredients and instructions
  - Nutrition information
  - Cooking time and difficulty
  - Personalization score
- **Regenerate**: Tap the refresh icon for a new meal plan
- **Settings**: Update preferences anytime

---

## 🎨 Design System

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Primary Orange | `#E87461` | CTAs, accents, highlights |
| Terracotta | `#D4765C` | Secondary actions |
| Sage Green | `#9DB89F` | Success states, nature |
| Cream | `#F9F5F0` | Background |
| Beige | `#F5EDE4` | Secondary background |
| Charcoal | `#2D3436` | Primary text |

### Typography
- **Headings**: Rounded system font (playful, friendly)
- **Body**: Default system font (readable, accessible)
- **Sizes**: 34pt (large title) → 12pt (caption)

### Spacing
- **XS**: 4pt - Tight spacing
- **SM**: 8pt - Compact elements
- **MD**: 16pt - Standard spacing
- **LG**: 24pt - Section spacing
- **XL**: 32pt - Major sections
- **XXL**: 48pt - Hero spacing

---

## 🤖 AI Personalization

### How It Works

1. **Profile Building**: The app collects comprehensive user data through the onboarding flow
2. **Prompt Engineering**: The `AIPersonalizationService` builds a detailed prompt that includes:
   - Dietary requirements (hard constraints)
   - Allergies (absolute exclusions)
   - Preferences (soft preferences)
   - Skill level matching
   - Time and complexity constraints
   - Visual preference hints from photos
3. **LLM Generation**: Claude API generates a week of meals in structured JSON format
4. **Personalization Scoring**: Each meal receives a score based on:
   - Dietary alignment (30%)
   - Cuisine match (20%)
   - Skill appropriateness (20%)
   - Favorite ingredients (15%)
   - Avoiding dislikes (15%)
5. **Context Explanation**: The AI provides reasoning for why these meals were chosen

### Prompt Structure
```
USER PROFILE → DIETARY REQUIREMENTS → ALLERGIES → PREFERENCES
     ↓
PERSONALIZATION REQUIREMENTS (7 critical factors)
     ↓
SCORING CRITERIA (5-factor weighted score)
     ↓
STRUCTURED JSON RESPONSE (7-day meal plan)
```

### Example Personalization Factors
- **High Score (0.9+)**: Vegan user gets Thai Red Curry with Tofu
- **Medium Score (0.7-0.8)**: Italian preference with occasional Asian fusion
- **Skill Match**: Beginner gets one-pot meals, Chef gets soufflés
- **Time Respect**: 30-min preference = quick stir-fries, not slow-roasted dishes

---

## 🔐 Privacy & Data

### Current Implementation
- **Local Storage**: User profiles stored in UserDefaults
- **No Cloud**: Data stays on device
- **API Communication**: Only meal plan requests sent to Claude API
- **No Tracking**: No analytics or user tracking

### Future Considerations
- **iCloud Sync**: Optional profile backup via CloudKit
- **Photo Storage**: Secure local photo storage with option to delete
- **API Security**: Encrypt API requests in transit (HTTPS)
- **Data Export**: Allow users to export their data

---

## 🛣️ Roadmap

### Phase 1: MVP ✅ (Current)
- [x] Comprehensive onboarding flow
- [x] AI-powered meal plan generation
- [x] Weekly meal view with details
- [x] Personalization scoring
- [x] Beautiful design system

### Phase 2: Enhanced Personalization
- [ ] Photo analysis using Claude Vision API
- [ ] Learning from user feedback (like/dislike meals)
- [ ] Grocery list generation
- [ ] Ingredient substitution suggestions
- [ ] Seasonal ingredient awareness

### Phase 3: Social & Sharing
- [ ] Share favorite recipes
- [ ] Family meal planning (multiple profiles)
- [ ] Collaborative meal selection
- [ ] Recipe ratings and reviews

### Phase 4: Smart Features
- [ ] Calendar integration (busy days = quick meals)
- [ ] Leftover tracking and recipe suggestions
- [ ] Pantry inventory management
- [ ] Smart shopping list with price estimates

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow Swift style guide and SwiftUI best practices
- Maintain the warm, playful design language
- Write clear commit messages
- Test on multiple device sizes
- Consider accessibility (VoiceOver, Dynamic Type)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Anthropic Claude API**: Powers intelligent meal personalization
- **SwiftUI**: Modern, declarative UI framework
- **SF Symbols**: Beautiful system icons

---

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/theurbandev/EasyCook/issues)
- **Discussions**: [GitHub Discussions](https://github.com/theurbandev/EasyCook/discussions)

---

## 🎯 Why EasyCook?

**The Problem**: People struggle with meal planning. They cook the same things every week, or spend hours deciding what to make, or order takeout because it's easier.

**The Solution**: EasyCook removes the guesswork. Our AI learns your tastes, respects your constraints, and suggests meals you'll actually want to cook. No more decision fatigue. No more boring meals.

**The Difference**: Unlike generic recipe apps, EasyCook is:
- **Deeply Personal**: Every meal is scored on how well it matches YOUR profile
- **Smart Learning**: Improves recommendations based on photos and feedback
- **Respectful**: Honors dietary restrictions, allergies, and time constraints
- **Playful**: Cooking should be fun, not stressful

---

**Made with ❤️ and 🍳 by the EasyCook team**
