import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, X, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

export default function VoiceChat({ onClose }: { onClose: () => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const playbackContextRef = useRef<AudioContext | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  const startRecording = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Setup playback audio context
      playbackContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      nextPlayTimeRef.current = playbackContextRef.current.currentTime;

      const sessionPromise = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-12-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: "You are a helpful, encouraging tutor for a flashcard app called Tibeb.ai. Keep responses concise and conversational.",
        },
        callbacks: {
          onopen: async () => {
            setIsConnecting(false);
            setIsRecording(true);
            
            try {
              const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                  channelCount: 1,
                  sampleRate: 16000,
                } 
              });
              mediaStreamRef.current = stream;
              
              audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
              sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
              processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
              
              processorRef.current.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                // Convert Float32Array to Int16Array (PCM)
                const pcmData = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                  pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
                }
                
                // Convert Int16Array to Base64
                const buffer = new ArrayBuffer(pcmData.length * 2);
                const view = new DataView(buffer);
                for (let i = 0; i < pcmData.length; i++) {
                  view.setInt16(i * 2, pcmData[i], true); // true for little-endian
                }
                
                let binary = '';
                const bytes = new Uint8Array(buffer);
                for (let i = 0; i < bytes.byteLength; i++) {
                  binary += String.fromCharCode(bytes[i]);
                }
                const base64Data = btoa(binary);
                
                sessionPromise.then((session) => {
                  session.sendRealtimeInput({
                    audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
                  });
                });
              };
              
              sourceRef.current.connect(processorRef.current);
              processorRef.current.connect(audioContextRef.current.destination);
              
            } catch (err) {
              console.error("Error accessing microphone:", err);
              setError("Could not access microphone.");
              stopRecording();
            }
          },
          onmessage: (message: LiveServerMessage) => {
            // Handle audio output
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && playbackContextRef.current) {
              // Decode base64 to binary
              const binaryString = atob(base64Audio);
              const len = binaryString.length;
              const bytes = new Uint8Array(len);
              for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              
              // Convert PCM16 to Float32
              const int16Array = new Int16Array(bytes.buffer);
              const float32Array = new Float32Array(int16Array.length);
              for (let i = 0; i < int16Array.length; i++) {
                float32Array[i] = int16Array[i] / 32768.0;
              }
              
              const audioBuffer = playbackContextRef.current.createBuffer(1, float32Array.length, 24000);
              audioBuffer.getChannelData(0).set(float32Array);
              
              const source = playbackContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(playbackContextRef.current.destination);
              
              const currentTime = playbackContextRef.current.currentTime;
              const playTime = Math.max(currentTime, nextPlayTimeRef.current);
              source.start(playTime);
              nextPlayTimeRef.current = playTime + audioBuffer.duration;
            }
            
            if (message.serverContent?.interrupted) {
              if (playbackContextRef.current) {
                playbackContextRef.current.close();
                playbackContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                nextPlayTimeRef.current = playbackContextRef.current.currentTime;
              }
            }
          },
          onerror: (err) => {
            console.error("Live API Error:", err);
            setError("Connection error.");
            stopRecording();
          },
          onclose: () => {
            stopRecording();
          }
        }
      });
      
      sessionRef.current = sessionPromise;
      
    } catch (err) {
      console.error("Failed to start voice chat:", err);
      setError("Failed to start voice chat.");
      setIsConnecting(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsConnecting(false);
    
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (playbackContextRef.current) {
      playbackContextRef.current.close();
      playbackContextRef.current = null;
    }
    if (sessionRef.current) {
      sessionRef.current.then((session: any) => session.close());
      sessionRef.current = null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 w-80 h-96 bg-coffee rounded-3xl shadow-2xl border border-gold/30 flex flex-col z-50 overflow-hidden text-parchment"
    >
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-parchment/10">
        <div className="flex items-center gap-2">
          <Sparkles className="text-gold" size={20} />
          <h3 className="font-display font-bold text-lg">Voice Tutor</h3>
        </div>
        <button onClick={onClose} className="text-parchment/70 hover:text-parchment transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        {error ? (
          <div className="text-red-400 mb-4">{error}</div>
        ) : isConnecting ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={48} className="text-gold animate-spin" />
            <p className="text-parchment/70">Connecting to AI...</p>
          </div>
        ) : isRecording ? (
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gold/20 rounded-full animate-ping"></div>
              <div className="w-24 h-24 bg-gold rounded-full flex items-center justify-center relative z-10 shadow-lg shadow-gold/20">
                <Mic size={40} className="text-coffee" />
              </div>
            </div>
            <p className="text-parchment/90 font-medium">Listening...</p>
            <p className="text-sm text-parchment/50">Speak to your tutor</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="w-24 h-24 bg-parchment/10 rounded-full flex items-center justify-center">
              <MicOff size={40} className="text-parchment/40" />
            </div>
            <p className="text-parchment/70">Ready to practice?</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 flex justify-center border-t border-parchment/10">
        {!isRecording && !isConnecting ? (
          <button 
            onClick={startRecording}
            className="bg-gold text-coffee px-8 py-3 rounded-full font-bold hover:bg-gold/90 transition-colors shadow-lg shadow-gold/20"
          >
            Start Conversation
          </button>
        ) : (
          <button 
            onClick={stopRecording}
            className="bg-red-500 text-white px-8 py-3 rounded-full font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
          >
            End Conversation
          </button>
        )}
      </div>
    </motion.div>
  );
}
