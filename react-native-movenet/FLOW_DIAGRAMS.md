# 📊 Visual Flow Diagram - Camera Feature

## 🔄 Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     START APPLICATION                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  Initialize App                              │
│  • Load TensorFlow.js                                        │
│  • Load MoveNet Model                                        │
│  • Request Media Library Permission                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   MAIN SCREEN                                │
│  ┌─────────────────────────────────────────────────┐        │
│  │         MoveNet Pose Detection                  │        │
│  │         ✓ Model Ready                           │        │
│  └─────────────────────────────────────────────────┘        │
│                                                              │
│  ┌─────────────────────────────────────────────────┐        │
│  │         📸 Buka Kamera                          │◄───┐   │
│  └─────────────────────────────────────────────────┘    │   │
│                       │                                 │   │
│  ┌─────────────────────────────────────────────────┐    │   │
│  │         🖼️ Pilih dari Galeri                    │    │   │
│  └─────────────────────────────────────────────────┘    │   │
│                       │                                 │   │
└───────────────────────┼─────────────────────────────────┼───┘
                        │                                 │
            ┌───────────┴──────────┐                     │
            ▼                      ▼                     │
    ┌──────────────┐       ┌──────────────┐             │
    │   CAMERA     │       │   GALLERY    │             │
    │   SCREEN     │       │   PICKER     │             │
    └──────┬───────┘       └──────┬───────┘             │
           │                      │                     │
           │  Take Photo          │  Select Image       │
           │                      │                     │
           └──────────┬───────────┘                     │
                      │                                 │
                      ▼                                 │
           ┌─────────────────────┐                     │
           │   IMAGE SELECTED    │                     │
           │  • Set selectedImage│                     │
           │  • Get dimensions   │                     │
           │  • Reset pose result│                     │
           └──────────┬──────────┘                     │
                      │                                 │
                      ▼                                 │
           ┌─────────────────────┐                     │
           │  🔍 Detect Pose     │                     │
           └──────────┬──────────┘                     │
                      │                                 │
                      ▼                                 │
           ┌─────────────────────┐                     │
           │  POSE DETECTION     │                     │
           │  • Load image tensor│                     │
           │  • Run inference    │                     │
           │  • Get keypoints    │                     │
           └──────────┬──────────┘                     │
                      │                                 │
                      ▼                                 │
           ┌─────────────────────┐                     │
           │  SHOW RESULTS       │                     │
           │  • Image + Overlay  │                     │
           │  • Keypoints list   │                     │
           │  • Confidence       │                     │
           └──────────┬──────────┘                     │
                      │                                 │
                      └─────────────────────────────────┘
```

## 📸 Camera Screen Flow

```
USER TAPS "Buka Kamera"
         │
         ▼
┌──────────────────────────────────┐
│  Check showCamera state          │
│  showCamera = true               │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│  Render CameraView Component     │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│  Check Camera Permission         │
└────────────┬─────────────────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
┌───────────┐  ┌────────────┐
│ GRANTED   │  │ NOT GRANTED│
└─────┬─────┘  └──────┬─────┘
      │                │
      │                ▼
      │        ┌──────────────────┐
      │        │ Show Permission  │
      │        │ Request Screen   │
      │        └────────┬─────────┘
      │                 │
      │        ┌────────┴─────────┐
      │        │ User Grants/     │
      │        │ Denies           │
      │        └────────┬─────────┘
      │                 │
      └─────────────────┘
                │
                ▼
      ┌──────────────────────┐
      │ CAMERA SCREEN READY  │
      │                      │
      │  ┌───────────────┐   │
      │  │ X  Ambil Foto │   │
      │  └───────────────┘   │
      │                      │
      │  ┌───────────────┐   │
      │  │               │   │
      │  │  LIVE CAMERA  │   │
      │  │     VIEW      │   │
      │  │               │   │
      │  └───────────────┘   │
      │                      │
      │  ┌───────────────┐   │
      │  │ 🔄  ⚪   □    │   │
      │  └───────────────┘   │
      └──────┬───────────────┘
             │
      ┌──────┴──────────┐
      │                 │
      ▼                 ▼
┌──────────┐      ┌──────────┐
│  FLIP    │      │ CAPTURE  │
│  CAMERA  │      │  PHOTO   │
└────┬─────┘      └─────┬────┘
     │                  │
     ▼                  ▼
Toggle facing     takePicture()
back/front              │
     │                  ▼
     │          onCapture(photoUri)
     │                  │
     │                  ▼
     │          handlePhotoCapture()
     │                  │
     │                  ▼
     │           showCamera = false
     │                  │
     └──────────────────┴──────────
                    │
                    ▼
              Back to Main Screen
              with Image Selected
