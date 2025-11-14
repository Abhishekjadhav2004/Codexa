import React, { useState, useRef, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../../utils/realtimeActions';
import Client from './Client';
import Editor from './Editor';
import { initSocket } from '../../utils/socket';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router';

const CodingRoomEditor = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const connectedUsers = useRef(new Set()); // Track connected usernames

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();

            const handleErrors = (e) => {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/coding-room');
            };

            socketRef.current.on('connect_error', handleErrors);
            socketRef.current.on('connect_failed', handleErrors);

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    
                    // Create a Map to ensure only one entry per username
                    const uniqueClientsMap = new Map();
                    
                    clients.forEach(client => {
                        const existingClient = uniqueClientsMap.get(client.username);
                        
                        // If username doesn't exist, add it
                        if (!existingClient) {
                            uniqueClientsMap.set(client.username, client);
                        } else {
                            // If username exists, keep the one with the most recent socketId
                            // (assuming higher socketId means more recent connection)
                            if (client.socketId > existingClient.socketId) {
                                uniqueClientsMap.set(client.username, client);
                            }
                        }
                    });
                    
                    // Convert Map back to array
                    const uniqueClients = Array.from(uniqueClientsMap.values());
                    
                    // Debug log
                    console.log('Original clients:', clients.map(c => c.username));
                    console.log('Unique clients:', uniqueClients.map(c => c.username));
                    
                    // Update connected users set
                    connectedUsers.current = new Set(uniqueClients.map(c => c.username));
                    
                    setClients(uniqueClients);

                    // Only sync code if this is the initial connection and we have code
                    if (!isInitialized && codeRef.current) {
                        const socket = socketRef.current;
                        socket.emit(ACTIONS.SYNC_CODE, {
                            code: codeRef.current,
                            socketId,
                        });
                        setIsInitialized(true);
                    }
                }
            );

            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    
                    // Remove from connected users set
                    connectedUsers.current.delete(username);
                    
                    // Update clients list to remove the disconnected user
                    setClients(prev => {
                        const updatedClients = prev.filter(client => client.username !== username);
                        
                        // Update connected users set with remaining clients
                        connectedUsers.current = new Set(updatedClients.map(c => c.username));
                        
                        return updatedClients;
                    });
                }
            );
        };

        init();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.off(ACTIONS.DISCONNECTED);
            }
            // Clean up connected users tracking
            connectedUsers.current.clear();
        };
    }, [roomId, location.state?.username, reactNavigator]);

    const handleCodeChange = useCallback((code) => {
        codeRef.current = code;
    }, []);

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    function leaveRoom() {
        reactNavigator('/coding-room');
    }

    if (!location.state) {
        return <Navigate to="/coding-room" />;
    }

    return (
        <div className="h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex">
            {/* Sidebar */}
            <div className="w-80 bg-gradient-to-b from-gray-800 to-gray-900 flex flex-col border-r border-gray-700 shadow-2xl">
                <div className="p-6">
                    <div className="flex items-center mb-8">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4 flex items-center justify-center shadow-lg">
                            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-lg">CodeForge</h2>
                            <p className="text-purple-400 text-sm font-medium">Live Collaboration Studio</p>
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-semibold text-lg">Active Developers</h3>
                            <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                {clients.length}
                            </div>
                        </div>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                        {clients.map((client) => (
                            <Client key={client.socketId} username={client.username} />
                        ))}
                        </div>
                    </div>
                </div>
                
                <div className="mt-auto p-6 space-y-4">
                    <button 
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                        onClick={copyRoomId}
                    >
                        📋 Copy Room ID
                    </button>
                    <button 
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                        onClick={leaveRoom}
                    >
                        🚪 Leave Studio
                    </button>
                </div>
            </div>
            
            {/* Editor */}
            <div className="flex-1 bg-gradient-to-br from-gray-900 to-slate-900">
                <Editor
                    socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={handleCodeChange}
                />
            </div>
        </div>
    );
};

export default CodingRoomEditor;
