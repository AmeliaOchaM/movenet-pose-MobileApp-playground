"""
Script untuk membuat visualisasi diagram keypoints
Membantu memahami struktur 17 keypoints MoveNet
"""

import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch
import numpy as np

# Keypoint names dan posisi untuk visualisasi
keypoint_info = [
    (0, 'nose', 0.5, 0.1),
    (1, 'left_eye', 0.45, 0.08),
    (2, 'right_eye', 0.55, 0.08),
    (3, 'left_ear', 0.4, 0.1),
    (4, 'right_ear', 0.6, 0.1),
    (5, 'left_shoulder', 0.4, 0.25),
    (6, 'right_shoulder', 0.6, 0.25),
    (7, 'left_elbow', 0.35, 0.4),
    (8, 'right_elbow', 0.65, 0.4),
    (9, 'left_wrist', 0.3, 0.55),
    (10, 'right_wrist', 0.7, 0.55),
    (11, 'left_hip', 0.42, 0.55),
    (12, 'right_hip', 0.58, 0.55),
    (13, 'left_knee', 0.4, 0.75),
    (14, 'right_knee', 0.6, 0.75),
    (15, 'left_ankle', 0.38, 0.95),
    (16, 'right_ankle', 0.62, 0.95),
]

# Edges untuk skeleton
edges = [
    (0, 1), (0, 2), (1, 3), (2, 4),  # Face
    (0, 5), (0, 6),  # Nose to shoulders
    (5, 7), (7, 9),  # Left arm
    (6, 8), (8, 10),  # Right arm
    (5, 6),  # Shoulders
    (5, 11), (6, 12),  # Shoulders to hips
    (11, 12),  # Hips
    (11, 13), (13, 15),  # Left leg
    (12, 14), (14, 16)   # Right leg
]

# Colors untuk different body parts
colors = {
    'face': '#FF6B6B',
    'left_arm': '#4ECDC4',
    'right_arm': '#45B7D1',
    'torso': '#FFA07A',
    'left_leg': '#98D8C8',
    'right_leg': '#6BCF7F'
}

def get_keypoint_color(idx):
    if idx <= 4:
        return colors['face']
    elif idx in [5, 7, 9]:
        return colors['left_arm']
    elif idx in [6, 8, 10]:
        return colors['right_arm']
    elif idx in [11, 13, 15]:
        return colors['left_leg']
    elif idx in [12, 14, 16]:
        return colors['right_leg']
    return colors['torso']

def create_keypoint_diagram():
    """Create diagram showing all 17 keypoints"""
    fig, ax = plt.subplots(1, 1, figsize=(10, 14))
    
    # Draw skeleton lines
    for edge in edges:
        idx1, idx2 = edge
        x1, y1 = keypoint_info[idx1][2], keypoint_info[idx1][3]
        x2, y2 = keypoint_info[idx2][2], keypoint_info[idx2][3]
        
        ax.plot([x1, x2], [y1, y2], 'gray', linewidth=3, alpha=0.5, zorder=1)
    
    # Draw keypoints
    for idx, name, x, y in keypoint_info:
        color = get_keypoint_color(idx)
        
        # Draw circle
        circle = plt.Circle((x, y), 0.025, color=color, zorder=3)
        ax.add_patch(circle)
        
        # Add label
        offset_x = 0.08 if x < 0.5 else -0.08
        ha = 'left' if x < 0.5 else 'right'
        
        ax.text(x + offset_x, y, f'{idx}. {name}', 
                fontsize=10, ha=ha, va='center',
                bbox=dict(boxstyle='round,pad=0.3', facecolor='white', alpha=0.8))
    
    # Title and styling
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.invert_yaxis()
    ax.set_aspect('equal')
    ax.axis('off')
    ax.set_title('MoveNet 17 Keypoints Structure', fontsize=16, fontweight='bold', pad=20)
    
    # Add legend
    legend_elements = [
        patches.Patch(facecolor=colors['face'], label='Face (0-4)'),
        patches.Patch(facecolor=colors['left_arm'], label='Left Arm (5,7,9)'),
        patches.Patch(facecolor=colors['right_arm'], label='Right Arm (6,8,10)'),
        patches.Patch(facecolor=colors['torso'], label='Torso'),
        patches.Patch(facecolor=colors['left_leg'], label='Left Leg (11,13,15)'),
        patches.Patch(facecolor=colors['right_leg'], label='Right Leg (12,14,16)')
    ]
    ax.legend(handles=legend_elements, loc='upper center', 
             bbox_to_anchor=(0.5, -0.02), ncol=3, frameon=True)
    
    plt.tight_layout()
    plt.savefig('keypoints_diagram.png', dpi=150, bbox_inches='tight')
    print("✓ Diagram saved to: keypoints_diagram.png")
    plt.show()

