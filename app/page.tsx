"use client"

import React from 'react'
import CompanionCard from "@/components/CompanionCard";
import CompanionsList from "@/components/CompanionsList";
import Cta from "@/components/CTA";
import {recentSessions} from "@/constants/index";

const Page = () => {
  return (
    <main>
    <h1 className='text-2xl underline'>Popular Companions</h1>
    <section className="home-section">
      <CompanionCard
      id="123"
      name="Neura the Brainy Explorer"
      topic="Neural Network of the Brain"
      subject="science"
      duration={45}
      color="#fcca03"
      />
      <CompanionCard
          id="456"
          name="Countsy the Number Wizard"
          topic="Derivatives & Integrals"
          subject="math"
          duration={30}
          color="#ff70f8"
      />
      <CompanionCard
        id="789"
        name="Verba the Vocabulary Builder"
        topic="English Literature"
        subject="language"
        duration={30}
        color="#03d3fc"
    />
    </section>
      <section className="home-section">
        <CompanionsList
            title="Recent Sessions"
            companions={recentSessions}
            className="w-2/3 max-lg:w-full mt-10"
        />
        <Cta/>
      </section>
    </main>
  )
}

export default Page