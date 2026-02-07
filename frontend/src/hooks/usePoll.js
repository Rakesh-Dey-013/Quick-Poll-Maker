import { useState, useEffect } from 'react';
import { pollAPI } from '../services/api';

export const usePoll = (pollId) => {
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        const response = await pollAPI.getOne(pollId);
        
        if (response.data.success) {
          setPoll(response.data.data.poll);
        } else {
          setError('Poll not found');
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load poll');
      } finally {
        setLoading(false);
      }
    };

    if (pollId) {
      fetchPoll();
    }
  }, [pollId]);

  return { poll, loading, error };
};

export const usePolls = (params = {}) => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);

  const fetchPolls = async (customParams = {}) => {
    try {
      setLoading(true);
      const response = await pollAPI.getAll({ ...params, ...customParams });
      
      if (response.data.success) {
        setPolls(response.data.data);
        setTotal(response.data.total);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load polls');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, [JSON.stringify(params)]); // Using JSON.stringify to compare object changes

  return { polls, loading, error, total, refetch: fetchPolls };
};