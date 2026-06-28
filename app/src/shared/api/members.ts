const DEMO_MEMBERS = [
  { userId: 'b0000000-0000-0000-0000-000000000001', displayName: 'Jan de Vries' },
  { userId: 'b0000000-0000-0000-0000-000000000002', displayName: 'Lisa Bakker' },
  { userId: 'b0000000-0000-0000-0000-000000000003', displayName: 'Tom Visser' },
  { userId: 'b0000000-0000-0000-0000-000000000004', displayName: 'Emma Jansen' },
  { userId: 'b0000000-0000-0000-0000-000000000005', displayName: 'Daan Mulder' },
  { userId: 'b0000000-0000-0000-0000-000000000006', displayName: 'Sophie van Dijk' },
]

export function useMembers() {
  return { data: DEMO_MEMBERS, isLoading: false }
}
