export const stateToLabel = (state) => {
  switch (state) {
    case 0: return "Open"
    case 1: return "Closed"
    case 2: return "Resolved"
    case 3: return "Finished"
    default: return null
  }
}
