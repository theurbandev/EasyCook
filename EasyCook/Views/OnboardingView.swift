//
//  OnboardingView.swift
//  EasyCook
//
//  Playful onboarding flow to gather user preferences
//

import SwiftUI

struct OnboardingView: View {
    @EnvironmentObject var appState: AppState
    @StateObject private var viewModel = OnboardingViewModel()

    var body: some View {
        ZStack {
            EasyCookColors.backgroundCream
                .ignoresSafeArea()

            VStack(spacing: 0) {
                // Progress Bar
                ProgressView(value: viewModel.progress)
                    .tint(EasyCookColors.primaryOrange)
                    .padding(.horizontal, EasyCookSpacing.lg)
                    .padding(.top, EasyCookSpacing.md)

                TabView(selection: $viewModel.currentStep) {
                    WelcomeStep()
                        .tag(OnboardingStep.welcome)

                    NameStep(name: $viewModel.profile.name)
                        .tag(OnboardingStep.name)

                    DietaryPreferencesStep(preferences: $viewModel.profile.dietaryPreferences)
                        .tag(OnboardingStep.dietary)

                    CuisinePreferencesStep(cuisines: $viewModel.profile.cuisinePreferences)
                        .tag(OnboardingStep.cuisine)

                    CookingSkillStep(skillLevel: $viewModel.profile.cookingSkillLevel)
                        .tag(OnboardingStep.skill)

                    AllergiesStep(
                        allergies: $viewModel.profile.allergies,
                        disliked: $viewModel.profile.dislikedIngredients
                    )
                    .tag(OnboardingStep.allergies)

                    PreferencesStep(
                        householdSize: $viewModel.profile.householdSize,
                        cookingTime: $viewModel.profile.cookingTimePreference,
                        complexity: $viewModel.profile.mealComplexityPreference
                    )
                    .tag(OnboardingStep.preferences)

                    PhotoUploadStep(photoURLs: $viewModel.profile.uploadedPhotoURLs)
                        .tag(OnboardingStep.photos)
                }
                .tabViewStyle(.page(indexDisplayMode: .never))

                // Navigation Buttons
                HStack(spacing: EasyCookSpacing.md) {
                    if viewModel.currentStep != .welcome {
                        SecondaryButton(title: "Back") {
                            viewModel.previousStep()
                        }
                    }

                    PrimaryButton(
                        title: viewModel.isLastStep ? "Let's Cook!" : "Continue",
                        action: {
                            if viewModel.isLastStep {
                                appState.completeOnboarding(with: viewModel.profile)
                            } else {
                                viewModel.nextStep()
                            }
                        },
                        isEnabled: viewModel.canProceed
                    )
                }
                .padding(EasyCookSpacing.lg)
            }
        }
    }
}

// MARK: - Onboarding Steps

struct WelcomeStep: View {
    var body: some View {
        VStack(spacing: EasyCookSpacing.xl) {
            Spacer()

            VStack(spacing: EasyCookSpacing.md) {
                Text("🍳")
                    .font(.system(size: 80))

                Text("Welcome to EasyCook")
                    .font(EasyCookFonts.largeTitle)
                    .foregroundColor(EasyCookColors.textPrimary)

                Text("Your personal AI chef that learns your taste")
                    .font(EasyCookFonts.body)
                    .foregroundColor(EasyCookColors.textSecondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, EasyCookSpacing.xl)
            }

            Spacer()

            VStack(alignment: .leading, spacing: EasyCookSpacing.md) {
                FeatureRow(icon: "✨", title: "Personalized", description: "Meals tailored to your taste")
                FeatureRow(icon: "📸", title: "Visual Learning", description: "Upload photos of your favorites")
                FeatureRow(icon: "🤖", title: "AI-Powered", description: "Smart recommendations that improve")
            }
            .padding(EasyCookSpacing.lg)

            Spacer()
        }
    }
}

struct FeatureRow: View {
    let icon: String
    let title: String
    let description: String

    var body: some View {
        HStack(spacing: EasyCookSpacing.md) {
            Text(icon)
                .font(.system(size: 32))

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(EasyCookFonts.bodyBold)
                    .foregroundColor(EasyCookColors.textPrimary)

                Text(description)
                    .font(EasyCookFonts.footnote)
                    .foregroundColor(EasyCookColors.textSecondary)
            }

            Spacer()
        }
    }
}

