#!/usr/bin/env bash
# Generate placeholder English narration for one game using the open-source
# `flite` engine (BSD-licensed, CMU Festival-Lite — no network, no model
# download). Output goes to games/<slug>/assets/audio/<id>.mp3.
#
# This never touches Arabic lines: flite's Arabic support isn't good enough
# to trust with how a word is supposed to sound, so Arabic narration is left
# entirely to tools/record-voice (a parent's real voice) or the device's own
# speechSynthesis fallback — never a synthesized placeholder.
#
# Requires: flite, ffmpeg, jq.
# Usage: scripts/generate-placeholder-audio.sh games/<slug>

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 games/<slug>" >&2
  exit 1
fi

GAME_DIR="$1"
NARRATION_FILE="$GAME_DIR/narration.json"
AUDIO_DIR="$GAME_DIR/assets/audio"

if [ ! -f "$NARRATION_FILE" ]; then
  echo "No narration.json at $NARRATION_FILE" >&2
  exit 1
fi

mkdir -p "$AUDIO_DIR"

count=$(jq 'length' "$NARRATION_FILE")
for i in $(seq 0 $((count - 1))); do
  id=$(jq -r ".[$i].id" "$NARRATION_FILE")
  text=$(jq -r ".[$i].text" "$NARRATION_FILE")
  lang=$(jq -r ".[$i].lang" "$NARRATION_FILE")

  if [ "$lang" != "en" ]; then
    echo "skip  $id (lang=$lang, not synthesized)"
    continue
  fi

  tmp_wav=$(mktemp --suffix=.wav)
  flite -t "$text" -voice slt -o "$tmp_wav"
  ffmpeg -y -loglevel error -i "$tmp_wav" -codec:a libmp3lame -qscale:a 4 "$AUDIO_DIR/$id.mp3"
  rm -f "$tmp_wav"
  echo "wrote $AUDIO_DIR/$id.mp3  ($text)"
done
