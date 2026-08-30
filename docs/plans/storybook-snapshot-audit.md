# Storybook Chromatic snapshot-policy audit

Per-story classification of every `*.stories.tsx` under `app/src/` for a Chromatic snapshot
decision. Read all 46 files (247 story exports). The audit only *recommends* a policy; it does not
modify any story.

## Legend

- **keep-baseline** — renders a visually distinct end-state that deserves its own pixel baseline
  (empty/loading/error/data variants, distinct layouts, a `play` that opens a dialog / reveals new UI
  / changes visible text or state, distinct icons/badges, read-only vs editable, distinct data shape).
  This is the default.
- **disableSnapshot** — the story's rendered pixels *after* `play` runs are essentially identical to a
  sibling story's baseline, so the picture is redundant. The behavioral test still runs; only the
  Chromatic snapshot is turned off (`parameters.chromatic.disableSnapshot`). Signature: an
  interaction-only spy that clicks/types and asserts a callback, where the component is controlled (or
  a menu/dialog opens transiently and then closes) so the *final* frame matches a sibling.
- **modes-candidate** — theme- or viewport-sensitive enough that a **dark** (or extra-viewport)
  snapshot adds real regression value. Marked *in addition to* keep-baseline; the extra snapshot is
  counted separately below. The repo currently pins `theme: 'light'` globally, so dark coverage is
  near-zero today (only `ThemeToggleView.Dark` opts in) — modes flags are where that gap bites.

## Summary

| Metric | Count |
|--------|------:|
| Total story exports | 247 |
| keep-baseline | 205 |
| disableSnapshot | 42 |
| modes-candidate stories (extra **dark** snapshots) | +11 |

**Current baseline:** 247 (every story snapshots today).

**Projected new baseline** = keep-baseline − snapshots removed + dark extras
= `247 − 42 (disabled) + 11 (dark modes) = 216`
(equivalently: 205 kept + 11 dark = 216).

**Net change: −31 baselines** (−42 redundant spy/duplicate pictures, +11 intentional dark snapshots).

disableSnapshot removals are disjoint from keep-baseline; the two never overlap. modes-candidates are
a subset of keep-baseline that each earn one *additional* snapshot in the dark theme.

---

## entities

### entities/event/EventCard
| Story | Classification | Reason |
|-------|----------------|--------|
| Populated | keep-baseline · modes | Data card; event-type color chit on card surface — worth a dark snapshot. |
| WithQuietRelativeLabel | keep-baseline | Quiet grey "in 3 days" label, no pill — distinct. |
| WithSolidRelativeLabel | keep-baseline | Solid ink "Tomorrow" pill — distinct treatment. |
| WithoutRelativeLabel | keep-baseline | No relative label variant. |
| SocialEvent | keep-baseline · modes | Different type color (gold chit) + data — dark snapshot catches the tint. |
| NoResponses | keep-baseline | "0 going / of 0" empty-attendance shape. |
| WithReferences | keep-baseline | Reference chips + "+1" overflow. |
| WithLocation | keep-baseline | Maps link row present. |

### entities/event/EventDetailSkeleton
| Story | Classification | Reason |
|-------|----------------|--------|
| Default | keep-baseline | The only loading-shimmer baseline for the detail route. |

### entities/event/EventListView
| Story | Classification | Reason |
|-------|----------------|--------|
| Loading | keep-baseline | Loading shell. |
| ErrorState | keep-baseline | Error shell. |
| Empty | keep-baseline | "No upcoming events." empty. |
| EmptyWhenFiltered | keep-baseline | Distinct empty message ("No events for this type."). |
| WithEvents | keep-baseline · modes | Data list of cards; representative dark snapshot of the list surface. |
| DataDespiteBackgroundError | keep-baseline | One cached card, no error banner — distinct from the 3-card data state. |

### entities/event/EventTypeBadge
| Story | Classification | Reason |
|-------|----------------|--------|
| WithColor | keep-baseline | Tinted badge. Trivial-variant cluster (colored vs neutral) — could collapse to one argTypes story if per-variant baselines aren't wanted. |
| WithoutColor | keep-baseline | Neutral-grey fallback badge. Same trivial-variant note. |

