#!/usr/bin/env python3
"""Optional development-only regeneration; requires Poppler and Pillow 12.3.0."""
import argparse
from pathlib import Path
import shutil
import subprocess
import tempfile

from PIL import Image


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("pdf", type=Path, help="Original, unchanged 13-page calendar PDF")
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parents[2] / "static/calendar2027/textures")
    args = parser.parse_args()
    if not args.pdf.is_file():
        parser.error(f"PDF does not exist: {args.pdf}")
    if not shutil.which("pdftoppm"):
        parser.error("pdftoppm is missing; install Poppler on your development computer")
    with tempfile.TemporaryDirectory(prefix="calendar2027-") as temp:
        subprocess.run([
            "pdftoppm", "-scale-to-x", "1800", "-scale-to-y", "-1", "-png",
            str(args.pdf.resolve()), str(Path(temp) / "page"),
        ], check=True)
        pages = sorted(Path(temp).glob("page-*.png"))
        if len(pages) != 13:
            raise ValueError(f"Expected 13 pages; found {len(pages)}")
        args.output.mkdir(parents=True, exist_ok=True)
        for index, page in enumerate(pages):
            name = "calendar2027_cover.webp" if index == 0 else f"calendar2027_{index:02}.webp"
            with Image.open(page) as image:
                if image.size != (1800, 2532):
                    raise ValueError(f"Unexpected page dimensions: {page.name}: {image.size}")
                image.convert("RGB").save(args.output / name, "WEBP", quality=94, method=6)
            print(name)


if __name__ == "__main__":
    main()
