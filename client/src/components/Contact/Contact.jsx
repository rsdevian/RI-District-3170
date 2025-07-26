import React, { useState, useEffect } from "react";
import "../../styles/Contact.css";

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email format is invalid";
        }

        if (!formData.subject.trim()) {
            newErrors.subject = "Subject is required";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
        } else if (formData.message.length < 10) {
            newErrors.message = "Message must be at least 10 characters";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage("");

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));

            setSubmitMessage(
                "Thank you for your message! We'll get back to you soon."
            );

            // Reset form
            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
            });
        } catch (error) {
            setSubmitMessage("Error sending message: ", error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='contact-container'>
            {/* Hero Section */}
            <section className='contact-hero'>
                <div className='container'>
                    <h1>Get in Touch</h1>
                    <p>
                        We'd love to hear from you. Send us a message and we'll
                        respond as soon as possible.
                    </p>
                </div>
            </section>

            {/* Contact Content */}
            <section className='contact-content'>
                <div className='container'>
                    <div className='contact-wrapper'>
                        {/* Contact Info */}
                        <div className='contact-info'>
                            <h2>Contact Information</h2>
                            <p>
                                Feel free to reach out to us through any of the
                                following methods:
                            </p>

                            <div className='contact-details'>
                                <div className='contact-item'>
                                    <div className='contact-names'>
                                        <div className='contact-text'>
                                            <h3>Address</h3>
                                            <p>
                                                House no 1776, Dharmaveer
                                                Sambaji
                                                <br />
                                                Maharaj Chowk, Kelkar baag
                                                Belgaum -
                                                <br />
                                                590001
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className='contact-item'>
                                    <div className='contact-names'>
                                        <div className='contact-text'>
                                            <h3>
                                                PHF Rtn. Rtr. Harsh Paresh
                                                Shinde
                                            </h3>
                                            <p>
                                                <i>
                                                    District Rotaract
                                                    Representative
                                                </i>
                                            </p>
                                            <p>
                                                <i>RY 2025 2026</i>
                                            </p>
                                        </div>
                                        <div className='contact-text'>
                                            <p>+91 99026 65574</p>
                                        </div>
                                        <div className='contact-text'>
                                            <p>drrharsh3170@gmail.com</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='contact-item'>
                                    <div className='contact-names'>
                                        <div className='contact-text'>
                                            <h3>
                                                PHF Rtn. Rtr. Harshit Kulkarni
                                            </h3>
                                            <p>
                                                <i>
                                                    District Rotaract Secretary
                                                </i>
                                            </p>
                                            <p>
                                                <i>RY 2025 2026</i>
                                            </p>
                                        </div>
                                        <div className='contact-text'>
                                            <p>+91 89512 86155</p>
                                        </div>
                                        <div className='contact-text'>
                                            <p>drsharshit3170@gmail.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            {/* <div className='social-media'>
                                <h3>Follow Us</h3>
                                <div className='social-links'>
                                    <a href='#' className='social-link'>
                                        📘 Facebook
                                    </a>
                                    <a href='#' className='social-link'>
                                        🐦 Twitter
                                    </a>
                                    <a href='#' className='social-link'>
                                        📷 Instagram
                                    </a>
                                    <a href='#' className='social-link'>
                                        💼 LinkedIn
                                    </a>
                                </div>
                            </div> */}
                        </div>

                        {/* Contact Form */}
                        <div className='contact-form-section'>
                            <h2>Send us a Message</h2>

                            {submitMessage && (
                                <div
                                    className={`submit-message ${
                                        submitMessage.includes("Error")
                                            ? "error"
                                            : "success"
                                    }`}
                                >
                                    {submitMessage}
                                </div>
                            )}

                            <form
                                className='contact-form'
                                onSubmit={handleSubmit}
                            >
                                <div className='form-group'>
                                    <label htmlFor='name'>Full Name *</label>
                                    <input
                                        type='text'
                                        id='name'
                                        name='name'
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={errors.name ? "error" : ""}
                                        placeholder='Enter your full name'
                                    />
                                    {errors.name && (
                                        <span className='error-message'>
                                            {errors.name}
                                        </span>
                                    )}
                                </div>

                                <div className='form-group'>
                                    <label htmlFor='email'>
                                        Email Address *
                                    </label>
                                    <input
                                        type='email'
                                        id='email'
                                        name='email'
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={errors.email ? "error" : ""}
                                        placeholder='Enter your email address'
                                    />
                                    {errors.email && (
                                        <span className='error-message'>
                                            {errors.email}
                                        </span>
                                    )}
                                </div>

                                <div className='form-group'>
                                    <label htmlFor='subject'>Subject *</label>
                                    <input
                                        type='text'
                                        id='subject'
                                        name='subject'
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className={
                                            errors.subject ? "error" : ""
                                        }
                                        placeholder='Enter the subject'
                                    />
                                    {errors.subject && (
                                        <span className='error-message'>
                                            {errors.subject}
                                        </span>
                                    )}
                                </div>

                                <div className='form-group'>
                                    <label htmlFor='message'>Message *</label>
                                    <textarea
                                        id='message'
                                        name='message'
                                        value={formData.message}
                                        onChange={handleChange}
                                        className={
                                            errors.message ? "error" : ""
                                        }
                                        placeholder='Enter your message (minimum 10 characters)'
                                        rows='6'
                                    />
                                    {errors.message && (
                                        <span className='error-message'>
                                            {errors.message}
                                        </span>
                                    )}
                                </div>

                                <button
                                    type='submit'
                                    className='btn btn-submit'
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Sending..."
                                        : "Send Message"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            {/* <section className='map-section'>
                <div className='container'>
                    <h2>Find Us</h2>
                    <div className='map-placeholder'>
                        <div className='map-content'>
                            <h3>📍 Our Location</h3>
                            <p>
                                123 Business Street, Pune, Maharashtra 411001,
                                India
                            </p>
                            <p>Interactive map would be embedded here</p>
                        </div>
                    </div>
                </div>
            </section> */}
        </div>
    );
}

export default Contact;