### entities/event/EventTypeIcon
| Story | Classification | Reason |
|-------|----------------|--------|
| Training | keep-baseline | Distinct lucide icon (dumbbell). Trivial-variant cluster — one icon per literal type; could alternatively be a single argTypes story. |
| Match | keep-baseline | Swords icon. |
| Tournament | keep-baseline | Trophy icon. |
| Social | keep-baseline | Party-popper icon. |
| UnknownFallback | keep-baseline | Calendar fallback icon. |
| Small | keep-baseline | `sm` size (h-9) wrapper — distinct dimensions. |

### entities/event/ReferenceChips
| Story | Classification | Reason |
|-------|----------------|--------|
| None | keep-baseline | Renders nothing (empty). |
| OneTitled | keep-baseline | Single titled chip. |
| HostFallbackWhenTitleBlank | keep-baseline | Host stands in as label — distinct text. |
| OverflowCollapsesToPlusN | keep-baseline | Two chips + "+2" overflow. |

### entities/event/ReferenceRowsEditor
| Story | Classification | Reason |
|-------|----------------|--------|
| AddAndRemove | keep-baseline | Stateful harness; add/remove reveals link rows — DOM changes. |
| Prefilled | keep-baseline | Pre-filled row (Nevobo) — distinct data. |
| ReportsEdits | **disableSnapshot** | Prop-contract spy (`onChange` args). Final frame = one link row, duplicating AddAndRemove's added-row state. Value is the wiring, not the picture. |

### entities/event/RoleBreakdown
| Story | Classification | Reason |
|-------|----------------|--------|
| Populated | keep-baseline | Role/count chips. |
| Empty | keep-baseline | Renders nothing. |
| WithUnassigned | keep-baseline | Includes the "Unassigned" bucket — distinct data. |

### entities/event/SeriesPeek
| Story | Classification | Reason |
|-------|----------------|--------|
| CollapsedByDefault | keep-baseline | Collapsed header only. |
| ExpandedLongSeries | keep-baseline | `play` expands → occurrence list + "+N more" revealed. |
| CurrentInHead | keep-baseline | Expanded with "This one" tag on the current occurrence. |
| ShortSeries | keep-baseline | Expanded, every occurrence inline (no gap). |

### entities/position/PositionPicker
| Story | Classification | Reason |
|-------|----------------|--------|
| NoPositions | keep-baseline | Placeholder trigger, no options. |
| HasPositions | **disableSnapshot** | Opens the Radix select, picks Libero, asserts `onChange('p2')`. Value is controlled (`null`), so the menu closes and the trigger returns to the "Select a position" placeholder — final frame is pixel-identical to NoPositions. |
| Preselected | keep-baseline | Trigger shows "Outside Hitter" (p3). |
| WithUnassigned | keep-baseline | `includeUnassigned` config; trigger shows "Setter" — distinct label, not a clean duplicate. |

---

## features

### features/act-as/ActAsBannerView
| Story | Classification | Reason |
|-------|----------------|--------|
| NamesTheTeam | keep-baseline | Banner names the team + enabled Exit. |
| ExitIsOneClick | **disableSnapshot** | Spy: clicks Exit, asserts `onExit`. Controlled — no visible change; final = NamesTheTeam. |
| Exiting | keep-baseline | Exit disabled — distinct state. |
| NotActingAs | keep-baseline | `teamName: null` → renders nothing. |

### features/act-as/ActAsRecordsView
| Story | Classification | Reason |
|-------|----------------|--------|
| Loading | keep-baseline | Loading text. |
| ErrorState | keep-baseline | Error text. |
| NeverVisited | keep-baseline | Empty ("never worked here") message. |
| CollapsedByDefault | keep-baseline | Resting one-line collapsed state. |
| OneVisitReadsAsOnce | keep-baseline | "worked here once" copy — distinct label. |
| ExpandedListAttributesGenerically | keep-baseline | `play` expands → generic-attribution list revealed (progressive-disclosure layer 1). |
| RecordExpandsToItsDetail | keep-baseline | Expands a record → per-visit detail (layer 2). |
| RanOutRatherThanLeft | keep-baseline | "when the hour ran out" — distinct data + detail. |
| ReasoningIsReachable | keep-baseline | Opens the reasoning panel (layer 3) — distinct revealed copy. |
| ReasoningClosesWithItsRecord | **disableSnapshot** | Behavioral: reasoning collapses when another record opens. Final frame is just an expanded-record detail, redundant with RecordExpandsToItsDetail / RanOutRatherThanLeft. |

