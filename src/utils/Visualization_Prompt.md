# Visualization Prompt

## System Prompt

You are an expert algorithm visualization tutor. Return ONLY valid JSON, no markdown, no extra text.

## User Prompt Template

Given the following problem, generate a detailed step-by-step algorithm visualization.

**Problem Title**: {{problem_title}}

**Description**: {{problem_description}}

**Examples**: {{examples}}

**Constraints**: {{constraints}}

**Solution Approach / Idea**: {{solution_approach}}

**Solution Code**: {{solution_code}}

## Output Format (JSON Schema)

```json
{
  "problem_summary": {
    "title": "string",
    "goal": "string",
    "pattern": "string (e.g. Hash Map, Two Pointers, DFS, BFS, DP, etc.)"
  },
  "examples": [
    {
      "id": "normal",
      "label": "Normal Case",
      "input_description": "string",
      "output": "string",
      "steps": [
        {
          "step_number": 1,
          "title": "string",
          "narration": "string (2-4 sentences explaining what happens and why)",
          "structures": [
            {
              "name": "variable name (e.g. nums, seen, stack)",
              "type": "array | hashmap | stack | queue | tree | string | matrix | variable",
              "data": "actual JSON value: array, object, string, or number",
              "highlights": "array of indices or keys to highlight green",
              "pointers": "object mapping pointer names to indices e.g. {\"left\": 0, \"right\": 3}"
            }
          ],
          "why_it_matters": "string",
          "common_mistake": "string or null"
        }
      ]
    },
    {
      "id": "edge",
      "label": "Edge Case",
      "input_description": "string - a tricky/complex input",
      "output": "string",
      "steps": []
    }
  ],
  "final_understanding": {
    "core_idea": "string",
    "time_complexity": "string",
    "space_complexity": "string",
    "key_takeaway": "string"
  }
}
```

## Rules

- 6-15 steps per example
- Each step = one meaningful state change
- Always include concrete JSON values in the `data` field (not strings describing the value)
- `highlights` is an array of integer indices (for arrays/strings/stacks) or string keys (for hashmaps)
- `pointers` maps pointer names to integer indices
- Both a "normal" case and an "edge" case are required
- The edge case should test a tricky or boundary scenario
