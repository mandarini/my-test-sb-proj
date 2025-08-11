'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Instrument = {
  id: number;
  name: string;
  type: string;
  created_at: string;
};

export default function Instruments() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [lastActivity, setLastActivity] = useState<string>('');

  // Fetch initial data
  useEffect(() => {
    fetchInstruments();
  }, []);

  // Set up realtime subscriptions
  useEffect(() => {
    // Subscribe to database changes
    const channel = supabase
      .channel('instruments-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'instruments',
        },
        (payload) => {
          console.log('Database change received:', payload);
          handleDatabaseChange(payload);
        }
      )
      .on(
        'broadcast',
        { event: 'user-activity' },
        (payload) => {
          console.log('User activity:', payload);
          setLastActivity(payload.payload.message);
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        setOnlineUsers(Object.keys(newState).length);
      })
      .subscribe();

    // Join presence to track online users
    channel.track({ user: `user-${Math.random().toString(36).substr(2, 9)}` });

    // Broadcast user joined
    setTimeout(() => {
      channel.send({
        type: 'broadcast',
        event: 'user-activity',
        payload: { message: 'A user joined the instruments page!' },
      });
    }, 1000);

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchInstruments = async () => {
    try {
      const { data, error } = await supabase
        .from('instruments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setInstruments(data || []);
    } catch (error) {
      console.error('Error fetching instruments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDatabaseChange = (payload: any) => {
    switch (payload.eventType) {
      case 'INSERT':
        setInstruments(prev => [payload.new, ...prev]);
        setLastActivity(`New instrument "${payload.new.name}" was added!`);
        break;
      case 'UPDATE':
        setInstruments(prev => 
          prev.map(instrument => 
            instrument.id === payload.new.id ? payload.new : instrument
          )
        );
        setLastActivity(`Instrument "${payload.new.name}" was updated!`);
        break;
      case 'DELETE':
        setInstruments(prev => 
          prev.filter(instrument => instrument.id !== payload.old.id)
        );
        setLastActivity(`An instrument was deleted!`);
        break;
    }
  };

  const addSampleInstrument = async () => {
    const sampleInstruments = [
      { name: 'Electric Guitar', type: 'String' },
      { name: 'Piano', type: 'Keyboard' },
      { name: 'Drums', type: 'Percussion' },
      { name: 'Violin', type: 'String' },
      { name: 'Trumpet', type: 'Brass' },
    ];
    
    const randomInstrument = sampleInstruments[Math.floor(Math.random() * sampleInstruments.length)];
    
    try {
      const { error } = await supabase
        .from('instruments')
        .insert([randomInstrument]);
      
      if (error) throw error;
      
      // Broadcast activity
      const channel = supabase.channel('instruments-changes');
      channel.send({
        type: 'broadcast',
        event: 'user-activity',
        payload: { message: `Someone added a ${randomInstrument.name}!` },
      });
    } catch (error) {
      console.error('Error adding instrument:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">Loading instruments...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">🎵 Live Instruments Tracker</h1>
        
        {/* Status Bar */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Online Users: {onlineUsers}
            </span>
            <span>Total Instruments: {instruments.length}</span>
          </div>
          {lastActivity && (
            <div className="text-sm text-blue-600 dark:text-blue-400 mt-2">
              📢 {lastActivity}
            </div>
          )}
        </div>

        {/* Add Sample Button */}
        <button
          onClick={addSampleInstrument}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 transition-colors"
        >
          ➕ Add Random Instrument
        </button>
      </div>

      {/* Instruments List */}
      <div className="space-y-4">
        {instruments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No instruments yet. Add one to get started!
          </div>
        ) : (
          instruments.map((instrument) => (
            <div
              key={instrument.id}
              className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{instrument.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">Type: {instrument.type}</p>
                </div>
                <div className="text-sm text-gray-500">
                  ID: {instrument.id}
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Added: {new Date(instrument.created_at).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h3 className="font-semibold mb-2">🚀 Try the real-time features:</h3>
        <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
          <li>• Click "Add Random Instrument" to see live updates</li>
          <li>• Open this page in multiple tabs to see user presence</li>
          <li>• Watch for real-time notifications when data changes</li>
          <li>• All changes are instantly synchronized across all connected clients!</li>
        </ul>
      </div>
    </div>
  );
}