### features/act-as/PlatformTeamsView
| Story | Classification | Reason |
|-------|----------------|--------|
| Loading | keep-baseline | Loading shell. |
| ErrorState | keep-baseline | Error shell. |
| Forbidden | keep-baseline | No-access message — distinct. |
| Empty | keep-baseline | "No teams yet." |
| EveryTeam | keep-baseline | Team list with slugs + Enter buttons. |
| EnterATeam | **disableSnapshot** | Spy: clicks Enter, asserts `onEnter(team)`. Controlled — final = EveryTeam. |
| AfterALapse | keep-baseline | Adds the "act-as ran out" banner — distinct. |
| Entering | keep-baseline | Enter buttons disabled — distinct state. |

### features/attendance-toggle/AttendanceToggle
| Story | Classification | Reason |
|-------|----------------|--------|
| Attending | keep-baseline · **modes** | Green "Going" pressed — semantic attendance color; top dark-mode candidate. |
| Maybe | keep-baseline · **modes** | Gold "Maybe" pressed — semantic color. |
| Absent | keep-baseline · **modes** | Red "Can't go" pressed — semantic color. |
| NotResponded | keep-baseline | No option pressed (neutral state); spy click is a bonus, final = none-pressed which no sibling holds. |
| Disabled | keep-baseline | All three disabled — distinct state. |

### features/bulk-attend/BulkAttendBarView
| Story | Classification | Reason |
|-------|----------------|--------|
| Hidden | keep-baseline | Empty groups → renders nothing. |
| PerType | keep-baseline | Two per-type buttons. |
| SingleType | keep-baseline | One button. |
| ManyTypes | keep-baseline | Four buttons wrapping. |
| OneTypePending | keep-baseline | One disabled, one enabled — distinct. |
| TapReportsItsType | **disableSnapshot** | Spy: `onAttend('et-match')`. Controlled — final = PerType (default groups). |

### features/bulk-attend/BulkAttendButtonView
| Story | Classification | Reason |
|-------|----------------|--------|
| Hidden | keep-baseline | count 0 → hidden. |
| WithCount | keep-baseline | "Attend 3 events". |
| SingleEvent | keep-baseline | Singular "Attend 1 event". |
| SingleType | keep-baseline | "Attend 4 trainings" — type-named. |
| Pending | keep-baseline | Disabled while in flight. |
| TapFiresOnAttend | **disableSnapshot** | Spy: `onAttend` called. Controlled — final = WithCount (default count 3). |

### features/create-event/CreateEventForm
| Story | Classification | Reason |
|-------|----------------|--------|
| Default | keep-baseline | Empty form. |
| Submitting | keep-baseline | "Creating..." disabled. |
| TypeSelected | keep-baseline | Selecting a type (local state) auto-fills the title — distinct filled form. |
| NoEventTypes | keep-baseline | Placeholder selector. |
| AddingLinks | keep-baseline | Add/remove reveals link rows — DOM changes. |
| CreateFailed | keep-baseline | Inline alert shown. |
| DerivesEndTimeFromDuration | keep-baseline | Fills type + start time then submits; the filled form differs from TypeSelected by the start-time field. (Heavy overlap with TypeSelected — a trim candidate if the endTime contract alone is the point.) |

### features/create-recurring-events/MonthCalendarPreview
| Story | Classification | Reason |
|-------|----------------|--------|
| InSeason | keep-baseline | In-season grid with occurrence highlights. |
| OutOfSeason | keep-baseline | Red out-of-season warning — distinct. |
| OverCap | keep-baseline | "over 200 events" cap warning. |
| Empty | keep-baseline | "No dates yet" prompt. |

### features/create-recurring-events/RecurringEventsWizard
| Story | Classification | Reason |
|-------|----------------|--------|
| DetailsEmpty | keep-baseline | Step 1 empty, Next blocked. |
| DetailsFilled | keep-baseline | Type chosen → title auto-filled, Next enabled. |
| RecurrencePreview | keep-baseline | Step 2 live preview (distinct step UI). |
| OverCap | keep-baseline | Step 2 cap warning, Next blocked. |
| CreateSeries | keep-baseline | Walks to step 3 confirm — a distinct step no other story baselines at rest. |
| Submitting | keep-baseline | Step 3 pending "Creating…". |