struct NameStep: View {
    @Binding var name: String

    var body: some View {
        OnboardingStepContainer(
            title: "What should we call you?",
            subtitle: "Let's make this personal"
        ) {
            TextField("Your name", text: $name)
                .font(EasyCookFonts.title2)
                .padding(EasyCookSpacing.md)
                .background(EasyCookColors.cardBackground)
                .cornerRadius(EasyCookRadius.md)
        }
    }
}

struct DietaryPreferencesStep: View {
    @Binding var preferences: DietaryPreferences

    var body: some View {
        OnboardingStepContainer(
            title: "Any dietary preferences?",
            subtitle: "Select all that apply"
        ) {
            VStack(spacing: EasyCookSpacing.sm) {
                SelectionToggle(title: "Vegetarian", icon: "🥬", isSelected: $preferences.isVegetarian)
                SelectionToggle(title: "Vegan", icon: "🌱", isSelected: $preferences.isVegan)
                SelectionToggle(title: "Gluten-Free", icon: "🌾", isSelected: $preferences.isGlutenFree)
                SelectionToggle(title: "Dairy-Free", icon: "🥛", isSelected: $preferences.isDairyFree)
                SelectionToggle(title: "Keto", icon: "🥑", isSelected: $preferences.isKeto)
                SelectionToggle(title: "Paleo", icon: "🥩", isSelected: $preferences.isPaleo)
                SelectionToggle(title: "Halal", icon: "☪️", isSelected: $preferences.isHalal)
                SelectionToggle(title: "Kosher", icon: "✡️", isSelected: $preferences.isKosher)
            }
        }
    }
}

struct CuisinePreferencesStep: View {
    @Binding var cuisines: [CuisineType]

    var body: some View {
        OnboardingStepContainer(
            title: "What cuisines do you love?",
            subtitle: "Pick your favorites"
        ) {
            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: EasyCookSpacing.sm) {
                ForEach(CuisineType.allCases, id: \.self) { cuisine in
                    CuisineCard(
                        cuisine: cuisine,
                        isSelected: cuisines.contains(cuisine)
                    ) {
                        if cuisines.contains(cuisine) {
                            cuisines.removeAll { $0 == cuisine }
                        } else {
                            cuisines.append(cuisine)
                        }
                    }
                }
            }
        }
    }
}

struct CookingSkillStep: View {
    @Binding var skillLevel: CookingSkillLevel

    var body: some View {
        OnboardingStepContainer(
            title: "How's your cooking experience?",
            subtitle: "Be honest, we'll match your level"
        ) {
            VStack(spacing: EasyCookSpacing.sm) {
                ForEach(CookingSkillLevel.allCases, id: \.self) { level in
                    SkillLevelCard(
                        level: level,
                        isSelected: skillLevel == level
                    ) {
                        skillLevel = level
                    }
                }
            }
        }
    }
}

struct AllergiesStep: View {
    @Binding var allergies: [String]
    @Binding var disliked: [String]
    @State private var newAllergy = ""
    @State private var newDisliked = ""

    var body: some View {
        OnboardingStepContainer(
            title: "Anything to avoid?",
            subtitle: "Allergies and dislikes"
        ) {
            VStack(alignment: .leading, spacing: EasyCookSpacing.lg) {
                VStack(alignment: .leading, spacing: EasyCookSpacing.sm) {
                    Text("Allergies")
                        .font(EasyCookFonts.bodyBold)
                        .foregroundColor(EasyCookColors.textPrimary)

                    TagInputField(
                        placeholder: "Add allergy (e.g., peanuts)",
                        text: $newAllergy,
                        tags: $allergies
                    )
                }

                VStack(alignment: .leading, spacing: EasyCookSpacing.sm) {
                    Text("Disliked Ingredients")
                        .font(EasyCookFonts.bodyBold)
                        .foregroundColor(EasyCookColors.textPrimary)

                    TagInputField(
                        placeholder: "Add ingredient you dislike",
                        text: $newDisliked,
                        tags: $disliked
                    )
                }
            }
        }
    }
}

struct PreferencesStep: View {
    @Binding var householdSize: Int
    @Binding var cookingTime: CookingTime
    @Binding var complexity: MealComplexity

