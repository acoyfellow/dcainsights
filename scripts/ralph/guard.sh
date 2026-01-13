#!/usr/bin/env bash
set -euo pipefail

constraints_file="${1:-}"

if [[ -z "${constraints_file}" ]]; then
  echo "Usage: $0 <constraints.json>" >&2
  exit 1
fi

if [[ ! -f "${constraints_file}" ]]; then
  echo "guard: constraints file not found at ${constraints_file}" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "guard: jq is required" >&2
  exit 1
fi

jq -e . "${constraints_file}" >/dev/null

max_files=$(jq -r '.maxFilesChanged // 20' "${constraints_file}")
max_additions=$(jq -r '.maxAdditions // 800' "${constraints_file}")
max_deletions=$(jq -r '.maxDeletions // 800' "${constraints_file}")
allow_binary=$(jq -r '.allowBinary // false' "${constraints_file}")
mapfile -t forbidden_paths < <(jq -r '(.forbiddenPaths // [])[]? // empty' "${constraints_file}")

mapfile -t changed_files < <(git diff --name-only --diff-filter=ACMRTUXB)
mapfile -t untracked_files < <(git ls-files --others --exclude-standard)
if [[ ${#untracked_files[@]} -gt 0 ]]; then
  changed_files+=("${untracked_files[@]}")
fi
if [[ ${#changed_files[@]} -eq 0 ]]; then
  echo "guard: no changes detected"
  exit 0
fi

if [[ ${#changed_files[@]} -gt ${max_files} ]]; then
  echo "guard: too many files changed (${#changed_files[@]} > ${max_files})" >&2
  exit 1
fi

numstat_output=$(git diff --numstat)
total_add=0
total_del=0
binary_seen=0
if [[ -n "${numstat_output}" ]]; then
  while IFS=$'\t' read -r add del _path; do
    [[ -z "${add}" ]] && continue
    if [[ "${add}" == "-" || "${del}" == "-" ]]; then
      binary_seen=1
    fi
    if [[ "${add}" != "-" ]]; then
      total_add=$((total_add + add))
    fi
    if [[ "${del}" != "-" ]]; then
      total_del=$((total_del + del))
    fi
  done <<<"${numstat_output}"
fi

if [[ "${allow_binary}" == "false" && "${binary_seen}" -ne 0 ]]; then
  echo "guard: binary changes detected (forbidden)" >&2
  exit 1
fi

if [[ ${total_add} -gt ${max_additions} ]]; then
  echo "guard: too many additions (${total_add} > ${max_additions})" >&2
  exit 1
fi

if [[ ${total_del} -gt ${max_deletions} ]]; then
  echo "guard: too many deletions (${total_del} > ${max_deletions})" >&2
  exit 1
fi

if [[ ${#forbidden_paths[@]} -gt 0 ]]; then
  for file in "${changed_files[@]}"; do
    [[ -z "${file}" ]] && continue
    for forbidden in "${forbidden_paths[@]}"; do
      [[ -z "${forbidden}" ]] && continue
      pattern="${forbidden}"
      if [[ "${pattern}" == *"*"* || "${pattern}" == *"?"* || "${pattern}" == *"["* ]]; then
        case "${file}" in
          ${pattern})
            echo "guard: forbidden path touched (${file})" >&2
            exit 1
            ;;
        esac
      else
        if [[ "${file}" == "${pattern}" || "${file}" == "${pattern}"/* ]]; then
          echo "guard: forbidden path touched (${file})" >&2
          exit 1
        fi
      fi
    done
  done
fi

echo "guard: ok"
