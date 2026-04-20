import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast notifications
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  // ===== FETCH DATA =====
  const fetchProfile = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (!error && data) setProfile(data);
  }, [user]);

  const fetchUsers = useCallback(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('skill_points', { ascending: false });
    if (!error && data) setUsers(data);
  }, []);

  const fetchSessions = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .or(`teacher_id.eq.${user.id},learner_id.eq.${user.id}`)
      .order('session_date', { ascending: true });
    if (!error && data) setSessions(data);
  }, [user]);

  const fetchReviews = useCallback(async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setReviews(data);
  }, []);

  // Load all data when user changes
  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchProfile(), fetchUsers(), fetchSessions(), fetchReviews()])
        .finally(() => setLoading(false));
    } else {
      setProfile(null);
      setSessions([]);
      setLoading(false);
    }
  }, [user, fetchProfile, fetchUsers, fetchSessions, fetchReviews]);

  // ===== PROFILE =====
  const updateProfile = useCallback(async (updates) => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update({
        name: updates.name,
        bio: updates.bio,
        location: updates.location,
        availability: updates.availability,
        skills_offered: updates.skills_offered || updates.skillsOffered,
        skills_wanted: updates.skills_wanted || updates.skillsWanted,
      })
      .eq('id', user.id);

    if (error) {
      addToast('Failed to update profile: ' + error.message, 'error');
    } else {
      await fetchProfile();
      await fetchUsers();
      addToast('Profile updated successfully!', 'success');
    }
  }, [user, addToast, fetchProfile, fetchUsers]);

  // ===== SESSIONS CRUD =====
  const createSession = useCallback(async (session) => {
    const { data, error } = await supabase
      .from('sessions')
      .insert({
        teacher_id: session.teacherId,
        learner_id: session.learnerId,
        skill_taught: session.skillTaught,
        skill_exchanged: session.skillExchanged,
        session_date: session.date,
        session_time: session.time,
        duration: session.duration,
        notes: session.notes || '',
        status: 'upcoming',
      })
      .select()
      .single();

    if (error) {
      addToast('Failed to book session: ' + error.message, 'error');
    } else {
      // Award skill points
      await supabase
        .from('profiles')
        .update({ skill_points: (profile?.skill_points || 0) + 50 })
        .eq('id', user.id);
      await fetchSessions();
      await fetchProfile();
      addToast('Session booked! +50 Skill Points', 'success');
    }
    return data;
  }, [user, profile, addToast, fetchSessions, fetchProfile]);

  const updateSession = useCallback(async (id, updates) => {
    const { error } = await supabase
      .from('sessions')
      .update({
        skill_taught: updates.skillTaught,
        skill_exchanged: updates.skillExchanged,
        session_date: updates.date,
        session_time: updates.time,
        duration: updates.duration,
        notes: updates.notes,
      })
      .eq('id', id);

    if (error) {
      addToast('Failed to update session: ' + error.message, 'error');
    } else {
      await fetchSessions();
      addToast('Session updated!', 'success');
    }
  }, [addToast, fetchSessions]);

  const cancelSession = useCallback(async (id) => {
    const { error } = await supabase
      .from('sessions')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (error) {
      addToast('Failed to cancel session: ' + error.message, 'error');
    } else {
      await supabase
        .from('profiles')
        .update({ skill_points: Math.max(0, (profile?.skill_points || 0) - 25) })
        .eq('id', user.id);
      await fetchSessions();
      await fetchProfile();
      addToast('Session cancelled. -25 Skill Points', 'error');
    }
  }, [user, profile, addToast, fetchSessions, fetchProfile]);

  const completeSession = useCallback(async (id) => {
    const { error } = await supabase
      .from('sessions')
      .update({ status: 'completed' })
      .eq('id', id);

    if (error) {
      addToast('Failed to complete session: ' + error.message, 'error');
    } else {
      await supabase
        .from('profiles')
        .update({
          skill_points: (profile?.skill_points || 0) + 100,
          sessions_completed: (profile?.sessions_completed || 0) + 1,
        })
        .eq('id', user.id);
      await fetchSessions();
      await fetchProfile();
      addToast('Session completed! +100 Skill Points 🎉', 'success');
    }
  }, [user, profile, addToast, fetchSessions, fetchProfile]);

  // ===== REVIEWS =====
  const addReview = useCallback(async (review) => {
    const { error } = await supabase
      .from('reviews')
      .insert({
        from_user_id: user.id,
        to_user_id: review.toUserId,
        rating: review.rating,
        comment: review.comment,
      });

    if (error) {
      addToast('Failed to submit review: ' + error.message, 'error');
    } else {
      // Update target user's rating
      const userReviews = [...reviews.filter((r) => r.to_user_id === review.toUserId)];
      userReviews.push({ rating: review.rating });
      const avgRating = userReviews.reduce((a, r) => a + r.rating, 0) / userReviews.length;
      const targetUser = users.find((u) => u.id === review.toUserId);

      await supabase
        .from('profiles')
        .update({
          rating: Math.round(avgRating * 100) / 100,
          review_count: (targetUser?.review_count || 0) + 1,
        })
        .eq('id', review.toUserId);

      await fetchReviews();
      await fetchUsers();
      addToast('Review submitted! Thanks for the feedback.', 'success');
    }
  }, [user, reviews, users, addToast, fetchReviews, fetchUsers]);

  // ===== MATCHING =====
  const getMatches = useCallback(() => {
    if (!profile) return [];
    const myOffered = profile.skills_offered || [];
    const myWanted = profile.skills_wanted || [];

    return users
      .filter((u) => u.id !== user?.id)
      .map((u) => {
        const theirOffered = u.skills_offered || [];
        const theirWanted = u.skills_wanted || [];
        const theyTeachMe = theirOffered.filter((s) => myWanted.includes(s));
        const iTeachThem = myOffered.filter((s) => theirWanted.includes(s));
        const matchScore =
          theyTeachMe.length * 40 +
          iTeachThem.length * 40 +
          (u.rating || 0) * 5 +
          (theyTeachMe.length > 0 && iTeachThem.length > 0 ? 50 : 0);
        return {
          user: u,
          theyTeachMe,
          iTeachThem,
          matchScore,
          isPerfectMatch: theyTeachMe.length > 0 && iTeachThem.length > 0,
        };
      })
      .filter((m) => m.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [users, profile, user]);

  const getUserById = useCallback(
    (id) => users.find((u) => u.id === id),
    [users]
  );

  const getReviewsForUser = useCallback(
    (userId) => reviews.filter((r) => r.to_user_id === userId),
    [reviews]
  );

  const getSessionsForUser = useCallback(
    (userId) =>
      sessions.filter(
        (s) =>
          (s.teacher_id === userId || s.learner_id === userId) &&
          s.status !== 'cancelled'
      ),
    [sessions]
  );

  // Helper: normalize profile to match component expectations
  const currentUser = profile
    ? {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        bio: profile.bio,
        location: profile.location,
        skillsOffered: profile.skills_offered || [],
        skillsWanted: profile.skills_wanted || [],
        skillPoints: profile.skill_points || 0,
        sessionsCompleted: profile.sessions_completed || 0,
        rating: Number(profile.rating) || 0,
        reviewCount: profile.review_count || 0,
        availability: profile.availability || '',
        joinedDate: profile.created_at,
      }
    : null;

  // Normalize users for components
  const normalizedUsers = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    bio: u.bio,
    location: u.location,
    skillsOffered: u.skills_offered || [],
    skillsWanted: u.skills_wanted || [],
    skillPoints: u.skill_points || 0,
    sessionsCompleted: u.sessions_completed || 0,
    rating: Number(u.rating) || 0,
    reviewCount: u.review_count || 0,
    availability: u.availability || '',
    joinedDate: u.created_at,
  }));

  // Normalize sessions for components
  const normalizedSessions = sessions.map((s) => ({
    id: s.id,
    teacherId: s.teacher_id,
    learnerId: s.learner_id,
    skillTaught: s.skill_taught,
    skillExchanged: s.skill_exchanged,
    date: s.session_date,
    time: s.session_time,
    duration: s.duration,
    status: s.status,
    notes: s.notes,
  }));

  // Normalize reviews for components
  const normalizedReviews = reviews.map((r) => ({
    id: r.id,
    fromUserId: r.from_user_id,
    toUserId: r.to_user_id,
    rating: r.rating,
    comment: r.comment,
    date: r.created_at?.split('T')[0],
  }));

  const value = {
    currentUser,
    users: normalizedUsers,
    sessions: normalizedSessions,
    reviews: normalizedReviews,
    toasts,
    loading,
    updateProfile,
    createSession,
    updateSession,
    cancelSession,
    completeSession,
    addReview,
    getMatches: () => {
      if (!profile) return [];
      const myOffered = profile.skills_offered || [];
      const myWanted = profile.skills_wanted || [];
      return normalizedUsers
        .filter((u) => u.id !== user?.id)
        .map((u) => {
          const theyTeachMe = u.skillsOffered.filter((s) => myWanted.includes(s));
          const iTeachThem = myOffered.filter((s) => u.skillsWanted.includes(s));
          const matchScore =
            theyTeachMe.length * 40 +
            iTeachThem.length * 40 +
            (u.rating || 0) * 5 +
            (theyTeachMe.length > 0 && iTeachThem.length > 0 ? 50 : 0);
          return {
            user: u,
            theyTeachMe,
            iTeachThem,
            matchScore,
            isPerfectMatch: theyTeachMe.length > 0 && iTeachThem.length > 0,
          };
        })
        .filter((m) => m.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore);
    },
    getUserById: (id) => normalizedUsers.find((u) => u.id === id),
    getReviewsForUser: (userId) => normalizedReviews.filter((r) => r.toUserId === userId),
    getSessionsForUser: (userId) =>
      normalizedSessions.filter(
        (s) => (s.teacherId === userId || s.learnerId === userId) && s.status !== 'cancelled'
      ),
    addToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
