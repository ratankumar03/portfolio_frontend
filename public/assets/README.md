# Assets Folder

This folder contains all media assets for the portfolio website.

## 📁 Folder Structure

```
assets/
├── images/       # Profile photos, background images
├── icons/        # Icon files, logos, favicons
└── projects/     # Project screenshots and thumbnails
```

## 📸 Supported Image Formats

- **JPG/JPEG** - Standard photo format (recommended for photos)
- **PNG** - Transparent images, logos, icons
- **JFIF** - JPEG File Interchange Format (alternative JPEG format)

## 📋 Guidelines

### Images Folder
- Place your profile photo here: `images/profile.jpg` (or `.png`, `.jfif`)
- Recommended size: 400x400 pixels (square)
- Background images and other photos

### Icons Folder
- Logo files
- Favicon files
- UI icons
- Recommended: PNG format with transparency

### Projects Folder
- Project screenshots
- Project thumbnails
- Demo images
- Recommended size: 1200x800 pixels (landscape)

## 💡 Usage in Code

Reference images using:
```jsx
// Profile image
<img src="/assets/images/profile.jpg" alt="Profile" />

// Project image
<img src="/assets/projects/project-name.png" alt="Project" />

// Icon
<img src="/assets/icons/logo.png" alt="Logo" />
```

## 🎨 Optimization Tips

1. **Compress images** before uploading to reduce file size
2. **Use appropriate format**:
   - JPG/JFIF for photos
   - PNG for images with transparency
3. **Recommended dimensions**:
   - Profile: 400x400px
   - Projects: 1200x800px
   - Icons: 64x64px or 128x128px

## 🔗 Helpful Tools

- **TinyPNG** - Image compression (https://tinypng.com/)
- **Squoosh** - Image optimization (https://squoosh.app/)
- **ImageOptim** - Batch optimization

---

**Note**: All formats (JPG, PNG, JFIF) are fully supported throughout the application.
