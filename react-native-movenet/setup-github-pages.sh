#!/bin/bash
# Script untuk commit dan enable GitHub Pages

echo "🚀 Setup GitHub Pages untuk Model"
echo "=================================="
echo ""

cd /home/amelia-ocha/Documents/project_izin/react-native-movenet

# Step 1: Add files
echo "📦 Step 1: Adding files to git..."
git add docs/
git add src/models/MoveNetModel.js
git add MODEL_SOLUTIONS.md
git add QUICK_FIX_REAL_MODEL.md
git add REBUILD_REQUIRED.md
git add START_DEV.md

# Step 2: Commit
echo "💾 Step 2: Committing changes..."
git commit -m "Add model hosting support via GitHub Pages

- Added loadModelFromURL() method to MoveNetModel
- Created docs/models/ folder with model files
- Ready for GitHub Pages deployment
- Backward compatible with mock model"

# Step 3: Push
echo "⬆️  Step 3: Pushing to GitHub..."
git push origin mobileTes

echo ""
echo "✅ Done! Files pushed to GitHub"
echo ""
echo "📋 Next Steps:"
echo "1. Go to: https://github.com/AmeliaOchaM/movenet-pose-MobileApp-playground/settings/pages"
echo "2. Source: Select 'mobileTes' branch"
echo "3. Folder: Select '/docs'"
echo "4. Click 'Save'"
echo "5. Wait 1-2 minutes"
echo "6. Model will be available at:"
echo "   https://ameliaocham.github.io/movenet-pose-MobileApp-playground/models/model.json"
echo ""
echo "7. Update PoseDetector.js to use loadModelFromURL() instead of loadModelFromAssets()"
echo ""