### features/create-team/CreateTeamForm
| Story | Classification | Reason |
|-------|----------------|--------|
| Pristine | keep-baseline | Empty, submit disabled. |
| Valid | keep-baseline | Local state fills name/slug/code — distinct filled form. |
| Submitting | keep-baseline | Disabled + "still setting up" reassurance line. |
| CodeInvalid | keep-baseline | Invalid-code error. |
| SlugTaken | keep-baseline | Slug-taken error. |
| NameOrSlugInvalid | keep-baseline | Inline slug-validation message appears. |
| GenericFailure | keep-baseline | Generic error banner. |
| GenericError | **disableSnapshot** | Exact duplicate of GenericFailure — same `GENERIC` error arg, same render. |

### features/edit-event/DeleteEventDialogView
| Story | Classification | Reason |
|-------|----------------|--------|
| Standalone | keep-baseline | Standalone delete confirm (no scope group) — the default render. |
| Cancel | **disableSnapshot** | Spy: clicks Cancel, asserts `onCancel`. Controlled — final = Standalone. |
| Series | keep-baseline | Scope selector shown; "All events" relabels the confirm button (stateful). |
| Deleting | keep-baseline | Buttons disabled "Deleting…". |
| ErrorState | keep-baseline | Delete-failed message. |

### features/edit-event/EditEventDialogView
| Story | Classification | Reason |
|-------|----------------|--------|
| Standalone | keep-baseline | Default filled edit form (title "Tuesday Training"). |
| Series | keep-baseline | Scope selector + "Affects 1 of 3" — distinct. |
| CarriesRosterOverrideThroughAnUnrelatedEdit | **disableSnapshot** | Prop-contract spy (roster-override carry). Renames the title then submits; the form frame is essentially Standalone with a different title string. The carried override is invisible. |
| KeepsAnInheritingEventInheriting | **disableSnapshot** | Spy: submit asserts `rosterOverride: undefined`. No visible change; final = Standalone. |
| Saving | keep-baseline | "Saving…" disabled. |
| ErrorState | keep-baseline | Save-failed message. |

### features/edit-event/SeriesScopeField
| Story | Classification | Reason |
|-------|----------------|--------|
| EditThis | keep-baseline | Edit variant, THIS — "Affects 1 of 4" + split note. |
| EditThisAndFollowing | keep-baseline | Stateful click → "Affects 3 of 4" + date-lock note revealed. |
| EditAll | keep-baseline | ALL selected — "Affects 4 of 4", "No split". |
| DeleteThis | keep-baseline | Delete variant — "Removes 1 of 4", no date-lock note. |
| DeleteThisAndFollowing | keep-baseline | Stateful click → "Removes 3 of 4". |
| DeleteAll | keep-baseline | "Removes the entire series". |

