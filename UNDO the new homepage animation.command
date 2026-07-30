#!/bin/bash
# Double-click this file to remove the new homepage animation ("the seam")
# and put the homepage back exactly as it was before it was added.
#
# It is safe to run. It does not delete history — it records an undo on top of
# it, so the animation can be brought back later if you change your mind.
#
# Nothing else on the site is touched: the Appliances animation, the service
# area drawing on Contact, the photography and the logos all stay as they are.

set -u
cd "$(dirname "$0")" || exit 1

SEAM_COMMIT="241017fb43880e4fbe98973d30fb8764751cd084"

echo ""
echo "  Urban Reach — undo the new homepage animation"
echo ""

if ! command -v git >/dev/null 2>&1; then
  echo "  Git is not available, so this cannot run automatically."
  echo "  Ask Claude to undo it instead."
  echo ""
  read -r -p "  Press Return to close this window. " _
  exit 1
fi

# Refuse to run on top of unsaved edits. Reverting over them could mix the undo
# together with work in progress, which would be very hard to untangle later.
if [ -n "$(git status --porcelain)" ]; then
  echo "  There are unsaved changes in the project, so this stopped before"
  echo "  doing anything — undoing on top of them could tangle the two"
  echo "  together."
  echo ""
  echo "  Ask Claude to commit or discard those changes first, then run this"
  echo "  again."
  echo ""
  read -r -p "  Press Return to close this window. " _
  exit 1
fi

if ! git cat-file -e "${SEAM_COMMIT}^{commit}" 2>/dev/null; then
  echo "  Could not find the change to undo. It may already have been undone."
  echo ""
  read -r -p "  Press Return to close this window. " _
  exit 1
fi

if git revert --no-edit "$SEAM_COMMIT"; then
  echo ""
  echo "  Done. The homepage animation has been removed."
else
  git revert --abort 2>/dev/null
  echo ""
  echo "  The automatic undo could not be applied cleanly — the homepage has"
  echo "  been edited since the animation was added, so the two changes"
  echo "  overlap. Nothing was changed. Ask Claude to undo it by hand."
  echo ""
  read -r -p "  Press Return to close this window. " _
  exit 1
fi

echo "  Rebuilding the preview folder so you can look at it…"
echo ""
if npm run preview; then
  echo ""
  echo "  The preview folder is up to date."
else
  echo ""
  echo "  The undo worked, but rebuilding the preview failed. Ask Claude to"
  echo "  rebuild it."
fi

echo ""
read -r -p "  Press Return to close this window. " _
