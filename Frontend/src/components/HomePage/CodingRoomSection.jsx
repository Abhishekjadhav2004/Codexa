import React from 'react';
import { useNavigate } from 'react-router';

const CodingRoomSection = () => {
    const navigate = useNavigate();

    const handleCodingRoomClick = () => {
        navigate('/coding-room');
    };

    return (
        <section className="py-16 bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        CodeForge Studio
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Experience the future of collaborative coding. Join live development sessions, code together in real-time, and build amazing projects with your team.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
                        <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Real-time Sync</h3>
                        <p className="text-gray-300">
                            See changes as they happen. Every keystroke is synchronized instantly across all participants.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
                        <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Multi-user Support</h3>
                        <p className="text-gray-300">
                            Invite multiple developers to join your coding session. Perfect for pair programming and team collaboration.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
                        <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Easy Sharing</h3>
                        <p className="text-gray-300">
                            Generate unique room IDs to share with your team. No complex setup required - just join and start coding.
                        </p>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="text-center mt-12">
                    <button
                        onClick={handleCodingRoomClick}
                        className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors inline-flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" />
                        </svg>
                        Start CodeForge Studio
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CodingRoomSection;
