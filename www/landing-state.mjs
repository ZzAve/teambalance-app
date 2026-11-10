// Pure state for the landing page demo: tallies per event, the visitor's answers, and whether the chat is quiet.
// No DOM here; landing.js wires it to the page.
export const initialState = () => ({
  counts: {
    training: { going: 8, maybe: 2, cant: 1, none: 3 },
    match: { going: 5, maybe: 3, cant: 2, none: 4 },
  },
  answers: { training: null, match: null },
  last: null,
  quiet: false,
})

export const answer = (state, ev, a) => {
  const previous = state.answers[ev]
  if (previous === a) return state
  const counts = { ...state.counts[ev] }
  counts[previous ?? 'none']--
  counts[a]++
  return {
    counts: { ...state.counts, [ev]: counts },
    answers: { ...state.answers, [ev]: a },
    last: { ev, a },
    quiet: true,
  }
}

export const showOldWay = (state) => ({ ...state, quiet: false })

// copy: { idle, oldBack, '<event>_<answer>': sentence }
export const statusText = (state, copy) => {
  if (!state.last) return copy.idle
  if (!state.quiet) return copy.oldBack
  return copy[`${state.last.ev}_${state.last.a}`]
}
