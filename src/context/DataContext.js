// All posts, claims, chats and notifications, plus the actions that change them.
// Right now the data lives in memory (it resets when you reload the app).
// In Stage 3 each action below becomes Firestore reads/writes (addDoc, updateDoc, onSnapshot)
// and the screens stay the same.
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { SEED_ITEMS, SEED_CLAIMS, SEED_CHATS, SEED_NOTIFICATIONS, SEED_SAVED } from '../data/seed';
import { POINTS_PER_RETURN, REMINDER_AFTER_HOURS } from '../data/constants';
import { findMatches } from '../utils/matchEngine';
import { getRoles } from '../utils/roles';
import { uid } from '../utils/format';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);
export const useData = () => useContext(DataContext);

export function DataProvider({ children }) {
  const { user, awardPoints } = useAuth();

  const [items, setItems] = useState(SEED_ITEMS);
  const [claims, setClaims] = useState(SEED_CLAIMS);
  const [chats, setChats] = useState(SEED_CHATS);
  const [notifications, setNotifications] = useState(SEED_NOTIFICATIONS);
  const [savedMap, setSavedMap] = useState(SEED_SAVED);
  const [claimCounter, setClaimCounter] = useState(SEED_CLAIMS.length);

  // ---------- notifications ----------
  // Adds an in-app notification for one user. (Push + email come in Stage 3.)
  const notify = (userId, data) => {
    setNotifications((prev) => [
      { id: uid('n'), userId, read: false, createdAt: Date.now(), ...data },
      ...prev,
    ]);
  };

  // 48-hour reminder: if only one side confirmed the handover and 48 hours passed,
  // remind the other side. Runs once when the app opens.
  const reminderRan = useRef(false);
  useEffect(() => {
    if (reminderRan.current) return;
    reminderRan.current = true;
    const now = Date.now();
    const limit = REMINDER_AFTER_HOURS * 60 * 60 * 1000;
    const due = SEED_ITEMS.filter(
      (i) =>
        i.stage !== 'resolved' && !i.reminderSent && i.firstConfirmAt &&
        i.finderConfirmed !== i.receiverConfirmed && now - i.firstConfirmAt >= limit
    );
    if (due.length === 0) return;
    due.forEach((item) => {
      const claim = SEED_CLAIMS.find((c) => c.id === item.approvedClaimId);
      if (!claim) return;
      const { finderId, ownerId } = getRoles(item, claim);
      const waitingId = item.finderConfirmed ? ownerId : finderId;
      notify(waitingId, {
        type: 'reminder',
        title: 'Please confirm the handover',
        body: item.finderConfirmed
          ? `Did you receive "${item.title}"? Tap "I received it" to finish.`
          : `Did you hand over "${item.title}"? Tap "Item handed over" to finish.`,
        itemId: item.id,
        claimId: claim.id,
      });
    });
    setItems((prev) => prev.map((i) => (due.some((d) => d.id === i.id) ? { ...i, reminderSent: true } : i)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const myNotifications = user ? notifications.filter((n) => n.userId === user.id) : [];
  const unreadCount = myNotifications.filter((n) => !n.read).length;
  const markRead = (id) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => (n.userId === user.id ? { ...n, read: true } : n)));

  // ---------- saved items ----------
  const savedIds = user ? savedMap[user.id] || [] : [];
  const isSaved = (itemId) => savedIds.includes(itemId);
  const toggleSave = (itemId) => {
    setSavedMap((prev) => {
      const current = prev[user.id] || [];
      const next = current.includes(itemId) ? current.filter((x) => x !== itemId) : [...current, itemId];
      return { ...prev, [user.id]: next };
    });
  };

  // ---------- posts ----------
  const getMatches = (item) => findMatches(item, items);

  // data = { type, title, description, category, location, date, imageUri, icon,
  //          questions, contactMethod, contactValue, handover }
  const createItem = (data) => {
    const item = {
      id: uid('i'),
      ownerId: user.id,
      createdAt: Date.now(),
      stage: 'posted',
      approvedClaimId: null,
      finderConfirmed: false,
      receiverConfirmed: false,
      ...data,
    };
    const matches = findMatches(item, items);
    setItems((prev) => [item, ...prev]);

    // A new Found post alerts the owners of matching Lost posts.
    if (item.type === 'found') {
      matches.forEach((m) =>
        notify(m.item.ownerId, {
          type: 'match',
          title: 'Possible match found!',
          body: `A found item "${item.title}" may match your lost "${m.item.title}".`,
          itemId: item.id,
        })
      );
    }
    return { item, matchCount: matches.length };
  };

  // Poster closes a post themselves (e.g. found their own item). No points.
  const closePost = (itemId) => {
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, stage: 'resolved', resolvedAt: Date.now() } : i)));
    claims
      .filter((c) => c.itemId === itemId && c.status === 'pending')
      .forEach((c) =>
        notify(c.claimerId, {
          type: 'claim_result',
          title: 'Post closed',
          body: 'The poster closed this post, so your claim was not reviewed.',
          itemId,
          claimId: c.id,
        })
      );
    setClaims((prev) =>
      prev.map((c) =>
        c.itemId === itemId && c.status === 'pending'
          ? { ...c, status: 'rejected', rejectReason: 'The poster closed this post.', resolvedAt: Date.now() }
          : c
      )
    );
  };

  // ---------- claims ----------
  // data = { itemId, answers: [{q, a}], handover (only for "I found this" on a Lost post) }
  const submitClaim = ({ itemId, answers, handover }) => {
    const item = items.find((i) => i.id === itemId);
    const n = claimCounter + 1;
    setClaimCounter(n);
    const claim = {
      id: uid('c'),
      code: `CLM-${String(n).padStart(3, '0')}`,
      itemId,
      claimerId: user.id,
      answers,
      proofUri: null,
      handover: handover || null,
      status: 'pending',
      rejectReason: null,
      proofRequested: false,
      review: null,
      createdAt: Date.now(),
    };
    setClaims((prev) => [claim, ...prev]);
    setItems((prev) =>
      prev.map((i) => (i.id === itemId && i.stage === 'posted' ? { ...i, stage: 'claim_requested' } : i))
    );
    const isFound = item.type === 'found';
    notify(item.ownerId, {
      type: 'claim',
      title: isFound ? 'Claim requested' : 'Someone says they found your item',
      body: `${user.name} ${isFound ? 'wants to claim' : 'replied about'} "${item.title}". Review their answers.`,
      itemId,
      claimId: claim.id,
    });
    notify(user.id, {
      type: 'claim_status',
      title: `Your claim for ${item.title} is under review`,
      body: "You'll be notified once the poster responds.",
      itemId,
      claimId: claim.id,
    });
    return claim;
  };

  const approveClaim = (claimId) => {
    const claim = claims.find((c) => c.id === claimId);
    const item = items.find((i) => i.id === claim.itemId);
    const others = claims.filter((c) => c.itemId === item.id && c.id !== claimId && c.status === 'pending');

    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId) return { ...c, status: 'approved', resolvedAt: Date.now() };
        if (c.itemId === item.id && c.status === 'pending') {
          return { ...c, status: 'rejected', rejectReason: 'Another claim was approved for this item.', resolvedAt: Date.now() };
        }
        return c;
      })
    );
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, stage: 'claim_approved', approvedClaimId: claimId } : i))
    );
    notify(claim.claimerId, {
      type: 'claim_result',
      title: 'Claim approved!',
      body: `Your claim for "${item.title}" was approved. Arrange the handover.`,
      itemId: item.id,
      claimId,
    });
    others.forEach((c) =>
      notify(c.claimerId, {
        type: 'claim_result',
        title: 'Claim not approved',
        body: `Another claim was approved for "${item.title}".`,
        itemId: item.id,
        claimId: c.id,
      })
    );
  };

  const rejectClaim = (claimId, reason) => {
    const claim = claims.find((c) => c.id === claimId);
    const item = items.find((i) => i.id === claim.itemId);
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? { ...c, status: 'rejected', rejectReason: reason || 'Answers did not match.', resolvedAt: Date.now() }
          : c
      )
    );
    const stillPending = claims.some((c) => c.itemId === item.id && c.id !== claimId && c.status === 'pending');
    if (!stillPending) {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id && i.stage === 'claim_requested' ? { ...i, stage: 'posted' } : i))
      );
    }
    notify(claim.claimerId, {
      type: 'claim_result',
      title: 'Claim rejected',
      body: `Your claim for "${item.title}" was rejected.`,
      itemId: item.id,
      claimId,
    });
  };

  // Poster asks the claimer for a photo / receipt
  const requestMoreProof = (claimId) => {
    const claim = claims.find((c) => c.id === claimId);
    const item = items.find((i) => i.id === claim.itemId);
    setClaims((prev) => prev.map((c) => (c.id === claimId ? { ...c, proofRequested: true } : c)));
    notify(claim.claimerId, {
      type: 'proof',
      title: `Request for more proof on ${item.title}`,
      body: 'The poster asked for a photo, receipt or other proof.',
      itemId: item.id,
      claimId,
    });
  };

  // Claimer uploads extra proof
  const addProof = (claimId, proofUri) => {
    const claim = claims.find((c) => c.id === claimId);
    const item = items.find((i) => i.id === claim.itemId);
    setClaims((prev) => prev.map((c) => (c.id === claimId ? { ...c, proofUri, proofRequested: false } : c)));
    notify(item.ownerId, {
      type: 'claim',
      title: 'Extra proof added',
      body: `${user.name} added more proof for "${item.title}".`,
      itemId: item.id,
      claimId,
    });
  };

  // Rejected claimer asks the campus team to look again
  const requestReview = (claimId, { message, evidenceUri }) => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? { ...c, review: { message, evidenceUri: evidenceUri || null, status: 'under_review', createdAt: Date.now() } }
          : c
      )
    );
  };

  // ---------- handover and status tracking ----------
  // role: 'finder' (taps "Item handed over") or 'receiver' (taps "I received it").
  // The post becomes Resolved only when both have confirmed.
  const confirmHandover = (itemId, role) => {
    const item = items.find((i) => i.id === itemId);
    const claim = item && claims.find((c) => c.id === item.approvedClaimId);
    if (!item || !claim) return;
    const { finderId, ownerId } = getRoles(item, claim);

    const finderConfirmed = role === 'finder' ? true : item.finderConfirmed;
    const receiverConfirmed = role === 'receiver' ? true : item.receiverConfirmed;
    const stage =
      finderConfirmed && receiverConfirmed ? 'resolved' : finderConfirmed ? 'handed_over' : 'claim_approved';

    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              finderConfirmed,
              receiverConfirmed,
              stage,
              firstConfirmAt: i.firstConfirmAt || Date.now(),
              resolvedAt: stage === 'resolved' ? Date.now() : i.resolvedAt,
            }
          : i
      )
    );

    if (stage === 'resolved') {
      awardPoints(finderId, POINTS_PER_RETURN);
      notify(finderId, {
        type: 'resolved',
        title: 'Item returned: points earned!',
        body: `"${item.title}" is resolved. You earned ${POINTS_PER_RETURN} points.`,
        itemId,
        claimId: claim.id,
      });
      notify(ownerId, {
        type: 'resolved',
        title: 'Post resolved',
        body: `"${item.title}" is marked as returned.`,
        itemId,
        claimId: claim.id,
      });
    } else if (role === 'finder') {
      notify(ownerId, {
        type: 'handover',
        title: 'Item handed over',
        body: `The finder marked "${item.title}" as handed over. Tap "I received it" to confirm.`,
        itemId,
        claimId: claim.id,
      });
    } else {
      notify(finderId, {
        type: 'handover',
        title: 'Owner confirmed receipt',
        body: `The owner says they received "${item.title}". Tap "Item handed over" to finish.`,
        itemId,
        claimId: claim.id,
      });
    }
  };

  // ---------- chat ----------
  // Finds the existing thread between two people about an item, or creates one.
  const openChat = ({ itemId, otherUserId, claimId }) => {
    const existing = chats.find(
      (c) => c.itemId === itemId && c.participantIds.includes(user.id) && c.participantIds.includes(otherUserId)
    );
    if (existing) return existing.id;
    const chat = { id: uid('chat'), itemId, claimId: claimId || null, participantIds: [user.id, otherUserId], messages: [] };
    setChats((prev) => [chat, ...prev]);
    return chat.id;
  };

  const sendMessage = (chatId, text) => {
    const clean = text.trim();
    if (!clean) return;
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return;
    const msg = { id: uid('m'), senderId: user.id, text: clean, createdAt: Date.now() };
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, messages: [...c.messages, msg] } : c)));

    // One unread "new message" notification per chat (updated, not repeated)
    const otherId = chat.participantIds.find((id) => id !== user.id);
    setNotifications((prev) => {
      const idx = prev.findIndex((n) => n.userId === otherId && n.type === 'message' && n.chatId === chatId && !n.read);
      const fresh = {
        id: idx >= 0 ? prev[idx].id : uid('n'),
        userId: otherId,
        type: 'message',
        title: `New message from ${user.name}`,
        body: clean.length > 80 ? clean.slice(0, 80) + '…' : clean,
        chatId,
        itemId: chat.itemId,
        read: false,
        createdAt: Date.now(),
      };
      if (idx >= 0) return prev.map((n, i) => (i === idx ? fresh : n));
      return [fresh, ...prev];
    });
  };

  const value = {
    items, claims, chats,
    myNotifications, unreadCount, markRead, markAllRead,
    savedIds, isSaved, toggleSave,
    getMatches, createItem, closePost,
    submitClaim, approveClaim, rejectClaim, requestMoreProof, addProof, requestReview,
    confirmHandover,
    openChat, sendMessage,
  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
