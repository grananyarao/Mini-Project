import { useState } from "react";
import ContactForm from "./ContactForm";
import LoginSignupModal from "../Auth/LoginSignupModal";

// Remove "Career Ready" card from the array
const featureData = [
  {
    title: "No Upfront Costs",
    desc: "Access premium courses by earning points through tasks – no credit card required.",
    icon: (
      <span style={{
        background: "#eff4ff", borderRadius: "50%",
        padding: "0.5em", fontSize: "1.4em"
      }}>⏳</span>
    ),
  },
  {
    title: "Real-World Tasks",
    desc: "Build your portfolio with practical projects evaluated by industry professionals.",
    icon: (
      <span style={{
        background: "#eafcef", borderRadius: "50%",
        padding: "0.5em", fontSize: "1.4em"
      }}>✅</span>
    ),
  },
  {
    title: "Comprehensive Courses",
    desc: "Master DSA, Python, DBMS, Computer Networks and UI/UX with structured content.",
    icon: (
      <span style={{
        background: "#f5f0ff", borderRadius: "50%",
        padding: "0.5em", fontSize: "1.4em"
      }}>📖</span>
    ),
  }
];

const stepsData = [
  {
    stepTitle: "Step 1: Choose Tasks",
    desc: "Browse through coding challenges, web development, design projects, and more. Pick tasks based on your skill level – easy, medium, or hard.",
    icon: "📖",
    bg: "#eff4ff",
  },
  {
    stepTitle: "Step 2: Complete & Submit",
    desc: "Work on your chosen task and submit your solution with files, links, or code. Our admins will evaluate your work promptly.",
    icon: "🟣",
    bg: "#f5f0ff",
  },
  {
    stepTitle: "Step 3: Earn & Learn",
    desc: "Receive points and feedback from admins. Accumulate points to unlock comprehensive CS courses and boost your career.",
    icon: "🏆",
    bg: "#eafcef",
  },
];

const HomePage = ({ user, setUser }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="home-root">
      <section style={{ textAlign: "center", margin: "3rem 0 2.5rem 0" }}>
        <h1 style={{
          fontSize: "2.8rem",
          fontWeight: "800",
          marginBottom: "0.6em",
          letterSpacing: "0.01em",
          color: "#132749"
        }}>
          Learn by Doing, <br />
          <span style={{ color: "#2366d1" }}>Earn While You Grow</span>
        </h1>
        <div style={{ fontSize: "1.18em", color: "#54607a", marginBottom: "1.7em" }}>
          Complete technical tasks, earn points, and unlock premium computer science courses without paying a dime.
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "inline-block",
            fontSize: "1.1em",
            fontWeight: 600,
            padding: "0.85em 2.4em",
            borderRadius: "28px",
            margin: "0.6em 0",
            background: "linear-gradient(90deg,#2366d1,#2688f1 85%)",
            color: "#fff",
            textDecoration: "none",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 3px 12px #2366d10c",
            transition: "background 0.14s",
          }}
        >
          Start Your Journey →
        </button>
      </section>

      <section style={{ textAlign: "center", marginBottom: "3.7rem" }}>
        <h2 style={{
          fontSize: "2rem",
          marginBottom: "1.1em",
          fontWeight: "700"
        }}>
          How It Works
        </h2>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "2.2rem"
        }}>
          {stepsData.map((item, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                borderRadius: "18px",
                boxShadow: "0 2px 18px #e5e8f0",
                padding: "2.2em 2em 2.2em 2em",
                maxWidth: "345px",
                minWidth: "240px",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  background: item.bg,
                  borderRadius: "50%",
                  fontSize: "1.75em",
                  marginBottom: "0.7em",
                  padding: "0.45em",
                }}
              >
                {item.icon}
              </span>
              <div style={{ fontWeight: "700", fontSize: "1.17em", color: "#132749", marginBottom: "0.44em" }}>
                {item.stepTitle}
              </div>
              <div style={{ color: "#525b79", fontSize: "1.04em" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ textAlign: "center", marginBottom: "3.4rem" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1.25em" }}>Why Earn&Learn?</h2>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "2.2rem"
        }}>
          {featureData.map((item, i) => (
            <div key={i}
              style={{
                background: "#fff",
                borderRadius: "18px",
                boxShadow: "0 2px 18px #e5e8f0",
                padding: "2em 2em",
                minWidth: "230px",
                maxWidth: "330px",
                textAlign: "left",
                display: "flex",
                gap: "1em",
                alignItems: "flex-start"
              }}>
              {item.icon}
              <div style={{ marginLeft: "0.15em" }}>
                <div style={{
                  fontWeight: "700",
                  color: '#132749',
                  fontSize: "1.12em"
                }}>{item.title}</div>
                <div style={{
                  color: "#525b79",
                  fontSize: "1.03em",
                  marginTop: "0.36em"
                }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" style={{
        maxWidth: "500px",
        margin: "0 auto 48px auto",
        background: "#fff",
        borderRadius: "18px",
        boxShadow: "0 2px 16px #e5e8f1",
        padding: "2em 2.2em 2em 2.2em",
        position: "relative"
      }}>
        <h2 style={{
          fontSize: "1.55em",
          fontWeight: "700",
          marginBottom: "0.4em"
        }}>Contact Us</h2>
        <div style={{
          color: "#676b9f",
          fontSize: "1.10em",
          marginBottom: "1.4em"
        }}>
          Have questions or feedback? We'd love to hear from you!
        </div>
        <ContactForm />
      </section>

      <footer className="home-footer">
        <div style={{
          fontWeight: "bold",
          fontSize: "1.4em",
          marginBottom: "0.8em"
        }}>📖 Earn&Learn</div>
        <div>
          © 2025 Earn&Learn. Building the future, one task at a time.
        </div>
      </footer>

      {/* Login/Signup Modal */}
      <LoginSignupModal 
        open={showModal} 
        onClose={() => setShowModal(false)} 
        setUser={setUser} 
      />
    </div>
  );
};

export default HomePage;
