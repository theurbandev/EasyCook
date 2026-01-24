//
//  Meal.swift
//  EasyCook
//
//  Meal and recipe data models
//

import Foundation

struct Meal: Codable, Identifiable {
    var id: UUID = UUID()
    var name: String
    var description: String
    var cuisineType: CuisineType
    var prepTime: Int // minutes
    var cookTime: Int // minutes
    var servings: Int
    var difficulty: CookingSkillLevel
    var ingredients: [Ingredient]
    var instructions: [String]
    var nutritionInfo: NutritionInfo?
    var imageURL: String?
    var tags: [String]
    var isAIGenerated: Bool = true
    var personalizationScore: Double // 0.0 to 1.0 - how well it matches user preferences

    var totalTime: Int {
        prepTime + cookTime
    }

    var timeDescription: String {
        "\(totalTime) min"
    }
}

struct Ingredient: Codable, Identifiable {
    var id: UUID = UUID()
    var name: String
    var amount: String
    var unit: String?
    var isOptional: Bool = false

    var displayText: String {
        if let unit = unit {
            return "\(amount) \(unit) \(name)"
        }
        return "\(amount) \(name)"
    }
}

struct NutritionInfo: Codable {
    var calories: Int
    var protein: Int // grams
    var carbs: Int // grams
    var fat: Int // grams
    var fiber: Int? // grams
    var sodium: Int? // milligrams
}

struct WeeklyMealPlan: Codable, Identifiable {
    var id: UUID = UUID()
    var weekStartDate: Date
    var meals: [DayMealPlan]
    var generatedAt: Date = Date()
    var personalizationContext: String // Summary of why these meals were chosen

    var weekDescription: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMM d"
        let endDate = Calendar.current.date(byAdding: .day, value: 6, to: weekStartDate) ?? weekStartDate
        return "\(formatter.string(from: weekStartDate)) - \(formatter.string(from: endDate))"
    }
}

struct DayMealPlan: Codable, Identifiable {
    var id: UUID = UUID()
    var date: Date
    var dayOfWeek: String
    var breakfast: Meal?
    var lunch: Meal?
    var dinner: Meal?
    var snacks: [Meal]?

    var mainMeals: [Meal] {
        [breakfast, lunch, dinner].compactMap { $0 }
    }

    var allMeals: [Meal] {
        mainMeals + (snacks ?? [])
    }

    init(date: Date) {
        self.date = date
        let formatter = DateFormatter()
        formatter.dateFormat = "EEEE"
        self.dayOfWeek = formatter.string(from: date)
    }
}

// MARK: - Sample Data for Development

extension Meal {
    static let sample = Meal(
        name: "Creamy Tuscan Chicken",
        description: "Tender chicken in a rich, creamy sauce with sun-dried tomatoes and spinach",
        cuisineType: .italian,
        prepTime: 15,
        cookTime: 25,
        servings: 4,
        difficulty: .intermediate,
        ingredients: [
            Ingredient(name: "Chicken breast", amount: "4", unit: "pieces"),
            Ingredient(name: "Heavy cream", amount: "1", unit: "cup"),
            Ingredient(name: "Sun-dried tomatoes", amount: "1/2", unit: "cup"),
            Ingredient(name: "Fresh spinach", amount: "2", unit: "cups"),
            Ingredient(name: "Garlic", amount: "3", unit: "cloves"),
            Ingredient(name: "Parmesan cheese", amount: "1/2", unit: "cup")
        ],
        instructions: [
            "Season chicken with salt and pepper",
            "Sear chicken in olive oil until golden, 5-6 minutes per side",
            "Remove chicken and set aside",
            "Sauté garlic until fragrant",
            "Add cream, sun-dried tomatoes, and parmesan",
            "Stir in spinach until wilted",
            "Return chicken to pan and simmer 5 minutes",
            "Serve hot with pasta or rice"
        ],
        nutritionInfo: NutritionInfo(
            calories: 425,
            protein: 38,
            carbs: 12,
            fat: 26,
            fiber: 2,
            sodium: 580
        ),
        tags: ["Comfort Food", "Quick", "Family-Friendly"],
        personalizationScore: 0.92
    )
}
