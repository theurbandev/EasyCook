# EasyCook Architecture Documentation

## Overview

EasyCook is built using SwiftUI with an MVVM (Model-View-ViewModel) architecture, emphasizing AI-driven personalization and a playful, accessible user experience.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         User Interface                       │
│  ┌─────────────────────┐     ┌──────────────────────────┐  │
│  │  OnboardingView     │     │   MealPlanView           │  │
│  │  ├── WelcomeStep    │     │   ├── HeaderView         │  │
│  │  ├── NameStep       │     │   ├── WeeklyMealPlanCard │  │
│  │  ├── DietaryStep    │     │   ├── DayMealCard        │  │
│  │  ├── CuisineStep    │     │   └── MealDetailView     │  │
│  │  ├── SkillStep      │     │                          │  │
│  │  ├── AllergiesStep  │     │                          │  │
│  │  ├── PreferencesStep│     │                          │  │
│  │  └── PhotoStep      │     │                          │  │
│  └─────────────────────┘     └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      ViewModels Layer                        │
│  ┌──────────────────────────┐  ┌───────────────────────┐   │
│  │  OnboardingViewModel     │  │  MealPlanViewModel    │   │
│  │  └── @Published profile  │  │  └── @Published plan  │   │
│  └──────────────────────────┘  └───────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                       Services Layer                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         AIPersonalizationService                      │  │
│  │  ├── generateWeeklyMealPlan(for: UserProfile)        │  │
│  │  ├── buildPersonalizationPrompt()                    │  │
│  │  ├── callClaudeAPI()                                 │  │
│  │  └── parseMealPlanResponse()                         │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      External APIs                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Anthropic Claude API                     │  │
│  │         (claude-3-5-sonnet-20241022)                  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Models                            │
│  ┌──────────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ UserProfile  │  │   Meal   │  │  WeeklyMealPlan      │  │
│  ├──────────────┤  ├──────────┤  ├──────────────────────┤  │
│  │ Dietary      │  │ Ingredient│ │  DayMealPlan         │  │
│  │ Preferences  │  │ Nutrition │  │                      │  │
│  └──────────────┘  └──────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. **Models Layer**

#### UserProfile
**Purpose**: Comprehensive representation of user preferences and constraints

**Key Properties**:
- `dietaryPreferences: DietaryPreferences` - 9 diet types (Vegan, Keto, etc.)
- `cookingSkillLevel: CookingSkillLevel` - 4 skill tiers
- `cuisinePreferences: [CuisineType]` - 12 cuisine types
- `allergies: [String]` - Hard constraints (absolute exclusions)
- `dislikedIngredients: [String]` - Soft preferences
- `favoriteIngredients: [String]` - Positive signals
- `uploadedPhotoURLs: [String]` - Visual preference data

**Design Decision**: Rich, structured data enables precise AI personalization. Each field maps to specific prompt engineering elements.

#### Meal
**Purpose**: Complete recipe representation with personalization metadata

**Key Properties**:
- `ingredients: [Ingredient]` - Structured ingredient list
- `instructions: [String]` - Step-by-step cooking directions
- `nutritionInfo: NutritionInfo?` - Caloric and macro data
- `personalizationScore: Double` - 0.0-1.0 fit score
- `cuisineType: CuisineType` - Classification
- `difficulty: CookingSkillLevel` - Skill matching

**Design Decision**: `personalizationScore` makes AI decisions transparent to users. Tags enable filtering and search.

#### WeeklyMealPlan
**Purpose**: Container for 7-day meal plan with context

**Key Properties**:
- `meals: [DayMealPlan]` - 7 days of breakfast/lunch/dinner
- `personalizationContext: String` - Explanation of choices
- `weekStartDate: Date` - Calendar anchoring

**Design Decision**: `personalizationContext` builds user trust by explaining AI reasoning.

---

### 2. **Views Layer (SwiftUI)**

#### OnboardingView
**Purpose**: Multi-step questionnaire to build UserProfile

**Architecture**:
- `TabView` with 8 steps (welcome → photos)
- `OnboardingViewModel` manages state
- Each step is a separate view component
- Progress bar shows completion
- Back/Continue navigation

