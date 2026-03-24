import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Plus, Search, LogIn, Clock, BookOpen, Coffee } from 'lucide-react';
import { UserProfile, Room } from '../types';
import { User } from '../types';
import { db, collection, query, getDocs, addDoc, serverTimestamp, doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from '../firebase';

interface StudyRoomsProps {
  userProfile: UserProfile | null;
}

export default function StudyRooms({ userProfile }: StudyRoomsProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [newRoomTags, setNewRoomTags] = useState('');

  useEffect(() => {
    // Listen to all rooms
    const q = query(collection(db, 'rooms'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const roomData: Room[] = [];
      snapshot.forEach((doc) => {
        roomData.push({ id: doc.id, ...doc.data() } as Room);
      });
      setRooms(roomData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile || !newRoomName.trim()) return;

    try {
      const tags = newRoomTags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const newRoom = {
        name: newRoomName,
        description: newRoomDesc,
        tags,
        activeUsers: [{
          uid: userProfile.uid,
          displayName: userProfile.displayName,
          photoURL: userProfile.photoURL,
          joinedAt: new Date().toISOString()
        }],
        createdAt: serverTimestamp(),
        createdBy: userProfile.uid
      };

      await addDoc(collection(db, 'rooms'), newRoom);
      setShowCreateModal(false);
      setNewRoomName('');
      setNewRoomDesc('');
      setNewRoomTags('');
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    if (!userProfile) return;
    
    try {
      const roomRef = doc(db, 'rooms', roomId);
      await updateDoc(roomRef, {
        activeUsers: arrayUnion({
          uid: userProfile.uid,
          displayName: userProfile.displayName,
          photoURL: userProfile.photoURL,
          joinedAt: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  const handleLeaveRoom = async (roomId: string) => {
    if (!userProfile) return;
    
    try {
      const room = rooms.find(r => r.id === roomId);
      if (!room || !room.activeUsers) return;
      
      const userEntry = room.activeUsers.find(u => u.uid === userProfile.uid);
      if (!userEntry) return;

      const roomRef = doc(db, 'rooms', roomId);
      await updateDoc(roomRef, {
        activeUsers: arrayRemove(userEntry)
      });
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  };

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-parchment/50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-parchment/50">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-coffee mb-2">Study Rooms</h1>
            <p className="text-coffee/70">Join others to study together and stay motivated.</p>
          </div>
          
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-coffee text-parchment px-6 py-3 rounded-2xl hover:bg-coffee/90 transition-colors shadow-md font-medium"
          >
            <Plus size={20} />
            Create Room
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee/40" size={20} />
          <input
            type="text"
            placeholder="Search rooms by name, description, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-2 border-earth/20 focus:border-gold focus:ring-0 transition-colors text-coffee placeholder-coffee/40 shadow-sm"
          />
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.length > 0 ? (
            filteredRooms.map(room => {
              const activeUsers = room.activeUsers || [];
              const isMember = activeUsers.some(u => u.uid === userProfile?.uid);
              
              return (
                <motion.div 
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-earth/20 flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-coffee">{room.name}</h3>
                    <div className="flex items-center gap-1 text-xs font-medium bg-earth/30 text-coffee px-2 py-1 rounded-full">
                      <Users size={14} />
                      {activeUsers.length}
                    </div>
                  </div>
                  
                  {room.description && (
                    <p className="text-coffee/70 text-sm mb-4 line-clamp-2">{room.description}</p>
                  )}
                  
                  {room.tags && room.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {room.tags.map(tag => (
                        <span key={tag} className="text-xs bg-gold/10 text-coffee/80 px-2 py-1 rounded-md border border-gold/20">
                           #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-auto pt-4 border-t border-earth/30">
                    <div className="flex -space-x-2 mb-4 overflow-hidden">
                      {activeUsers.slice(0, 5).map((user, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-earth flex items-center justify-center overflow-hidden" title={user.displayName}>
                          {user.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <span className="text-xs font-bold text-coffee">{user.displayName?.charAt(0) || '?'}</span>
                          )}
                        </div>
                      ))}
                      {activeUsers.length > 5 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-earth/50 flex items-center justify-center text-xs font-bold text-coffee">
                          +{activeUsers.length - 5}
                        </div>
                      )}
                    </div>
                    
                    {isMember ? (
                      <button 
                        onClick={() => handleLeaveRoom(room.id!)}
                        className="w-full py-2 rounded-xl border-2 border-red-500/20 text-red-500 font-medium hover:bg-red-500/10 transition-colors"
                      >
                        Leave Room
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleJoinRoom(room.id!)}
                        className="w-full py-2 rounded-xl bg-gold/20 text-coffee font-medium hover:bg-gold/30 transition-colors flex items-center justify-center gap-2"
                      >
                        <LogIn size={18} />
                        Join Room
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12 text-coffee/50">
              <Users size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg">No study rooms found.</p>
              <p className="text-sm mt-2">Create one to start studying with others!</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-parchment rounded-3xl p-8 max-w-md w-full shadow-2xl border border-earth"
          >
            <h2 className="text-2xl font-bold text-coffee mb-6">Create Study Room</h2>
            
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-coffee mb-1">Room Name</label>
                <input
                  type="text"
                  required
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-earth/50 focus:border-gold focus:ring-0 bg-white"
                  placeholder="e.g., Biology 101 Study Group"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-coffee mb-1">Description (Optional)</label>
                <textarea
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-earth/50 focus:border-gold focus:ring-0 bg-white resize-none h-24"
                  placeholder="What are you studying?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-coffee mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={newRoomTags}
                  onChange={(e) => setNewRoomTags(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-earth/50 focus:border-gold focus:ring-0 bg-white"
                  placeholder="biology, exams, focus"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 rounded-xl border-2 border-earth/50 text-coffee font-medium hover:bg-earth/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-coffee text-parchment font-medium hover:bg-coffee/90 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
