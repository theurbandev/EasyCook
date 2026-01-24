//
//  DesignSystem.swift
//  EasyCook
//
//  Playful, warm, and earthy design system
//

import SwiftUI

/// EasyCook Color Palette - Warm & Earthy
struct EasyCookColors {
    // Primary Colors - Warm & Inviting
    static let primaryOrange = Color(hex: "E87461")      // Warm coral-orange
    static let primaryTerracotta = Color(hex: "D4765C")  // Earthy terracotta
    static let accentSage = Color(hex: "9DB89F")         // Soft sage green

    // Background Colors - Natural & Calm
    static let backgroundCream = Color(hex: "F9F5F0")    // Warm cream
    static let backgroundBeige = Color(hex: "F5EDE4")    // Soft beige
    static let cardBackground = Color(hex: "FFFFFF")     // Clean white

    // Text Colors
    static let textPrimary = Color(hex: "2D3436")        // Deep charcoal
    static let textSecondary = Color(hex: "636E72")      // Soft gray
    static let textTertiary = Color(hex: "B2BEC3")       // Light gray

    // Accent Colors - Playful Touches
    static let accentYellow = Color(hex: "F6C667")       // Warm honey
    static let accentBrown = Color(hex: "A0826D")        // Toasted brown
    static let accentMint = Color(hex: "B8DDD3")         // Fresh mint

    // Semantic Colors
    static let success = Color(hex: "81C784")            // Fresh green
    static let warning = Color(hex: "FFB74D")            // Gentle amber
    static let error = Color(hex: "E57373")              // Soft red
}

/// Typography System
struct EasyCookFonts {
    // Headings - Playful & Friendly
    static let largeTitle = Font.system(size: 34, weight: .bold, design: .rounded)
    static let title1 = Font.system(size: 28, weight: .bold, design: .rounded)
    static let title2 = Font.system(size: 22, weight: .semibold, design: .rounded)
    static let title3 = Font.system(size: 20, weight: .semibold, design: .rounded)

    // Body Text - Readable & Warm
    static let body = Font.system(size: 17, weight: .regular, design: .default)
    static let bodyBold = Font.system(size: 17, weight: .semibold, design: .default)
    static let callout = Font.system(size: 16, weight: .regular, design: .default)

    // Supporting Text
    static let subheadline = Font.system(size: 15, weight: .regular, design: .default)
    static let footnote = Font.system(size: 13, weight: .regular, design: .default)
    static let caption = Font.system(size: 12, weight: .regular, design: .default)
}

/// Spacing System
struct EasyCookSpacing {
    static let xs: CGFloat = 4
    static let sm: CGFloat = 8
    static let md: CGFloat = 16
    static let lg: CGFloat = 24
    static let xl: CGFloat = 32
    static let xxl: CGFloat = 48
}

/// Corner Radius System
struct EasyCookRadius {
    static let sm: CGFloat = 8
    static let md: CGFloat = 12
    static let lg: CGFloat = 16
    static let xl: CGFloat = 24
    static let round: CGFloat = 999
}

// MARK: - Helper Extensions

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - Reusable Components

struct PrimaryButton: View {
    let title: String
    let action: () -> Void
    var isEnabled: Bool = true

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(EasyCookFonts.bodyBold)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, EasyCookSpacing.md)
                .background(isEnabled ? EasyCookColors.primaryOrange : EasyCookColors.textTertiary)
                .cornerRadius(EasyCookRadius.md)
        }
        .disabled(!isEnabled)
    }
}

struct SecondaryButton: View {
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(EasyCookFonts.bodyBold)
                .foregroundColor(EasyCookColors.primaryOrange)
                .frame(maxWidth: .infinity)
                .padding(.vertical, EasyCookSpacing.md)
                .background(EasyCookColors.backgroundBeige)
                .cornerRadius(EasyCookRadius.md)
        }
    }
}

struct CardView<Content: View>: View {
    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        content
            .padding(EasyCookSpacing.lg)
            .background(EasyCookColors.cardBackground)
            .cornerRadius(EasyCookRadius.lg)
            .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 2)
    }
}
