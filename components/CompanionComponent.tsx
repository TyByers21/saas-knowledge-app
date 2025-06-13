'use client';

import { useEffect, useRef, useState } from 'react';
import { cn, configureAssistant, getSubjectColor } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk';
import Image from 'next/image';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import soundwaves from '@/constants/soundwaves.json';
import { addToSessionHistory } from '@/lib/actions/companion.actions';
import VisualDisplay from '@/components/VisualDisplay/VisualDisplay';

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

const CompanionComponent = ({
                                companionId,
                                subject,
                                topic,
                                name,
                                userName,
                                userImage,
                                style,
                                voice,
                            }: CompanionComponentProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const [visualData, setVisualData] = useState<any>(null);
    const lottieRef = useRef<LottieRefCurrentProps>(null);

    useEffect(() => {
        if (lottieRef) {
            isSpeaking ? lottieRef.current?.play() : lottieRef.current?.stop();
        }
    }, [isSpeaking]);

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
        const onCallEnd = () => {
            setCallStatus(CallStatus.FINISHED);
            addToSessionHistory(companionId);
        };

        // ⬇️ Place your onMessage function right here
        const onMessage = (message: Message) => {
            if (message.type === 'transcript' && message.transcriptType === 'final') {
                let transcript = message.transcript;
                let cleanedTranscript = transcript;
                let visualFound = false;

                // Remove all JSON visual blocks before rendering or speaking
                const fencedJsonRegex = /```(?:json)?\s*([\s\S]*?)\s*```/g;
                const matches = [...transcript.matchAll(fencedJsonRegex)];

                for (const match of matches) {
                    try {
                        const jsonContent = match[1];
                        const parsed = JSON.parse(jsonContent);
                        if (parsed?.visual) {
                            setVisualData(parsed.visual);
                            visualFound = true;
                            cleanedTranscript = cleanedTranscript.replace(match[0], ''); // full match
                        }
                    } catch (e) {
                        console.warn('Failed to parse visual JSON:', e);
                    }
                }

                // Absolute safety: Remove remaining suspicious JSON-looking content
                cleanedTranscript = cleanedTranscript.replace(/\{.*?"visual".*?\}/gs, '');
                cleanedTranscript = cleanedTranscript.replace(/[\{\}\[\]":,]/g, ''); // remove JSON-like tokens
                cleanedTranscript = cleanedTranscript.trim().replace(/\s+/g, ' ');

                const finalMessage = visualFound
                    ? "I've created a visual to help illustrate this concept."
                    : cleanedTranscript;

                if (finalMessage) {
                    setMessages((prev) => [
                        {
                            role: message.role,
                            content: finalMessage,
                        },
                        ...prev,
                    ]);
                }
            }
        };


        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);
        const onError = (error: Error) => console.log('Error', error);

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('error', onError);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);

        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('error', onError);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
        };
    }, []);


    const toggleMicrophone = () => {
        const isMuted = vapi.isMuted();
        vapi.setMuted(!isMuted);
        setIsMuted(!isMuted);
    };

    const handleCall = () => {
        setCallStatus(CallStatus.CONNECTING);
        const assistantOverrides = {
            variableValues: { subject, topic, style },
            clientMessages: ['transcript'],
            serverMessages: [],
        };
        // @ts-expect-error
        vapi.start(configureAssistant(voice, style), assistantOverrides);
    };

    const handleDisconnect = () => {
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();
    };

    return (
        <section className="flex flex-col h-[80vh]">
            <section className="flex gap-8 max-sm:flex-col">
                <div className="companion-section">
                    <div className="companion-avatar" style={{ backgroundColor: getSubjectColor(subject) }}>
                        <div className={cn('absolute transition-opacity duration-1000',
                            callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE ? 'opacity-100' : 'opacity-0',
                            callStatus === CallStatus.CONNECTING && 'opacity-100 animate-pulse')}>
                            <Image src={`/icons/${subject}.svg`} alt={subject} width={150} height={150} className="max-sm:w-fit" />
                        </div>
                        <div className={cn('absolute transition-opacity duration-1000',
                            callStatus === CallStatus.ACTIVE ? 'opacity-100' : 'opacity-0')}>
                            <Lottie lottieRef={lottieRef} animationData={soundwaves} autoplay={false} className="companion-lottie" />
                        </div>
                    </div>
                    <p className="font-bold text-2xl">{name}</p>
                </div>

                <div className="user-section">
                    <div className="user-avatar">
                        <Image src={userImage} alt={userName} width={130} height={130} className="rounded-lg" />
                        <p className="font-bold text-2xl">{userName}</p>
                    </div>
                    <button className="btn-mic" onClick={toggleMicrophone} disabled={callStatus !== CallStatus.ACTIVE}>
                        <Image src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'} alt="mic" width={36} height={36} />
                        <p className="max-sm:hidden">{isMuted ? 'Turn on microphone' : 'Turn off microphone'}</p>
                    </button>
                    <button className={cn('rounded-lg py-2 cursor-pointer transition-colors w-full text-white',
                        callStatus === CallStatus.ACTIVE ? 'bg-red-700' : 'bg-black',
                        callStatus === CallStatus.CONNECTING && 'animate-pulse')} onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}>
                        {callStatus === CallStatus.ACTIVE ? 'End Session' : callStatus === CallStatus.CONNECTING ? 'Connecting' : 'Start Session'}
                    </button>
                </div>
            </section>

            <section className="transcript">
                <div className="transcript-message no-scrollbar">
                    {messages.map((message, index) => (
                        <p key={index} className={cn(message.role === 'assistant' ? '' : 'text-primary', 'max-sm:text-sm')}>
                            {message.role === 'assistant' ? `${name.split(' ')[0]}: ${message.content}` : `${userName}: ${message.content}`}
                        </p>
                    ))}
                </div>
                <div className="transcript-fade" />
            </section>

            {visualData && (
                <section className="mt-4">
                    <VisualDisplay data={visualData} subject={subject} topic={topic} />
                </section>
            )}
        </section>
    );
};

export default CompanionComponent;
