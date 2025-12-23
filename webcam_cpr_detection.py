"""
Real-time CPR Point Detection menggunakan Webcam
Mendeteksi titik kompresi CPR dari webcam secara real-time
"""

import cv2
import numpy as np
import time
from test_movenet import MoveNetDetector


def main():
    """Main function untuk webcam detection"""
    
    print("="*70)
    print(" " * 15 + "REAL-TIME CPR POINT DETECTION")
    print("="*70)
    
    # Initialize detector
    print("\n[1/3] Loading MoveNet model...")
    try:
        detector = MoveNetDetector('4.tflite')
        print("      ✓ Model loaded successfully!")
    except Exception as e:
        print(f"      ✗ Error loading model: {e}")
        return
    
    # Initialize webcam
    print("\n[2/3] Opening webcam...")
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("      ✗ Error: Cannot open webcam!")
        print("\n      Troubleshooting:")
        print("      - Check if webcam is connected")
        print("      - Close other apps using webcam")
        print("      - Try running: ls /dev/video*")
        return
    
    # Set webcam resolution
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    
    print("      ✓ Webcam opened successfully!")
    
    print("\n[3/3] Starting detection...")
    print("\n" + "="*70)
    print("                           INSTRUCTIONS")
    print("="*70)
    print("  📷 POSITIONING:")
    print("     - Face the camera (frontal view)")
    print("     - Show upper body (head to waist)")
    print("     - Stand/sit in good lighting")
    print("")
    print("  🎯 CPR POINT:")
    print("     - Yellow marker = CPR compression point")
    print("     - Shows on center chest when detected")
    print("")
    print("  ⌨️  CONTROLS:")
    print("     - Press 'q' to quit")
    print("     - Press 's' to save screenshot")
    print("     - Press 'a' to toggle all keypoints")
    print("     - Press 'h' to toggle help overlay")
    print("="*70)
    
    input("\nPress ENTER to start...")
    
    # Variables
    show_all_keypoints = False
    show_help = True
    frame_count = 0
    start_time = time.time()
    
    print("\n✓ Detection started! Press 'q' to quit.\n")
    
    try:
        while True:
            ret, frame = cap.read()
            
            if not ret:
                print("✗ Error: Cannot read frame from webcam")
                break
            
            frame_count += 1
            
            # Mirror frame for better UX
            frame = cv2.flip(frame, 1)
            
            # Detect pose
            keypoints_with_scores = detector.detect_from_frame(frame)
            
            # Convert to RGB for processing
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Draw detection
            result_frame = detector.draw_keypoints(
                frame_rgb, 
                keypoints_with_scores,
                show_cpr=True,
                show_all_keypoints=show_all_keypoints
            )
            
            # Convert back to BGR for display
            result_bgr = cv2.cvtColor(result_frame, cv2.COLOR_RGB2BGR)
            
            # Calculate FPS
            elapsed_time = time.time() - start_time
            fps = frame_count / elapsed_time if elapsed_time > 0 else 0
            
            # Get CPR point info
            cpr_point = detector.calculate_cpr_point(keypoints_with_scores)
            
            # === OVERLAY INFORMATION ===
            overlay = result_bgr.copy()
            
            # Top info bar
            cv2.rectangle(overlay, (0, 0), (result_bgr.shape[1], 120), (0, 0, 0), -1)
            cv2.addWeighted(overlay, 0.6, result_bgr, 0.4, 0, result_bgr)
            
            # FPS
            cv2.putText(result_bgr, f"FPS: {fps:.1f}", (10, 30),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            
            # CPR Status
            if cpr_point:
                confidence = cpr_point['confidence']
                
                # Color based on confidence
                if confidence >= 0.7:
                    color = (0, 255, 0)  # Green - Excellent
                    status = "EXCELLENT"
                elif confidence >= 0.5:
                    color = (0, 255, 255)  # Yellow - Good
                    status = "GOOD"
                else:
                    color = (0, 165, 255)  # Orange - Fair
                    status = "FAIR"
                
                cv2.putText(result_bgr, f"CPR Confidence: {confidence:.2%} ({status})", 
                           (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
                
                # Position info
                y_cpr, x_cpr = cpr_point['position']
                cv2.putText(result_bgr, f"Position: ({x_cpr:.3f}, {y_cpr:.3f})", 
                           (10, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
                
                # Large status indicator
                cv2.putText(result_bgr, "● CPR POINT DETECTED", 
                           (result_bgr.shape[1] - 300, 35),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
            else:
                cv2.putText(result_bgr, "⚠ WAITING FOR POSE...", 
                           (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                cv2.putText(result_bgr, "Position upper body facing camera", 
                           (10, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1)
            
            # Mode indicator
            mode_text = "Mode: Full Detection" if show_all_keypoints else "Mode: CPR Only"
            cv2.putText(result_bgr, mode_text, 
                       (result_bgr.shape[1] - 250, 90),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
            
            # Help overlay
            if show_help:
                help_y = result_bgr.shape[0] - 100
                cv2.rectangle(result_bgr, (0, help_y), (result_bgr.shape[1], result_bgr.shape[0]), 
                             (0, 0, 0), -1)
                cv2.addWeighted(result_bgr[help_y:], 0.6, result_bgr[help_y:], 0.4, 0, result_bgr[help_y:])
                
                cv2.putText(result_bgr, "Q: Quit  |  S: Screenshot  |  A: Toggle Keypoints  |  H: Hide Help", 
                           (10, help_y + 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
                cv2.putText(result_bgr, "Yellow Marker = CPR Compression Point (center chest, lower sternum)", 
                           (10, help_y + 60), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1)
            
            # Display
            cv2.imshow('CPR Point Detection - Real-time', result_bgr)
            
            # Keyboard controls
            key = cv2.waitKey(1) & 0xFF
            
            if key == ord('q'):
                print("\n✓ Exiting...")
                break
            
            elif key == ord('s'):
                # Save screenshot
                timestamp = time.strftime("%Y%m%d_%H%M%S")
                filename = f"cpr_webcam_{timestamp}.jpg"
                cv2.imwrite(filename, result_bgr)
                print(f"✓ Screenshot saved: {filename}")
                
                # Save with CPR info
                if cpr_point:
                    info_filename = f"cpr_webcam_{timestamp}_info.txt"
                    with open(info_filename, 'w') as f:
                        f.write("CPR POINT DETECTION RESULT\n")
                        f.write("="*50 + "\n\n")
                        f.write(f"Timestamp: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
                        f.write(f"Confidence: {cpr_point['confidence']:.4f}\n")
                        f.write(f"Position (normalized):\n")
                        f.write(f"  X: {cpr_point['position'][1]:.4f}\n")
                        f.write(f"  Y: {cpr_point['position'][0]:.4f}\n")
                        f.write(f"\nPosition (pixels):\n")
                        f.write(f"  X: {int(cpr_point['position'][1] * result_bgr.shape[1])}\n")
                        f.write(f"  Y: {int(cpr_point['position'][0] * result_bgr.shape[0])}\n")
                    print(f"✓ Info saved: {info_filename}")
            
            elif key == ord('a'):
                # Toggle all keypoints
                show_all_keypoints = not show_all_keypoints
                mode = "Full Detection" if show_all_keypoints else "CPR Only"
                print(f"✓ Mode: {mode}")
            
            elif key == ord('h'):
                # Toggle help
                show_help = not show_help
    
    except KeyboardInterrupt:
        print("\n✓ Interrupted by user")
    
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        # Cleanup
        cap.release()
        cv2.destroyAllWindows()
        
        # Summary
        total_time = time.time() - start_time
        avg_fps = frame_count / total_time if total_time > 0 else 0
        
        print("\n" + "="*70)
        print("                           SESSION SUMMARY")
        print("="*70)
        print(f"  Total frames: {frame_count}")
        print(f"  Total time: {total_time:.1f}s")
        print(f"  Average FPS: {avg_fps:.1f}")
        print("="*70)
        print("\n✓ Session ended. Thank you!")


if __name__ == "__main__":
    main()
