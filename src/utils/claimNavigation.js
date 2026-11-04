// Opens the right screen for a claim, depending on its status.
export function openClaim(navigation, claim) {
  if (claim.status === 'rejected') {
    navigation.navigate('ClaimRejected', { claimId: claim.id });
  } else if (claim.status === 'disputed') {
    navigation.navigate('DisputeStatus', { claimId: claim.id });
  } else {
    navigation.navigate('ClaimSubmitted', { claimId: claim.id });
  }
}
