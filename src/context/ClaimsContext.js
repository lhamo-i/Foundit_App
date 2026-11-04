import React, { createContext, useContext, useState } from 'react';
import { SAMPLE_CLAIMS, SAMPLE_USER } from '../data/sampleClaims';

// Keeps all claims in memory and the functions that change them.
// SAMPLE ONLY: in Stage 4 these changes happen in Firestore through trusted
// Cloud Functions, so the phone cannot cheat (e.g. approve its own claim).
const ClaimsContext = createContext(null);

export function ClaimsProvider({ children }) {
  const [claims, setClaims] = useState(SAMPLE_CLAIMS);

  const getClaim = (id) => claims.find((c) => c.id === id);
  const getMyClaimForItem = (itemId) =>
    claims.find((c) => c.itemId === itemId && c.claimantIsMe);
  const getClaimsForItem = (itemId) => claims.filter((c) => c.itemId === itemId);

  const updateClaim = (id, changes) => {
    setClaims((current) => current.map((c) => (c.id === id ? { ...c, ...changes } : c)));
  };

  const hasOtherApprovedClaim = (itemId, exceptId) =>
    claims.some((c) => c.itemId === itemId && c.status === 'approved' && c.id !== exceptId);

  const addClaim = ({ itemId, answers, evidence }) => {
    const id = `CLM-${String(claims.length + 1).padStart(3, '0')}`;
    const claim = {
      id,
      itemId,
      claimantName: SAMPLE_USER.name,
      claimantId: SAMPLE_USER.id,
      claimantIsMe: true,
      answers,
      evidence,
      status: 'pending',
      rejectionReason: '',
      proofRequested: false,
      appealText: '',
      staffNote: '',
      finalDecision: false,
      submittedLabel: 'Just now',
    };
    setClaims((current) => [claim, ...current]);
    return id;
  };

  // Uploader approves. Only ONE claim per item can ever be approved.
  const approveClaim = (id) => {
    const claim = getClaim(id);
    if (!claim) return { ok: false, message: 'Claim not found.' };
    if (hasOtherApprovedClaim(claim.itemId, id)) {
      return { ok: false, message: 'Another claim for this item is already approved.' };
    }
    updateClaim(id, { status: 'approved', proofRequested: false });
    return { ok: true };
  };

  const rejectClaim = (id, reason) => {
    updateClaim(id, { status: 'rejected', rejectionReason: reason, proofRequested: false });
  };

  const requestProof = (id) => updateClaim(id, { proofRequested: true });

  // Claimant adds more photos after the uploader asked for proof.
  const addProof = (id, uris) => {
    const claim = getClaim(id);
    if (!claim) return;
    updateClaim(id, { evidence: [...claim.evidence, ...uris], proofRequested: false });
  };

  // Claimant asks for another review of a rejected claim.
  const requestReview = (id, text, uris) => {
    const claim = getClaim(id);
    if (!claim) return;
    updateClaim(id, {
      status: 'disputed',
      appealText: text,
      evidence: [...claim.evidence, ...uris],
    });
  };

  // Campus staff records the final decision on a disputed claim.
  const decideDispute = (id, decision, note) => {
    const claim = getClaim(id);
    if (!claim) return { ok: false, message: 'Claim not found.' };
    if (decision === 'approve') {
      if (hasOtherApprovedClaim(claim.itemId, id)) {
        return { ok: false, message: 'Another claim for this item is already approved.' };
      }
      updateClaim(id, { status: 'approved', staffNote: note, finalDecision: true });
    } else {
      updateClaim(id, { status: 'rejected', staffNote: note, finalDecision: true });
    }
    return { ok: true };
  };

  return (
    <ClaimsContext.Provider
      value={{
        claims,
        getClaim,
        getMyClaimForItem,
        getClaimsForItem,
        addClaim,
        approveClaim,
        rejectClaim,
        requestProof,
        addProof,
        requestReview,
        decideDispute,
      }}
    >
      {children}
    </ClaimsContext.Provider>
  );
}

export function useClaims() {
  return useContext(ClaimsContext);
}