### features/edit-profile/EditProfileForm
| Story | Classification | Reason |
|-------|----------------|--------|
| Default | keep-baseline | Name field (no picker, positions empty), Save enabled. |
| Editing | **disableSnapshot** | Types a new name; structurally identical to Default (one input's text differs, Save stays enabled). No new UI. |
| Saving | keep-baseline | "Saving..." disabled. |
| NameTakenError | keep-baseline | Name-taken error. |
| SavedSuccess | **disableSnapshot** | Submit-contract spy (`onSubmit('Grace Hopper', null)`); filled form frame = Default layout. |
| PositionRequired | keep-baseline | Position picker present + required-gating (Save disabled until picked) — new UI vs Default. |
| PositionPreselected | keep-baseline | Picker preselected ("Setter") — distinct config. |

### features/filter-event-types/EventFiltersView
| Story | Classification | Reason |
|-------|----------------|--------|
| Closed | keep-baseline | Popover shut, filter button. |
| Open | keep-baseline | Popover open — type chips + past switch. |
| TogglesType | **disableSnapshot** | Spy: opens popover, `onToggleType('et-2')`. Final = Open (popover open, same selection). |
| TogglesShowPast | **disableSnapshot** | Spy: `onToggleShowPast(true)`. `showPast` controlled false, so switch stays off; final = Open. |
| ShowingPast | keep-baseline | Switch ON + "On — past events included" — distinct. |
| ClosesOnEscape | **disableSnapshot** | Opens then Escape → popover closed; final = Closed. |
| WithoutEventTypes | keep-baseline | Popover open with no chips (only past toggle) — distinct. |
| FilteredToOneType | keep-baseline | Narrowed selection (Match pressed, Training not) — distinct chip states. |

### features/generate-invite/GenerateInviteContent
| Story | Classification | Reason |
|-------|----------------|--------|
| Loading | keep-baseline | Loading. |
| Error | keep-baseline | Load-error. |
| NoLink | keep-baseline | No-link state + Generate (default render). |
| Generating | keep-baseline | "Generating..." disabled. |
| ActiveLink | keep-baseline | Link shown + Copy — the "has link" baseline. |
| Copied | keep-baseline | "Copied!" button — distinct label. |
| RotateLink | **disableSnapshot** | Spy: clicks Rotate, `onRotate`. Controlled — final = ActiveLink. |
| RevokeLink | **disableSnapshot** | Spy: clicks Revoke, `onExpire`. Controlled — final = ActiveLink. |
| Rotating | keep-baseline | "Rotating..." disabled. |
| Revoking | keep-baseline | "Revoking..." disabled. |
| JustExpired | keep-baseline | Revoked confirmation + "Generate new link". |
| ActionError | keep-baseline | Link + error banner — distinct. |

### features/join-team/JoinTeamView
| Story | Classification | Reason |
|-------|----------------|--------|
| Default | keep-baseline | Empty field, Join disabled. |
| TypingUpdatesTheContainer | **disableSnapshot** | Spy: types, asserts `onChange`. `value` controlled (`''`), so the field never fills; final = Default. |
| Submit | keep-baseline | `value` = pasted URL → filled field + enabled Join (distinct from Default). |
| Submitting | keep-baseline | "Joining…" disabled. |
| ErrorState | keep-baseline | Invalid/expired alert. |
| NoLinkFallback | keep-baseline | Reveals the "no link" fallback + Create-a-team link. |

### features/manage-creation-codes/ManageCreationCodesView
| Story | Classification | Reason |
|-------|----------------|--------|
| Loading | keep-baseline | Loading shell. |
| ErrorState | keep-baseline | Error shell. |
| Forbidden | keep-baseline | No-access message. |
| Empty | keep-baseline | "No creation codes yet." |
| WithItems | keep-baseline | Active/Expired/Used status badges + Revoke buttons. |
| GenerateCode | **disableSnapshot** | Spy: clicks Generate, `onCreate`. `codes: []`, so final = Empty. |
| RevokeConfirm | **disableSnapshot** | Opens the confirm dialog, confirms — but the confirm handler calls `setConfirmTarget(null)`, closing the dialog; final = WithItems. (No sibling captures the open dialog, so the dialog itself goes unsnapshotted — a coverage gap, not a duplication.) |
| RevokeConsumedBlocked | keep-baseline | Consumed-blocked error. |

### features/manage-members/MemberRosterView
| Story | Classification | Reason |
|-------|----------------|--------|
| Loading | keep-baseline | Loading shell. |
| ErrorState | keep-baseline | Error shell. |
| Default | keep-baseline | Full editable roster (avatars, pickers, role buttons). |
| ChangePosition | **disableSnapshot** | Opens a position select, picks Libero, `onChangePosition`. Value controlled → menu closes, row stays "Unassigned"; final = Default. |
| NoPositionsDefined | keep-baseline | Rows fall back to plain "Unassigned" text (no picker) — distinct. |
| RemoveConfirmOpen | keep-baseline | Remove opens the confirm dialog and leaves it open — the only open-dialog baseline. |
| RenameMember | keep-baseline | Editing a name flips the row `dirty` → an inline **Save** button appears (local state, new UI). The survey flagged this as a spy, but the revealed Save affordance makes the frame non-redundant. |
| ToggleRole | **disableSnapshot** | Spy: "Make member", `onToggleRole`. Role from props → no change; final = Default. |
| RemoveMember | **disableSnapshot** | Opens the confirm dialog then confirms — handler calls `setConfirmTarget(null)`, closing it; final = Default (RemoveConfirmOpen already holds the open-dialog picture). |
| ReadOnly | keep-baseline | `canManage: false` read-only rows — distinct layout. |
| LastAdminRefused | keep-baseline | Last-admin refusal alert banner. |

### features/manage-positions/ManagePositionsView
| Story | Classification | Reason |
|-------|----------------|--------|
| Loading | keep-baseline | Loading shell. |
| ErrorState | keep-baseline | Error shell. |
| Empty | keep-baseline | "No positions yet." |
| WithItems | keep-baseline | Editable position rows + Delete buttons. |
| CreatePosition | **disableSnapshot** | Types a label, Add; `handleCreate` clears the field and `positions: []` stays → final = Empty. |
| RenamePosition | keep-baseline | Editing flips `dirty` → inline **Save** button appears (new UI). Same reasoning as MemberRosterView.RenameMember — survey flagged it, but the Save affordance is a distinct frame. |
| DeleteConfirm | **disableSnapshot** | Opens confirm then confirms — handler closes the dialog; final = WithItems. |
| LabelTaken | keep-baseline | Label-taken error. |

### features/onboarding-hub/OnboardingHubView
| Story | Classification | Reason |
|-------|----------------|--------|
| Default | keep-baseline | The fork (join vs create) — the only render of this component's UI. |
| ChooseJoin | **disableSnapshot** | Spy: `onChooseJoin`. Navigation owned by container → no visible change; final = Default. |
| ChooseCreate | **disableSnapshot** | Spy: `onChooseCreate`. Same — final = Default. |

### features/switch-team/SelectTeamView
| Story | Classification | Reason |
|-------|----------------|--------|
| TwoTeams | keep-baseline | Two-team choice list. |
| ManyTeams | keep-baseline | Four teams — distinct list length/layout. |
| ChoosingHandsUpTheSlug | **disableSnapshot** | Spy: `onSelect('tovo-heren-5')`. Controlled — final = TwoTeams. |

### features/switch-team/TeamSwitcherView
| Story | Classification | Reason |
|-------|----------------|--------|
| SingleTeam | keep-baseline | Names the team, no menu trigger. |
| SeveralTeams | keep-baseline | Trigger closed (multi-team). |
| MenuOpen | keep-baseline | Dropdown open with selected/unselected options — the open-menu baseline. |
| SwitchesToTheOtherTeam | **disableSnapshot** | Opens menu, picks Tovo, `onSelect`. Menu closes; final = SeveralTeams. |
| PickingTheActiveTeamDoesNothing | **disableSnapshot** | Opens menu, re-picks active, asserts no-op + listbox closed; final = SeveralTeams. |
| NoActiveTeam | keep-baseline | `activeTeam: null` — distinct. |

### features/team-settings/TeamSettingsView
| Story | Classification | Reason |
|-------|----------------|--------|
| Loading | keep-baseline | Loading shell. |
| ErrorState | keep-baseline | Error shell. |
| Unset | keep-baseline | "No season set" + Save disabled. |
| Set | keep-baseline | Populated dates, pristine (Save disabled). |
| ChangeWarning | keep-baseline | Editing surfaces the non-blocking warning + enables Save. |
| InvalidRange | keep-baseline | Inverted-range validation error + Save disabled. |

### features/theme-toggle/ThemeToggleView
| Story | Classification | Reason |
|-------|----------------|--------|
| SystemSelected | keep-baseline · modes | System radio checked (light theme). Whole slice is theme-critical. |
| LightSelected | keep-baseline | Light radio checked. |
| DarkSelected | keep-baseline | Dark radio checked (still under light theme). |
| ChoosingDark | **disableSnapshot** | Spy: clicks Dark, `onChange('dark')`. `value` controlled ('system') → checked unchanged; final = SystemSelected. |
| ReturningToSystem | **disableSnapshot** | Spy: `onChange('system')`. `value` controlled ('dark') → final = DarkSelected. |
| Dark | keep-baseline · **modes** | Renders under `.dark` via the `theme` global — the repo's one existing dark baseline and the exemplar pattern the modes recommendations should replicate. |

---

## shared

### shared/ui/BottomNav
| Story | Classification | Reason |
|-------|----------------|--------|
| EventsActive | keep-baseline · **modes** | Events tab active (blue). Persistent mobile-nav chrome — worth a dark snapshot. |
| TeamActive | keep-baseline | Team tab active. |
| MoneyActive | keep-baseline | Money tab active. |
| TeamSettingsActive | **disableSnapshot** | Nested route (`/team/settings`) keeps the **Team** tab active — same highlighted-tab picture as TeamActive. Behavioral (prefix-vs-exact match) only. |
| ProfileActive | keep-baseline | Profile tab active. |

### shared/ui/ColdStartSplash
| Story | Classification | Reason |
|-------|----------------|--------|
| Brand | keep-baseline | Warm boot — brand mark only. |
| Waking | keep-baseline | "rounding up the team" line. |
| WakingLater | keep-baseline | Rotated "almost there" line. |
| Warming | keep-baseline | Step indicator stage. |

### shared/ui/QueryErrorState
| Story | Classification | Reason |
|-------|----------------|--------|
| Default | keep-baseline | Title + description + Retry. |
| WithBackAction | keep-baseline | Adds a Back-link actions slot — distinct. |

### shared/ui/RouteErrorFallback
| Story | Classification | Reason |
|-------|----------------|--------|
| Default | keep-baseline | The only render; Retry spy is a bonus on the sole baseline. |

### shared/ui/UpdateToast
| Story | Classification | Reason |
|-------|----------------|--------|
| Hidden | keep-baseline | `show: false` → renders nothing. |
| Shown | keep-baseline | The toast bar — the component's only visible render. |

---

## widgets

### widgets/create-event/CreateEntryChooser
| Story | Classification | Reason |
|-------|----------------|--------|
| Default | keep-baseline | The chooser UI — sole render; spy clicks are bonus on the only baseline. |

### widgets/create-event/CreateEventSheetView
| Story | Classification | Reason |
|-------|----------------|--------|
| Chooser | keep-baseline | Chooser mode (single vs recurring). |
| SingleForm | keep-baseline | Single-event form mode + back step. |
| SingleError | keep-baseline | Inline single-create error. |
| Recurring | keep-baseline | Recurring wizard mode. |

### widgets/money-teaser/MoneyTeaserView
| Story | Classification | Reason |
|-------|----------------|--------|
| NotVoted | keep-baseline · **modes** | Coming-soon money surface, pre-vote — money surface dark snapshot. |
| Voted | keep-baseline · **modes** | Post-vote confirmation state. |
| Voting | **disableSnapshot** | Spy: `onVote` called once. `hasVoted` controlled false → button doesn't flip; final = NotVoted. |
| AlreadyVotedIsHeld | **disableSnapshot** | Spy: `hasVoted: true`, tap asserts `onVote` NOT called; final = Voted. |

### widgets/next-event-hero/NextEventHeroView
| Story | Classification | Reason |
|-------|----------------|--------|
| HasNext | keep-baseline · **modes** | Default hero render (countdown, title, location). Hero card is a top dark-mode candidate. |
| HaventReplied | **disableSnapshot** | Same default args as HasNext (myState NOT_RESPONDED) → pixel-identical render; asserts the status-line/buttons only. |
| Going | keep-baseline · **modes** | `myState: ATTENDING` → "I'm in" pressed + "you're in" — distinct attendance state. |
| NotGoing | keep-baseline · **modes** | `myState: ABSENT` → "Can't make it" pressed + "you're out". |
| Maybe | keep-baseline | `myState: MAYBE` → "you said maybe", neither button pressed. |
| RsvpIn | **disableSnapshot** | Spy: `onRespond('ATTENDING')`. Default args, controlled → final = HasNext/HaventReplied render. |
| RsvpOut | **disableSnapshot** | Spy: `onRespond('ABSENT')`. Default args → final = HasNext render. |
| Saving | keep-baseline | Both RSVP buttons disabled (in-flight) — distinct state. |
| WholeCardIsClickable | **disableSnapshot** | Hit-test spy (`elementFromPoint`), no visible change; default args → final = HasNext render. |
| ControlsStayAboveTheOverlay | **disableSnapshot** | Hit-test spy over the buttons/maps link; no visible change; final = HasNext render. |
| StartingToday | keep-baseline | Same-day event drops to "11h" countdown — distinct data. |

> **Biggest single-file harvest:** five stories (HaventReplied, RsvpIn, RsvpOut, WholeCardIsClickable,
> ControlsStayAboveTheOverlay) all run on the *default* args and render pixel-identically to HasNext.
> They are valuable behavioral tests (RSVP wiring, stretched-link hit-testing) but redundant pictures.

### widgets/page-header/PageHeader
| Story | Classification | Reason |
|-------|----------------|--------|
| TitleOnly | keep-baseline | Minimal title-only header. |
| StickyOffsetFollowsHeaderHeight | **disableSnapshot** | Asserts computed `top` follows `--header-height` (80px). The offset is not visible in a static frame; the header itself = TitleOnly. |
| WithBack | keep-baseline | Back link + title. |
| WithBackAndActions | keep-baseline | Back + trailing actions slot — distinct. |
| LongTitle | keep-baseline | Overrunning title truncates on one line — distinct layout stress. |

### widgets/team-header/TeamHeader
| Story | Classification | Reason |
|-------|----------------|--------|
| Admin | keep-baseline | Gear + Invite-link action (admin). |
| Member | keep-baseline | No gear, no invite (member) — distinct. |

---

## Highest-value actions

### disableSnapshot — where it removes the most redundant baselines
Applying `parameters.chromatic.disableSnapshot` here trims 42 redundant pictures while keeping every
behavioral assertion. Ordered by impact:

1. **`widgets/next-event-hero/NextEventHeroView`** (−5) — five default-args stories duplicate HasNext.
   The single biggest win; keep HasNext (plus the distinct myState/Saving/StartingToday variants).
2. **`features/filter-event-types/EventFiltersView`** (−3) — TogglesType/TogglesShowPast duplicate
   Open; ClosesOnEscape duplicates Closed.
3. **`features/manage-members/MemberRosterView`** (−3) — ChangePosition/ToggleRole/RemoveMember all
   settle back to the Default roster (or, for RemoveMember, the already-baselined confirm dialog).
4. **`features/generate-invite/GenerateInviteContent`** (−2) — RotateLink/RevokeLink duplicate
   ActiveLink.
5. **`features/edit-event/EditEventDialogView`** (−2) — the two roster-override contract spies
   duplicate Standalone.
6. **`features/manage-positions/ManagePositionsView`** (−2) — CreatePosition→Empty, DeleteConfirm→WithItems.
7. **`features/manage-creation-codes/ManageCreationCodesView`** (−2) — GenerateCode→Empty, RevokeConfirm→WithItems.
8. **`features/switch-team/TeamSwitcherView`** (−2) — the two menu-pick spies settle to SeveralTeams.
9. **`features/theme-toggle/ThemeToggleView`** (−2), **`features/edit-profile/EditProfileForm`** (−2),
   **`features/onboarding-hub/OnboardingHubView`** (−2), **`widgets/money-teaser/MoneyTeaserView`** (−2) —
   each has two controlled-spy stories that match a sibling.

The remaining 12 removals are single controlled-spy stories (`CreateTeamForm.GenericError` is a literal
duplicate; `BottomNav.TeamSettingsActive` duplicates TeamActive; the rest are one-per-file
callback spies).

### modes-candidates — where a dark snapshot adds the most regression value
Today only `ThemeToggleView.Dark` snapshots in dark (the global is pinned to light). These components
carry the semantic/surface tokens that a light-only baseline leaves unwatched. Recommended dark modes
(11 extra snapshots):

1. **`AttendanceToggle`** — Attending / Maybe / Absent (green / gold / red). The canonical semantic
   attendance colors; highest-value dark coverage in the app.
2. **`NextEventHeroView`** — HasNext / Going / NotGoing. The hero card is the largest themed surface on
   the events page and carries the RSVP-state coloring.
3. **`MoneyTeaserView`** — NotVoted / Voted. The money "coming soon" surface (gradients + pillars).
4. **`EventCard`** — Populated / SocialEvent. Event-type color chits on the repeated list-card surface.
5. **`BottomNav`** — EventsActive. Persistent mobile-nav chrome + active-tab blue.

`ThemeToggleView` already demonstrates the mechanism (`globals: { theme: 'dark' }` + a resolved-token
assertion in `play`); the five components above should follow that exemplar rather than adding
separate hand-wrapped `.dark` stories.