    var body: some View {
        OnboardingStepContainer(
            title: "A few more details",
            subtitle: "Help us personalize better"
        ) {
            VStack(alignment: .leading, spacing: EasyCookSpacing.lg) {
                VStack(alignment: .leading, spacing: EasyCookSpacing.sm) {
                    Text("Cooking for how many?")
                        .font(EasyCookFonts.bodyBold)

                    Stepper(value: $householdSize, in: 1...12) {
                        Text("\(householdSize) \(householdSize == 1 ? "person" : "people")")
                            .font(EasyCookFonts.body)
                            .foregroundColor(EasyCookColors.primaryOrange)
                    }
                    .padding(EasyCookSpacing.md)
                    .background(EasyCookColors.cardBackground)
                    .cornerRadius(EasyCookRadius.md)
                }

                VStack(alignment: .leading, spacing: EasyCookSpacing.sm) {
                    Text("Preferred cooking time")
                        .font(EasyCookFonts.bodyBold)

                    ForEach(CookingTime.allCases, id: \.self) { time in
                        SelectionRow(
                            title: time.rawValue,
                            icon: time.icon,
                            isSelected: cookingTime == time
                        ) {
                            cookingTime = time
                        }
                    }
                }

                VStack(alignment: .leading, spacing: EasyCookSpacing.sm) {
                    Text("Meal complexity preference")
                        .font(EasyCookFonts.bodyBold)

                    ForEach(MealComplexity.allCases, id: \.self) { comp in
                        SelectionRow(
                            title: comp.rawValue,
                            icon: comp.icon,
                            isSelected: complexity == comp
                        ) {
                            complexity = comp
                        }
                    }
                }
            }
        }
    }
}

struct PhotoUploadStep: View {
    @Binding var photoURLs: [String]
    @State private var showImagePicker = false

    var body: some View {
        OnboardingStepContainer(
            title: "Show us what you love! 📸",
            subtitle: "Upload photos of your favorite meals (optional)"
        ) {
            VStack(spacing: EasyCookSpacing.lg) {
                if photoURLs.isEmpty {
                    Button(action: { showImagePicker = true }) {
                        VStack(spacing: EasyCookSpacing.md) {
                            Image(systemName: "photo.on.rectangle.angled")
                                .font(.system(size: 48))
                                .foregroundColor(EasyCookColors.primaryOrange)

                            Text("Tap to add photos")
                                .font(EasyCookFonts.body)
                                .foregroundColor(EasyCookColors.textSecondary)
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 200)
                        .background(EasyCookColors.backgroundBeige)
                        .cornerRadius(EasyCookRadius.lg)
                        .overlay(
                            RoundedRectangle(cornerRadius: EasyCookRadius.lg)
                                .stroke(EasyCookColors.primaryOrange, style: StrokeStyle(lineWidth: 2, dash: [8]))
                        )
                    }
                } else {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: EasyCookSpacing.sm) {
                            ForEach(photoURLs, id: \.self) { url in
                                RoundedRectangle(cornerRadius: EasyCookRadius.md)
                                    .fill(EasyCookColors.backgroundBeige)
                                    .frame(width: 120, height: 120)
                                    .overlay(
                                        Text("📸")
                                            .font(.system(size: 40))
                                    )
                            }

                            Button(action: { showImagePicker = true }) {
                                RoundedRectangle(cornerRadius: EasyCookRadius.md)
                                    .stroke(EasyCookColors.primaryOrange, style: StrokeStyle(lineWidth: 2, dash: [8]))
                                    .frame(width: 120, height: 120)
                                    .overlay(
                                        Image(systemName: "plus")
                                            .font(.system(size: 32))
                                            .foregroundColor(EasyCookColors.primaryOrange)
                                    )
                            }
                        }
                    }
                }

                Text("Photos help our AI understand your preferences better")
                    .font(EasyCookFonts.caption)
                    .foregroundColor(EasyCookColors.textSecondary)
                    .multilineTextAlignment(.center)
            }
        }
        .sheet(isPresented: $showImagePicker) {
            // ImagePicker would go here
            Text("Image Picker Placeholder")
        }
    }
}

// MARK: - Reusable Components

struct OnboardingStepContainer<Content: View>: View {
    let title: String
    let subtitle: String
    let content: Content