**Key Design Patterns**:
- **Composition**: Each step is a reusable view (`WelcomeStep`, `DietaryPreferencesStep`, etc.)
- **Data Binding**: `@Binding` for two-way data flow to profile
- **Validation**: `canProceed` computed property enables/disables Continue button

**UX Considerations**:
- Progressive disclosure (one question at a time)
- Visual feedback (checkmarks, selection states)
- Optional steps (photos) to reduce friction
- "Skip" implied by allowing blank answers (except name)

#### MealPlanView
**Purpose**: Display weekly meal plan with personalization insights

**Architecture**:
- Hierarchical: Week → Day → Meal → Detail
- `MealPlanViewModel` handles business logic
- Expandable cards for day-by-day view
- Modal sheet for meal details

**Key Components**:
- `WeeklyMealPlanCard`: Week-level overview with regenerate button
- `DayMealCard`: Collapsible view of 3 meals per day
- `MealRow`: Compact meal display with personalization badge
- `MealDetailView`: Full recipe modal with ingredients, instructions, nutrition

**Design Patterns**:
- **Lazy Loading**: Days collapsed by default to reduce cognitive load
- **Progressive Enhancement**: Basic info → full detail on tap
- **Transparency**: Personalization scores visible on every meal

---

### 3. **Services Layer**

#### AIPersonalizationService
**Purpose**: Core intelligence - converts UserProfile to personalized meals via Claude API

**Key Methods**:

##### `generateWeeklyMealPlan(for: UserProfile) async throws -> WeeklyMealPlan`
**Flow**:
1. Build comprehensive prompt from profile
2. Call Claude API with prompt
3. Parse JSON response into WeeklyMealPlan
4. Return structured data

##### `buildPersonalizationPrompt(for: UserProfile) -> String`
**Prompt Engineering Strategy**:

```
USER PROFILE (basics)
  ↓
DIETARY REQUIREMENTS (MUST BE STRICTLY FOLLOWED)
  ↓
ALLERGIES (NEVER INCLUDE THESE)
  ↓
DISLIKES (AVOID IF POSSIBLE)
  ↓
FAVORITES (TRY TO INCORPORATE)
  ↓
CUISINE PREFERENCES
  ↓
TIME & COMPLEXITY CONSTRAINTS
  ↓
VISUAL PREFERENCES (photo hints)
  ↓
PERSONALIZATION REQUIREMENTS (7 factors)
  ↓
SCORING CRITERIA (weighted 5-factor model)
  ↓
RESPONSE FORMAT (structured JSON schema)
```

**Critical Design Decisions**:
- **Hierarchical Constraints**: MUST (allergies) > SHOULD (dislikes) > NICE TO HAVE (favorites)
- **Skill Matching**: Explicitly instruct to match user's skill level
- **Variety Requirement**: Force diversity across week
- **Scoring Transparency**: Request AI to provide score + reasoning

**Prompt Example** (abbreviated):
```
DIETARY REQUIREMENTS (MUST BE STRICTLY FOLLOWED):
Vegetarian, Gluten-Free

ALLERGIES (NEVER INCLUDE THESE):
Peanuts, Shellfish

PERSONALIZATION REQUIREMENTS:
1. Every meal must align with dietary restrictions
2. Match cooking skill level - don't suggest advanced techniques to beginners
3. Respect time constraints
4. Create variety across the week
5. Consider household size for portions
6. Balance nutrition while respecting preferences
7. Add 1-2 "stretch" meals for growth

PERSONALIZATION SCORING:
- Dietary alignment (0.3 weight)
- Cuisine match (0.2 weight)
- Skill appropriateness (0.2 weight)
- Favorite ingredients (0.15 weight)
- Avoids dislikes (0.15 weight)
```

##### `callClaudeAPI(prompt: String) async throws -> String`
**Implementation**:
- Uses `URLSession` for async HTTP requests
- Sets proper headers (`x-api-key`, `anthropic-version`)
- Configures temperature (0.7 - balanced creativity/consistency)
- Handles errors (network, auth, parsing)
- **Fallback**: Returns mock data if no API key (dev mode)

**API Parameters**:
- `model`: claude-3-5-sonnet-20241022 (latest, most capable)
- `max_tokens`: 8192 (sufficient for 21 meals + instructions)
- `temperature`: 0.7 (creative but consistent)
- `system`: Expert chef persona

