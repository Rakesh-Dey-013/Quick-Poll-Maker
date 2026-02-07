export const POLL_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  VOTED: 'voted'
};

export const VOTE_RESULT = {
  CORRECT: 'correct',
  WRONG: 'wrong',
  PENDING: 'pending'
};

export const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: '-options.voteCount', label: 'Most Popular' },
  { value: 'expiresAt', label: 'Expiring Soon' },
];

export const TIME_UNITS = {
  HOUR: 'hour',
  DAY: 'day',
  MINUTE: 'minute'
};

export const API_ENDPOINTS = {
  POLLS: '/polls',
  VOTES: '/votes',
  AUTH: '/auth'
};