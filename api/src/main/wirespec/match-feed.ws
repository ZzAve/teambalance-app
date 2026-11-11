// The team's Nevobo match feed (ADR-0047). Admin-only. The feed is a poule programme feed; the team name is how the feed spells this team.

enum MatchDifference {
    START_TIME,
    LOCATION,
    OPPONENT
}

type FeedMatch {
    code: String,
    link: String,
    startTime: DateTimestampWithTimezone,
    homeTeam: String,
    awayTeam: String,
    venue: String?
}

// An upcoming event that is linked to a feed match and differs from it.
type MatchMismatch {
    eventId: String,
    eventTitle: String,
    eventStartTime: DateTimestampWithTimezone,
    eventLocation: String?,
    feedMatch: FeedMatch,
    differences: MatchDifference[]
}

// `lastCheckFailed`: the last read of the feed failed, so the findings use the matches of an earlier read. `missing`: upcoming matches of this team with no linked event.
type MatchFeedStatus {
    feedUrl: String,
    teamName: String,
    lastCheckedAt: DateTimestampWithTimezone?,
    lastCheckFailed: Boolean,
    mismatches: MatchMismatch[],
    missing: FeedMatch[]
}

type MatchFeedTeams {
    teams: String[]
}

type ConfigureMatchFeedRequest {
    feedUrl: String,
    teamName: String
}

type MatchFeedTeamsRequest {
    feedUrl: String
}

// A read, sent as POST so the feed URL travels in the body rather than in a query string. 400 carries code INVALID_FEED_URL; 503: the feed could not be read.
endpoint ListMatchFeedTeams POST MatchFeedTeamsRequest /api/match-feed/teams -> {
    200 -> MatchFeedTeams
    400 -> Unit
    503 -> Unit
}

endpoint GetMatchFeed GET /api/match-feed -> {
    200 -> MatchFeedStatus
    404 -> Unit
}

// Reads the feed at once, so the status it returns is current. 400 carries code INVALID_FEED_URL or UNKNOWN_FEED_TEAM; 503: the feed could not be read.
endpoint ConfigureMatchFeed PUT ConfigureMatchFeedRequest /api/match-feed -> {
    200 -> MatchFeedStatus
    400 -> Unit
    503 -> Unit
}

endpoint RemoveMatchFeed DELETE /api/match-feed -> {
    204 -> Unit
}
