interface OnboardingHubViewProps {
  onChooseJoin: () => void
  onChooseCreate: () => void
}

/**
 * Presentational onboarding fork for a signed-in, teamless user — replaces the old hard redirect
 * onto the create-team form. Deliberately not personalized (displayName is an email-derived
 * placeholder for new users). The route container owns navigation to /onboarding/join and
 * /create-team.
 */
export function OnboardingHubView({ onChooseJoin, onChooseCreate }: OnboardingHubViewProps) {
  return (
    <div className="mx-auto mt-10 max-w-sm text-center">
      <h1 className="font-display text-2xl font-bold">Welcome to TeamBalance 👋</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        You're signed in, but not on a team yet. How would you like to get started?
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <button
          type="button"
          onClick={onChooseJoin}
          className="rounded-lg border border-border bg-blue/5 p-4 text-left transition-colors hover:border-blue"
        >
          <span className="block font-display text-lg font-bold">I have an invite</span>
          <span className="mt-1 block text-sm text-muted-foreground">Someone shared a join link with you</span>
        </button>

        <button
          type="button"
          onClick={onChooseCreate}
          className="rounded-lg border border-border p-4 text-left transition-colors hover:border-blue"
        >
          <span className="block font-semibold">Create a team</span>
          <span className="mt-1 block text-sm text-muted-foreground">
            You'll need a creation code — team owners get these from us
          </span>
        </button>
      </div>
    </div>
  )
}
