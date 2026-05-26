#!/usr/bin/env python3
import argparse
from pathlib import Path
from typing import Optional

import cv2


def contour_depth(hierarchy, idx: int) -> int:
    depth = 0
    parent = hierarchy[0][idx][3]
    while parent != -1:
        depth += 1
        parent = hierarchy[0][parent][3]
    return depth


def points_to_path(points) -> str:
    coords = points.reshape(-1, 2)
    if len(coords) < 3:
        return ""
    start_x, start_y = coords[0]
    parts = [f"M {int(start_x)} {int(start_y)}"]
    for x, y in coords[1:]:
        parts.append(f"L {int(x)} {int(y)}")
    parts.append("Z")
    return " ".join(parts)


def trace_png_to_svg(input_path: Path, output_path: Path, threshold: Optional[int]) -> None:
    img = cv2.imread(str(input_path), cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise FileNotFoundError(f"Could not read image: {input_path}")

    height, width = img.shape[:2]

    if threshold is None:
        _, bw = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    else:
        _, bw = cv2.threshold(img, threshold, 255, cv2.THRESH_BINARY)

    contours, hierarchy = cv2.findContours(bw, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    if hierarchy is None:
        hierarchy = [[[-1, -1, -1, -1] for _ in contours]]

    output_path.parent.mkdir(parents=True, exist_ok=True)

    with output_path.open("w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write(
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
            f'viewBox="0 0 {width} {height}" shape-rendering="geometricPrecision">\n'
        )
        f.write(f'  <rect x="0" y="0" width="{width}" height="{height}" fill="#000000"/>\n')

        for idx, contour in enumerate(contours):
            path_data = points_to_path(contour)
            if not path_data:
                continue
            depth = contour_depth(hierarchy, idx)
            fill = "#ffffff" if depth % 2 == 0 else "#000000"
            f.write(f'  <path d="{path_data}" fill="{fill}"/>\n')

        f.write("</svg>\n")


def main() -> None:
    parser = argparse.ArgumentParser(description="Trace a black/white PNG into SVG contours.")
    parser.add_argument("--input", required=True, help="Input PNG path")
    parser.add_argument("--output", required=True, help="Output SVG path")
    parser.add_argument(
        "--threshold",
        type=int,
        default=None,
        help="Optional fixed threshold 0-255. Defaults to Otsu auto-threshold.",
    )
    args = parser.parse_args()

    trace_png_to_svg(Path(args.input), Path(args.output), args.threshold)


if __name__ == "__main__":
    main()
