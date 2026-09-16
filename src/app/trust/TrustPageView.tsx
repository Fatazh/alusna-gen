import { type ReactNode } from "react";
import { type Locale } from "../../shared/i18n";
import { type TrustPage } from "../router/routes";
import { RELEASE_NOTES } from "./releaseNotes";
import { type TrustSection, TRUST_COPY, TRUST_PAGE_UPDATED } from "./trustCopy";

export function TrustPageView({ page }: { page: TrustPage }) {
  return (
    <article
      className="mx-auto max-w-4xl rounded-2xl border px-5 py-6 sm:px-8 sm:py-8"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--card-bg)" }}
    >
      <header className="mb-8 border-b pb-5" style={{ borderColor: "var(--border)" }}>
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
          {page.heading}
        </h1>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {page.description}
        </p>
        <p className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
          {page.locale === "en" ? "Last updated" : "Terakhir diperbarui"}:{" "}
          {TRUST_PAGE_UPDATED[page.locale]}
        </p>
      </header>
      <div className="space-y-7">
        {TRUST_COPY[page.locale][page.id].map((section) => (
          <TrustSectionBlock key={section.title} section={section} />
        ))}
        {page.id === "about" && <Changelog locale={page.locale} />}
        <ContactSection locale={page.locale} />
      </div>
    </article>
  );
}

function TrustSectionBlock({ section }: { section: TrustSection }) {
  return (
    <Section title={section.title}>
      {section.body && <p>{section.body}</p>}
      {section.bullets && (
        <ul className="list-disc space-y-1 pl-5">
          {section.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      )}
    </Section>
  );
}

function Changelog({ locale }: { locale: Locale }) {
  const release = RELEASE_NOTES[locale];
  return (
    <section aria-labelledby="release-notes-title" className="border-t pt-7 theme-border">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: "var(--accent)" }}
          >
            {locale === "en" ? "Current version" : "Versi saat ini"}
          </p>
          <h2
            id="release-notes-title"
            className="mt-2 text-base font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {locale === "en" ? "Changelog" : "Catatan perubahan"}
          </h2>
        </div>
        <span
          className="rounded-full border px-3 py-1 font-mono text-xs font-bold"
          style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
        >
          {release.version}
        </span>
      </div>
      <div className="mt-4 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
        <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
          {release.title} · {release.releasedAt}
        </p>
        <p className="mt-1">{release.summary}</p>
        <ul className="mt-3 space-y-2">
          {release.items.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true" style={{ color: "var(--accent)" }}>
                •
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
        {title}
      </h2>
      <div className="mt-2 space-y-2 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
        {children}
      </div>
    </section>
  );
}

function ContactSection({ locale }: { locale: Locale }) {
  const configuredEmail = import.meta.env.VITE_CONTACT_EMAIL?.trim();
  const email =
    configuredEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configuredEmail) ? configuredEmail : null;
  return (
    <Section title={locale === "en" ? "Contact" : "Kontak"}>
      {email ? (
        <p>
          {locale === "en"
            ? "Privacy requests, questions, and advertising reports can be sent to"
            : "Pertanyaan, permintaan privasi, atau laporan iklan dapat dikirim ke"}{" "}
          <a className="underline" href={`mailto:${email}`}>
            {email}
          </a>
          .
        </p>
      ) : (
        <p>
          {locale === "en"
            ? "The official contact address will appear after the ALUSNA production domain is configured."
            : "Alamat kontak resmi akan ditampilkan setelah domain produksi ALUSNA dikonfigurasi."}
        </p>
      )}
    </Section>
  );
}
