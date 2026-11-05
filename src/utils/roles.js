// Who is who in a claim.
//  - "poster"    = the person who made the post
//  - "responder" = the person who claimed it ("This is mine") or replied ("I found this")
//  - "finder"    = whoever physically has the item
//  - "owner"     = whoever lost it (gets it back)
export function getRoles(item, claim) {
  const posterId = item.ownerId;
  const responderId = claim.claimerId;
  return {
    posterId,
    responderId,
    finderId: item.type === 'found' ? posterId : responderId,
    ownerId: item.type === 'found' ? responderId : posterId,
  };
}

// For Found posts the finder chose the handover when posting.
// For Lost posts the finder chooses it when submitting their "I found this" reply.
export function getHandover(item, claim) {
  if (item.type === 'found') return item.handover;
  return claim ? claim.handover : null;
}