```

## 🔄 Component Communication

```
┌─────────────────────────────────────────────────────────┐
│                        App.js                           │
│  ┌───────────────────────────────────────────────────┐ │
│  │  State:                                           │ │
│  │  • showCamera: boolean                            │ │
│  │  • selectedImage: uri                             │ │
│  │  • poseResult: object                             │ │
│  │  • isDetecting: boolean                           │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Functions:                                       │ │
│  │  • openCamera()                                   │ │
│  │  • handleCameraClose()                            │ │
│  │  • handlePhotoCapture(photoUri)                   │ │
│  │  • pickImage()                                    │ │
│  │  • detectPose()                                   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│                    │                                    │
│                    ▼                                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Conditional Render:                            │   │
│  │  if (showCamera) {                              │   │
│  │    return <CameraView                           │   │
│  │              onClose={handleCameraClose}        │   │
│  │              onCapture={handlePhotoCapture}     │   │
│  │            />                                   │   │
│  │  }                                              │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────┘
                      │
                      │ Props
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   CameraView.js                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Props:                                           │ │
│  │  • onClose: function                              │ │
│  │  • onCapture: function                            │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  State:                                           │ │
│  │  • permission: object                             │ │
│  │  • facing: 'back' | 'front'                       │ │
│  │  • cameraRef: ref                                 │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Events:                                          │ │
│  │  • Close button → onClose()                       │ │
│  │  • Capture button → takePicture() → onCapture()   │ │
│  │  • Flip button → toggleCameraFacing()             │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## 📱 UI State Diagram

```
┌────────────────────────────────────────────────────────┐
│                   APP STATES                           │
└────────────────────────────────────────────────────────┘

State: LOADING
┌──────────────────────┐
│  ⏳ Loading Model    │
│  ActivityIndicator   │
└──────────────────────┘
          │
          ▼
State: MAIN_SCREEN (showCamera = false, !selectedImage)
┌──────────────────────┐
│  📸 Buka Kamera      │
│  🖼️ Pilih Galeri     │
└──────────────────────┘
          │
          ▼
State: CAMERA_SCREEN (showCamera = true)
┌──────────────────────┐
│  ✕ Close             │
│  📷 Camera View      │
│  🔄 ⚪ Controls       │
└──────────────────────┘
          │
          ▼
State: IMAGE_SELECTED (selectedImage, !poseResult)
┌──────────────────────┐
│  📸 Buka Kamera      │
│  🖼️ Pilih Galeri     │
│  🔍 Detect Pose      │
│  [Image Preview]     │
└──────────────────────┘
          │
          ▼
State: DETECTING (isDetecting = true)
┌──────────────────────┐
│  ⏳ Detecting...     │
│  [Image Preview]     │
└──────────────────────┘
          │
          ▼
State: RESULT_SHOWN (poseResult)
┌──────────────────────┐
│  📸 Buka Kamera      │
│  🖼️ Pilih Galeri     │
│  🔍 Detect Pose      │
│  [Image + Overlay]   │
│  [Results Details]   │
└──────────────────────┘
```

## 🎯 Permission Flow

```
┌─────────────────────────────────────────┐
│       CameraView Component Mount        │
└───────────────┬─────────────────────────┘
                │
                ▼
        ┌───────────────────┐
        │ Check Permission  │
        └───────┬───────────┘
                │
        ┌───────┴────────┐
        │                │
        ▼                ▼
┌──────────────┐  ┌──────────────┐
│  GRANTED     │  │ NOT GRANTED  │
└──────┬───────┘  └──────┬───────┘
       │                 │
       │                 ▼
       │         ┌──────────────────┐
       │         │ Show Permission  │
       │         │ Request Screen   │
       │         └────────┬─────────┘
       │                  │
       │         ┌────────┴─────────┐
       │         │  User Action:    │
       │         │  Grant / Deny    │
       │         └────────┬─────────┘
       │                  │
       │         ┌────────┴─────────┐
       │         │                  │
       │         ▼                  ▼
       │   ┌──────────┐      ┌──────────┐
       │   │ GRANTED  │      │ DENIED   │
       │   └─────┬────┘      └─────┬────┘
       │         │                  │
       └─────────┘                  │
                │                   │
                ▼                   ▼
        ┌──────────────┐    ┌──────────────┐
        │ Show Camera  │    │ Keep Request │
        │    View      │    │   Screen     │
        └──────────────┘    └──────────────┘
```

## 🔄 Data Flow

```
USER ACTION          COMPONENT           STATE UPDATE        RENDER
─────────────────────────────────────────────────────────────────

Tap "Buka Kamera" → App.openCamera() → showCamera = true → CameraView
                                                             rendered

Tap Capture       → CameraView.       → takePicture()    → Photo taken
                    takePicture()

Photo taken       → onCapture()       → App.              → showCamera = 
                    callback             handlePhoto-       false
                                        Capture()          selectedImage
                                                           = uri

Tap "Detect       → App.              → isDetecting =    → Show
Pose"               detectPose()         true               "Detecting..."

Detection         → PoseDetector.     → poseResult =     → Show overlay
complete            detectPose()         result             + results
                                        isDetecting =
                                        false
```

---

*Visual diagrams untuk membantu pemahaman flow aplikasi*
