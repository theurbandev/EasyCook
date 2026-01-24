//
//  AIPersonalizationService.swift
//  EasyCook
//
//  AI-powered meal personalization using Claude API
//  Critical: Emphasis on deep personalization and context understanding
//

import Foundation

class AIPersonalizationService {
    private let apiKey: String
    private let apiEndpoint = "https://api.anthropic.com/v1/messages"
    private let model = "claude-3-5-sonnet-20241022" // Latest Claude model

    init() {
        // In production, load from secure storage or environment
        // For now, this should be set via configuration
        self.apiKey = ProcessInfo.processInfo.environment["ANTHROPIC_API_KEY"] ?? ""
    }

    /// Generate a highly personalized weekly meal plan
    /// Uses advanced prompting techniques to ensure meals match user preferences
    func generateWeeklyMealPlan(for profile: UserProfile) async throws -> WeeklyMealPlan {
        let prompt = buildPersonalizationPrompt(for: profile)
        let response = try await callClaudeAPI(prompt: prompt)
        let mealPlan = try parseMealPlanResponse(response, for: profile)
        return mealPlan
    }

    /// Build a comprehensive prompt that emphasizes personalization
    private func buildPersonalizationPrompt(for profile: UserProfile) -> String {
        var prompt = """
        You are an expert chef and nutritionist AI creating a HIGHLY PERSONALIZED weekly meal plan.

        CRITICAL: This meal plan must be deeply tailored to the user's specific preferences, skills, and constraints.
        The user should feel like these meals were hand-picked just for them.

        USER PROFILE:
        Name: \(profile.name)
        Cooking Skill Level: \(profile.cookingSkillLevel.rawValue) - \(profile.cookingSkillLevel.description)
        Household Size: \(profile.householdSize) people

        """

        // Dietary preferences - CRITICAL constraints
        if !profile.dietaryPreferences.activePreferences.isEmpty {
            prompt += """

            DIETARY REQUIREMENTS (MUST BE STRICTLY FOLLOWED):
            \(profile.dietaryPreferences.activePreferences.joined(separator: ", "))

            """
        }

        // Allergies - ABSOLUTE constraints
        if !profile.allergies.isEmpty {
            prompt += """

            ALLERGIES (NEVER INCLUDE THESE):
            \(profile.allergies.joined(separator: ", "))

            """
        }

        // Dislikes - Strong preferences
        if !profile.dislikedIngredients.isEmpty {
            prompt += """

            DISLIKED INGREDIENTS (AVOID IF POSSIBLE):
            \(profile.dislikedIngredients.joined(separator: ", "))

            """
        }

        // Favorite ingredients - Positive signals
        if !profile.favoriteIngredients.isEmpty {
            prompt += """

            FAVORITE INGREDIENTS (TRY TO INCORPORATE):
            \(profile.favoriteIngredients.joined(separator: ", "))

            """
        }

        // Cuisine preferences
        if !profile.cuisinePreferences.isEmpty {
            let cuisines = profile.cuisinePreferences.map { $0.rawValue }.joined(separator: ", ")
            prompt += """

            PREFERRED CUISINES:
            \(cuisines)
            Focus on these cuisines, but feel free to introduce complementary styles.

            """
        }

        // Time and complexity constraints
        prompt += """

        COOKING PREFERENCES:
        - Preferred cooking time: \(profile.cookingTimePreference.rawValue)
        - Meal complexity preference: \(profile.mealComplexityPreference.rawValue)
        - Adjust recipes to match the user's \(profile.cookingSkillLevel.rawValue) skill level

        """

        // Photo context (if available)
        if !profile.uploadedPhotoURLs.isEmpty {
            prompt += """

            VISUAL PREFERENCES:
            The user has uploaded \(profile.uploadedPhotoURLs.count) photos of meals they enjoy.
            While you cannot see these photos, consider that the user likely prefers:
            - Visually appealing, well-plated dishes
            - Meals similar to what they've photographed (comfort foods, home cooking, or restaurant-quality dishes)

            """
        }

        // Core requirements
        prompt += """

        TASK: Create a 7-day meal plan with breakfast, lunch, and dinner for each day.

        PERSONALIZATION REQUIREMENTS:
        1. Every meal must align with the user's dietary restrictions and preferences
        2. Match the cooking skill level - don't suggest advanced techniques to beginners
        3. Respect time constraints - if they prefer quick meals, keep it under 30-45 minutes
        4. Create variety across the week - different proteins, cooking methods, and flavors
        5. Consider household size for ingredient quantities and serving sizes
        6. Balance nutrition across the week while respecting preferences
        7. Add 1-2 "stretch" meals that slightly challenge their skill level (optional growth)

        PERSONALIZATION SCORING:
        For each meal, provide a personalization score (0.0-1.0) based on:
        - How well it matches dietary requirements (0.3 weight)
        - Alignment with cuisine preferences (0.2 weight)
        - Appropriate skill level (0.2 weight)
        - Includes favorite ingredients (0.15 weight)
        - Avoids disliked ingredients (0.15 weight)

        RESPONSE FORMAT (JSON):
        {
          "week_start_date": "2026-01-27",
          "personalization_context": "Brief explanation of why these meals were chosen and how they match the user's profile",
          "days": [
            {
              "day_of_week": "Monday",
              "date": "2026-01-27",
              "breakfast": {
                "name": "Meal name",
                "description": "Brief description",
                "cuisine_type": "Italian/Mexican/etc",
                "prep_time": 10,
                "cook_time": 15,
                "servings": 2,
                "difficulty": "Beginner/Intermediate/Advanced/Chef",
                "ingredients": [
                  {"name": "ingredient", "amount": "1", "unit": "cup"}
                ],
                "instructions": ["Step 1", "Step 2"],
                "nutrition": {
                  "calories": 400,
                  "protein": 20,
                  "carbs": 45,
                  "fat": 15,
                  "fiber": 5,
                  "sodium": 300
                },
                "tags": ["Quick", "Healthy"],
                "personalization_score": 0.85
              },
              "lunch": { ... },
              "dinner": { ... }
            }
          ]
        }

        Generate a thoughtful, personalized meal plan now.
        """

        return prompt
    }

