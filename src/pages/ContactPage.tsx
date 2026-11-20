import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Send } from 'lucide-react';
import { FAQ_ITEMS } from '../data/seedData';
import { useApp } from '../context/AppContext';

export const ContactPage: React.FC = () => {
  const { currentUser, inquiries, submitInquiry } = useApp();

  const [name, setName] = useState(currentUser?.name ?? '');
  const [email, setEmail] = useState(currentUser?.email ?? '');
  const [mobile, setMobile] = useState(currentUser?.mobile ?? '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Please enter your name.');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError('Please enter a valid email address.');
    if (!/^[0-9]{10}$/.test(mobile.trim()))
      return setError('Please enter a valid 10-digit mobile number.');
    if (!subject.trim()) return setError('Please enter a subject for your inquiry.');
    if (message.trim().length < 10)
      return setError('Please write a message of at least 10 characters.');

    const created = submitInquiry({
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });
    setSubmittedId(created.id);
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="max-w-2xl space-y-2 border-b border-[#E5E1D6] pb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#17231C]">
          Contact &amp; Support
        </h1>
        <p className="text-sm sm:text-base text-[#56635B] leading-relaxed">
          Have a question about student meal ordering, weekly or monthly plans, or partnering as a
          local food provider in Dehradun? Send us a message using the support form below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Contact Form */}
        <section className="lg:col-span-7 bg-white border border-[#E5E1D6] rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#17231C]">
              Send a Support Message
            </h2>
            <p className="text-xs text-[#56635B] mt-1">
              Inquiries are stored locally in this prototype workspace for demonstration purposes.
            </p>
          </div>

          {submittedId && (
            <div className="bg-[#EAF3EE] text-[#135233] rounded-xl p-4 flex items-start gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Message received ({submittedId})</p>
                <p className="text-xs mt-0.5">
                  Thank you for reaching out to HostelBite Support. Your inquiry has been logged.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="c-name" className="block text-sm font-medium text-[#17231C]">
                  Name *
                </label>
                <input
                  id="c-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="c-mobile" className="block text-sm font-medium text-[#17231C]">
                  Mobile Number *
                </label>
                <input
                  id="c-mobile"
                  type="tel"
                  required
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit mobile number"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="c-email" className="block text-sm font-medium text-[#17231C]">
                Email *
              </label>
              <input
                id="c-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="c-subject" className="block text-sm font-medium text-[#17231C]">
                Subject *
              </label>
              <input
                id="c-subject"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Weekly meal plan question or Home chef onboarding"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="c-message" className="block text-sm font-medium text-[#17231C]">
                Message *
              </label>
              <textarea
                id="c-message"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your question or support request..."
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-[#B83B24] bg-[#FDF1E8] px-4 py-2.5 rounded-xl">{error}</p>
            )}

            <button
              type="submit"
              className="px-6 py-3 bg-[#1B6B44] hover:bg-[#135233] text-white text-sm font-semibold rounded-xl transition-colors inline-flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Message</span>
            </button>
          </form>

          {inquiries.length > 0 && (
            <div className="pt-6 border-t border-[#E5E1D6] space-y-3">
              <h3 className="text-sm font-semibold text-[#17231C]">
                Submitted Inquiries in This Session ({inquiries.length})
              </h3>
              <div className="space-y-2.5">
                {inquiries.slice(0, 3).map((inq) => (
                  <div
                    key={inq.id}
                    className="p-3.5 bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl text-xs space-y-1"
                  >
                    <div className="flex justify-between font-medium text-[#17231C]">
                      <span>{inq.subject}</span>
                      <span className="font-mono text-[#56635B]">{inq.id}</span>
                    </div>
                    <p className="text-[#56635B]">{inq.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Right: FAQ Accordion */}
        <section className="lg:col-span-5 space-y-5">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#17231C]">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#56635B] mt-1">
              Quick answers for Dehradun students and local home chefs.
            </p>
          </div>

          <div className="divide-y divide-[#E5E1D6] bg-white border border-[#E5E1D6] rounded-2xl overflow-hidden">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={item.question}>
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#FAFAF6] transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold text-[#17231C]">{item.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#1B6B44] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#56635B] shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-sm text-[#56635B] leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-[#F3F0E6] border border-[#E5E1D6] rounded-2xl p-5 text-xs text-[#56635B] leading-relaxed">
            <strong className="text-[#17231C]">Pilot Venture Note:</strong> HostelBite is an
            early-stage student entrepreneurship prototype developed at DBS Global University for
            Dehradun, Uttarakhand. Official helpline numbers, commercial offices, and social media
            channels will be published upon commercial launch.
          </div>
        </section>
      </div>
    </div>
  );
};
