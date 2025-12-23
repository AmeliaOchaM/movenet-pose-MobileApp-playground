"""
Script untuk testing MoveNet model dengan TensorFlow Lite
Model: google/movenet/singlepose/lightning/4
Input: 192x192x3 RGB image (uint8)
Output: [1, 1, 17, 3] keypoints dengan confidence scores
"""

import numpy as np
import cv2
from ai_edge_litert.interpreter import Interpreter
import matplotlib.pyplot as plt
import matplotlib.patches as patches


# Definisi 17 keypoints sesuai dokumentasi MoveNet
KEYPOINT_NAMES = [
    'nose',
    'left_eye',
    'right_eye', 
    'left_ear',
    'right_ear',
    'left_shoulder',
    'right_shoulder',
    'left_elbow',
    'right_elbow',
    'left_wrist',
    'right_wrist',
    'left_hip',
    'right_hip',
    'left_knee',
    'right_knee',
    'left_ankle',
    'right_ankle'
]

# Koneksi antar keypoints untuk drawing skeleton
KEYPOINT_EDGES = [
    (0, 1), (0, 2), (1, 3), (2, 4),  # Wajah
    (0, 5), (0, 6),  # Hidung ke bahu
    (5, 7), (7, 9),  # Lengan kiri
    (6, 8), (8, 10),  # Lengan kanan
    (5, 6),  # Bahu
    (5, 11), (6, 12),  # Bahu ke pinggul
    (11, 12),  # Pinggul
    (11, 13), (13, 15),  # Kaki kiri
    (12, 14), (14, 16)   # Kaki kanan
]


