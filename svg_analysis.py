import re

# Parse the SVG code to analyze its properties
svg_code = """<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
  "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="1024.000000pt" height="1024.000000pt" viewBox="0 0 1024.000000 1024.000000"
  xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMidYMid meet">
  <metadata>
Created by potrace, written by Peter Selinger 2001-2019
</metadata>
  <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="none">
<path d="M3355 9084 c-16 -2 -70 -9 -120 -15 -379 -43 -775 -194 -1070 -410 -272
-200 -507 -470 -670 -765 -104 -187 -198 -452 -235 -662 -17 -97 -20 -155 -20
-372 0 -281 19 -402 96 -632 159 -467 493 -880 921 -1136 279 -167 573 -252
918 -272 77 -5 143 -10 148 -13 4 -2 7 -27 7 -55 0 -48 -2 -52 -27 -58 -16 -3
-55 -15 -88 -26 -261 -85 -455 -311 -510 -593 -18 -95 -18 -255 0 -350 55 -282
249 -508 510 -593 33 -11 72 -23 88 -26 25 -6 27 -10 27 -58 0 -28 -3 -53 -7
-55 -5 -3 -71 -8 -148 -13 -345 -20 -639 -105 -918 -272 -428 -256 -762 -669
-921 -1136 -77 -230 -96 -351 -96 -632 0 -217 3 -275 20 -372 37 -210 131 -475
235 -662 163 -295 398 -565 670 -765 295 -216 691 -367 1070 -410 50 -6 104 -13
120 -15 17 -2 727 -4 1580 -4 l1550 0 0 3600 0 3600 -1550 0 c-853 0 -1563 -2
-1580 -4z m1260 -2489 c47 -23 87 -64 109 -111 16 -35 21 -64 21 -134 0 -70 -5
-99 -21 -134 -22 -47 -62 -88 -109 -111 -35 -16 -64 -21 -134 -21 -70 0 -99 5
-134 21 -47 23 -87 64 -109 111 -16 35 -21 64 -21 134 0 70 5 99 21 134 22 47
62 88 109 111 35 16 64 21 134 21 70 0 99 -5 134 -21z m-415 -2930 c47 -23 87
-64 109 -111 16 -35 21 -64 21 -134 0 -70 -5 -99 -21 -134 -22 -47 -62 -88 -109
-111 -35 -16 -64 -21 -134 -21 -70 0 -99 5 -134 21 -47 23 -87 64 -109 111 -16
35 -21 64 -21 134 0 70 5 99 21 134 22 47 62 88 109 111 35 16 64 21 134 21
70 0 99 -5 134 -21z" fill="#0ea5e9"/>
<path d="M3355 9084 c-16 -2 -70 -9 -120 -15 -379 -43 -775 -194 -1070 -410 -272
-200 -507 -470 -670 -765 -104 -187 -198 -452 -235 -662 -17 -97 -20 -155 -20
-372 0 -281 19 -402 96 -632 159 -467 493 -880 921 -1136 279 -167 573 -252
918 -272 77 -5 143 -10 148 -13 4 -2 7 -27 7 -55 0 -48 -2 -52 -27 -58 -16 -3
-55 -15 -88 -26 -261 -85 -455 -311 -510 -593 -18 -95 -18 -255 0 -350 55 -282
249 -508 510 -593 33 -11 72 -23 88 -26 25 -6 27 -10 27 -58 0 -28 -3 -53 -7
-55 -5 -3 -71 -8 -148 -13 -345 -20 -639 -105 -918 -272 -428 -256 -762 -669
-921 -1136 -77 -230 -96 -351 -96 -632 0 -217 3 -275 20 -372 37 -210 131 -475
235 -662 163 -295 398 -565 670 -765 295 -216 691 -367 1070 -410 50 -6 104 -13
120 -15 17 -2 727 -4 1580 -4 l1550 0 0 3600 0 3600 -1550 0 c-853 0 -1563 -2
-1580 -4z m1260 -2489 c47 -23 87 -64 109 -111 16 -35 21 -64 21 -134 0 -70 -5
-99 -21 -134 -22 -47 -62 -88 -109 -111 -35 -16 -64 -21 -134 -21 -70 0 -99 5
-134 21 -47 23 -87 64 -109 111 -16 35 -21 64 -21 134 0 70 5 99 21 134 22 47
62 88 109 111 35 16 64 21 134 21 70 0 99 -5 134 -21z m-415 -2930 c47 -23 87
-64 109 -111 16 -35 21 -64 21 -134 0 -70 -5 -99 -21 -134 -22 -47 -62 -88 -109
-111 -35 -16 -64 -21 -134 -21 -70 0 -99 5 -134 21 -47 23 -87 64 -109 111 -16
35 -21 64 -21 134 0 70 5 99 21 134 22 47 62 88 109 111 35 16 64 21 134 21
70 0 99 -5 134 -21z" fill="#0ea5e9"/>
</g>
</svg>"""

