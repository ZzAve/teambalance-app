
   ---
   1. Header / Top Bar

   Prototype (design intent)

   - Fixed top bar, 60px tall, with a frosted-glass gradient background (rgba(254,253,251,0.97) → rgba(248,246,240,0.95)) and backdrop-filter: blur(14px).
   - Wordmark: Grandstander font at 21px. "Team" is regular weight (400) in --text-primary (#1E2A3A); "Balance" is bold (700) in --accent-green (#249E6C). letter-spacing:
   -0.01em. No link — just a display element.
   - Right side: A static team indicator pill — "Heren 3" with a 7px green dot, pill-shaped (border-radius: 24px), background: rgba(34,92,156,0.08) (primary-bg), primary
   blue text. It's an identity indicator, not interactive.
   - No bottom border shadow; border is 1px solid rgba(30,42,58,0.07).

   React implementation (current state)

   - Not fixed — part of normal document flow.
   - No backdrop blur, no gradient; background is flat bg-card (#FEFDFB), with border-b border-border/40.
   - Wordmark: font-display text-xl font-bold text-blue — both words bold, only "Balance" is green. The font is correct (Grandstander), but "Team" should be weight 400 (not
    bold), and size is text-xl (~20px) vs 21px.
   - Right side: A <UserSelector /> — a <Select> dropdown letting you choose which team member you are acting as. This is a dev-only identity simulation, not the final
   "which team am I on" indicator.

   Gap

   - Top bar is not position: fixed; no frosted-glass effect.
   - Wordmark weight split is wrong ("Team" should be normal/400, not bold).
   - The right-side element is entirely wrong concept: the prototype shows a static team name chip; the implementation shows a user impersonation dropdown. The UserSelector
    is scaffolding for development, not the real design.
   - Missing: backdrop-filter, gradient background, proper shadow (0 -1px 16px equivalent is on bottom bar in prototype, but top bar border is subtle).

   ---
   2. Navigation — Bottom Tab Bar

   Prototype

   - Fixed bottom bar, 72px tall, with backdrop-filter: blur(20px) saturate(1.4), frosted semi-transparent background (rgba(254,253,251,0.88)), subtle upward shadow.
   - Three tabs: Events (calendar icon), Money Pool (card icon), Team (people icon).
   - Each tab has: icon (22×22px) + label (11px, 500 weight) + an animated pill background that scales in (scaleX) on active.
   - Active state: primary blue color, icon scales up 1.1× with a subtle drop-shadow glow, pill slides in with spring animation.
   - Notification badge (8px gold dot) on Events tab.
   - padding-bottom: env(safe-area-inset-bottom, 0) for iPhone notch support.

   React implementation

   - No bottom navigation at all. The root layout has a top header + <main> content area only.
   - Navigation is URL-based (TanStack Router), with a "← Back" button for the detail view.

   Gap

   - The entire bottom tab bar is missing. This is the most significant structural gap — the prototype's core navigation paradigm (tab bar switching between Events / Money
   Pool / Team) doesn't exist yet.
   - No Money Pool or Team screens/routes exist.
   - No safe-area-inset handling.

   ---
   3. Overall Layout / Screen System

   Prototype

   - Fixed, layered layout: top bar fixed at top, bottom bar fixed at bottom, a screen-container fills the space between (position fixed, top: 60px, bottom: 72px, overflow:
    hidden).
   - Two screens (#screen-list, #screen-detail) are positioned absolutely within the container and animate between each other: list pushes left (translateX(-30%), opacity:
   0.4) while detail slides in from the right (translateX(100%) → translateX(0)). Duration 0.4s with cubic-bezier(0.4, 0, 0.2, 1).
   - A separate --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1) is used for interactive elements (buttons, pills, tab icons).
   - max-width: 640px centered, desktop expands to 720px.
   - Screen padding: 24px 20px 32px (mobile), 32px 40px 48px (desktop ≥768px).

   React implementation

   - Standard scrollable page layout: min-h-screen, top header, <main> with max-w-2xl px-4 py-6.
   - Page transitions: none. Navigation between list and detail is a full page replace (TanStack Router route change).
   - No fixed scroll boundary; page scrolls naturally.
   - max-w-2xl ≈ 672px — close but not using the exact token from the prototype.

   Gap

   - No push/slide screen transition animation between list and detail.
   - No layered fixed-height viewport with overflow-hidden container.
   - py-6 (24px) padding matches prototype's 24px top padding, px-4 (16px) is slightly less than prototype's 20px.
   - prefers-reduced-motion media query is not implemented in the React app.

   ---
   4. Event List Page

   Prototype

   - Tab header: Grandstander h1 at 30px (weight 500), with a subtitle paragraph in secondary color: "3 events need your response". letter-spacing: -0.01em.
   - Filter bar:
     - A time toggle (pill segmented control): "Upcoming" | "Past" — background rgba(30,42,58,0.05), active button gets white card background + shadow, spring animation on
   switch.
     - Type filter pills: Training (clock icon), Match (layers icon), Misc (dots icon) — each pill has an icon + label, colored when active (blue/green/gold per type),
   border-colored to match. All active by default.
   - Section headings: 12px, 600 weight, uppercase, letter-spacing: 1.5px, tertiary color. Labels: "This Week", "Next Week", "Later", or month names for past events.
   - Cards grouped under section headings with margin-top: 24px for each new section.

   React implementation

   - Page header: <h2 className="text-2xl font-bold">Events</h2> — DM Sans (body font), not Grandstander. No subtitle.
   - Filter: A plain <input type="checkbox"> + "Show past" label. No segmented pill control.
   - No type filtering at all.
   - No section headings — all events rendered in one flat list.
   - A <CreateEventDialog /> button ("New Event") next to the title — the prototype doesn't show a create button in the list header (it would logically be an admin action,
   possibly in a FAB or admin section).

   Gap

   - Page title uses wrong font (body instead of display/Grandstander) and has no subtitle.
   - Checkbox-based filter vs. polished segmented pill control.
   - No type filter pills (Training/Match/Misc) at all.
   - No section grouping (This Week / Next Week / Later).
   - "New Event" button placement differs from prototype (prototype has no visible create button on the list screen).

   ---
   5. Event Cards

   Prototype card structure

   [icon 42×42px] [type badge] [title]
                  [meta: date · time · pin location-link]
   ─────────────────────────────────────────────────────
   [my-status chip]                  [X/Y going · N not responded]

   - Icon: 42×42px rounded square (border-radius: 12px) with type-colored background and SVG icon (clock for training, layers for match, dots for misc). Color-coded per
   type (blue/green/gold).
   - Type badge: Uppercase text, 11px, weight 600, letter-spacing: 0.04em, tiny inline block with colored background (primary-bg/green-bg/gold-bg). e.g. "TRAINING" in blue.
   - Title: Grandstander font, 17px, weight 500, letter-spacing: -0.01em, truncated with ellipsis.
   - Meta row: Inline with calendar SVG icon + date + dot separator + pin SVG icon + location as a clickable <a> link to Google Maps (tap-through without opening detail).
   Icons are 13×13px.
   - Bottom section (separated by a top border):
     - Left: "my status chip" — color-coded pill ("You're going" / "Maybe" / "Not going" / "Not set") with a small dot indicator.
     - Right: "X/Y going · N not responded" in tertiary text, right-aligned.
   - Hover: translateY(-1px) + shadow-md.
   - Active (tap): scale(0.985) + shadow-sm, 80ms transition.
   - Entry animation: cardSlideIn keyframe (opacity: 0; translateY(14px) → opacity: 1; translateY(0)) over 0.4s, staggered by 50ms per card (:nth-child(1) through
   :nth-child(6)).
   - Card border-radius: 16px, padding 16px 18px.

   React implementation

   - Icon: A 3×3px (h-3 w-3) colored dot — just a circle, no icon, no background square.
   - Type badge: Plain <span> with text-sm text-muted-foreground — no uppercase, no color-coded background, just gray text.
   - Title: CardTitle with text-lg — DM Sans (body font), not Grandstander. No truncation.
   - Meta: Plain text paragraph, no inline SVG icons, no location link (just plain text for location).
   - Bottom section: Raw numbers in colored text (text-green, text-gold, text-red-500, text-muted-foreground) — no chip/pill, no border separator, no contextual label
   ("You're going").
   - Hover: hover:shadow-md only — no translateY.
   - Active tap: No style.
   - Entry animation: None.
   - Card uses Shadcn <Card> with default rounded-lg (10px) and default padding.

   Gap — this area has the largest number of gaps:

   - Large icon block with colored background → tiny dot
   - Type badge with uppercase/colored background → plain gray text
   - Title in Grandstander → body font
   - Meta row with inline SVG icons and map link → plain text
   - "My status" chip (personalized, colored) → missing entirely
   - Attendee summary format differs (prototype: "7/12 going · 1 not responded"; React: bare numbers)
   - No bottom border separator in the card
   - No translateY hover effect, no scale active effect
   - No staggered card entry animation
   - border-radius: 16px vs 10px

   ---
   6. Event Detail Page

   Prototype

   - Back button: Pill-shaped button (border-radius: 24px), background rgba(30,42,58,0.05), chevron-left SVG (18×18px), "Back" label, 14px weight 500. Hover darkens; active
    scales to 0.96.
   - Detail header:
     - Type badge (same as card badges, but larger spacing).
     - Title in Grandstander 28px weight 500 (detail-title).
     - Info rows (stacked, with gap: 6px): each row has a 16×16px tertiary SVG icon + text. Two rows: (1) calendar icon + "Day, Date · start time - end time", (2) pin icon
   + location as <a> map link.
     - Audience indicator: "👥 Entire team" or "👥 N members invited".
   - Attendance action section (labeled "YOUR RESPONSE" in 12px uppercase):
     - Three large equal-width buttons side by side: "✓ Going" (green), "~ Maybe" (gold), "✗ Not going" (red).
     - Each has a border-only default state and fills with color + colored box-shadow when selected.
     - On selection: btnBounce animation (scale 0.92 → 1.06 → 1.0, 0.4s spring).
     - Active tap: scale(0.95).
   - Attendees section (card with tabs):
     - Four tabs: "Going" / "Maybe" / "Absent" / "?" (no response).
     - Each tab has a count badge (colored background pill) and a colored underline when active (green/gold/red/gray). Tab underline animates width (left: 20% right: 20% →
   left: 10% right: 10%).
     - Panel content: role-grouped attendee rows. Each group has a role label ("SETTER", "MID-BLOCKER" etc.), then attendee rows with a 36px avatar circle (colored
   initials), name (bold 14px), role sub-label (12px secondary). Each row has a ghost edit button (pencil icon, opacity 0.45) that opens a status dropdown with all 4
   states.
     - Panel change animation: fadeIn (opacity + translateY 6px).
   - Description section (if present): card with "NOTES" uppercase heading + body text.
   - Admin actions: "Edit Event" and "Delete Event" buttons at bottom, inline with icons. Delete is red-tinted.

   React implementation

   - Back button: <Button variant="ghost" size="sm">&larr; Back</Button> — text HTML entity arrow, ghost Shadcn button variant, no custom pill styling.
   - Detail header: 3px color dot + type name in gray text + <h1 text-2xl font-bold> (body font, not Grandstander) + single text string for date/time (no icon) + plain text
    location (no map link) + description inline below.
   - Attendance actions: Not on the detail page at all. The <AttendanceToggle> is embedded inline per-attendee in the attendance list (each row has its own Yes/Maybe/No
   button row).
   - Attendees section: Flat list of <Card> rows — no tabs, no role grouping, no avatar circles, no initials, no status chip. Each row is: name (bold if current user) +
   <AttendanceToggle> buttons inline.
   - AttendanceToggle: Three small Shadcn buttons (size="sm") labeled "Yes" / "Maybe" / "No" — solid colored when selected, outline otherwise. No icons. No bounce
   animation.
   - Description section: Inline paragraph below the title (mt-2).
   - Admin actions: None implemented.

   Gap — almost everything in the detail view is different:

   - Back button styling (ghost button vs. pill).
   - Title font (body vs. Grandstander 28px).
   - Info rows lack icons; location not linked.
   - "Your response" section with 3 large buttons → per-row mini toggle (wrong information architecture).
   - No tabbed attendees section; no role grouping; no avatar circles; no edit affordance.
   - No description card wrapper.
   - No admin actions.
   - The "your response" pattern in the prototype is user-first (one prominent action at top), whereas the React version scatters the toggle on every attendee row.

   ---
   7. Visual Design System

   Color Palette

   ┌─────────────────┬─────────────────────┬──────────────────────────────────┬────────────────────────────────────────────────────────────────────────┐
   │      Token      │      Prototype      │        React (global.css)        │                                 Match?                                 │
   ├─────────────────┼─────────────────────┼──────────────────────────────────┼────────────────────────────────────────────────────────────────────────┤
   │ Background      │ #F8F6F0             │ #F8F6F0                          │ Yes                                                                    │
   ├─────────────────┼─────────────────────┼──────────────────────────────────┼────────────────────────────────────────────────────────────────────────┤
   │ Card background │ #FEFDFB             │ #FEFDFB                          │ Yes                                                                    │
   ├─────────────────┼─────────────────────┼──────────────────────────────────┼────────────────────────────────────────────────────────────────────────┤
   │ Blue/primary    │ #225C9C             │ #225C9C                          │ Yes                                                                    │
   ├─────────────────┼─────────────────────┼──────────────────────────────────┼────────────────────────────────────────────────────────────────────────┤
   │ Green           │ #249E6C             │ #249E6C                          │ Yes                                                                    │
   ├─────────────────┼─────────────────────┼──────────────────────────────────┼────────────────────────────────────────────────────────────────────────┤
   │ Gold            │ #F4B400             │ #F4B400                          │ Yes                                                                    │
   ├─────────────────┼─────────────────────┼──────────────────────────────────┼────────────────────────────────────────────────────────────────────────┤
   │ Red             │ #E05252 (warm-red)  │ hsl(0 84.2% 60.2%) ≈ #F04545     │ Close but not exact                                                    │
   ├─────────────────┼─────────────────────┼──────────────────────────────────┼────────────────────────────────────────────────────────────────────────┤
   │ Text primary    │ #1E2A3A             │ hsl(222.2 84% 4.9%) ≈ #070D1A    │ Off — prototype is mid-dark, CSS is near-black                         │
   ├─────────────────┼─────────────────────┼──────────────────────────────────┼────────────────────────────────────────────────────────────────────────┤
   │ Text secondary  │ #5A6B7F             │ hsl(215.4 16.3% 46.9%) ≈ #697A8F │ Close                                                                  │
   ├─────────────────┼─────────────────────┼──────────────────────────────────┼────────────────────────────────────────────────────────────────────────┤
   │ Border          │ rgba(30,42,58,0.07) │ hsl(214.3 31.8% 91.4%) = #E2E8F0 │ Different: prototype uses near-transparent dark, CSS uses a light gray │
   └─────────────────┴─────────────────────┴──────────────────────────────────┴────────────────────────────────────────────────────────────────────────┘

   The background and brand colors match. The semantic colors for text and border differ from the prototype's warm-toned system. The prototype uses dark-with-low-opacity
   borders (feels warm and light); the React CSS uses standard Tailwind slate-toned borders (slightly cooler).

   Shadows

   - Prototype: warm-brown-tinted shadows (rgba(62, 45, 30, ...)) at sm/md/lg/nav scales.
   - React: uses Shadcn/Tailwind default shadows (no warm tint). hover:shadow-md only.

   Border Radius

   - Prototype: 8px (sm), 12px (md), 16px (lg), 24px (pill) — deliberate scale.
   - React: --radius: 0.625rem (10px) as the base; Shadcn cards use this uniformly. Missing the deliberate scale (no 16px card radius, no 24px pill shapes).

   Typography

   - Prototype: Grandstander for display (wordmark, page h1, event titles, detail title); DM Sans for all other text; headings via h1-h4 use DM Sans body font (600 weight),
    NOT Grandstander.
   - React: font-display (Grandstander) is defined in global.css, and the wordmark Link uses font-display. But EventCard titles, EventDetail h1, and the Events page h2 all
   use DM Sans (default body), missing the Grandstander treatment the prototype applies to event titles.
   - The prototype uses letter-spacing: -0.01em on display text and letter-spacing: 0.01em on body text for refinement.

   Transitions / Animations

   - Prototype: Two easing curves defined (--ease-spring for interactive elements, --ease-smooth for page transitions); prefers-reduced-motion kills all animations.
   - React: No custom easing curves defined. transition-shadow on cards only. No spring easing anywhere.

   ---
   8. Summary of Gaps by Priority

   Critical (core information architecture)
   1. Bottom tab bar entirely missing (Events / Money Pool / Team navigation).
   2. Top bar is not fixed; no frosted glass effect.
   3. "Your response" action on detail page uses wrong pattern (per-row toggle vs. single prominent 3-button section).
   4. Attendees section has no tabs (Going/Maybe/Absent/?), no role grouping, no avatars.

   Major (visual fidelity)
   5. Event card icon: 3px dot vs. 42×42px colored icon block.
   6. Event card title: body font vs. Grandstander 17px.
   7. Event card bottom: bare numbers vs. my-status chip + attendance summary.
   8. No section headings (This Week / Next Week) in the event list.
   9. Event list filter: checkbox vs. segmented pill + type filter pills.
   10. Page h1 ("Events") uses body font and has no subtitle.
   11. Detail title uses body font vs. Grandstander 28px.
   12. Location is not a map link anywhere.
   13. Admin actions (Edit/Delete) entirely absent from detail page.

   Moderate (polish)
   14. No screen push/slide transition between list and detail.
   15. No staggered card entry animation.
   16. No hover translateY or active scale on cards.
   17. No btnBounce animation on attendance selection.
   18. Back button lacks pill shape and custom styling.
   19. Border radius on cards (10px vs 16px).
   20. Border color system differs (warm transparent vs. cool slate).
   21. Text primary color differs slightly (near-black vs. #1E2A3A).
   22. No prefers-reduced-motion handling.
   23. Shadows lack warm brown tint.

   Minor
   24. Wordmark "Team" should be weight 400, not bold.
   25. px-4 (16px) screen padding vs 20px in prototype.
   26. No audience indicator ("Entire team" / "N members invited") on detail.
   27. No description card wrapper (currently inline paragraph).
