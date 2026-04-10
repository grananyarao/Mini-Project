import { useState } from "react";
const ContactForm = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    // submission logic...
  }

  if (submitted) {
    return <p style={{ color: "#287bdd", fontWeight: "bold", fontSize: "1.13em" }}>
      Thanks for contacting us! We'll reach out soon.
    </p>;
  }

  return (
    <form style={{ display: "flex", flexDirection: "column" }} onSubmit={handleSubmit}>
      <label htmlFor="contactName" style={{ fontWeight: "500", marginBottom: "0.3em", color: "#1751b2" }}>
        Name
      </label>
      <input
        name="name"
        id="contactName"
        value={form.name}
        onChange={handleChange}
        required
        style={{
          padding: "0.7em",
          borderRadius: "7px",
          border: "1.3px solid #c8d9fc",
          fontSize: "1.06em",
          marginBottom: "1.1em"
        }}
        placeholder="Your name"
      />

      <label htmlFor="contactEmail" style={{ fontWeight: "500", marginBottom: "0.3em", color: "#1751b2" }}>
        Email
      </label>
      <input
        name="email"
        type="email"
        id="contactEmail"
        value={form.email}
        onChange={handleChange}
        required
        style={{
          padding: "0.7em",
          borderRadius: "7px",
          border: "1.3px solid #c8d9fc",
          fontSize: "1.06em",
          marginBottom: "1.1em"
        }}
        placeholder="your.email@example.com"
      />

      <label htmlFor="contactMsg" style={{ fontWeight: "500", marginBottom: "0.3em", color: "#1751b2" }}>
        Message
      </label>
      <textarea
        name="message"
        id="contactMsg"
        value={form.message}
        onChange={handleChange}
        required
        style={{
          padding: "0.7em",
          borderRadius: "7px",
          border: "1.3px solid #c8d9fc",
          fontSize: "1.06em",
          marginBottom: "1.1em",
          minHeight: "46px",
          resize: "vertical"
        }}
        placeholder="Tell us what's on your mind..."
      />

      <button
        type="submit"
        style={{
          background: "linear-gradient(90deg,#2366d1,#2688f1)",
          color: "#fff",
          border: "none",
          borderRadius: "7px",
          padding: "1em 0",
          marginTop: "0.7em",
          fontSize: "1.07em",
          fontWeight: "bold",
          letterSpacing: "0.02em",
          boxShadow: "0 3px 12px #2366d122",
          cursor: "pointer",
          transition: "background 0.1s"
        }}
      >
        Send Message
      </button>
    </form>
  );
};

export default ContactForm;

