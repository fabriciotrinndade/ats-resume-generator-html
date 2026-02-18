export default function Footer() {
  return (
    <footer className="homeFooter">
      <div className="homeFooter__grid">
        {/* Brand */}
        <div className="homeFooter__col">
          <div className="homeFooter__logoRow">
            <img
              src="/assets/images/ats-flow.png"
              alt="ATS Flow"
              className="homeFooter__logo"
            />
          </div>

          <p className="homeFooter__text">
            A free and open-source resume builder focused on ATS-first
            structure, clarity, and portability.
          </p>
        </div>

        {/* Community */}
        <div className="homeFooter__col">
          <div className="homeFooter__label">Community</div>
          <a
            className="homeFooter__link"
            href="https://github.com/fabriciotrinndade/ats-resume-generator-html/issues"
            target="_blank"
            rel="noreferrer"
          >
            Report an issue
          </a>
          <a
            className="homeFooter__link"
            href="https://github.com/fabriciotrinndade/ats-resume-generator-html/pulls"
            target="_blank"
            rel="noreferrer"
          >
            Pull requests
          </a>
          <a
            className="homeFooter__link"
            href="https://discord.gg/XjUaNnFf"
            target="_blank"
            rel="noreferrer"
          >
            Discord
          </a>
        </div>

        {/* Built by */}
        <div className="homeFooter__col">
          <div className="homeFooter__label">Built by</div>

          <span className="homeFooter__text">
            By the community, for the community.
          </span>

          <span className="homeFooter__text">
            Initiated by{" "}
            <a
              className="homeFooter__link"
              href="https://fabriciotrindade.com.br/"
              target="_blank"
              rel="noreferrer"
            >
              Fabricio Trindade
            </a>
          </span>
        </div>
      </div>

      <div className="homeFooter__bottom">
        <span className="homeFooter__muted">
          © {new Date().getFullYear()} ATS Flow
        </span>
      </div>
    </footer>
  );
}
