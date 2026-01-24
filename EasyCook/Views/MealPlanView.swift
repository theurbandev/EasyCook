//
//  MealPlanView.swift
//  EasyCook
//
//  Weekly meal plan display with personalized recommendations
//

import SwiftUI

struct MealPlanView: View {
    @EnvironmentObject var appState: AppState
    @StateObject private var viewModel = MealPlanViewModel()
    @State private var showSettings = false

    var body: some View {
        NavigationView {
            ZStack {
                EasyCookColors.backgroundCream
                    .ignoresSafeArea()

                ScrollView {
                    VStack(spacing: EasyCookSpacing.lg) {
                        // Header with greeting
                        HeaderView(userName: appState.userProfile?.name ?? "Chef")

                        // Weekly meal plan
                        if let mealPlan = viewModel.currentMealPlan {
                            WeeklyMealPlanCard(mealPlan: mealPlan)
                        } else if viewModel.isLoading {
                            LoadingView()
                        } else {
                            EmptyStateView {
                                viewModel.generateMealPlan(for: appState.userProfile!)
                            }
                        }

                        // Personalization insights
                        if let plan = viewModel.currentMealPlan {
                            PersonalizationInsightCard(context: plan.personalizationContext)
                        }
                    }
                    .padding(EasyCookSpacing.lg)
                }
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .navigationBarTrailing) {
                        Button(action: { showSettings = true }) {
                            Image(systemName: "gearshape.fill")
                                .foregroundColor(EasyCookColors.primaryOrange)
                        }
                    }
                }
            }
        }
        .onAppear {
            if viewModel.currentMealPlan == nil, let profile = appState.userProfile {
                viewModel.generateMealPlan(for: profile)
            }
        }
        .sheet(isPresented: $showSettings) {
            SettingsView()
                .environmentObject(appState)
        }
    }
}

struct HeaderView: View {
    let userName: String

    var body: some View {
        VStack(alignment: .leading, spacing: EasyCookSpacing.sm) {
            Text("Hey \(userName)! 👋")
                .font(EasyCookFonts.largeTitle)
                .foregroundColor(EasyCookColors.textPrimary)

            Text("Your personalized meal plan for this week")
                .font(EasyCookFonts.body)
                .foregroundColor(EasyCookColors.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

struct WeeklyMealPlanCard: View {
    let mealPlan: WeeklyMealPlan

    var body: some View {
        VStack(alignment: .leading, spacing: EasyCookSpacing.md) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("This Week's Menu")
                        .font(EasyCookFonts.title2)
                        .foregroundColor(EasyCookColors.textPrimary)

                    Text(mealPlan.weekDescription)
                        .font(EasyCookFonts.footnote)
                        .foregroundColor(EasyCookColors.textSecondary)
                }

                Spacer()

                Button(action: {}) {
                    Image(systemName: "arrow.clockwise.circle.fill")
                        .font(.system(size: 32))
                        .foregroundColor(EasyCookColors.primaryOrange)
                }
            }

            ForEach(mealPlan.meals) { dayPlan in
                DayMealCard(dayPlan: dayPlan)
            }
        }
    }
}

struct DayMealCard: View {
    let dayPlan: DayMealPlan
    @State private var isExpanded = false

    var body: some View {
        CardView {
            VStack(alignment: .leading, spacing: EasyCookSpacing.md) {
                Button(action: { withAnimation { isExpanded.toggle() } }) {
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(dayPlan.dayOfWeek)
                                .font(EasyCookFonts.title3)
                                .foregroundColor(EasyCookColors.textPrimary)

                            Text("\(dayPlan.mainMeals.count) meals planned")
                                .font(EasyCookFonts.caption)
                                .foregroundColor(EasyCookColors.textSecondary)
                        }

                        Spacer()

                        Image(systemName: isExpanded ? "chevron.up" : "chevron.down")
                            .foregroundColor(EasyCookColors.primaryOrange)
                    }
                }

                if isExpanded {
                    VStack(spacing: EasyCookSpacing.md) {
                        if let breakfast = dayPlan.breakfast {
                            MealRow(meal: breakfast, mealType: "Breakfast")
                        }
                        if let lunch = dayPlan.lunch {
                            MealRow(meal: lunch, mealType: "Lunch")
                        }
                        if let dinner = dayPlan.dinner {
                            MealRow(meal: dinner, mealType: "Dinner")
                        }
                    }
                }
            }
        }
    }
}

struct MealRow: View {
    let meal: Meal
    let mealType: String
    @State private var showDetail = false