print("=== SVG Analysis ===")

# Extract key properties
width_match = re.search(r'width="([^"]+)"', svg_code)
height_match = re.search(r'height="([^"]+)"', svg_code)
viewbox_match = re.search(r'viewBox="([^"]+)"', svg_code)
transform_match = re.search(r'translate\(([^)]+)\)', svg_code)
scale_match = re.search(r'scale\(([^)]+)\)', svg_code)

print(f"Width: {width_match.group(1) if width_match else 'Not found'}")
print(f"Height: {height_match.group(1) if height_match else 'Not found'}")
print(f"ViewBox: {viewbox_match.group(1) if viewbox_match else 'Not found'}")
print(f"Transform: {transform_match.group(1) if transform_match else 'Not found'}")
print(f"Scale: {scale_match.group(1) if scale_match else 'Not found'}")

# Extract path coordinates to understand actual content bounds
paths = re.findall(r'd="([^"]+)"', svg_code)
print(f"\nNumber of paths: {len(paths)}")

# Analyze the first path to find coordinate ranges
if paths:
    # Extract all numbers from the path data
    import re
    coordinates = re.findall(r'[-+]?\d*\.?\d+', paths[0])
    coords = [float(c) for c in coordinates]

    print(f"\nPath 1 coordinate analysis:")
    print(f"Total coordinates: {len(coords)}")
    print(f"Min coordinate: {min(coords)}")
    print(f"Max coordinate: {max(coords)}")
    print(f"Coordinate range: {max(coords) - min(coords)}")

    # Find specific coordinate types
    moves = [int(i) for i, c in enumerate(coordinates) if 'M' in paths[0][:paths[0].find(coordinates[i+1]) if i+1 < len(coordinates) else len(paths[0])]]
    print(f"Move commands at positions: {moves[:5]}...")  # First 5 moves

# Check for preserveAspectRatio
preserve_aspect_ratio = 'preserveAspectRatio="xMidYMid meet"' in svg_code
print(f"\nPreserve aspect ratio: {preserve_aspect_ratio}")

# Analyze the transform matrix more carefully
transform_str = 'translate(0.000000,1024.000000) scale(0.100000,-0.100000)'
print(f"\n=== Transform Analysis ===")
print(f"Original transform: {transform_str}")
print("This means:")
print("- Translate: (0, 1024) - moves content down by 1024 units")
print("- Scale: (0.1, -0.1) - scales down to 10% and flips vertically")

# Calculate effective coordinate bounds
if coords:
    min_x = min(coords[::2])  # Every other coordinate starting from 0
    max_x = max(coords[::2])
    min_y = min(coords[1::2])  # Every other coordinate starting from 1
    max_y = max(coords[1::2])

    print(f"\nRaw coordinate bounds:")
    print(f"X: {min_x} to {max_x} (range: {max_x - min_x})")
    print(f"Y: {min_y} to {max_y} (range: {max_y - min_y})")

    # Apply transform to understand final rendered coordinates
    # Final x = (x + 0) * 0.1 = x * 0.1
    # Final y = (y + 1024) * -0.1 = -(y + 1024) * 0.1

    transformed_min_x = min_x * 0.1
    transformed_max_x = max_x * 0.1
    transformed_min_y = -(min_y + 1024) * 0.1
    transformed_max_y = -(max_y + 1024) * 0.1

    print(f"\nTransformed coordinate bounds:")
    print(f"X: {transformed_min_x} to {transformed_max_x} (range: {transformed_max_x - transformed_min_x})")
    print(f"Y: {transformed_min_y} to {transformed_max_y} (range: {transformed_max_y - transformed_min_y})")

    # Calculate actual content usage of the 1024x1024 viewBox
    viewBox_usage_x = (transformed_max_x - transformed_min_x) / 1024 * 100
    viewBox_usage_y = (transformed_max_y - transformed_min_y) / 1024 * 100

    print(f"\nViewBox usage percentage:")
    print(f"X-axis usage: {viewBox_usage_x:.2f}%")
    print(f"Y-axis usage: {viewBox_usage_y:.2f}%")