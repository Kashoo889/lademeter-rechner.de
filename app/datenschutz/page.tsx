import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, LegalPage, LegalSection, Missing } from "@/components/legal/LegalPage";
import { ConsentSettingsButton } from "@/components/ads/ConsentSettingsButton";
import { adsActive } from "@/lib/ads/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { formatAddressLines, isLegalReviewed, operator } from "@/lib/legal/operator";
import { LEGAL_TEXTS_UPDATED, legalNoindex, missingFor } from "@/lib/legal/pages";

export const metadata: Metadata = buildPageMetadata({
  title: "Datenschutzerklärung",
  description:
    "Datenschutzerklärung von Lademeter Rechner: Hosting, Server-Logfiles, lokale Berechnung im Browser, Kontakt, Einwilligungen und Ihre Rechte nach DSGVO.",
  path: "/datenschutz/",
  noindex: legalNoindex("datenschutz"),
});

export default function DatenschutzPage() {
  const address = formatAddressLines();
  let n = 0;
  const num = () => `${++n}.`;

  return (
    <LegalPage
      title="Datenschutzerklärung"
      path="/datenschutz/"
      updatedAt={LEGAL_TEXTS_UPDATED}
      missing={missingFor("datenschutz")}
      reviewed={isLegalReviewed()}
      intro={
        <p>
          Mit dieser Datenschutzerklärung informieren wir Sie nach Art. 13 und 14 der
          Datenschutz-Grundverordnung (DSGVO) darüber, welche personenbezogenen Daten beim Besuch von
          lademeter-rechner.de verarbeitet werden, zu welchen Zwecken und auf welcher Rechtsgrundlage
          und welche Rechte Ihnen zustehen.
        </p>
      }
    >
      <LegalSection id="verantwortlicher" title={`${num()} Verantwortlicher`}>
        <p>Verantwortlich im Sinne von Art. 4 Nr. 7 DSGVO ist:</p>
        <p>
          {operator.name ?? <Missing label="Name bzw. Firma" />}
          <br />
          {address ? (
            address.join(", ")
          ) : (
            <>
              <Missing label="Anschrift (Straße und Hausnummer bzw. Gebäude und Ortsteil, PLZ, Ort)" />, {operator.country}
            </>
          )}
          <br />
          E-Mail: {operator.email ?? <Missing label="E-Mail-Adresse" />}
          {operator.phone ? (
            <>
              <br />
              Telefon: {operator.phone}
            </>
          ) : null}
        </p>
      </LegalSection>

      <LegalSection id="eu-vertretung" title={`${num()} Vertretung in der Europäischen Union`}>
        {operator.euRepresentative ? (
          <p>
            Vertretung nach Art. 27 DSGVO: {operator.euRepresentative.name}, {operator.euRepresentative.address},{" "}
            E-Mail: {operator.euRepresentative.email}.
          </p>
        ) : operator.euRepresentativeExemption ? (
          <p>
            Nach dokumentierter fachlicher Prüfung vom {operator.euRepresentativeExemption.reviewedAt} durch{" "}
            {operator.euRepresentativeExemption.reviewer} wurde die Ausnahme nach Art. 27 Abs. 2 DSGVO wie folgt
            beurteilt: {operator.euRepresentativeExemption.reason}
          </p>
        ) : (
          <p>
            <Missing label="EU-Vertretung nach Art. 27 DSGVO oder dokumentierte fachliche Prüfung einer Ausnahme nach Art. 27 Abs. 2 DSGVO" />
          </p>
        )}
      </LegalSection>

      <LegalSection id="ueberblick" title={`${num()} Überblick`}>
        <ul className="list-disc space-y-1 pl-5">
          <li>Die Rechner arbeiten vollständig in Ihrem Browser. Ihre Eingaben werden nicht an uns übertragen und nicht gespeichert.</li>
          <li>Es ist keine Registrierung und kein Benutzerkonto nötig.</li>
          <li>Schriftarten werden von unserem eigenen Server geladen, es besteht keine Verbindung zu Google Fonts.</li>
          <li>
            {adsActive
              ? "Werbung (Google AdSense) wird nur nach Ihrer Einwilligung personalisiert ausgespielt; eigene Analyse- oder Tracking-Dienste setzen wir nicht ein."
              : "Wir setzen keine Analyse-, Tracking- oder Werbedienste und keine Cookies ein."}
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="hosting" title={`${num()} Hosting und Server-Logfiles`}>
        <p>
          {operator.hosting.confirmed ? "Diese Website wird" : "Diese Website soll"} bei{" "}
          {operator.hosting.provider ? (
            <strong>{operator.hosting.provider}</strong>
          ) : (
            <Missing label="Tatsächlichen Hosting-Anbieter, Verarbeitungsorte und Vertragsgrundlagen bestätigen" />
          )}{" "}
          {operator.hosting.confirmed
            ? "gehostet."
            : "gehostet werden (Planungsstand; noch kein bestätigtes Produktions-Deployment)."}{" "}
          Beim Aufruf einer Seite verarbeitet der jeweilige Hosting-Anbieter technisch notwendige Daten, die Ihr
          Browser übermittelt (Server-Logfiles):
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>IP-Adresse des anfragenden Geräts</li>
          <li>Datum und Uhrzeit des Zugriffs</li>
          <li>aufgerufene Adresse (URL) einschließlich eventueller URL-Parameter</li>
          <li>HTTP-Statuscode und übertragene Datenmenge</li>
          <li>Referrer-URL (zuvor besuchte Seite), soweit übermittelt</li>
          <li>Browsertyp, Betriebssystem und Spracheinstellung (User-Agent)</li>
        </ul>
        <p>
          Zweck ist die Auslieferung der Website sowie die Gewährleistung von Stabilität und Sicherheit,
          etwa die Abwehr von Angriffen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser
          berechtigtes Interesse liegt in einem sicheren und funktionsfähigen Betrieb.
        </p>
        {operator.hosting.provider === "Vercel Inc." ? (
          <>
            <p>
              Vercel beschreibt in seinen öffentlichen Unterlagen die Verarbeitung von Website- und
              Verbindungsinformationen, darunter IP-Adresse, daraus abgeleitete Standortinformationen
              und Systemkonfigurationen. Der veröffentlichte Vercel-DPA nennt die USA als primären
              Verarbeitungsort und weist darauf hin, dass Daten auch dort verarbeitet werden können, wo
              Vercel oder seine Unterauftragsverarbeiter tätig sind. Vercel, Inc. ist unter dem EU-U.S. Data Privacy Framework (DPF) zertifiziert. Für Übermittlungen aus dem
              EWR sieht der DPA zudem die EU-Standardvertragsklauseln (SCC) vor. Nach seinem aktuellen
              Wortlaut gilt dieser DPA für Kunden auf Pro- und Enterprise-Tarifen; der tatsächlich
              gewählte Tarif und die vertragliche Einbeziehung sind daher vor dem Livegang zu bestätigen.
            </p>
            <p>
              Die Laufzeit von Runtime-Logs ist tarifabhängig. Vercel dokumentiert aktuell unterschiedliche
              Aufbewahrungsfenster für Hobby, Pro, Enterprise und Zusatzoptionen. Der konkrete Tarif, die
              wirksame Einbeziehung des DPA, die aktivierten Protokollierungs- und Analysefunktionen sowie
              die tatsächlichen Verarbeitungsorte dieses Projekts sind noch nicht bestätigt.
            </p>
            <p>
              Öffentliche Informationen: {operator.hosting.privacyPolicyUrl ? (
                <ExternalLink href={operator.hosting.privacyPolicyUrl}>Vercel Privacy Notice</ExternalLink>
              ) : null}
              {operator.hosting.dpaUrl ? (
                <>, <ExternalLink href={operator.hosting.dpaUrl}>Vercel Data Processing Addendum</ExternalLink></>
              ) : null}
              {operator.hosting.subprocessorsUrl ? (
                <>, <ExternalLink href={operator.hosting.subprocessorsUrl}>aktuelle Unterauftragsverarbeiter</ExternalLink></>
              ) : null}
              {operator.hosting.runtimeLogsUrl ? (
                <>, <ExternalLink href={operator.hosting.runtimeLogsUrl}>Dokumentation zur Runtime-Log-Aufbewahrung</ExternalLink></>
              ) : null}.
            </p>
          </>
        ) : null}
        {!operator.hosting.confirmed ? (
          <p>
            <Missing label="Vercel-Tarif, Vertrags-/DPA-Geltung, Kontoeinstellungen, Verarbeitungsorte, Unterauftragsverarbeiter und Log-Aufbewahrung des tatsächlichen Deployments bestätigen" />
          </p>
        ) : null}
      </LegalSection>

      <LegalSection id="rechner" title={`${num()} Nutzung der Rechner`}>
        <p>
          Alle Berechnungen erfolgen lokal in Ihrem Browser per JavaScript. Die eingegebenen Maße,
          Mengen und Gewichte werden nicht an unseren Server übertragen und von uns nicht gespeichert.
        </p>
        <p>
          Damit Sie eine Berechnung teilen oder als Lesezeichen speichern können, werden Ihre
          Eingaben nach dem Berechnen in kodierter Form in die Adresse (URL) der Seite geschrieben.
          Diese Adresse verbleibt zunächst nur in Ihrem Browser. Rufen Sie einen solchen Link auf oder
          geben Sie ihn weiter, wird er wie jede andere aufgerufene Adresse vom Hosting-Anbieter in den
          Server-Logfiles verarbeitet (siehe oben). Geben Sie in Freitextfelder wie „Bezeichnung“
          daher keine personenbezogenen Daten ein.
        </p>
      </LegalSection>

      <LegalSection id="kontakt" title={`${num()} Kontaktaufnahme (E-Mail und Kontaktformular)`}>
        <p>
          Wenn Sie uns per E-Mail oder über unser Kontaktformular kontaktieren, verarbeiten wir die von
          Ihnen eingegebenen Daten (Name, E-Mail-Adresse, Betreff sowie den Inhalt Ihrer Nachricht),
          um Ihr Anliegen zu bearbeiten und mit Ihnen in Kontakt zu treten. Rechtsgrundlage ist Art. 6
          Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen) bzw. Art. 6 Abs. 1
          lit. b DSGVO, sofern Ihre Anfrage auf den Abschluss oder die Durchführung eines Vertrages abzielt.
          Wir löschen die Daten, sobald die Anfrage abschließend bearbeitet ist und keine gesetzlichen
          Aufbewahrungspflichten entgegenstehen.
        </p>
        <p>
          <strong>E-Mail-Zustelldienst Resend:</strong> Für die technische Zustellung von Nachrichten
          aus dem Kontaktformular an unsere E-Mail-Adresse ({operator.email}) nutzen wir den
          E-Mail-Versanddienst Resend der Resend, Inc., 2261 Market Street #5039, San Francisco, CA
          94114, USA. Resend verarbeitet die Formularinhalte als Auftragsverarbeiter gemäß Art. 28 DSGVO.
          Resend, Inc. ist unter dem EU-U.S. Data Privacy Framework (DPF) zertifiziert; zudem besteht
          mit dem Anbieter ein Auftragsverarbeitungsvertrag (Data Processing Addendum, DPA) auf Basis
          der EU-Standardvertragsklauseln (SCC) nach Art. 46 Abs. 2 lit. c DSGVO.
        </p>
        <p>
          <strong>Spamschutz und Missbrauchsabwehr:</strong> Zur Erkennung automatisierter Spam-Nachrichten
          setzen wir ein verdecktes Formularfeld (Honeypot) sowie eine zeitliche Ausfüllprüfung ein. Zur
          Abwehr von Denial-of-Service- und Massenangriffen wird die übermittelte IP-Adresse für maximal
          10 Minuten flüchtig im Arbeitsspeicher des Servers zur Ratenbegrenzung verarbeitet und
          anschließend gelöscht; eine dauerhafte Speicherung der IP-Adresse im Rahmen des Formulars findet
          nicht statt.
        </p>
        <p className="text-sm text-slate-600">
          Weitere Informationen zum Datenschutz bei Resend finden Sie in der{" "}
          <ExternalLink href="https://resend.com/legal/privacy-policy">Datenschutzerklärung von Resend</ExternalLink>.
        </p>
      </LegalSection>

      <LegalSection id="cookies" title={`${num()} Cookies und Endgeräte-Zugriff`}>
        <p>
          Das Speichern von Informationen auf Ihrem Endgerät oder der Zugriff darauf (z. B. Cookies,
          Local Storage) ist nach § 25 Abs. 1 TDDDG nur mit Ihrer Einwilligung zulässig, es sei denn,
          er ist für einen von Ihnen ausdrücklich gewünschten Dienst unbedingt erforderlich (§ 25
          Abs. 2 Nr. 2 TDDDG). Details zu den eingesetzten Technologien finden Sie in unserer{" "}
          <Link href="/cookies/" className="text-brand-700 underline">
            Cookie-Richtlinie
          </Link>
          .
        </p>
        {adsActive ? (
          <>
            <p>
              Zur Einholung und Verwaltung Ihrer Einwilligungen nutzen wir die Consent-Management-Plattform
              „Datenschutz &amp; Mitteilungen“ von Google (Google Ireland Limited, Gordon House, Barrow
              Street, Dublin 4, Irland). Sie arbeitet mit dem Transparency &amp; Consent Framework (TCF)
              des IAB Europe. Dabei werden Ihre Einwilligungsentscheidung, ein Zeitstempel und technische
              Kennungen in Cookies gespeichert. Rechtsgrundlage ist Art. 6 Abs. 1 lit. c DSGVO i. V. m.
              Art. 7 Abs. 1 DSGVO (Nachweispflicht); die Speicherung der Entscheidung auf Ihrem Gerät ist
              nach § 25 Abs. 2 Nr. 2 TDDDG zulässig. Weitere Informationen:{" "}
              <ExternalLink href="https://policies.google.com/privacy">Datenschutzerklärung von Google</ExternalLink>.
            </p>
            <p>
              Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft ändern oder widerrufen:{" "}
              <ConsentSettingsButton className="font-medium text-brand-700 underline" />.
            </p>
          </>
        ) : (
          <p>
            Wir setzen keine Cookies oder vergleichbaren Technologien ein, die einer Einwilligung
            bedürfen. Daher wird auch kein Cookie-Banner angezeigt.
          </p>
        )}
      </LegalSection>

      {adsActive ? (
        <LegalSection id="google-adsense" title={`${num()} Werbung mit Google AdSense`}>
          <p>
            Zur Finanzierung des kostenlosen Angebots binden wir Werbeanzeigen über Google AdSense ein,
            einen Dienst der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland.
            Anzeigen sind als „Anzeige“ gekennzeichnet.
          </p>
          <p>
            Google und seine Partner können Cookies und ähnliche Technologien einsetzen, um Anzeigen
            auszuliefern, ihre Wirkung zu messen, Betrug zu verhindern und – sofern Sie eingewilligt
            haben – personalisierte Anzeigen auf Grundlage Ihrer Interessen anzuzeigen. Dabei können
            insbesondere IP-Adresse, Geräte- und Browserinformationen, die aufgerufene Seite sowie
            Kennungen verarbeitet werden. Welche Zwecke und Anbieter Sie zulassen, legen Sie in der
            Einwilligungsverwaltung fest (IAB TCF).
          </p>
          <p>
            Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG).
            Google ist für bestimmte Verarbeitungen eigenständig bzw. gemeinsam mit uns verantwortlich.
            Eine Übermittlung in die USA ist möglich; Google LLC ist unter dem EU-U.S. Data Privacy
            Framework zertifiziert. Informationen:{" "}
            <ExternalLink href="https://policies.google.com/technologies/partner-sites">
              Wie Google Daten von Websites verwendet
            </ExternalLink>
            ,{" "}
            <ExternalLink href="https://policies.google.com/technologies/ads">Werbung bei Google</ExternalLink>,{" "}
            <ExternalLink href="https://myadcenter.google.com/">Mein Werbecenter (Einstellungen für Google-Werbung)</ExternalLink>.
          </p>
        </LegalSection>
      ) : null}

      <LegalSection id="drittland" title={`${num()} Übermittlung in Drittländer`}>
        <p>
          Der Betreiber hat seinen Sitz in Lahore, Pakistan. Wenn Sie ihn per E-Mail oder künftig über ein
          Kontaktformular kontaktieren, werden die von Ihnen übermittelten Daten deshalb grundsätzlich
          auch in Pakistan verarbeitet. Für Pakistan besteht kein Angemessenheitsbeschluss der
          EU-Kommission. Die für diese Übermittlung einschlägige Rechtsgrundlage, geeignete Garantien
          und gegebenenfalls ergänzende Schutzmaßnahmen müssen vor dem öffentlichen Betrieb fachlich
          geprüft und anschließend hier konkret beschrieben werden.
        </p>
        <p>
          Soweit künftig weitere Anbieter außerhalb von EU und EWR eingesetzt werden, werden deren
          Empfängerland, Rolle, Übermittlungsgrundlage und Schutzmaßnahmen dienstbezogen in dieser
          Erklärung ergänzt. Eine bloße Zertifizierung einer Consent-Plattform ersetzt diese Prüfung nicht.
        </p>
      </LegalSection>

      <LegalSection id="speicherdauer" title={`${num()} Speicherdauer`}>
        <p>
          Wir speichern personenbezogene Daten nur so lange, wie es für den jeweiligen Zweck
          erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen. Danach werden die Daten
          gelöscht oder, wenn eine Löschung nicht möglich ist, gesperrt.
        </p>
      </LegalSection>

      <LegalSection id="rechte" title={`${num()} Ihre Rechte`}>
        <p>Ihnen stehen nach der DSGVO folgende Rechte zu:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Auskunft über die verarbeiteten Daten (Art. 15 DSGVO)</li>
          <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
          <li>Löschung (Art. 17 DSGVO) und Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
          <li>
            Beschwerde bei einer Datenschutz-Aufsichtsbehörde (Art. 77 DSGVO), insbesondere in dem
            Mitgliedstaat Ihres Aufenthaltsorts, Ihres Arbeitsplatzes oder des Orts des mutmaßlichen
            Verstoßes.
          </li>
        </ul>
        {operator.supervisoryAuthority ? (
          <p>
            Zusätzlich können Sie sich an{" "}
            <ExternalLink href={operator.supervisoryAuthority.url}>{operator.supervisoryAuthority.name}</ExternalLink> wenden.
          </p>
        ) : null}
        <p>Zur Ausübung Ihrer Rechte genügt eine formlose Nachricht an die oben genannten Kontaktdaten.</p>
      </LegalSection>

      <LegalSection id="widerspruch" title={`${num()} Widerspruchsrecht nach Art. 21 DSGVO`}>
        <div className="rounded-lg border-2 border-slate-300 bg-slate-50 p-4">
          <p className="font-semibold text-slate-900">
            Soweit wir Ihre Daten auf Grundlage berechtigter Interessen (Art. 6 Abs. 1 lit. f DSGVO)
            verarbeiten, haben Sie das Recht, aus Gründen, die sich aus Ihrer besonderen Situation
            ergeben, jederzeit Widerspruch gegen diese Verarbeitung einzulegen. Wir verarbeiten die
            Daten dann nicht mehr, es sei denn, wir können zwingende schutzwürdige Gründe nachweisen,
            die Ihre Interessen, Rechte und Freiheiten überwiegen, oder die Verarbeitung dient der
            Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen.
          </p>
          {adsActive ? (
            <p className="mt-2 font-semibold text-slate-900">
              Werden Daten zum Zweck der Direktwerbung verarbeitet, können Sie dieser Verarbeitung
              jederzeit ohne Angabe von Gründen widersprechen.
            </p>
          ) : null}
        </div>
      </LegalSection>

      <LegalSection id="pflicht" title={`${num()} Bereitstellung der Daten und automatisierte Entscheidungen`}>
        <p>
          Sie sind weder gesetzlich noch vertraglich verpflichtet, uns personenbezogene Daten
          bereitzustellen. Ohne die technisch notwendigen Verbindungsdaten kann die Website allerdings
          nicht ausgeliefert werden. Eine automatisierte Entscheidungsfindung einschließlich Profiling
          im Sinne von Art. 22 DSGVO findet durch uns nicht statt.
        </p>
      </LegalSection>

      <LegalSection id="aenderungen" title={`${num()} Änderungen dieser Datenschutzerklärung`}>
        <p>
          Wir passen diese Datenschutzerklärung an, wenn sich die Datenverarbeitung ändert, zum
          Beispiel bei der Einführung neuer Dienste. Es gilt die jeweils hier veröffentlichte Fassung.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
