// A claimer whose claim was rejected goes to the "Claim Rejected" screen.
// Everyone else goes to "Claim Details".
export function openClaim(navigation, claim, userId) {
  if (claim.status === 'rejected' && claim.claimerId === userId) {
    navigation.navigate('ClaimRejected', { claimId: claim.id });
  } else {
    navigation.navigate('ClaimDetails', { claimId: claim.id });
  }
}
