import Image from 'next/image';
import Link from 'next/link';

interface CompanionCardProps {
    id: string;
    name: string;
    subject: string;
    topic: string;
    duration: number;
    color: string;
}

const CompanionCard = ({
                           id,
                           name,
                           subject,
                           topic,
                           duration,
                           color,
                       }: CompanionCardProps) => {
    return (
        <article
            className="companion-card p-4 rounded-lg shadow"
            style={{ backgroundColor: color }}
            aria-labelledby={`companion-title-${id}`}
        >
            <h2 id={`companion-title-${id}`} className="text-2xl font-bold mb-2">
                {name}
            </h2>
            <div className="flex items-center justify-between">
                <div className='subject-badge'>
                    {subject}
                </div>
               <button className="companion-bookmark">
                   <Image src="/icons/bookmark.svg" alt="bookmark" width={12.5} height={15}/>
               </button>
            </div>

            <p className="text-md text-gray-700">Topic: {topic}</p>
            <div className='flex items-center gap-2 align-content-center'>
                <Image src="/icons/clock.svg" alt="clock" width={15} height={15}/>
                <p className="text-sm text-gray-700 font-bold"> {duration} minutes</p>
            </div>

            <Link href={`/companion/${id}`} className='w-full'>
                <button className="btn-primary w-full justify-center">
                    Launch Lesson
                </button>
            </Link>

        </article>
    );
};

export default CompanionCard;
