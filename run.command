#!/bin/bash

# Ensure script runs from its own directory (important for double-click)
cd "$(dirname "$0")"

# Use system python3
python3 encoder.py