    /// Call Claude API with the personalization prompt
    private func callClaudeAPI(prompt: String) async throws -> String {
        guard !apiKey.isEmpty else {
            // For development, return mock data
            return generateMockResponse()
        }

        var request = URLRequest(url: URL(string: apiEndpoint)!)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(apiKey, forHTTPHeaderField: "x-api-key")
        request.setValue("2023-06-01", forHTTPHeaderField: "anthropic-version")

        let body: [String: Any] = [
            "model": model,
            "max_tokens": 8192,
            "messages": [
                [
                    "role": "user",
                    "content": prompt
                ]
            ],
            "temperature": 0.7, // Slightly creative but consistent
            "system": "You are a professional chef and nutritionist AI assistant specializing in personalized meal planning. You deeply understand dietary requirements, cooking techniques, and how to match meals to individual preferences."
        ]

        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
              (200...299).contains(httpResponse.statusCode) else {
            throw AIServiceError.invalidResponse
        }

        let json = try JSONSerialization.jsonObject(with: data) as? [String: Any]
        guard let content = json?["content"] as? [[String: Any]],
              let text = content.first?["text"] as? String else {
            throw AIServiceError.invalidResponse
        }

        return text
    }

    /// Parse the AI response into a WeeklyMealPlan
    private func parseMealPlanResponse(_ response: String, for profile: UserProfile) throws -> WeeklyMealPlan {
        // Extract JSON from response (handle both raw JSON and markdown code blocks)
        let jsonString: String
        if response.contains("```json") {
            let components = response.components(separatedBy: "```json")
            if components.count > 1 {
                let endComponents = components[1].components(separatedBy: "```")
                jsonString = endComponents[0].trimmingCharacters(in: .whitespacesAndNewlines)
            } else {
                jsonString = response
            }
        } else if response.contains("```") {
            let components = response.components(separatedBy: "```")
            if components.count > 1 {
                jsonString = components[1].trimmingCharacters(in: .whitespacesAndNewlines)
            } else {
                jsonString = response
            }
        } else {
            jsonString = response
        }

        guard let data = jsonString.data(using: .utf8),
              let json = try JSONSerialization.jsonObject(with: data) as? [String: Any] else {
            throw AIServiceError.parsingError
        }

        // Parse the response
        let dateFormatter = ISO8601DateFormatter()
        let weekStartString = json["week_start_date"] as? String ?? ""
        let weekStartDate = dateFormatter.date(from: weekStartString + "T00:00:00Z") ?? Date()
        let personalizationContext = json["personalization_context"] as? String ?? ""

        var dayPlans: [DayMealPlan] = []

        if let days = json["days"] as? [[String: Any]] {
            for dayData in days {
                let dateString = dayData["date"] as? String ?? ""
                let date = dateFormatter.date(from: dateString + "T00:00:00Z") ?? Date()
                var dayPlan = DayMealPlan(date: date)

                if let breakfastData = dayData["breakfast"] as? [String: Any] {
                    dayPlan.breakfast = parseMeal(from: breakfastData)
                }
                if let lunchData = dayData["lunch"] as? [String: Any] {
                    dayPlan.lunch = parseMeal(from: lunchData)
                }
                if let dinnerData = dayData["dinner"] as? [String: Any] {
                    dayPlan.dinner = parseMeal(from: dinnerData)
                }

                dayPlans.append(dayPlan)
            }
        }

        return WeeklyMealPlan(
            weekStartDate: weekStartDate,
            meals: dayPlans,
            personalizationContext: personalizationContext
        )
    }