    var body: some View {
        Button(action: { showDetail = true }) {
            HStack(spacing: EasyCookSpacing.md) {
                // Meal type icon
                Text(mealIcon)
                    .font(.system(size: 32))

                VStack(alignment: .leading, spacing: 4) {
                    Text(mealType)
                        .font(EasyCookFonts.caption)
                        .foregroundColor(EasyCookColors.textSecondary)

                    Text(meal.name)
                        .font(EasyCookFonts.bodyBold)
                        .foregroundColor(EasyCookColors.textPrimary)

                    HStack(spacing: EasyCookSpacing.sm) {
                        Label(meal.timeDescription, systemImage: "clock")
                        Label(meal.cuisineType.rawValue, systemImage: "globe")
                    }
                    .font(EasyCookFonts.caption)
                    .foregroundColor(EasyCookColors.textSecondary)
                }

                Spacer()

                // Personalization score
                PersonalizationBadge(score: meal.personalizationScore)
            }
            .padding(EasyCookSpacing.md)
            .background(EasyCookColors.backgroundBeige)
            .cornerRadius(EasyCookRadius.md)
        }
        .sheet(isPresented: $showDetail) {
            MealDetailView(meal: meal)
        }
    }

    var mealIcon: String {
        switch mealType {
        case "Breakfast": return "🌅"
        case "Lunch": return "🌞"
        case "Dinner": return "🌙"
        default: return "🍽️"
        }
    }
}

struct PersonalizationBadge: View {
    let score: Double

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: "sparkles")
                .font(.system(size: 12))
            Text("\(Int(score * 100))%")
                .font(EasyCookFonts.caption)
        }
        .foregroundColor(.white)
        .padding(.horizontal, EasyCookSpacing.sm)
        .padding(.vertical, 4)
        .background(color)
        .cornerRadius(EasyCookRadius.sm)
    }

    var color: Color {
        if score >= 0.8 {
            return EasyCookColors.success
        } else if score >= 0.6 {
            return EasyCookColors.primaryOrange
        } else {
            return EasyCookColors.warning
        }
    }
}

struct PersonalizationInsightCard: View {
    let context: String

