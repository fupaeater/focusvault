{
  "name": "PomodoroSession",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Session name"
    },
    "status": {
      "type": "string",
      "enum": [
        "waiting",
        "work",
        "short_break",
        "long_break",
        "paused"
      ],
      "default": "waiting",
      "description": "Current session status"
    },
    "current_cycle": {
      "type": "number",
      "default": 1,
      "description": "Current pomodoro cycle number"
    },
    "time_remaining": {
      "type": "number",
      "default": 1500,
      "description": "Time remaining in seconds"
    },
    "work_duration": {
      "type": "number",
      "default": 1500,
      "description": "Work duration in seconds (25 minutes)"
    },
    "short_break_duration": {
      "type": "number",
      "default": 300,
      "description": "Short break duration in seconds (5 minutes)"
    },
    "long_break_duration": {
      "type": "number",
      "default": 900,
      "description": "Long break duration in seconds (15 minutes)"
    },
    "last_updated": {
      "type": "string",
      "format": "date-time",
      "description": "Last time the timer was updated"
    },
    "active_participants": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of active participant emails"
    }
  },
  "required": [
    "name"
  ]
}