##### `parseMealPlanResponse(response: String, for: UserProfile) throws -> WeeklyMealPlan`
**Parsing Strategy**:
- Extracts JSON from markdown code blocks (```json ... ```)
- Validates required fields
- Maps strings to enums (CuisineType, CookingSkillLevel)
- Constructs nested object graph (WeeklyMealPlan → DayMealPlan → Meal → Ingredient)
- Handles optional fields gracefully (nutrition, tags)

---

### 4. **Design System**

#### DesignSystem.swift
**Purpose**: Single source of truth for visual design

**Components**:

##### Color Palette
```swift
EasyCookColors.primaryOrange      // #E87461 - Warm coral-orange
EasyCookColors.primaryTerracotta  // #D4765C - Earthy terracotta
EasyCookColors.accentSage         // #9DB89F - Soft sage green
EasyCookColors.backgroundCream    // #F9F5F0 - Warm cream
EasyCookColors.textPrimary        // #2D3436 - Deep charcoal
```

**Design Rationale**: Warm, earthy tones evoke home cooking and natural ingredients. Orange/terracotta provide energy without aggression.

##### Typography
```swift
EasyCookFonts.largeTitle  // 34pt, bold, rounded - Friendly headings
EasyCookFonts.body        // 17pt, regular - Readable body text
EasyCookFonts.caption     // 12pt, regular - Supporting info
```

**Design Rationale**: Rounded font design for playfulness. Standard sizes for accessibility (Dynamic Type support ready).

##### Spacing System (8pt Grid)
```swift
EasyCookSpacing.xs   // 4pt
EasyCookSpacing.sm   // 8pt
EasyCookSpacing.md   // 16pt
EasyCookSpacing.lg   // 24pt
EasyCookSpacing.xl   // 32pt
EasyCookSpacing.xxl  // 48pt
```

**Design Rationale**: Consistent spacing creates visual rhythm. 8pt grid aligns with iOS design standards.

##### Reusable Components
- `PrimaryButton`: Orange CTA with rounded corners
- `SecondaryButton`: Beige outline button
- `CardView`: Elevated white card with shadow
- `SelectionToggle`: Checkbox-style toggle with icon
- `TagView`: Removable tag chips

---

## Data Flow

### Onboarding Flow
```
User Input
  ↓
OnboardingView (UI Layer)
  ↓
OnboardingViewModel (@Published profile)
  ↓
Update UserProfile properties via @Binding
  ↓
On "Let's Cook!" → AppState.completeOnboarding(with: profile)
  ↓
Save to UserDefaults
  ↓
Navigate to MealPlanView
```

### Meal Plan Generation Flow
```
MealPlanView.onAppear()
  ↓
MealPlanViewModel.generateMealPlan(for: profile)
  ↓
Set isLoading = true (show loading spinner)
  ↓
AIPersonalizationService.generateWeeklyMealPlan(for: profile)
  ↓
buildPersonalizationPrompt(for: profile)
  ↓
callClaudeAPI(prompt: string)
  ↓
URLSession → Anthropic API → JSON Response
  ↓
parseMealPlanResponse(response, for: profile)
  ↓
Return WeeklyMealPlan
  ↓
Update @Published currentMealPlan
  ↓
SwiftUI re-renders MealPlanView with data
```

---

## Key Design Decisions

### 1. **Why Claude API?**
- **Best-in-class reasoning**: Superior at following complex constraints (dietary + skill + time + preferences)
- **JSON mode**: Reliable structured output via prompt engineering
- **Context window**: 200k tokens handles extensive profiles + examples
- **Safety**: Built-in content filtering for recipe generation

**Alternative Considered**: GPT-4 (rejected due to weaker constraint adherence in testing)

### 2. **Why MVVM?**
- **Testability**: ViewModels can be unit tested without UI
- **Separation**: Business logic separate from view rendering
- **SwiftUI Native**: `@Published` + `@StateObject` integrate seamlessly
- **Scalability**: Easy to add new features without view bloat

**Alternative Considered**: MVC (rejected - too much logic in views)

### 3. **Why Local-First Data?**
- **Privacy**: User data stays on device
- **Offline**: Profile editing works without network
- **Speed**: No network latency for settings
- **Simplicity**: No backend infrastructure to maintain

**Future Evolution**: Optional iCloud sync for multi-device

