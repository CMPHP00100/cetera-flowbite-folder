// components/ContactForm.js
'use client';

import { useState } from 'react';
import { GiRotaryPhone } from "react-icons/gi";


export default function ContactFormHome() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({ success: null, message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult({ success: null, message: '' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setResult({ success: true, message: 'Message sent successfully!' });
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setResult({ success: false, message: data.error || 'Something went wrong.' });
      }
    } catch (err) {
      setResult({ success: false, message: 'Failed to send message.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid mx-auto px-4 py-10 bg-cetera-dark-blue">
        <div className="row pt-2">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6 pb-4 md:pb-0 address-info contact-info font-cetera-josefin text-cetera-light-gray">
                <h1 className="text-[3rem] sm:text-[5rem] font-bold mb-6 font-cetera-libre text-cetera-light-gray">Contact Us</h1>
                <h3 class="t-h3 text-cetera-mono-orange pb-2">Los Angeles</h3>
                <p>Cetera Marketing (Head Office)<br /> 8216 Lankershim Blvd, <br /> North Hollywood, CA 91605<br /> </p>
                <p className="flex pt-2"><GiRotaryPhone className="text-xl text-cetera-mono-orange" /> <a className="text-cetera-light-gray hover:cetera-mono-orange px-2" href="tel:+18187678002">818.767.8002</a> <span className="text-cetera-mono-orange text-xl mt-[-4px]">|</span> <a className="text-cetera-light-gray hover:cetera-mono-orange ps-2" href="tel:+18883884438">888.388.4438</a></p>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                <form onSubmit={handleSubmit} className="space-y-5 w-full">
                    <div>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cetera-mono-orange bg-cetera-light-gray font-cetera-josefin"
                    />
                    </div>
                    <div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cetera-mono-orange bg-cetera-light-gray font-cetera-josefin"
                    />
                    </div>
                    <div>
                    <input
                        type="text"
                        name="subject"
                        placeholder="Subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cetera-mono-orange bg-cetera-light-gray font-cetera-josefin"
                    />
                    </div>
                    <div>
                    <textarea
                        name="message"
                        placeholder="Message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows="5"
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cetera-mono-orange bg-cetera-light-gray font-cetera-josefin"
                    />
                    </div>

                    <button
                    type="submit"
                    disabled={loading}
                    className="bg-cetera-dark-blue text-cetera-light-gray mt-1 ps-0 pe-6 py-2 rounded-md hover:text-cetera-mono-orange font-cetera-josefin disabled:opacity-50 font-bold text-lg"
                    >
                    {loading ? 'Sending...' : 'Send Message. . . .'}
                    </button>

                    {result.message && (
                    <p
                        className={`mt-3 font-medium ${
                        result.success ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                        {result.message}
                    </p>
                    )}
                </form>
            </div>
        </div>
    </div>
  );
}

