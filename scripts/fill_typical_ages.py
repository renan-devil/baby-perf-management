"""Add to Constance's seed every skill she would typically have by (age - 3 months),
dated at its typical age. Rule chosen with the family (2026-09-30):
  - milestones: typical age = p50 (half of children have it by then)
  - learning goals: typical age = middle of the age range
  - behaviours: skipped (observations, not skills)
  - skills already recorded from the Excel keep their real dates
Run after `npm run build:catalog`:  python3 scripts/fill_typical_ages.py [YYYY-MM-DD]
The optional date is "today" (default 2026-09-30, the day this was requested).
"""
import json
import sys
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SEED = ROOT / "catalog/seed/constance.json"
DAYS_PER_MONTH = 30.4375
NOTE = "Assumed at the typical age (filled up to 3 months before {today})"


def typical_months(skill):
    if skill.get("percentiles"):
        return skill["percentiles"]["p50"]
    if skill.get("ageStart") is not None:
        return (skill["ageStart"] + skill.get("ageEnd", skill["ageStart"])) / 2 * 12
    return None


def main():
    today = date.fromisoformat(sys.argv[1]) if len(sys.argv) > 1 else date(2026, 9, 30)
    catalog = json.loads((ROOT / "src/data/catalog.json").read_text())
    seed = json.loads(SEED.read_text())
    birth = date.fromisoformat(seed["child"]["birthDate"])
    cutoff = (today - birth).days / DAYS_PER_MONTH - 3
    # Keep the Excel observations, drop previous fills so the script can be re-run.
    kept = [o for o in seed["observations"] if not o.get("note", "").startswith("Assumed at the typical age")]
    have = {o["skillId"] for o in kept}
    added = []
    for s in catalog["skills"]:
        t = typical_months(s)
        if s["kind"] == "behaviour" or t is None or t > cutoff or s["id"] in have:
            continue
        added.append({
            "skillId": s["id"], "status": "achieved",
            "observedOn": (birth + timedelta(days=round(t * DAYS_PER_MONTH))).isoformat(),
            "approximate": True, "note": NOTE.format(today=today.isoformat()),
        })
    seed["version"] = 2
    seed["observations"] = sorted(kept + added, key=lambda o: (o["observedOn"], o["skillId"]))
    SEED.write_text(json.dumps(seed, indent=1, ensure_ascii=False))
    print(f"cutoff {cutoff:.1f} months: {len(kept)} Excel + {len(added)} typical-age = {len(seed['observations'])} observations")


if __name__ == "__main__":
    main()
