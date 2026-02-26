import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./home.css";
import Footer from "@/components/Footer";
import { Github } from "lucide-react";
import { Rocket } from "lucide-react";
import { Users } from "lucide-react";
import { FileText } from "lucide-react";
import { FaRegStar } from "react-icons/fa";

function getClientId() {
  const key = "atsflow_client_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    usersTotal: 0,
    pdfsTotal: 0,
  });

  useEffect(() => {
    const run = async () => {
      // register user
      const registered = localStorage.getItem("atsflow_user_registered");

      if (!registered) {
        try {
          const res = await fetch("/api/metrics-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clientId: getClientId() }),
          });

          if (res.ok) {
            localStorage.setItem("atsflow_user_registered", "1");
          } else {
            console.error("metrics-user failed", res.status, await res.text());
          }
        } catch (e) {
          console.error("metrics-user error", e);
        }
      }

      // fetch metrics
      try {
        const res = await fetch("/api/metrics", { cache: "no-store" });
        if (!res.ok) {
          console.error("metrics failed", res.status, await res.text());
          return;
        }

        const data = await res.json();
        setStats({
          usersTotal: Number(data.usersTotal ?? 0),
          pdfsTotal: Number(data.pdfsTotal ?? 0),
        });
      } catch (e) {
        console.error("metrics error", e);
      }
    };

    run();
  }, []);

  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch(
      "https://api.github.com/repos/fabriciotrinndade/ats-resume-generator-html",
    )
      .then((r) => r.json())
      .then((d) => setStars(d.stargazers_count));
  }, []);

  return (
    <div className="min-h-screen flex-col">
      <header className="bg-black/95 top-0 z-30 sticky">
        <div className="max-w-[var(--max-width-container)] mx-auto items-center justify-between flex px-4 py-3 gap-4">
          <img
            src="/assets/images/ats-flow.png"
            alt="ATS Flow"
            className="h-6 w-auto object-contain"
          />

          <nav className="flex gap-2">
            <button
              className="bg-transparent border hover:bg-white/3 text-white border-white/40 b-2 rounded-3xl flex items-center gap-3 p-1"
              onClick={() =>
                window.open(
                  "https://github.com/fabriciotrinndade/ats-resume-generator-html",
                  "_blank",
                )
              }
            >
              <Github size={18} className="ml-2" />
              <span>{stars}</span>
              <FaRegStar size={18} className="mr-2" />
            </button>
          </nav>
        </div>
      </header>

      <main className="home">
        <div className="light-beam"></div>

        <section className="home__hero">
          <h1 className="home__title text-center font-heading text-6xl md:text-7xl font-bold tracking-tight">
            Your free ATS resume builder.
          </h1>

          <section className="home__hero text-center font-body text-lg mx-auto">
            Create, edit, and export professional resumes using a clean visual
            editor.
          </section>

          <div className="home__actions flex items-center justify-center gap-4">
            <button
              className="btn btn--primary hover:bg-black flex items-center gap-2 mt-6"
              onClick={() => navigate("/editor")}
            >
              Get Started
              <Rocket size={18} />
            </button>

            <button
              className="btn flex items-center gap-2 mt-6"
              onClick={() =>
                window.open(
                  "https://github.com/fabriciotrinndade/ats-resume-generator-html",
                  "_blank",
                )
              }
            >
              View on GitHub
              <Github size={18} />
            </button>
          </div>
        </section>

        {/* stats row (2 big cells) */}
        <section className="home__statsGrid mt-12">
          <div className="home__statCell">
            <div className="home__statValue">
              <Users size={35} />
              <span>{stats.usersTotal.toLocaleString()}</span>
            </div>
            <div className="home__statLabel">Users</div>
          </div>

          <div className="home__statCell">
            <div className="home__statValue">
              <FileText size={35} />
              <span>{stats.pdfsTotal.toLocaleString()}</span>
            </div>
            <div className="home__statLabel">PDFs generated</div>
          </div>
        </section>

        {/* section heading */}
        <section className="home__section">
          <h2 className="home__sectionTitle">Features</h2>
          <p className="home__sectionSubtitle">
            Everything you need to create, customize, and export ATS-friendly
            resumes. Built to stay simple, predictable, and portable.
          </p>
        </section>

        {/* features grid (table-like) */}
        <section className="home__featuresGrid">
          <article className="home__featureCell">
            <h3 className="home__featureTitle">ATS-first</h3>
            <p className="home__featureText">
              Predictable sections. Clean hierarchy.
            </p>
          </article>

          <article className="home__featureCell">
            <h3 className="home__featureTitle">Portable JSON</h3>
            <p className="home__featureText">
              Import/export anytime. No lock-in.
            </p>
          </article>

          <article className="home__featureCell">
            <h3 className="home__featureTitle">Deterministic HTML</h3>
            <p className="home__featureText">
              Consistent output designed for parsing.
            </p>
          </article>

          <article className="home__featureCell">
            <h3 className="home__featureTitle">PDF Export</h3>
            <p className="home__featureText">
              A4-ready PDF with print-safe styles.
            </p>
          </article>

          <article className="home__featureCell">
            <h3 className="home__featureTitle">Fast editor</h3>
            <p className="home__featureText">
              Edit and preview without friction.
            </p>
          </article>

          <article className="home__featureCell">
            <h3 className="home__featureTitle">Open source</h3>
            <p className="home__featureText">
              Built in public with community feedback.
            </p>
          </article>
        </section>

        {/* small highlights row */}
        <section className="home__highlightsRow mt-6">
          <span className="home__pill">Vite + React</span>
          <span className="home__pill">TypeScript</span>
          <span className="home__pill">Tailwind</span>
          <span className="home__pill">Monorepo</span>
          <span className="home__pill">Server-side PDF</span>
          <span className="home__pill">Upstash Redis</span>
        </section>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