    var body: some View {
        CardView {
            VStack(alignment: .leading, spacing: EasyCookSpacing.sm) {
                HStack {
                    Image(systemName: "brain.head.profile")
                        .foregroundColor(EasyCookColors.primaryOrange)
                    Text("Why These Meals?")
                        .font(EasyCookFonts.bodyBold)
                        .foregroundColor(EasyCookColors.textPrimary)
                }

                Text(context)
                    .font(EasyCookFonts.callout)
                    .foregroundColor(EasyCookColors.textSecondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
    }
}

struct LoadingView: View {
    var body: some View {
        CardView {
            VStack(spacing: EasyCookSpacing.lg) {
                ProgressView()
                    .tint(EasyCookColors.primaryOrange)

                VStack(spacing: EasyCookSpacing.sm) {
                    Text("Crafting your perfect meal plan...")
                        .font(EasyCookFonts.bodyBold)
                        .foregroundColor(EasyCookColors.textPrimary)

                    Text("Our AI is analyzing your preferences")
                        .font(EasyCookFonts.footnote)
                        .foregroundColor(EasyCookColors.textSecondary)
                }
            }
            .frame(maxWidth: .infinity)
            .padding(EasyCookSpacing.xl)
        }
    }
}

struct EmptyStateView: View {
    let onGenerate: () -> Void

    var body: some View {
        CardView {
            VStack(spacing: EasyCookSpacing.lg) {
                Text("🍳")
                    .font(.system(size: 64))

                VStack(spacing: EasyCookSpacing.sm) {
                    Text("Ready to cook?")
                        .font(EasyCookFonts.title2)
                        .foregroundColor(EasyCookColors.textPrimary)

                    Text("Let's create your personalized meal plan")
                        .font(EasyCookFonts.body)
                        .foregroundColor(EasyCookColors.textSecondary)
                }

                PrimaryButton(title: "Generate Meal Plan", action: onGenerate)
            }
            .padding(EasyCookSpacing.xl)
        }
    }
}

struct MealDetailView: View {
    let meal: Meal
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: EasyCookSpacing.lg) {
                    // Hero image placeholder
                    RoundedRectangle(cornerRadius: EasyCookRadius.lg)
                        .fill(
                            LinearGradient(
                                colors: [EasyCookColors.primaryOrange, EasyCookColors.primaryTerracotta],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(height: 200)
                        .overlay(
                            Text(meal.cuisineType.emoji)
                                .font(.system(size: 80))
                        )

                    VStack(alignment: .leading, spacing: EasyCookSpacing.md) {
                        Text(meal.name)
                            .font(EasyCookFonts.largeTitle)
                            .foregroundColor(EasyCookColors.textPrimary)

                        Text(meal.description)
                            .font(EasyCookFonts.body)
                            .foregroundColor(EasyCookColors.textSecondary)

                        // Quick stats
                        HStack(spacing: EasyCookSpacing.lg) {
                            StatBadge(icon: "clock", text: "\(meal.totalTime) min")
                            StatBadge(icon: "person.2", text: "\(meal.servings) servings")
                            StatBadge(icon: "chart.bar", text: meal.difficulty.rawValue)
                        }

                        Divider()

                        // Ingredients
                        VStack(alignment: .leading, spacing: EasyCookSpacing.md) {
                            Text("Ingredients")
                                .font(EasyCookFonts.title2)
                                .foregroundColor(EasyCookColors.textPrimary)

                            ForEach(meal.ingredients) { ingredient in
                                HStack {
                                    Image(systemName: "circle.fill")
                                        .font(.system(size: 6))
                                        .foregroundColor(EasyCookColors.primaryOrange)
                                    Text(ingredient.displayText)
                                        .font(EasyCookFonts.body)
                                        .foregroundColor(EasyCookColors.textPrimary)
                                }
                            }
                        }

                        Divider()

                        // Instructions
                        VStack(alignment: .leading, spacing: EasyCookSpacing.md) {
                            Text("Instructions")
                                .font(EasyCookFonts.title2)
                                .foregroundColor(EasyCookColors.textPrimary)

                            ForEach(Array(meal.instructions.enumerated()), id: \.offset) { index, instruction in
                                HStack(alignment: .top, spacing: EasyCookSpacing.md) {
                                    Text("\(index + 1)")
                                        .font(EasyCookFonts.bodyBold)
                                        .foregroundColor(.white)
                                        .frame(width: 28, height: 28)
                                        .background(EasyCookColors.primaryOrange)
                                        .clipShape(Circle())

                                    Text(instruction)
                                        .font(EasyCookFonts.body)
                                        .foregroundColor(EasyCookColors.textPrimary)
                                }
                            }
                        }

                        // Nutrition info
                        if let nutrition = meal.nutritionInfo {
                            Divider()

                            VStack(alignment: .leading, spacing: EasyCookSpacing.md) {
                                Text("Nutrition (per serving)")
                                    .font(EasyCookFonts.title2)
                                    .foregroundColor(EasyCookColors.textPrimary)

                                HStack(spacing: EasyCookSpacing.lg) {
                                    NutritionBadge(label: "Calories", value: "\(nutrition.calories)")
                                    NutritionBadge(label: "Protein", value: "\(nutrition.protein)g")
                                    NutritionBadge(label: "Carbs", value: "\(nutrition.carbs)g")
                                    NutritionBadge(label: "Fat", value: "\(nutrition.fat)g")
                                }
                            }
                        }
                    }
                    .padding(EasyCookSpacing.lg)
                }
            }
            .background(EasyCookColors.backgroundCream)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
}

struct StatBadge: View {
    let icon: String
    let text: String

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: icon)
            Text(text)
        }
        .font(EasyCookFonts.caption)
        .foregroundColor(EasyCookColors.textSecondary)
    }
}

struct NutritionBadge: View {
    let label: String
    let value: String

    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(EasyCookFonts.bodyBold)
                .foregroundColor(EasyCookColors.textPrimary)
            Text(label)
                .font(EasyCookFonts.caption)
                .foregroundColor(EasyCookColors.textSecondary)
        }
    }
}

struct SettingsView: View {
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationView {
            List {
                Section("Preferences") {
                    Text("Update dietary preferences")
                    Text("Manage allergies")
                    Text("Cooking skill level")
                }

                Section("Account") {
                    Text("Reset onboarding")
                    Text("Privacy settings")
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
}

// MARK: - ViewModel

class MealPlanViewModel: ObservableObject {
    @Published var currentMealPlan: WeeklyMealPlan?
    @Published var isLoading = false
    @Published var error: Error?

    private let aiService = AIPersonalizationService()

    func generateMealPlan(for profile: UserProfile) {
        isLoading = true
        error = nil

        Task {
            do {
                let plan = try await aiService.generateWeeklyMealPlan(for: profile)
                await MainActor.run {
                    self.currentMealPlan = plan
                    self.isLoading = false
                }
            } catch {
                await MainActor.run {
                    self.error = error
                    self.isLoading = false
                }
            }
        }
    }
}
