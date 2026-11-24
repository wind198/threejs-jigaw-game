#!/usr/bin/env python3
"""Convert puzzle PNGs to AVIF and archive originals under legacy/."""

import argparse
import shutil
import struct
import subprocess
import sys
import tempfile
from pathlib import Path


DEFAULT_ROOT = Path(__file__).resolve().parents[1] / "src/assets/puzzle-images"


def png_dimensions(path: Path) -> tuple[int, int]:
    with path.open("rb") as image:
        header = image.read(24)
    if header[:8] != b"\x89PNG\r\n\x1a\n" or header[12:16] != b"IHDR":
        raise ValueError(f"Invalid PNG: {path}")
    return struct.unpack(">II", header[16:24])


def avif_dimensions(path: Path) -> tuple[int, int]:
    result = subprocess.run(
        ["sips", "-g", "format", "-g", "pixelWidth", "-g", "pixelHeight", str(path)],
        check=True,
        capture_output=True,
        text=True,
    )
    fields = dict(line.strip().split(": ", 1) for line in result.stdout.splitlines() if ": " in line)
    if fields.get("format") != "avif":
        raise ValueError(f"Invalid AVIF: {path}")
    return int(fields["pixelWidth"]), int(fields["pixelHeight"])


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=DEFAULT_ROOT, help="Puzzle image directory")
    parser.add_argument("--quality", type=int, default=70, help="AVIF color quality (0–100; default: 70)")
    parser.add_argument("--dry-run", action="store_true", help="List files without changing them")
    args = parser.parse_args()
    if not 0 <= args.quality <= 100:
        parser.error("--quality must be between 0 and 100")
    if not args.root.is_dir():
        parser.error(f"Image directory does not exist: {args.root}")
    if not args.dry_run:
        for command in ("avifenc", "sips"):
            if not shutil.which(command):
                parser.error(f"Required command is unavailable: {command}")

    root = args.root.resolve()
    sources = sorted(path for path in root.rglob("*.png") if "legacy" not in path.relative_to(root).parts)
    converted = 0
    source_bytes = 0
    output_bytes = 0
    for source in sources:
        relative = source.relative_to(root)
        destination = source.with_suffix(".avif")
        legacy = root / "legacy" / relative
        if destination.exists() or legacy.exists():
            print(f"Skipping {relative}: destination or legacy file already exists", file=sys.stderr)
            continue
        if args.dry_run:
            print(f"Would convert {relative} -> {destination.relative_to(root)}")
            continue

        expected = png_dimensions(source)
        original_size = source.stat().st_size
        with tempfile.NamedTemporaryFile(dir=source.parent, suffix=".avif", delete=False) as temporary:
            temporary_path = Path(temporary.name)
        try:
            result = subprocess.run(
                ["avifenc", "--qcolor", str(args.quality), "--speed", "6", "--jobs", "4", str(source), str(temporary_path)],
                capture_output=True,
                text=True,
            )
            if result.returncode:
                raise RuntimeError(result.stderr.strip() or result.stdout.strip())
            if avif_dimensions(temporary_path) != expected:
                raise ValueError(f"AVIF dimensions differ from PNG: {relative}")
            new_size = temporary_path.stat().st_size
            temporary_path.replace(destination)
            try:
                legacy.parent.mkdir(parents=True, exist_ok=True)
                source.replace(legacy)
            except Exception:
                destination.unlink()
                raise
            converted += 1
            source_bytes += original_size
            output_bytes += new_size
            print(f"Converted {relative}: {original_size:,} -> {new_size:,} bytes", flush=True)
        finally:
            temporary_path.unlink(missing_ok=True)

    if args.dry_run:
        print(f"{len(sources)} PNGs found")
    else:
        print(f"Converted {converted} PNGs; active images: {source_bytes:,} -> {output_bytes:,} bytes")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
