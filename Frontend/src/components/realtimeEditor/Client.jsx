import React from 'react';
import Avatar from 'react-avatar';

const Client = ({ username }) => {
    // Extract initials from username (handle numbered usernames)
    const getInitials = (name) => {
        const cleanName = name.replace(/\s*\(\d+\)$/, ''); // Remove (1), (2), etc.
        return cleanName.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
    };

    return (
        <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all duration-200 border border-gray-600/30">
            <Avatar 
                name={username} 
                size={40} 
                round="12px" 
                className="shadow-md"
            />
            <div className="flex-1">
                <span className="text-white font-medium text-sm">{username}</span>
                <div className="flex items-center space-x-1 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs font-medium">Online</span>
                </div>
            </div>
        </div>
    );
};

export default Client;
