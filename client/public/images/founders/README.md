# Founder Profile Images

## How to Add Your Profile Pictures

To display your actual profile pictures on the landing page, follow these steps:

### 1. Prepare Your Images

**Image Requirements:**
- **Format**: JPG, JPEG, or PNG
- **Recommended Size**: 500x500 pixels (square)
- **Minimum Size**: 300x300 pixels
- **File Size**: Under 500KB for faster loading
- **Quality**: High-resolution, professional headshot

### 2. Name Your Image Files

Rename your photos to match these exact filenames:

- **Justice Tsehla**: `justice-tsehla.jpg`
- **Retsepile Phamane**: `retsepile-phamane.jpg`
- **Boitumelo Marasi**: `boitumelo-marasi.jpg`

### 3. Add Images to This Folder

Place your renamed image files in this folder:
```
client/public/images/founders/
```

The final structure should look like:
```
client/public/images/founders/
├── README.md (this file)
├── justice-tsehla.jpg
├── retsepile-phamane.jpg
└── boitumelo-marasi.jpg
```

### 4. Fallback Behavior

If an image is not found or fails to load, the system will automatically display:
- **JT** for Justice Tsehla (Blue background)
- **RP** for Retsepile Phamane (Green background)
- **BM** for Boitumelo Marasi (Purple background)

### 5. Test Your Images

After adding the images:
1. Rebuild the app: `npm run build`
2. Or just refresh in development mode
3. Visit the landing page and scroll to "Meet Our Founders" section
4. Your profile pictures should now be displayed!

### Tips for Best Results

✅ **Do's:**
- Use professional headshots with good lighting
- Ensure faces are centered and clearly visible
- Use neutral or professional backgrounds
- Maintain consistent style across all three photos

❌ **Don'ts:**
- Don't use low-resolution images
- Avoid busy or distracting backgrounds
- Don't crop faces too tightly
- Avoid images with excessive filters

### Image Optimization (Optional)

For better performance, you can optimize your images using online tools:
- **TinyPNG**: https://tinypng.com/
- **Squoosh**: https://squoosh.app/
- **ImageOptim**: https://imageoptim.com/

---

**Need Help?**
If images aren't displaying:
1. Check that filenames match exactly (case-sensitive)
2. Ensure files are in the correct folder
3. Clear browser cache: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
4. Check browser console for any errorss Profile Images

## 📁 Add Your Profile Pictures Here

### Required Images:
1. **founder1.jpg** - Thabo Mokoena (CEO)
2. **founder2.jpg** - Lerato Ramoeletsi (CTO) ⭐
3. **founder3.jpg** - Mpho Phiri (COO)

### Image Specifications:
- **Size:** 400x400px (square)
- **Format:** JPG or PNG
- **Quality:** High resolution
- **File Size:** < 100KB (recommended)
- **Style:** Professional headshot

### How to Add:
1. Save your profile photo as `founder2.jpg`
2. Copy it to this folder: `client/public/images/founders/`
3. The image will automatically display on the landing page

### Image Optimization Tools:
- **TinyPNG:** https://tinypng.com/
- **Squoosh:** https://squoosh.app/
- **Canva:** https://canva.com/ (for editing)

---

**Note:** Until you add real images, placeholder avatars with initials will be displayed.
