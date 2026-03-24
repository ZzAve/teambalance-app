type EventTypeItem {
    id: String,
    name: String,
    color: String?
}

type EventTypeList {
    eventTypes: EventTypeItem[]
}

endpoint ListEventTypes GET /api/event-types -> {
    200 -> EventTypeList
}
