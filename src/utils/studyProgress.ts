import { db, doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from '../firebase';
import { UserProfile } from '../types';

export async function recordStudySession(
  userId: string, 
  xpGained: number, 
  quality: number // 0-2: forgot, 3: doubtful, 4-5: knew
) {
  try {
    // 1. Update User Profile (XP, Level, Streak)
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data() as UserProfile;
      const currentXp = userData.xp || 0;
      const newXp = currentXp + xpGained;
      const newLevel = Math.floor(newXp / 1000) + 1; // 1000 XP per level
      
      // Check streak
      const today = new Date().toISOString().split('T')[0];
      const lastStudyDate = userData.lastStudyDate ? userData.lastStudyDate.split('T')[0] : '';
      let newStreak = userData.streak || 0;
      
      if (lastStudyDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (lastStudyDate === yesterdayStr) {
          newStreak += 1;
        } else {
          newStreak = 1; // Reset streak
        }
      }

      await updateDoc(userRef, {
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        lastStudyDate: new Date().toISOString()
      });
    }

    // 2. Update Daily Study Log
    const today = new Date().toISOString().split('T')[0];
    const logRef = doc(db, 'users', userId, 'studyLogs', today);
    const logSnap = await getDoc(logRef);

    const isForgot = quality < 3;
    const isDoubtful = quality === 3;
    const isKnew = quality > 3;

    if (logSnap.exists()) {
      await updateDoc(logRef, {
        cardsReviewed: increment(1),
        xpEarned: increment(xpGained),
        forgotCount: increment(isForgot ? 1 : 0),
        doubtfulCount: increment(isDoubtful ? 1 : 0),
        knewCount: increment(isKnew ? 1 : 0),
      });
    } else {
      await setDoc(logRef, {
        date: today,
        cardsReviewed: 1,
        xpEarned: xpGained,
        forgotCount: isForgot ? 1 : 0,
        doubtfulCount: isDoubtful ? 1 : 0,
        knewCount: isKnew ? 1 : 0,
        authorId: userId
      });
    }
  } catch (error) {
    console.error("Error recording study session:", error);
  }
}