### 4. **Why Personalization Scoring?**
- **Transparency**: Users see why AI chose each meal
- **Trust**: Builds confidence in recommendations
- **Feedback Loop**: Low scores signal to improve AI prompts
- **Gamification**: High scores feel rewarding

**Implementation**: Weighted 5-factor model in prompt, enforced via instruction

---

## Performance Considerations

### API Latency
- **Problem**: Meal plan generation takes 5-15 seconds
- **Solution**: Loading state with friendly message ("Crafting your perfect meal plan...")
- **Future**: Cache meal plans, generate in background, allow offline mode

### Image Uploads (Future)
- **Challenge**: Large photo files
- **Strategy**: Compress to 1024px max dimension, use JPEG @ 80% quality
- **Vision API**: Pass compressed images to Claude for analysis

### Memory Management
- **SwiftUI Auto-Management**: Views deallocated when off-screen
- **Large Data**: WeeklyMealPlan (~50KB) is acceptable
- **Future**: Paginate historical meal plans if storing weeks of data

---

## Security & Privacy

### API Key Management
**Current**: Environment variable (dev mode)
**Production**: Keychain storage with user-specific encryption
**Best Practice**: Never commit keys to git (.gitignore includes Config.plist)

### Data Storage
**Current**: UserDefaults (unencrypted)
**Production**: Keychain for sensitive data, encrypted Core Data for meal history
**Compliance**: GDPR-ready (local data = user owns it)

### Network Security
**Current**: HTTPS only (Anthropic enforces TLS 1.2+)
**Future**: Certificate pinning for API requests

---

## Testing Strategy

### Unit Tests (Future)
- **Models**: Codable conformance, computed properties
- **Services**: Mock Claude API responses, test parsing
- **ViewModels**: State transitions, validation logic

### UI Tests (Future)
- **Onboarding Flow**: Complete questionnaire end-to-end
- **Meal Plan**: Generate plan, expand days, view details
- **Settings**: Update preferences, reset onboarding

### Manual Testing Checklist
- [ ] Complete onboarding with various profiles
- [ ] Generate meal plans for vegetarian, vegan, keto users
- [ ] Test allergy exclusions (verify no peanuts in plan)
- [ ] Test skill level matching (beginner = simple recipes)
- [ ] Test time constraints (quick meals = <30 min)
- [ ] Test on iPhone SE, iPhone 15 Pro Max, iPad

---

## Accessibility

### Current Support
- **Dynamic Type**: Ready (using system fonts)
- **Color Contrast**: WCAG AA compliant (charcoal on cream)
- **VoiceOver**: Needs accessibility labels (future)

### Future Enhancements
- VoiceOver labels for all interactive elements
- High contrast mode support
- Reduce motion support (disable animations)
- Voice input for ingredient entry

---

## Localization

### Current State
- English only
- Hardcoded strings in views

### Future Strategy
- `Localizable.strings` for all user-facing text
- Priority languages: Spanish, French, Italian, Japanese
- Claude API supports multilingual meal generation
- Cuisine types adapt to region (e.g., more Japanese recipes in Japan)

---

## Future Architecture Considerations

### Backend Service (Optional)
If scale requires centralized processing:
- **Meal Plan Cache**: Pre-generate popular profile combinations
- **Analytics**: Anonymous usage data to improve prompts
- **Social Features**: Shared recipe database

**Trade-off**: Adds complexity, reduces privacy

### Machine Learning (On-Device)
- **CoreML**: Train local model to predict user preferences from photos
- **Feedback Loop**: Learn from meal likes/dislikes
- **Privacy**: All ML happens on-device

**Challenge**: Requires labeled training data

### Multi-Platform
- **watchOS**: Quick meal reminders, ingredient checklists
- **macOS**: Larger screen for meal planning and grocery lists
- **tvOS**: Step-by-step cooking mode on kitchen TV

**Architecture**: Shared SwiftUI views + platform-specific features

---

## Conclusion

EasyCook's architecture prioritizes:
1. **Deep Personalization**: Rich user profiles + advanced AI prompting
2. **User Trust**: Transparent scoring + context explanations
3. **Simplicity**: Local-first, MVVM, minimal dependencies
4. **Delight**: Playful design, smooth animations, friendly copy

The result is a meal planning app that feels like it truly understands you - because it does.
