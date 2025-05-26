import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Cta = () => {
    return (
        <section className='cta-section'>
            <div className='cta-badge'>
                Start learning your way
            </div>
            <div>
                <h2 className='text-3xl font-bold mb-4'>Build Your Personalized Learning Companion</h2>
                <p>Pick a name, subject, voice, & personality - and start learning through voice conversations that feel natural and fun!</p>
            </div>
            <Image src="/images/cta.svg" alt="cta" width={362} height={232}/>
            <button className='btn-primary'>
                <Image src="/icons/plus.svg" alt="arrow" width={15} height={15}/>
                <Link href='/companions/new'>Build A New Companion</Link>
            </button>
        </section>
    )
}

export default Cta