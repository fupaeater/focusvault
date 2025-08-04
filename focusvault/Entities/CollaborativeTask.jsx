{
  "name": "CollaborativeTask",
  "type": "object",
  "properties": {
    "session_id": {
      "type": "string",
      "description": "ID of the pomodoro session this task belongs to"
    },
    "title": {
      "type": "string",
      "description": "Task title"
    },
    "description": {
      "type": "string",
      "description": "Task description"
    },
    "completed": {
      "type": "boolean",
      "default": false,
      "description": "Whether the task is completed"
    },
    "completed_by": {
      "type": "string",
      "description": "Email of user who completed the task"
    },
    "priority": {
      "type": "string",
      "enum": [
        "low",
        "medium",
        "high"
      ],
      "default": "medium",
      "description": "Task priority"
    },
    "estimated_pomodoros": {
      "type": "number",
      "default": 1,
      "description": "Estimated number of pomodoros needed"
    }
  },
  "required": [
    "session_id",
    "title"
  ]
}