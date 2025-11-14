import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

const CodingRoomHome = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.authSlice);

    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState(user?.username || user?.fullName || '');

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('Created a new room');
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('ROOM ID & username is required');
            return;
        }

        // Redirect to coding room
        navigate(`/coding-room/${roomId}`, {
            state: { username },
        });
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center p-4">
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-10 w-full max-w-md shadow-2xl border border-gray-700">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">CodeForge</h2>
                    <p className="text-purple-400 text-lg font-medium">Live Collaboration Studio</p>
                </div>

                <h4 className="text-white text-xl mb-6 text-center font-semibold">Join Development Session</h4>
                
                <div className="space-y-5">
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Room ID</label>
                        <input
                            type="text"
                            className="w-full px-4 py-4 bg-gray-700/50 text-white rounded-xl border border-gray-600 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                            placeholder="Enter Room ID"
                            onChange={(e) => setRoomId(e.target.value)}
                            value={roomId}
                            onKeyUp={handleInputEnter}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Your Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-4 bg-gray-700/50 text-white rounded-xl border border-gray-600 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                            placeholder="Enter your name"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            onKeyUp={handleInputEnter}
                        />
                    </div>
                    <button 
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                        onClick={joinRoom}
                    >
                        🚀 Join Studio
                    </button>
                    
                    <div className="text-center text-gray-400 text-sm">
                        Don't have a room? Create &nbsp;
                        <button
                            type="button"
                            onClick={createNewRoom}
                            className="text-purple-400 hover:text-purple-300 underline cursor-pointer bg-transparent border-none p-0 font-medium"
                        >
                            new studio
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodingRoomHome;