class MoveNetDetector:
    """Class untuk melakukan pose detection menggunakan MoveNet"""
    
    def __init__(self, model_path='4.tflite'):
        """
        Initialize MoveNet detector
        
        Args:
            model_path: Path ke file model .tflite
        """
        self.model_path = model_path
        self.interpreter = Interpreter(model_path=model_path)
        self.interpreter.allocate_tensors()
        
        # Get input dan output details
        self.input_details = self.interpreter.get_input_details()
        self.output_details = self.interpreter.get_output_details()
        
        # Expected input shape: [1, 192, 192, 3]
        self.input_height = self.input_details[0]['shape'][1]
        self.input_width = self.input_details[0]['shape'][2]
        
        print(f"Model loaded successfully!")
        print(f"Input shape: {self.input_details[0]['shape']}")
        print(f"Output shape: {self.output_details[0]['shape']}")
        print(f"Input dtype: {self.input_details[0]['dtype']}")
        
    def preprocess_image(self, image_path):
        """
        Preprocess image untuk model input
        
        Args:
            image_path: Path ke gambar input
            
        Returns:
            Preprocessed image (uint8) dan original image
        """
        # Baca image
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Tidak bisa membaca image: {image_path}")
            
        # Convert BGR to RGB
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        original_image = image_rgb.copy()
        
        # Resize dengan maintain aspect ratio (padding)
        image_resized = self._resize_with_pad(image_rgb, self.input_height, self.input_width)
        
        # Expand dimensions untuk batch
        image_input = np.expand_dims(image_resized, axis=0)
        
        # Model expects uint8
        image_input = image_input.astype(np.uint8)
        
        return image_input, original_image
    
    def _resize_with_pad(self, image, target_height, target_width):
        """
        Resize image dengan padding untuk maintain aspect ratio
        
        Args:
            image: Input image (H, W, C)
            target_height: Target height
            target_width: Target width
            
        Returns:
            Resized and padded image
        """
        height, width = image.shape[:2]
        
        # Calculate scaling factor
        scale = min(target_height / height, target_width / width)
        new_height = int(height * scale)
        new_width = int(width * scale)
        
        # Resize
        resized = cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_LINEAR)
        
        # Create padded image
        padded = np.zeros((target_height, target_width, 3), dtype=np.uint8)
        
        # Calculate padding
        pad_top = (target_height - new_height) // 2
        pad_left = (target_width - new_width) // 2
        
        # Place resized image in center
        padded[pad_top:pad_top+new_height, pad_left:pad_left+new_width] = resized
        
        return padded
    
    def detect(self, image_path):
        """
        Deteksi pose dari image
        
        Args:
            image_path: Path ke gambar input
            
        Returns:
            keypoints_with_scores: Array [1, 1, 17, 3] berisi koordinat dan confidence
        """
        # Preprocess
        input_image, original_image = self.preprocess_image(image_path)
        
        # Set tensor
        self.interpreter.set_tensor(self.input_details[0]['index'], input_image)
        
        # Run inference
        self.interpreter.invoke()
        
        # Get output
        keypoints_with_scores = self.interpreter.get_tensor(self.output_details[0]['index'])
        
        return keypoints_with_scores, original_image
    
    def detect_from_frame(self, frame):
        """
        Deteksi pose dari frame webcam (numpy array)
        
        Args:
            frame: Frame dari webcam (numpy array BGR)
            
        Returns:
            keypoints_with_scores: Array [1, 1, 17, 3] berisi koordinat dan confidence
        """
        # Convert BGR to RGB
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Resize dengan maintain aspect ratio (padding)
        image_resized = self._resize_with_pad(frame_rgb, self.input_height, self.input_width)
        
        # Expand dimensions untuk batch
        image_input = np.expand_dims(image_resized, axis=0)
        
        # Model expects uint8
        image_input = image_input.astype(np.uint8)
        
        # Set tensor
        self.interpreter.set_tensor(self.input_details[0]['index'], image_input)
        
        # Run inference
        self.interpreter.invoke()
        
        # Get output
        keypoints_with_scores = self.interpreter.get_tensor(self.output_details[0]['index'])
        
        return keypoints_with_scores
    
    def draw_keypoints(self, image, keypoints_with_scores, confidence_threshold=0.3, show_cpr=True, show_all_keypoints=False):
        """
        Gambar keypoints, skeleton, dan titik CPR pada image
        
        Args:
            image: Original image
            keypoints_with_scores: Output dari model [1, 1, 17, 3]
            confidence_threshold: Minimum confidence untuk menampilkan keypoint
            show_cpr: Tampilkan titik CPR atau tidak
            show_all_keypoints: Tampilkan semua keypoints dan skeleton (default: False)
            
        Returns:
            Image dengan keypoints, skeleton, dan/atau titik CPR
        """
        height, width = image.shape[:2]
        output_image = image.copy()
        
        # Extract keypoints [17, 3]
        keypoints = keypoints_with_scores[0, 0, :, :]
        
        # Hanya gambar skeleton dan keypoints jika show_all_keypoints=True
        if show_all_keypoints:
            # Draw skeleton (connections)
            for edge in KEYPOINT_EDGES:
                y1, x1, c1 = keypoints[edge[0]]
                y2, x2, c2 = keypoints[edge[1]]
                
                if c1 > confidence_threshold and c2 > confidence_threshold:
                    # Convert normalized coordinates to pixel coordinates
                    x1_px = int(x1 * width)
                    y1_px = int(y1 * height)
                    x2_px = int(x2 * width)
                    y2_px = int(y2 * height)
                    
                    # Draw line
                    cv2.line(output_image, (x1_px, y1_px), (x2_px, y2_px), 
                            (0, 255, 0), 2, cv2.LINE_AA)
            
            # Draw keypoints
            for idx, (y, x, confidence) in enumerate(keypoints):
                if confidence > confidence_threshold:
                    # Convert to pixel coordinates
                    x_px = int(x * width)
                    y_px = int(y * height)
                    
                    # Draw circle
                    cv2.circle(output_image, (x_px, y_px), 5, (255, 0, 0), -1)
                    cv2.circle(output_image, (x_px, y_px), 7, (0, 0, 255), 2)
                    
                    # Add label
                    label = f"{KEYPOINT_NAMES[idx]}: {confidence:.2f}"
                    cv2.putText(output_image, label, (x_px + 10, y_px), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1, cv2.LINE_AA)
        
        # Draw CPR point (selalu ditampilkan jika show_cpr=True)
        if show_cpr:
            cpr_point = self.calculate_cpr_point(keypoints_with_scores, confidence_threshold)
            
            if cpr_point:
                y_cpr, x_cpr = cpr_point['position']
                x_cpr_px = int(x_cpr * width)
                y_cpr_px = int(y_cpr * height)
                
                # Draw CPR marker (larger, different color)
                # Outer circle (red)
                cv2.circle(output_image, (x_cpr_px, y_cpr_px), 15, (0, 0, 255), 3)
                # Inner circle (yellow)
                cv2.circle(output_image, (x_cpr_px, y_cpr_px), 10, (0, 255, 255), -1)
                # Center dot (white)
                cv2.circle(output_image, (x_cpr_px, y_cpr_px), 3, (255, 255, 255), -1)
                
                # Draw crosshair
                cv2.line(output_image, (x_cpr_px - 20, y_cpr_px), (x_cpr_px + 20, y_cpr_px),
                        (0, 255, 255), 2, cv2.LINE_AA)
                cv2.line(output_image, (x_cpr_px, y_cpr_px - 20), (x_cpr_px, y_cpr_px + 20),
                        (0, 255, 255), 2, cv2.LINE_AA)
                
                # Add label
                label = f"CPR POINT: {cpr_point['confidence']:.2f}"
                cv2.putText(output_image, label, (x_cpr_px + 25, y_cpr_px - 10), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2, cv2.LINE_AA)
                cv2.putText(output_image, "Titik Kompresi RJP", (x_cpr_px + 25, y_cpr_px + 10), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1, cv2.LINE_AA)
        
        return output_image
    
    def calculate_cpr_point(self, keypoints_with_scores, confidence_threshold=0.3):
        """
        Hitung titik kompresi CPR (RJP) berdasarkan posisi bahu dan pinggul
        
        Args:
            keypoints_with_scores: Output dari model [1, 1, 17, 3]
            confidence_threshold: Minimum confidence untuk kalkulasi
            
        Returns:
            Dictionary dengan CPR point dan metadata
        """
        keypoints = keypoints_with_scores[0, 0, :, :]
        
        # Index keypoints: 5=left_shoulder, 6=right_shoulder, 11=left_hip, 12=right_hip
        left_shoulder = keypoints[5]   # [y, x, confidence]
        right_shoulder = keypoints[6]
        left_hip = keypoints[11]
        right_hip = keypoints[12]
        
        # Check confidence
        if (left_shoulder[2] < confidence_threshold or 
            right_shoulder[2] < confidence_threshold or
            left_hip[2] < confidence_threshold or 
            right_hip[2] < confidence_threshold):
            return None
        
        # 1. Titik tengah bahu (shoulder midpoint)
        x_s = (left_shoulder[1] + right_shoulder[1]) / 2
        y_s = (left_shoulder[0] + right_shoulder[0]) / 2
        
        # 2. Titik tengah pinggul (hip midpoint)
        x_h = (left_hip[1] + right_hip[1]) / 2
        y_h = (left_hip[0] + right_hip[0]) / 2
        
        # 3. Estimasi titik CPR (α = 0.42 → 40-45% dari bahu ke pinggul)
        alpha = 0.42
        x_cpr = x_s + alpha * (x_h - x_s)
        y_cpr = y_s + alpha * (y_h - y_s)
        
        # Confidence rata-rata dari 4 keypoints
        avg_confidence = (left_shoulder[2] + right_shoulder[2] + 
                         left_hip[2] + right_hip[2]) / 4
        
        return {
            'position': (y_cpr, x_cpr),  # normalized coordinates
            'confidence': avg_confidence,
            'shoulder_midpoint': (y_s, x_s),
            'hip_midpoint': (y_h, x_h)
        }
    
    def print_keypoints(self, keypoints_with_scores, confidence_threshold=0.3):
        """
        Print informasi keypoints dan titik CPR ke console
        
        Args:
            keypoints_with_scores: Output dari model [1, 1, 17, 3]
            confidence_threshold: Minimum confidence untuk menampilkan
        """
        keypoints = keypoints_with_scores[0, 0, :, :]
        
        print("\n" + "="*60)
        print("DETECTED KEYPOINTS")
        print("="*60)
        print(f"{'No':<4} {'Keypoint':<18} {'Y':<8} {'X':<8} {'Confidence':<12}")
        print("-"*60)
        
        for idx, (y, x, confidence) in enumerate(keypoints):
            if confidence > confidence_threshold:
                print(f"{idx+1:<4} {KEYPOINT_NAMES[idx]:<18} {y:.4f}  {x:.4f}  {confidence:.4f}")
        
        print("="*60)
        
        # Calculate and print CPR point
        cpr_point = self.calculate_cpr_point(keypoints_with_scores, confidence_threshold)
        
        if cpr_point:
            print("\n" + "="*60)
            print("TITIK KOMPRESI CPR (RJP)")
            print("="*60)
            y_cpr, x_cpr = cpr_point['position']
            print(f"Posisi (normalized):")
            print(f"  X: {x_cpr:.4f}")
            print(f"  Y: {y_cpr:.4f}")
            print(f"Confidence: {cpr_point['confidence']:.4f}")
            print("\nCatatan:")
            print("- Titik berada di tengah dada (setengah bawah sternum)")
            print("- Estimasi: 40-45% jarak dari bahu ke pinggul")
            print("- Untuk edukasi dan simulasi CPR")
            print("="*60)
        else:
            print("\n⚠ Tidak dapat menghitung titik CPR (keypoints tidak lengkap)")
        
        print("="*60)


