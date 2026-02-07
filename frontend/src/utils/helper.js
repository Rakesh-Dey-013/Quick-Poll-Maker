// Format time remaining
export const formatTimeRemaining = (expiresAt) => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffMs = expiry - now;

  if (diffMs <= 0) {
    return { text: 'Expired', color: 'text-red-400', bg: 'bg-red-900/30' };
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 1) {
    const minutes = Math.floor(diffMs / (1000 * 60));
    return { 
      text: `${minutes}m`, 
      color: 'text-yellow-400', 
      bg: 'bg-yellow-900/30' 
    };
  } else if (diffHours < 24) {
    return { 
      text: `${diffHours}h`, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-900/30' 
    };
  } else {
    const days = Math.floor(diffHours / 24);
    return { 
      text: `${days}d`, 
      color: 'text-blue-400', 
      bg: 'bg-blue-900/30' 
    };
  }
};

// Calculate percentage for vote display
export const calculatePercentage = (votes, totalVotes) => {
  if (totalVotes === 0) return 0;
  return (votes / totalVotes) * 100;
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Generate share URL
export const generateShareUrl = (shareId) => {
  return `${window.location.origin}/poll/${shareId}`;
};

// Copy to clipboard
export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      console.log('Copied to clipboard');
    })
    .catch(err => {
      console.error('Failed to copy: ', err);
    });
};

// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};