    private func parseMeal(from data: [String: Any]) -> Meal {
        let name = data["name"] as? String ?? ""
        let description = data["description"] as? String ?? ""
        let cuisineTypeString = data["cuisine_type"] as? String ?? "American"
        let cuisineType = CuisineType(rawValue: cuisineTypeString) ?? .american
        let prepTime = data["prep_time"] as? Int ?? 15
        let cookTime = data["cook_time"] as? Int ?? 20
        let servings = data["servings"] as? Int ?? 2
        let difficultyString = data["difficulty"] as? String ?? "Intermediate"
        let difficulty = CookingSkillLevel(rawValue: difficultyString) ?? .intermediate
        let personalizationScore = data["personalization_score"] as? Double ?? 0.75

        var ingredients: [Ingredient] = []
        if let ingredientsData = data["ingredients"] as? [[String: Any]] {
            ingredients = ingredientsData.compactMap { ingData in
                guard let name = ingData["name"] as? String,
                      let amount = ingData["amount"] as? String else {
                    return nil
                }
                let unit = ingData["unit"] as? String
                return Ingredient(name: name, amount: amount, unit: unit)
            }
        }

        let instructions = data["instructions"] as? [String] ?? []
        let tags = data["tags"] as? [String] ?? []

        var nutritionInfo: NutritionInfo?
        if let nutritionData = data["nutrition"] as? [String: Any] {
            nutritionInfo = NutritionInfo(
                calories: nutritionData["calories"] as? Int ?? 0,
                protein: nutritionData["protein"] as? Int ?? 0,
                carbs: nutritionData["carbs"] as? Int ?? 0,
                fat: nutritionData["fat"] as? Int ?? 0,
                fiber: nutritionData["fiber"] as? Int,
                sodium: nutritionData["sodium"] as? Int
            )
        }

        return Meal(
            name: name,
            description: description,
            cuisineType: cuisineType,
            prepTime: prepTime,
            cookTime: cookTime,
            servings: servings,
            difficulty: difficulty,
            ingredients: ingredients,
            instructions: instructions,
            nutritionInfo: nutritionInfo,
            tags: tags,
            personalizationScore: personalizationScore
        )
    }

