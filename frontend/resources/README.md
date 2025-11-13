# Mobile App Assets

This directory contains source assets for generating app icons and splash screens for iOS and Android.

## Required Files

Place the following files in this directory:

### 1. App Icon
- **Filename**: `icon.png`
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Purpose**: App icon shown on home screen

**Design tips:**
- Use simple, recognizable imagery
- Ensure it looks good when scaled down
- Test on both light and dark backgrounds
- Avoid small text (won't be readable at small sizes)

### 2. Splash Screen
- **Filename**: `splash.png`
- **Size**: 2732x2732 pixels (centered content safe zone: 1200x1200)
- **Format**: PNG
- **Purpose**: Loading screen when app launches

**Design tips:**
- Keep important content in the center (1200x1200 area)
- Use a solid background color matching your brand
- Consider both light and dark mode appearances
- Simple is better - users only see this briefly

## Generating Assets

Once you have `icon.png` and `splash.png` in this directory:

### Option 1: Automatic Generation (Recommended)

```bash
# Install the Capacitor assets tool (already added to package.json)
npm install -D @capacitor/assets

# Generate all required sizes
npx capacitor-assets generate
```

This will automatically create:
- All icon sizes for iOS and Android
- All splash screen sizes for iOS and Android
- Properly sized and formatted for each platform

### Option 2: Manual Creation

If you prefer manual control:

**Android Icons** (`android/app/src/main/res/`):
- mipmap-mdpi (48x48)
- mipmap-hdpi (72x72)
- mipmap-xhdpi (96x96)
- mipmap-xxhdpi (144x144)
- mipmap-xxxhdpi (192x192)

**iOS Icons** (`ios/App/App/Assets.xcassets/AppIcon.appiconset/`):
- Multiple sizes from 20x20 to 1024x1024
- Configure via Xcode

## Current Status

🔴 **Action Required**: You need to create the source images:
1. Design your app icon (1024x1024)
2. Design your splash screen (2732x2732)
3. Save them as `icon.png` and `splash.png` in this directory
4. Run `npx capacitor-assets generate`

## Design Resources

### Free Tools
- [Figma](https://www.figma.com/) - Design tool with templates
- [Canva](https://www.canva.com/) - Easy graphic design
- [GIMP](https://www.gimp.org/) - Free Photoshop alternative

### Templates & Generators
- [App Icon Generator](https://www.appicon.co/)
- [Capacitor Assets](https://github.com/ionic-team/capacitor-assets)

### Design Guidelines
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- [Android Icon Design](https://developer.android.com/develop/ui/views/launch/icon_design)

## Example Icon Ideas for JournalXP

Since JournalXP is a mental health journaling app, consider:
- 📓 A journal/notebook icon
- ✨ A star or sparkle (representing growth/XP)
- 🌱 A plant/seedling (representing personal growth)
- 💚 A heart (representing mental health/wellness)
- 🧘 A meditation/zen symbol
- 📝 A pen and paper

Colors that work well for wellness apps:
- Calming blues and greens
- Soft purples
- Warm earth tones
- Gradients with pastel colors

## Next Steps

1. Create or commission your icon and splash screen designs
2. Save them in this directory with the correct names
3. Run the asset generator
4. Test on actual devices to ensure they look good
5. Iterate on the design if needed

---

**Need help?** Check the main mobile guide at `frontend/MOBILE.md`
