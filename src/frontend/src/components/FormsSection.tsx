import { SmokySectionTransition } from './SmokySectionTransition';
import { RegistrationForms } from './RegistrationForms';

/**
 * Forms section wrapper for the home page with heading and shared RegistrationForms component.
 */
export function FormsSection() {
  return (
    <SmokySectionTransition delay={400}>
      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-5xl md:text-6xl font-poppins font-bold metallic-text-hero mb-8 leading-tight">
                Join RBS Today
              </h2>
              <p className="text-xl metallic-text-secondary font-inter leading-relaxed">
                Register for presale or airdrop to secure your RBS tokens
              </p>
            </div>

            <RegistrationForms />
          </div>
        </div>
      </section>
    </SmokySectionTransition>
  );
}
