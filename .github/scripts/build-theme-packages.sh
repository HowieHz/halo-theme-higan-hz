#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="${ROOT_DIR:-$PWD}"
INCLUDE_LIST_PATH="${1:-.github/include-list.txt}"
OUTPUT_DIR="${2:-$ROOT_DIR/dist/theme-packages}"

INCLUDE_LIST="$ROOT_DIR/$INCLUDE_LIST_PATH"
SOURCE_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$SOURCE_DIR"
}

trap cleanup EXIT

if [ ! -f "$INCLUDE_LIST" ]; then
  echo "Include list not found: $INCLUDE_LIST" >&2
  exit 1
fi

rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

cd "$ROOT_DIR"

grep -Ev '^[[:space:]]*(#|$)' "$INCLUDE_LIST" | while IFS= read -r path; do
  if [ -e "$path" ]; then
    cp -r --parents "$path" "$SOURCE_DIR"
  else
    echo "Missing path from include-list: $path" >&2
    exit 1
  fi
done

package_theme() {
  local output_name="$1"
  local settings_file="$2"
  local annotation_file="$3"
  local theme_file="$4"
  local work_dir

  work_dir="$(mktemp -d)"
  cp -a "$SOURCE_DIR/." "$work_dir/"
  cp "$ROOT_DIR/$settings_file" "$work_dir/settings.yaml"
  cp "$ROOT_DIR/$annotation_file" "$work_dir/annotation-settings.yaml"
  cp "$ROOT_DIR/$theme_file" "$work_dir/theme.yaml"

  (
    cd "$work_dir"
    zip -9 -r "$output_name" .
  )

  mv "$work_dir/$output_name" "$OUTPUT_DIR/"
  rm -rf "$work_dir"
}

package_theme "howiehz-higan-cn.zip" "settings.yaml" "annotation-settings.yaml" "theme.yaml"
package_theme "howiehz-higan-en.zip" "i18n-settings/settings.en.yaml" "i18n-settings/annotation-settings.en.yaml" "i18n-settings/theme.en.yaml"
