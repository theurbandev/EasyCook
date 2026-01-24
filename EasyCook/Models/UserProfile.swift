//
//  UserProfile.swift
//  EasyCook
//
//  User preferences and profile data
//

import Foundation
import SwiftUI

struct UserProfile: Codable {
    var id: UUID = UUID()
    var name: String
    var dietaryPreferences: DietaryPreferences
    var cookingSkillLevel: CookingSkillLevel
    var householdSize: Int
    var allergies: [String]
    var dislikedIngredients: [String]
    var favoriteIngredients: [String]
    var cuisinePreferences: [CuisineType]
    var mealComplexityPreference: MealComplexity
    var cookingTimePreference: CookingTime
    var uploadedPhotoURLs: [String]
    var createdAt: Date = Date()

    init(
        name: String,
        dietaryPreferences: DietaryPreferences = DietaryPreferences(),
        cookingSkillLevel: CookingSkillLevel = .intermediate,
        householdSize: Int = 1,
        allergies: [String] = [],
        dislikedIngredients: [String] = [],
        favoriteIngredients: [String] = [],
        cuisinePreferences: [CuisineType] = [],
        mealComplexityPreference: MealComplexity = .moderate,
        cookingTimePreference: CookingTime = .medium,
        uploadedPhotoURLs: [String] = []
    ) {
        self.name = name
        self.dietaryPreferences = dietaryPreferences
        self.cookingSkillLevel = cookingSkillLevel
        self.householdSize = householdSize
        self.allergies = allergies
        self.dislikedIngredients = dislikedIngredients
        self.favoriteIngredients = favoriteIngredients
        self.cuisinePreferences = cuisinePreferences
        self.mealComplexityPreference = mealComplexityPreference
        self.cookingTimePreference = cookingTimePreference
        self.uploadedPhotoURLs = uploadedPhotoURLs
    }
}

struct DietaryPreferences: Codable {
    var isVegetarian: Bool = false
    var isVegan: Bool = false
    var isGlutenFree: Bool = false
    var isDairyFree: Bool = false
    var isKeto: Bool = false
    var isPaleo: Bool = false
    var isLowCarb: Bool = false
    var isHalal: Bool = false
    var isKosher: Bool = false

    var activePreferences: [String] {
        var preferences: [String] = []
        if isVegetarian { preferences.append("Vegetarian") }
        if isVegan { preferences.append("Vegan") }
        if isGlutenFree { preferences.append("Gluten-Free") }
        if isDairyFree { preferences.append("Dairy-Free") }
        if isKeto { preferences.append("Keto") }
        if isPaleo { preferences.append("Paleo") }
        if isLowCarb { preferences.append("Low-Carb") }
        if isHalal { preferences.append("Halal") }
        if isKosher { preferences.append("Kosher") }
        return preferences
    }
}

enum CookingSkillLevel: String, Codable, CaseIterable {
    case beginner = "Beginner"
    case intermediate = "Intermediate"
    case advanced = "Advanced"
    case chef = "Home Chef"

    var icon: String {
        switch self {
        case .beginner: return "🌱"
        case .intermediate: return "👨‍🍳"
        case .advanced: return "⭐"
        case .chef: return "🏆"
        }
    }

    var description: String {
        switch self {
        case .beginner: return "Simple recipes with basic techniques"
        case .intermediate: return "Moderate recipes with some techniques"
        case .advanced: return "Complex recipes with advanced techniques"
        case .chef: return "Challenging gourmet recipes"
        }
    }
}

enum CuisineType: String, Codable, CaseIterable {
    case italian = "Italian"
    case mexican = "Mexican"
    case asian = "Asian"
    case indian = "Indian"
    case mediterranean = "Mediterranean"
    case american = "American"
    case french = "French"
    case japanese = "Japanese"
    case thai = "Thai"
    case chinese = "Chinese"
    case greek = "Greek"
    case middleEastern = "Middle Eastern"

    var emoji: String {
        switch self {
        case .italian: return "🍝"
        case .mexican: return "🌮"
        case .asian: return "🥢"
        case .indian: return "🍛"
        case .mediterranean: return "🥙"
        case .american: return "🍔"
        case .french: return "🥐"
        case .japanese: return "🍱"
        case .thai: return "🍜"
        case .chinese: return "🥡"
        case .greek: return "🥗"
        case .middleEastern: return "🧆"
        }
    }
}

enum MealComplexity: String, Codable, CaseIterable {
    case simple = "Simple & Quick"
    case moderate = "Moderate"
    case elaborate = "Elaborate & Special"

    var icon: String {
        switch self {
        case .simple: return "⚡"
        case .moderate: return "⭐"
        case .elaborate: return "✨"
        }
    }
}

enum CookingTime: String, Codable, CaseIterable {
    case quick = "15-30 minutes"
    case medium = "30-60 minutes"
    case long = "60+ minutes"
    case flexible = "Flexible"

    var icon: String {
        switch self {
        case .quick: return "⏱️"
        case .medium: return "⏰"
        case .long: return "🕐"
        case .flexible: return "🔄"
        }
    }
}
