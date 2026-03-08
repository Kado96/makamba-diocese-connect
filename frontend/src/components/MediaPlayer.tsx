import React from 'react';
import ReactPlayer from 'react-player';
import { X, Maximize, Minimize } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';

interface MediaPlayerProps {
    url: string;
    title: string;
    type: 'video' | 'audio' | 'youtube';
    onClose: () => void;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ url, title, type, onClose }) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-sm"
            >
                <div className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-4 z-[110]">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onClose}
                        className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white h-12 w-12"
                    >
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className={`relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl bg-black ${type === 'audio' ? 'max-h-[300px]' : 'aspect-video'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {type === 'audio' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-12 bg-gradient-to-br from-indigo-900 to-slate-900">
                            <div className="mb-6 w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                                </div>
                            </div>
                            <h3 className="text-xl md:text-2xl font-heading font-bold text-white mb-8 text-center">{title}</h3>
                            <div className="w-full max-w-md">
                                <ReactPlayer
                                    url={url}
                                    controls
                                    width="100%"
                                    height="50px"
                                    playing
                                    config={{
                                        file: {
                                            forceAudio: true,
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full">
                            <ReactPlayer
                                url={url}
                                controls
                                width="100%"
                                height="100%"
                                playing
                                pip
                                stopOnTerminate
                            />
                        </div>
                    )}
                </motion.div>

                {/* Backdrop close area */}
                <div className="absolute inset-0 -z-10" onClick={onClose} />
            </motion.div>
        </AnimatePresence>
    );
};

export default MediaPlayer;