def run_webcam_detection():
    """Function untuk real-time detection dari webcam"""
    
    print("="*60)
    print("MoveNet CPR Detection - Webcam Mode")
    print("="*60)
    
    # Initialize detector
    print("\nLoading model...")
    detector = MoveNetDetector('4.tflite')
    print("✓ Model ready!")
    
    # Initialize webcam
    print("\nMembuka webcam...")
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("✗ Error: Tidak dapat membuka webcam!")
        print("Pastikan webcam terhubung dan tidak digunakan aplikasi lain.")
        return
    
    print("✓ Webcam ready!")
    print("\n" + "="*60)
    print("INSTRUKSI:")
    print("="*60)
    print("- Posisikan tubuh menghadap kamera (frontal view)")
    print("- Pastikan tubuh terlihat dari kepala sampai pinggul")
    print("- Titik CPR akan muncul otomatis di tengah dada")
    print("\nKONTROL:")
    print("- Tekan 'q' untuk keluar")
    print("- Tekan 's' untuk screenshot")
    print("- Tekan 'a' untuk toggle semua keypoints")
    print("="*60)
    
    show_all = False
    frame_count = 0
    fps_time = 0
    
    try:
        while True:
            ret, frame = cap.read()
            
            if not ret:
                print("✗ Error: Tidak dapat membaca frame dari webcam")
                break
            
            frame_count += 1
            
            # Detect pose every frame
            keypoints_with_scores = detector.detect_from_frame(frame)
            
            # Convert BGR to RGB untuk processing
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Draw keypoints and CPR point
            result_frame = detector.draw_keypoints(frame_rgb, keypoints_with_scores,
                                                   show_cpr=True, 
                                                   show_all_keypoints=show_all)
            
            # Convert back to BGR untuk display
            result_frame_bgr = cv2.cvtColor(result_frame, cv2.COLOR_RGB2BGR)
            
            # Calculate FPS
            import time
            current_time = time.time()
            if frame_count == 1:
                fps_time = current_time
            
            fps = frame_count / (current_time - fps_time) if (current_time - fps_time) > 0 else 0
            
            # Get CPR point info
            cpr_point = detector.calculate_cpr_point(keypoints_with_scores)
            
            # Add info overlay
            cv2.putText(result_frame_bgr, f"FPS: {fps:.1f}", (10, 30),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            
            if cpr_point:
                cv2.putText(result_frame_bgr, f"CPR Confidence: {cpr_point['confidence']:.2f}", 
                           (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
                cv2.putText(result_frame_bgr, "Status: CPR POINT DETECTED", 
                           (10, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            else:
                cv2.putText(result_frame_bgr, "Status: WAITING FOR POSE...", 
                           (10, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            
            # Add controls hint
            cv2.putText(result_frame_bgr, "Q:Quit | S:Screenshot | A:Toggle All Keypoints", 
                       (10, result_frame_bgr.shape[0] - 10),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
            
            # Display frame
            cv2.imshow('MoveNet CPR Detection - Webcam', result_frame_bgr)
            
            # Handle keyboard input
            key = cv2.waitKey(1) & 0xFF
            
            if key == ord('q'):
                print("\n✓ Keluar dari webcam mode")
                break
            elif key == ord('s'):
                # Save screenshot
                timestamp = time.strftime("%Y%m%d_%H%M%S")
                filename = f"webcam_cpr_{timestamp}.jpg"
                cv2.imwrite(filename, result_frame_bgr)
                print(f"✓ Screenshot disimpan: {filename}")
            elif key == ord('a'):
                # Toggle show all keypoints
                show_all = not show_all
                mode = "Full Detection" if show_all else "CPR Only"
                print(f"✓ Mode switched: {mode}")
    
    except KeyboardInterrupt:
        print("\n✓ Interrupted by user")
    
    finally:
        # Cleanup
        cap.release()
        cv2.destroyAllWindows()
        print("\n✓ Webcam closed")


def main():
    """Main function untuk testing"""
    
    print("="*60)
    print("MoveNet Pose Detection - Testing Script")
    print("="*60)
    
    # Path ke model
    model_path = '4.tflite'
    
    # Initialize detector
    detector = MoveNetDetector(model_path)
    
    # Minta user untuk input image path
    print("\nPilih mode:")
    print("1. Image file - Deteksi dari gambar")
    print("2. Webcam - Real-time detection")
    mode = input("\nPilih mode (1/2): ").strip()
    
    if mode == '2':
        run_webcam_detection()
        return
    
    # Mode image file
    print("\nMasukkan path ke image yang ingin dideteksi:")
    print("(Contoh: test_image.jpg)")
    image_path = input("Path: ").strip()
    
    try:
        # Detect pose
        print(f"\nMemproses image: {image_path}")
        keypoints_with_scores, original_image = detector.detect(image_path)
        
        # Print keypoints
        detector.print_keypoints(keypoints_with_scores)
        
        # Draw keypoints
        result_image = detector.draw_keypoints(original_image, keypoints_with_scores, 
                                               show_cpr=True, show_all_keypoints=False)
        
        # Display hasil
        plt.figure(figsize=(12, 6))
        
        plt.subplot(1, 2, 1)
        plt.imshow(original_image)
        plt.title('Original Image')
        plt.axis('off')
        
        plt.subplot(1, 2, 2)
        plt.imshow(result_image)
        plt.title('CPR Point Detection')
        plt.axis('off')
        
        plt.tight_layout()
        
        # Save hasil
        output_path = 'result_pose_detection.jpg'
        cv2.imwrite(output_path, cv2.cvtColor(result_image, cv2.COLOR_RGB2BGR))
        print(f"\nHasil disimpan ke: {output_path}")
        
        plt.savefig('result_visualization.png', dpi=150, bbox_inches='tight')
        print(f"Visualisasi disimpan ke: result_visualization.png")
        
        plt.show()
        
        print("\n✓ Testing berhasil! Model bekerja dengan baik.")
        
    except Exception as e:
        print(f"\n✗ Error: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