def create_output_format_diagram():
    """Create diagram showing output format"""
    fig, ax = plt.subplots(figsize=(12, 8))
    ax.axis('off')
    
    # Title
    ax.text(0.5, 0.95, 'MoveNet Output Format', 
            ha='center', va='top', fontsize=18, fontweight='bold')
    
    # Output shape
    box1 = FancyBboxPatch((0.1, 0.75), 0.8, 0.12, 
                          boxstyle="round,pad=0.01", 
                          edgecolor='#0066cc', facecolor='#e6f2ff', linewidth=2)
    ax.add_patch(box1)
    ax.text(0.5, 0.81, 'Output Shape: [1, 1, 17, 3]', 
            ha='center', va='center', fontsize=14, fontweight='bold')
    
    # Breakdown
    y_pos = 0.65
    items = [
        ('Batch dimension', '[1, _, _, _]', 'Always 1 for single image'),
        ('Pose dimension', '[_, 1, _, _]', 'Always 1 for single person'),
        ('Keypoints dimension', '[_, _, 17, _]', '17 body keypoints'),
        ('Values dimension', '[_, _, _, 3]', 'Y, X, Confidence for each keypoint')
    ]
    
    for title, shape, desc in items:
        # Box
        box = FancyBboxPatch((0.1, y_pos-0.06), 0.8, 0.08, 
                            boxstyle="round,pad=0.01", 
                            edgecolor='gray', facecolor='#f5f5f5', linewidth=1)
        ax.add_patch(box)
        
        # Text
        ax.text(0.15, y_pos-0.02, title, ha='left', va='center', 
                fontsize=11, fontweight='bold')
        ax.text(0.45, y_pos-0.02, shape, ha='left', va='center', 
                fontsize=10, fontfamily='monospace', color='#0066cc')
        ax.text(0.15, y_pos-0.04, desc, ha='left', va='center', 
                fontsize=9, style='italic', color='#666')
        
        y_pos -= 0.12
    
    # Example values
    y_pos -= 0.05
    ax.text(0.5, y_pos, 'Example Keypoint Values:', 
            ha='center', va='center', fontsize=12, fontweight='bold')
    
    y_pos -= 0.08
    examples = [
        'keypoints[0] = [0.234, 0.512, 0.945]  → Nose at (x=51.2%, y=23.4%), confidence=94.5%',
        'keypoints[5] = [0.345, 0.423, 0.876]  → Left shoulder at (x=42.3%, y=34.5%), confidence=87.6%',
        'keypoints[15] = [0.890, 0.412, 0.634]  → Left ankle at (x=41.2%, y=89.0%), confidence=63.4%'
    ]
    
    for example in examples:
        ax.text(0.5, y_pos, example, ha='center', va='center', 
                fontsize=9, fontfamily='monospace', 
                bbox=dict(boxstyle='round,pad=0.3', facecolor='#ffffcc', alpha=0.8))
        y_pos -= 0.06
    
    # Note
    note = "Note: Coordinates (x, y) are normalized to [0.0, 1.0] range"
    ax.text(0.5, 0.05, note, ha='center', va='center', 
            fontsize=10, style='italic', color='#cc0000',
            bbox=dict(boxstyle='round,pad=0.5', facecolor='#ffeeee', alpha=0.8))
    
    plt.tight_layout()
    plt.savefig('output_format_diagram.png', dpi=150, bbox_inches='tight')
    print("✓ Output format diagram saved to: output_format_diagram.png")
    plt.show()

if __name__ == "__main__":
    print("Creating MoveNet visualization diagrams...")
    print()
    
    print("1. Creating keypoints structure diagram...")
    create_keypoint_diagram()
    
    print()
    print("2. Creating output format diagram...")
    create_output_format_diagram()
    
    print()
    print("=" * 60)
    print("✓ All diagrams created successfully!")
    print("=" * 60)
    print()
    print("Generated files:")
    print("  - keypoints_diagram.png       (17 keypoints structure)")
    print("  - output_format_diagram.png   (Output format explanation)")
    print()
    print("Use these diagrams to understand the model better!")
