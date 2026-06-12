#!/usr/bin/env python3
"""Repository safety scan for the QA practice project.

Purpose:
- detect accidental local identity/path leaks before pushing to GitHub;
- detect obvious secret-looking material;
- allow documented mock credentials used by the intentional demo API.

This script is not a replacement for professional secret scanning.
It is a lightweight project gate for this training repository.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

EXCLUDED_PARTS = {
    ".git",
    ".venv",
    "node_modules",
    ".wrangler",
    ".pytest_cache",
    "__pycache__",
}

TEXT_SUFFIXES = {
    ".js",
    ".py",
    ".md",
    ".toml",
    ".json",
    ".yml",
    ".yaml",
    ".txt",
    ".gitignore",
    ".editorconfig",
}

# Project-owned public names are allowed. Personal machine/user identifiers are not.
IDENTITY_PATTERNS = [
    re.compile(pattern, re.IGNORECASE)
    for pattern in [
        r"\b***REMOVED***\b",
        r"***REMOVED***",
        r"\b***REMOVED***\b",
        r"***REMOVED***",
        r"\b***REMOVED***\b",
        r"\b***REMOVED***\b",
        r"***REMOVED***",
        r"darkdatastream",
        r"proton\.me",
        r"gmail\.com",
    ]
]

SECRET_PATTERNS = [
    re.compile(pattern, re.IGNORECASE)
    for pattern in [
        r"client_secret\s*[:=]",
        r"api[_-]?key\s*[:=]",
        r"access[_-]?key\s*[:=]",
        r"private[_-]?key\s*[:=]",
        r"-----BEGIN (RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----",
        r"Bearer\s+[A-Za-z0-9_\-\.]{24,}",
        r"sk-[A-Za-z0-9]{20,}",
        r"eyJ[A-Za-z0-9_\-]{20,}\.[A-Za-z0-9_\-]{20,}",
    ]
]

ALLOWED_MOCK_STRINGS = {
    "correct-password",
    "wrong-password",
    "demo-token-user",
    "qa@example.com",
    "Authorization: Bearer demo-token-user",
    "Bearer demo-token-user",
}


def should_scan(path: Path) -> bool:
    rel_parts = set(path.relative_to(ROOT).parts)
    if rel_parts & EXCLUDED_PARTS:
        return False
    if not path.is_file():
        return False
    if path.relative_to(ROOT).as_posix() == "scripts/security_scan.py":
        return False
    if path.name in {".gitignore", ".editorconfig"}:
        return True
    return path.suffix in TEXT_SUFFIXES


def allowed_line(line: str) -> bool:
    return any(value in line for value in ALLOWED_MOCK_STRINGS)


def main() -> int:
    findings: list[str] = []

    for path in sorted(ROOT.rglob("*")):
        if not should_scan(path):
            continue
        rel = path.relative_to(ROOT)
        try:
            lines = path.read_text(encoding="utf-8").splitlines()
        except UnicodeDecodeError:
            continue

        for line_number, line in enumerate(lines, start=1):
            if any(pattern.search(line) for pattern in IDENTITY_PATTERNS):
                findings.append(f"IDENTITY_LEAK {rel}:{line_number}: {line}")
                continue
            if allowed_line(line):
                continue
            if any(pattern.search(line) for pattern in SECRET_PATTERNS):
                findings.append(f"SECRET_LIKE {rel}:{line_number}: {line}")

    if findings:
        print("Security scan failed. Review these lines before publishing:")
        for finding in findings:
            print(finding)
        return 1

    print("Security scan passed: no configured identity leaks or secret-like values found.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