    /// Generate mock response for development/testing
    private func generateMockResponse() -> String {
        return """
        ```json
        {
          "week_start_date": "2026-01-27",
          "personalization_context": "This week's menu focuses on quick, intermediate-level recipes that match your preferences. I've included a variety of cuisines you enjoy while respecting your dietary needs. Each meal can be prepared in under 45 minutes and serves your household size.",
          "days": [
            {
              "day_of_week": "Monday",
              "date": "2026-01-27",
              "breakfast": {
                "name": "Mediterranean Veggie Scramble",
                "description": "Fluffy eggs with tomatoes, spinach, and feta cheese",
                "cuisine_type": "Mediterranean",
                "prep_time": 5,
                "cook_time": 10,
                "servings": 2,
                "difficulty": "Beginner",
                "ingredients": [
                  {"name": "Eggs", "amount": "4", "unit": "large"},
                  {"name": "Cherry tomatoes", "amount": "1", "unit": "cup"},
                  {"name": "Fresh spinach", "amount": "2", "unit": "cups"},
                  {"name": "Feta cheese", "amount": "1/4", "unit": "cup"},
                  {"name": "Olive oil", "amount": "1", "unit": "tbsp"}
                ],
                "instructions": [
                  "Heat olive oil in a pan over medium heat",
                  "Add cherry tomatoes and cook for 2 minutes",
                  "Add spinach and cook until wilted",
                  "Whisk eggs and pour into pan",
                  "Scramble gently, then top with feta",
                  "Serve hot with whole grain toast"
                ],
                "nutrition": {
                  "calories": 320,
                  "protein": 22,
                  "carbs": 8,
                  "fat": 23,
                  "fiber": 2,
                  "sodium": 450
                },
                "tags": ["Quick", "Healthy", "Vegetarian"],
                "personalization_score": 0.88
              },
              "lunch": {
                "name": "Thai Chicken Lettuce Wraps",
                "description": "Light and flavorful ground chicken with herbs and peanut sauce",
                "cuisine_type": "Thai",
                "prep_time": 10,
                "cook_time": 15,
                "servings": 2,
                "difficulty": "Intermediate",
                "ingredients": [
                  {"name": "Ground chicken", "amount": "1", "unit": "lb"},
                  {"name": "Butter lettuce", "amount": "1", "unit": "head"},
                  {"name": "Fresh cilantro", "amount": "1/4", "unit": "cup"},
                  {"name": "Peanut sauce", "amount": "1/4", "unit": "cup"},
                  {"name": "Lime", "amount": "1", "unit": "whole"}
                ],
                "instructions": [
                  "Cook ground chicken in a pan until browned",
                  "Add garlic and ginger, cook 1 minute",
                  "Stir in soy sauce and lime juice",
                  "Separate lettuce leaves and wash",
                  "Spoon chicken into lettuce cups",
                  "Top with cilantro and peanut sauce"
                ],
                "nutrition": {
                  "calories": 380,
                  "protein": 35,
                  "carbs": 12,
                  "fat": 22,
                  "fiber": 3,
                  "sodium": 620
                },
                "tags": ["Light", "Asian", "Low-Carb"],
                "personalization_score": 0.92
              },
              "dinner": {
                "name": "Creamy Tuscan Chicken",
                "description": "Tender chicken in a rich, creamy sauce with sun-dried tomatoes and spinach",
                "cuisine_type": "Italian",
                "prep_time": 15,
                "cook_time": 25,
                "servings": 2,
                "difficulty": "Intermediate",
                "ingredients": [
                  {"name": "Chicken breast", "amount": "2", "unit": "pieces"},
                  {"name": "Heavy cream", "amount": "1/2", "unit": "cup"},
                  {"name": "Sun-dried tomatoes", "amount": "1/4", "unit": "cup"},
                  {"name": "Fresh spinach", "amount": "2", "unit": "cups"},
                  {"name": "Garlic", "amount": "3", "unit": "cloves"},
                  {"name": "Parmesan cheese", "amount": "1/4", "unit": "cup"}
                ],
                "instructions": [
                  "Season chicken with salt and pepper",
                  "Sear chicken in olive oil until golden, 5-6 minutes per side",
                  "Remove chicken and set aside",
                  "Sauté garlic until fragrant",
                  "Add cream, sun-dried tomatoes, and parmesan",
                  "Stir in spinach until wilted",
                  "Return chicken to pan and simmer 5 minutes",
                  "Serve hot with pasta or rice"
                ],
                "nutrition": {
                  "calories": 425,
                  "protein": 38,
                  "carbs": 12,
                  "fat": 26,
                  "fiber": 2,
                  "sodium": 580
                },
                "tags": ["Comfort Food", "Italian", "Family-Friendly"],
                "personalization_score": 0.90
              }
            }
          ]
        }
        ```
        """
    }
}

enum AIServiceError: Error {
    case invalidResponse
    case parsingError
    case networkError
    case unauthorized
}
