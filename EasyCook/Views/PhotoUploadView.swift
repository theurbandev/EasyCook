//
//  PhotoUploadView.swift
//  EasyCook
//
//  Photo upload and image picker functionality
//

import SwiftUI
import PhotosUI

struct PhotoUploadView: View {
    @Binding var photoURLs: [String]
    @State private var selectedItems: [PhotosPickerItem] = []

    var body: some View {
        VStack(spacing: EasyCookSpacing.lg) {
            Text("Upload Your Favorite Meals")
                .font(EasyCookFonts.title2)
                .foregroundColor(EasyCookColors.textPrimary)

            Text("Help our AI learn your taste by showing us what you love")
                .font(EasyCookFonts.body)
                .foregroundColor(EasyCookColors.textSecondary)
                .multilineTextAlignment(.center)

            PhotosPicker(
                selection: $selectedItems,
                maxSelectionCount: 10,
                matching: .images
            ) {
                VStack(spacing: EasyCookSpacing.md) {
                    Image(systemName: "photo.on.rectangle.angled")
                        .font(.system(size: 48))
                        .foregroundColor(EasyCookColors.primaryOrange)

                    Text("Choose Photos")
                        .font(EasyCookFonts.bodyBold)
                        .foregroundColor(EasyCookColors.primaryOrange)
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
            .onChange(of: selectedItems) { newItems in
                Task {
                    await loadPhotos(from: newItems)
                }
            }

            if !photoURLs.isEmpty {
                VStack(alignment: .leading, spacing: EasyCookSpacing.sm) {
                    Text("\(photoURLs.count) photos selected")
                        .font(EasyCookFonts.caption)
                        .foregroundColor(EasyCookColors.textSecondary)

                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: EasyCookSpacing.sm) {
                            ForEach(photoURLs, id: \.self) { url in
                                PhotoThumbnail(url: url) {
                                    removePhoto(url)
                                }
                            }
                        }
                    }
                }
            }
        }
        .padding(EasyCookSpacing.lg)
    }

    private func loadPhotos(from items: [PhotosPickerItem]) async {
        photoURLs.removeAll()

        for item in items {
            if let data = try? await item.loadTransferable(type: Data.self) {
                // In production, save to local storage and return file URL
                // For now, create a placeholder URL
                let filename = UUID().uuidString + ".jpg"
                photoURLs.append(filename)
            }
        }
    }

    private func removePhoto(_ url: String) {
        photoURLs.removeAll { $0 == url }
    }
}

struct PhotoThumbnail: View {
    let url: String
    let onDelete: () -> Void

    var body: some View {
        ZStack(alignment: .topTrailing) {
            RoundedRectangle(cornerRadius: EasyCookRadius.md)
                .fill(
                    LinearGradient(
                        colors: [EasyCookColors.primaryOrange.opacity(0.3), EasyCookColors.accentSage.opacity(0.3)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .frame(width: 100, height: 100)
                .overlay(
                    Image(systemName: "photo.fill")
                        .font(.system(size: 32))
                        .foregroundColor(EasyCookColors.primaryOrange.opacity(0.6))
                )

            Button(action: onDelete) {
                Image(systemName: "xmark.circle.fill")
                    .font(.system(size: 24))
                    .foregroundColor(EasyCookColors.error)
                    .background(Color.white.clipShape(Circle()))
            }
            .offset(x: 8, y: -8)
        }
    }
}

#Preview {
    PhotoUploadView(photoURLs: .constant([]))
}