    init(title: String, subtitle: String, @ViewBuilder content: () -> Content) {
        self.title = title
        self.subtitle = subtitle
        self.content = content()
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: EasyCookSpacing.xl) {
                VStack(alignment: .leading, spacing: EasyCookSpacing.sm) {
                    Text(title)
                        .font(EasyCookFonts.largeTitle)
                        .foregroundColor(EasyCookColors.textPrimary)

                    Text(subtitle)
                        .font(EasyCookFonts.body)
                        .foregroundColor(EasyCookColors.textSecondary)
                }

                content
            }
            .padding(EasyCookSpacing.lg)
        }
    }
}

struct SelectionToggle: View {
    let title: String
    let icon: String
    @Binding var isSelected: Bool

    var body: some View {
        Button(action: { isSelected.toggle() }) {
            HStack {
                Text(icon)
                    .font(.system(size: 24))

                Text(title)
                    .font(EasyCookFonts.body)
                    .foregroundColor(EasyCookColors.textPrimary)

                Spacer()

                if isSelected {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(EasyCookColors.primaryOrange)
                }
            }
            .padding(EasyCookSpacing.md)
            .background(isSelected ? EasyCookColors.backgroundBeige : EasyCookColors.cardBackground)
            .cornerRadius(EasyCookRadius.md)
            .overlay(
                RoundedRectangle(cornerRadius: EasyCookRadius.md)
                    .stroke(isSelected ? EasyCookColors.primaryOrange : Color.clear, lineWidth: 2)
            )
        }
    }
}

struct CuisineCard: View {
    let cuisine: CuisineType
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: EasyCookSpacing.sm) {
                Text(cuisine.emoji)
                    .font(.system(size: 40))

                Text(cuisine.rawValue)
                    .font(EasyCookFonts.callout)
                    .foregroundColor(EasyCookColors.textPrimary)
            }
            .frame(maxWidth: .infinity)
            .padding(EasyCookSpacing.md)
            .background(isSelected ? EasyCookColors.backgroundBeige : EasyCookColors.cardBackground)
            .cornerRadius(EasyCookRadius.md)
            .overlay(
                RoundedRectangle(cornerRadius: EasyCookRadius.md)
                    .stroke(isSelected ? EasyCookColors.primaryOrange : Color.clear, lineWidth: 2)
            )
        }
    }
}

struct SkillLevelCard: View {
    let level: CookingSkillLevel
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack {
                Text(level.icon)
                    .font(.system(size: 32))

                VStack(alignment: .leading, spacing: 4) {
                    Text(level.rawValue)
                        .font(EasyCookFonts.bodyBold)
                        .foregroundColor(EasyCookColors.textPrimary)

                    Text(level.description)
                        .font(EasyCookFonts.footnote)
                        .foregroundColor(EasyCookColors.textSecondary)
                }

                Spacer()
            }
            .padding(EasyCookSpacing.md)
            .background(isSelected ? EasyCookColors.backgroundBeige : EasyCookColors.cardBackground)
            .cornerRadius(EasyCookRadius.md)
            .overlay(
                RoundedRectangle(cornerRadius: EasyCookRadius.md)
                    .stroke(isSelected ? EasyCookColors.primaryOrange : Color.clear, lineWidth: 2)
            )
        }
    }
}

struct SelectionRow: View {
    let title: String
    let icon: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack {
                Text(icon)
                Text(title)
                    .font(EasyCookFonts.body)
                    .foregroundColor(EasyCookColors.textPrimary)
                Spacer()
                if isSelected {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(EasyCookColors.primaryOrange)
                }
            }
            .padding(EasyCookSpacing.md)
            .background(isSelected ? EasyCookColors.backgroundBeige : EasyCookColors.cardBackground)
            .cornerRadius(EasyCookRadius.md)
        }
    }
}

struct TagInputField: View {
    let placeholder: String
    @Binding var text: String
    @Binding var tags: [String]

