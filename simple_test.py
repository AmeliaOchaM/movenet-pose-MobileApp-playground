"""
Simple example untuk testing MoveNet model dengan gambar sample
Jalankan: python simple_test.py
"""

from test_movenet import MoveNetDetector
import os

def main():
    print("=" * 60)
    print("MoveNet Simple Test")
    print("=" * 60)
    
    # Check apakah model ada
    model_path = '4.tflite'
    if not os.path.exists(model_path):
        print(f"\n✗ Model file tidak ditemukan: {model_path}")
        print("\nPastikan file '4.tflite' ada di folder yang sama dengan script ini.")
        return
    
    print(f"\n✓ Model file ditemukan: {model_path}")
    
    # Initialize detector
    print("\nLoading model...")
    detector = MoveNetDetector(model_path)
    print("✓ Model loaded!")
    
    # Test dengan gambar
    print("\n" + "=" * 60)
    print("Untuk testing, Anda perlu gambar dengan manusia di dalamnya.")
    print("=" * 60)
    
    print("\nContoh path gambar:")
    print("  - ./my_photo.jpg")
    print("  - /home/user/Pictures/test.png")
    print("  - C:\\Users\\user\\image.jpg  (Windows)")
    
    image_path = input("\nMasukkan path ke gambar: ").strip()
    
    # Remove quotes jika ada
    image_path = image_path.strip('"').strip("'")
    
    if not os.path.exists(image_path):
        print(f"\n✗ File tidak ditemukan: {image_path}")
        print("\nTips:")
        print("- Pastikan path benar")
        print("- Gunakan absolute path")
        print("- Pastikan file format: JPG, PNG, atau BMP")
        return
    
    print(f"\n✓ Image file ditemukan: {image_path}")
    print("\nProcessing...")
    
    try:
        # Detect pose
        keypoints, original_image = detector.detect(image_path)
        
        # Print hasil
        detector.print_keypoints(keypoints)
        
        # Count visible keypoints
        visible_count = sum(1 for kp in keypoints[0, 0, :, :] if kp[2] > 0.3)
        
        print(f"\n✓ Deteksi selesai!")
        print(f"  Keypoints terdeteksi: {visible_count} / 17")
        
        # Check CPR point
        cpr_point = detector.calculate_cpr_point(keypoints)
        if cpr_point:
            print(f"  ✓ Titik CPR terdeteksi (confidence: {cpr_point['confidence']:.2f})")
        else:
            print(f"  ⚠ Titik CPR tidak dapat dihitung")
        
        if visible_count >= 10:
            print("  Status: ✓ Deteksi bagus!")
        elif visible_count >= 5:
            print("  Status: ⚠ Deteksi cukup (pose mungkin tidak lengkap)")
        else:
            print("  Status: ✗ Deteksi kurang baik (coba gambar lain)")
        
        # Draw dan save
        result_image = detector.draw_keypoints(original_image, keypoints, 
                                               show_cpr=True, show_all_keypoints=False)
        
        import cv2
        output_path = 'simple_test_result.jpg'
        cv2.imwrite(output_path, cv2.cvtColor(result_image, cv2.COLOR_RGB2BGR))
        
        print(f"\n✓ Hasil disimpan ke: {output_path}")
        print("\nBuka file tersebut untuk melihat visualisasi keypoints!")
        
    except Exception as e:
        print(f"\n✗ Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
