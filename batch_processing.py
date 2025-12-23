"""
Batch Processing Example
Process multiple images at once untuk efficiency
"""

from test_movenet import MoveNetDetector
import os
import cv2
import time
from pathlib import Path

def process_batch(detector, image_paths, output_dir='results'):
    """
    Process multiple images sekaligus
    
    Args:
        detector: MoveNetDetector instance
        image_paths: List of image paths
        output_dir: Output directory untuk hasil
    """
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    results = []
    total_time = 0
    
    print(f"\nProcessing {len(image_paths)} images...")
    print("=" * 60)
    
    for i, image_path in enumerate(image_paths, 1):
        print(f"\n[{i}/{len(image_paths)}] Processing: {Path(image_path).name}")
        
        try:
            # Start timer
            start_time = time.time()
            
            # Detect pose
            keypoints, original_image = detector.detect(image_path)
            
            # End timer
            end_time = time.time()
            inference_time = end_time - start_time
            total_time += inference_time
            
            # Count visible keypoints
            visible_count = sum(1 for kp in keypoints[0, 0, :, :] if kp[2] > 0.3)
            avg_confidence = keypoints[0, 0, :, 2].mean()
            
            # Draw visualization
            result_image = detector.draw_keypoints(original_image, keypoints)
            
            # Save result
            output_filename = f"{Path(image_path).stem}_result.jpg"
            output_path = os.path.join(output_dir, output_filename)
            cv2.imwrite(output_path, cv2.cvtColor(result_image, cv2.COLOR_RGB2BGR))
            
            # Store results
            result = {
                'image': Path(image_path).name,
                'visible_keypoints': visible_count,
                'avg_confidence': avg_confidence,
                'inference_time': inference_time,
                'output_path': output_path,
                'status': 'success'
            }
            results.append(result)
            
            print(f"  ✓ Keypoints: {visible_count}/17")
            print(f"  ✓ Confidence: {avg_confidence*100:.1f}%")
            print(f"  ✓ Time: {inference_time*1000:.0f}ms")
            print(f"  ✓ Saved to: {output_path}")
            
        except Exception as e:
            print(f"  ✗ Error: {str(e)}")
            results.append({
                'image': Path(image_path).name,
                'status': 'failed',
                'error': str(e)
            })
    
    print("\n" + "=" * 60)
    print("BATCH PROCESSING SUMMARY")
    print("=" * 60)
    
    successful = sum(1 for r in results if r['status'] == 'success')
    failed = len(results) - successful
    
    print(f"Total images: {len(results)}")
    print(f"Successful: {successful}")
    print(f"Failed: {failed}")
    
    if successful > 0:
        avg_time = total_time / successful
        print(f"\nAverage inference time: {avg_time*1000:.0f}ms per image")
        print(f"Total processing time: {total_time:.2f}s")
        
        # Best and worst detections
        success_results = [r for r in results if r['status'] == 'success']
        best = max(success_results, key=lambda x: x['avg_confidence'])
        worst = min(success_results, key=lambda x: x['avg_confidence'])
        
        print(f"\nBest detection: {best['image']}")
        print(f"  - Keypoints: {best['visible_keypoints']}/17")
        print(f"  - Confidence: {best['avg_confidence']*100:.1f}%")
        
        print(f"\nWorst detection: {worst['image']}")
        print(f"  - Keypoints: {worst['visible_keypoints']}/17")
        print(f"  - Confidence: {worst['avg_confidence']*100:.1f}%")
    
    print(f"\nResults saved to: {output_dir}/")
    print("=" * 60)
    
    return results

def find_images_in_directory(directory, extensions=['.jpg', '.jpeg', '.png', '.bmp']):
    """
    Find all image files in directory
    
    Args:
        directory: Directory path
        extensions: List of valid extensions
        
    Returns:
        List of image paths
    """
    image_paths = []
    
    for ext in extensions:
        image_paths.extend(Path(directory).glob(f'*{ext}'))
        image_paths.extend(Path(directory).glob(f'*{ext.upper()}'))
    
    return [str(p) for p in image_paths]

def main():
    print("=" * 60)
    print("MoveNet Batch Processing")
    print("=" * 60)
    
    # Initialize detector
    print("\nLoading model...")
    detector = MoveNetDetector('4.tflite')
    print("✓ Model loaded!")
    
    # Get images
    print("\nChoose input mode:")
    print("1. Process all images in a directory")
    print("2. Process specific image files")
    
    choice = input("\nYour choice (1 or 2): ").strip()
    
    if choice == '1':
        directory = input("Enter directory path: ").strip().strip('"').strip("'")
        
        if not os.path.exists(directory):
            print(f"✗ Directory not found: {directory}")
            return
        
        image_paths = find_images_in_directory(directory)
        
        if not image_paths:
            print(f"✗ No images found in: {directory}")
            return
        
        print(f"\n✓ Found {len(image_paths)} images")
        
    else:
        print("\nEnter image paths (one per line, empty line to finish):")
        image_paths = []
        while True:
            path = input("> ").strip().strip('"').strip("'")
            if not path:
                break
            if os.path.exists(path):
                image_paths.append(path)
            else:
                print(f"  ✗ File not found: {path}")
        
        if not image_paths:
            print("✗ No valid images provided")
            return
    
    # Output directory
    output_dir = input("\nOutput directory (default: results): ").strip() or 'results'
    
    # Process batch
    results = process_batch(detector, image_paths, output_dir)
    
    # Save summary to file
    summary_path = os.path.join(output_dir, 'summary.txt')
    with open(summary_path, 'w') as f:
        f.write("BATCH PROCESSING RESULTS\n")
        f.write("=" * 60 + "\n\n")
        
        for result in results:
            if result['status'] == 'success':
                f.write(f"Image: {result['image']}\n")
                f.write(f"  Keypoints: {result['visible_keypoints']}/17\n")
                f.write(f"  Confidence: {result['avg_confidence']*100:.1f}%\n")
                f.write(f"  Time: {result['inference_time']*1000:.0f}ms\n")
                f.write(f"  Output: {result['output_path']}\n\n")
            else:
                f.write(f"Image: {result['image']}\n")
                f.write(f"  Status: FAILED\n")
                f.write(f"  Error: {result['error']}\n\n")
    
    print(f"\n✓ Summary saved to: {summary_path}")

if __name__ == "__main__":
    main()
