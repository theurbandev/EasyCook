//
//  EasyCookApp.swift
//  EasyCook
//
//  Personalized meal planning powered by AI
//

import SwiftUI

@main
struct EasyCookApp: App {
    @StateObject private var appState = AppState()

    var body: some Scene {
        WindowGroup {
            if appState.hasCompletedOnboarding {
                MealPlanView()
                    .environmentObject(appState)
            } else {
                OnboardingView()
                    .environmentObject(appState)
            }
        }
    }
}

/// Global app state manager
class AppState: ObservableObject {
    @Published var hasCompletedOnboarding: Bool = false
    @Published var userProfile: UserProfile?

    init() {
        // Load saved state from UserDefaults
        self.hasCompletedOnboarding = UserDefaults.standard.bool(forKey: "hasCompletedOnboarding")
    }

    func completeOnboarding(with profile: UserProfile) {
        self.userProfile = profile
        self.hasCompletedOnboarding = true
        UserDefaults.standard.set(true, forKey: "hasCompletedOnboarding")
    }
}