    var body: some View {
        VStack(alignment: .leading, spacing: EasyCookSpacing.sm) {
            HStack {
                TextField(placeholder, text: $text)
                    .font(EasyCookFonts.body)

                Button(action: addTag) {
                    Image(systemName: "plus.circle.fill")
                        .foregroundColor(EasyCookColors.primaryOrange)
                }
            }
            .padding(EasyCookSpacing.md)
            .background(EasyCookColors.cardBackground)
            .cornerRadius(EasyCookRadius.md)

            if !tags.isEmpty {
                FlowLayout(spacing: EasyCookSpacing.sm) {
                    ForEach(tags, id: \.self) { tag in
                        TagView(tag: tag) {
                            tags.removeAll { $0 == tag }
                        }
                    }
                }
            }
        }
    }

    private func addTag() {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        if !trimmed.isEmpty && !tags.contains(trimmed) {
            tags.append(trimmed)
            text = ""
        }
    }
}

struct TagView: View {
    let tag: String
    let onDelete: () -> Void

    var body: some View {
        HStack(spacing: 4) {
            Text(tag)
                .font(EasyCookFonts.footnote)
                .foregroundColor(EasyCookColors.textPrimary)

            Button(action: onDelete) {
                Image(systemName: "xmark.circle.fill")
                    .font(.system(size: 14))
                    .foregroundColor(EasyCookColors.textSecondary)
            }
        }
        .padding(.horizontal, EasyCookSpacing.sm)
        .padding(.vertical, 6)
        .background(EasyCookColors.backgroundBeige)
        .cornerRadius(EasyCookRadius.sm)
    }
}

struct FlowLayout: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let result = FlowResult(in: proposal.width ?? 0, subviews: subviews, spacing: spacing)
        return CGSize(width: proposal.width ?? 0, height: result.height)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let result = FlowResult(in: bounds.width, subviews: subviews, spacing: spacing)
        for (index, row) in result.rows.enumerated() {
            for (subviewIndex, subview) in row.enumerated() {
                let xPos = bounds.minX + result.xOffsets[index][subviewIndex]
                let yPos = bounds.minY + result.yOffsets[index]
                subview.place(at: CGPoint(x: xPos, y: yPos), proposal: .unspecified)
            }
        }
    }

    struct FlowResult {
        var rows: [[LayoutSubviews.Element]] = [[]]
        var xOffsets: [[CGFloat]] = [[]]
        var yOffsets: [CGFloat] = [0]
        var height: CGFloat = 0

        init(in maxWidth: CGFloat, subviews: LayoutSubviews, spacing: CGFloat) {
            var currentRow = 0
            var currentX: CGFloat = 0
            var currentY: CGFloat = 0
            var rowHeight: CGFloat = 0

            for subview in subviews {
                let size = subview.sizeThatFits(.unspecified)

                if currentX + size.width > maxWidth && !rows[currentRow].isEmpty {
                    currentRow += 1
                    currentX = 0
                    currentY += rowHeight + spacing
                    rowHeight = 0
                    rows.append([])
                    xOffsets.append([])
                    yOffsets.append(currentY)
                }

                rows[currentRow].append(subview)
                xOffsets[currentRow].append(currentX)
                currentX += size.width + spacing
                rowHeight = max(rowHeight, size.height)
            }

            height = currentY + rowHeight
        }
    }
}

// MARK: - ViewModel

enum OnboardingStep: Int, CaseIterable {
    case welcome, name, dietary, cuisine, skill, allergies, preferences, photos
}

class OnboardingViewModel: ObservableObject {
    @Published var currentStep: OnboardingStep = .welcome
    @Published var profile: UserProfile = UserProfile(name: "")

    var progress: Double {
        Double(currentStep.rawValue) / Double(OnboardingStep.allCases.count - 1)
    }

    var isLastStep: Bool {
        currentStep == OnboardingStep.allCases.last
    }

    var canProceed: Bool {
        switch currentStep {
        case .welcome:
            return true
        case .name:
            return !profile.name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
        default:
            return true
        }
    }

    func nextStep() {
        guard let nextIndex = OnboardingStep.allCases.firstIndex(where: { $0.rawValue == currentStep.rawValue + 1 }) else {
            return
        }
        withAnimation {
            currentStep = OnboardingStep.allCases[nextIndex]
        }
    }

    func previousStep() {
        guard let prevIndex = OnboardingStep.allCases.firstIndex(where: { $0.rawValue == currentStep.rawValue - 1 }) else {
            return
        }
        withAnimation {
            currentStep = OnboardingStep.allCases[prevIndex]
        }
    }
}
