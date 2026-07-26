// A season bound is an ISO-8601 calendar date (e.g. "2026-09-01"); null means unbounded on that side.
type SeasonDate = String

type Season {
    start: SeasonDate?,
    end: SeasonDate?
}

type SetSeasonRequest {
    start: SeasonDate?,
    end: SeasonDate?
}

endpoint GetSeason GET /api/team/season -> {
    200 -> Season
}

endpoint SetSeason PUT SetSeasonRequest /api/team/season -> {
    200 -> Season
    403 -> Unit
}
