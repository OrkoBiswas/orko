"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, LoaderCircle } from "lucide-react";

type FormData = {
  pathway: "contact" | "brief";
  name: string;
  email: string;
  company: string;
  phone: string;
  country: string;
  timezone: string;
  communication: string;
  projectType: string;
  goals: string[];
  deliverables: string[];
  materials: string[];
  style: string[];
  timeline: string;
  budget: string;
  details: string;
  consent: boolean;
  website: string;
};

const choices = {
  projectType: ["Video editing", "2D motion graphics", "Graphic design", "Social media design", "Advertisement creative", "YouTube content", "Other"],
  goals: ["Promote a product", "Build brand awareness", "Explain a service", "Increase engagement", "Launch a campaign", "Improve existing content", "Create a professional portfolio", "Other"],
  deliverables: ["Main video", "Short cutdowns", "Vertical edits", "Motion graphics", "Social assets", "Poster", "Thumbnail system", "Presentation visuals"],
  materials: ["Raw footage", "Script", "Voiceover", "Brand guidelines", "Logo", "Images", "Music", "Previous design", "No materials yet"],
  style: ["Cinematic", "Corporate", "Energetic", "Minimal", "Luxury", "Playful", "Educational", "Social-first", "Custom"],
  timeline: ["Urgent", "Within one week", "Two to four weeks", "One to two months", "Flexible"],
  budget: ["Under $500", "$500–$1,500", "$1,500–$3,500", "$3,500–$7,500", "$7,500+", "Prefer not to say yet"],
};

const initial = (mode: "contact" | "brief"): FormData => ({
  pathway: mode,
  name: "", email: "", company: "", phone: "", country: "", timezone: "", communication: "Email",
  projectType: "", goals: [], deliverables: [], materials: [], style: [], timeline: "", budget: "", details: "", consent: false, website: "",
});

function ChoiceGrid({ options, value, multiple = false, onChange }: { name: string; options: string[]; value: string | string[]; multiple?: boolean; onChange: (value: string | string[]) => void }) {
  function selected(option: string) { return Array.isArray(value) ? value.includes(option) : value === option; }
  function choose(option: string) {
    if (!multiple) return onChange(option);
    const values = Array.isArray(value) ? value : [];
    onChange(values.includes(option) ? values.filter((item) => item !== option) : [...values, option]);
  }
  return <div className="choice-grid">{options.map((option) => <button type="button" className={selected(option) ? "is-selected" : ""} aria-pressed={selected(option)} key={option} onClick={() => choose(option)}><span>{selected(option) && <Check aria-hidden="true" />}</span>{option}</button>)}</div>;
}

export function InquiryForm({ mode }: { mode: "contact" | "brief" }) {
  const totalSteps = mode === "brief" ? 9 : 1;
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(() => initial(mode));
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");

  const progress = useMemo(() => ((step + 1) / totalSteps) * 100, [step, totalSteps]);
  function update<K extends keyof FormData>(key: K, value: FormData[K]) { setData((current) => ({ ...current, [key]: value })); setError(""); }

  function validateStep() {
    if (mode === "contact") {
      if (!data.name.trim() || !data.email.includes("@") || !data.projectType || !data.timeline || !data.budget || data.details.trim().length < 20 || !data.consent) {
        setError("Complete the required fields, add a little more project detail, and confirm consent.");
        return false;
      }
      return true;
    }
    const valid = [
      Boolean(data.projectType),
      data.goals.length > 0,
      data.deliverables.length > 0,
      data.materials.length > 0,
      data.style.length > 0,
      Boolean(data.timeline),
      Boolean(data.budget),
      Boolean(data.name.trim() && data.email.includes("@") && data.details.trim().length >= 20 && data.consent),
      true,
    ][step];
    if (!valid) setError("Choose at least one option or complete the required information before continuing.");
    return valid;
  }

  function next() { if (validateStep()) { setStep((value) => Math.min(value + 1, totalSteps - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); } }
  function back() { setError(""); setStep((value) => Math.max(value - 1, 0)); }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!validateStep()) return;
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json() as { ok: boolean; message?: string; reference?: string };
      if (!response.ok || !result.ok) throw new Error(result.message || "The inquiry could not be submitted.");
      setReference(result.reference ?? "");
      setMessage(result.message ?? "Your inquiry is safely recorded.");
      setStatus("success");
    } catch (submitError) {
      setMessage(submitError instanceof Error ? submitError.message : "The inquiry could not be submitted safely.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return <div className="form-success" role="status"><span><Check aria-hidden="true" /></span><p className="eyebrow">Inquiry recorded</p><h2>{reference}</h2><p>{message}</p><button className="button button-light" type="button" onClick={() => { setData(initial(mode)); setStep(0); setStatus("idle"); }}>Send another inquiry</button></div>;
  }

  return (
    <form className={`inquiry-form mode-${mode}`} onSubmit={submit} noValidate>
      {mode === "brief" && <div className="form-progress" aria-label={`Step ${step + 1} of ${totalSteps}`}><div><span>Step {String(step + 1).padStart(2, "0")}</span><span>{String(totalSteps).padStart(2, "0")}</span></div><span><i style={{ width: `${progress}%` }} /></span></div>}
      <label className="honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={data.website} onChange={(event) => update("website", event.target.value)} /></label>

      {mode === "brief" && step === 0 && <section className="form-step"><p className="eyebrow">Project type</p><h2>What are we making?</h2><p>Choose the closest starting point. The scope can evolve together.</p><ChoiceGrid name="projectType" options={choices.projectType} value={data.projectType} onChange={(value) => update("projectType", value as string)} /></section>}
      {mode === "brief" && step === 1 && <section className="form-step"><p className="eyebrow">Goals</p><h2>What should the work change?</h2><p>Select everything that matters. This gives the creative direction a reason to exist.</p><ChoiceGrid name="goals" multiple options={choices.goals} value={data.goals} onChange={(value) => update("goals", value as string[])} /></section>}
      {mode === "brief" && step === 2 && <section className="form-step"><p className="eyebrow">Deliverables</p><h2>What needs to leave the studio?</h2><p>Pick the known formats. Exact specs can be confirmed after discovery.</p><ChoiceGrid name="deliverables" multiple options={choices.deliverables} value={data.deliverables} onChange={(value) => update("deliverables", value as string[])} /></section>}
      {mode === "brief" && step === 3 && <section className="form-step"><p className="eyebrow">Existing materials</p><h2>What do you already have?</h2><p>No materials yet is a perfectly useful answer.</p><ChoiceGrid name="materials" multiple options={choices.materials} value={data.materials} onChange={(value) => update("materials", value as string[])} /></section>}
      {mode === "brief" && step === 4 && <section className="form-step"><p className="eyebrow">Style direction</p><h2>What should it feel like?</h2><p>These are signals, not rigid boxes. Select the useful tension.</p><ChoiceGrid name="style" multiple options={choices.style} value={data.style} onChange={(value) => update("style", value as string[])} /></section>}
      {mode === "brief" && step === 5 && <section className="form-step"><p className="eyebrow">Timeline</p><h2>When does it need to move?</h2><ChoiceGrid name="timeline" options={choices.timeline} value={data.timeline} onChange={(value) => update("timeline", value as string)} /></section>}
      {mode === "brief" && step === 6 && <section className="form-step"><p className="eyebrow">Budget</p><h2>What range should guide the solution?</h2><p>A range helps shape a realistic approach. You can also leave it open for now.</p><ChoiceGrid name="budget" options={choices.budget} value={data.budget} onChange={(value) => update("budget", value as string)} /></section>}

      {((mode === "brief" && step === 7) || mode === "contact") && <section className="form-step contact-fields"><p className="eyebrow">{mode === "brief" ? "Your details" : "Say hello"}</p><h2>{mode === "brief" ? "Who should I reply to?" : "What are you building?"}</h2><div className="field-grid">
        <label>Name *<input required autoComplete="name" value={data.name} onChange={(event) => update("name", event.target.value)} /></label>
        <label>Email *<input required type="email" autoComplete="email" value={data.email} onChange={(event) => update("email", event.target.value)} /></label>
        <label>Company<input autoComplete="organization" value={data.company} onChange={(event) => update("company", event.target.value)} /></label>
        <label>Phone, optional<input autoComplete="tel" value={data.phone} onChange={(event) => update("phone", event.target.value)} /></label>
        {mode === "contact" && <><label>Service needed *<select required value={data.projectType} onChange={(event) => update("projectType", event.target.value)}><option value="">Choose a service</option>{choices.projectType.map((item) => <option key={item}>{item}</option>)}</select></label><label>Timeline *<select required value={data.timeline} onChange={(event) => update("timeline", event.target.value)}><option value="">Choose a timeline</option>{choices.timeline.map((item) => <option key={item}>{item}</option>)}</select></label><label>Budget range *<select required value={data.budget} onChange={(event) => update("budget", event.target.value)}><option value="">Choose a range</option>{choices.budget.map((item) => <option key={item}>{item}</option>)}</select></label></>}
        {mode === "brief" && <><label>Country<input autoComplete="country-name" value={data.country} onChange={(event) => update("country", event.target.value)} /></label><label>Timezone<input placeholder="e.g. GMT+6" value={data.timezone} onChange={(event) => update("timezone", event.target.value)} /></label><label>Preferred contact<select value={data.communication} onChange={(event) => update("communication", event.target.value)}><option>Email</option><option>Phone</option><option>Video call</option></select></label></>}
      </div><label className="field-wide">Project details *<textarea required rows={7} minLength={20} value={data.details} onChange={(event) => update("details", event.target.value)} placeholder="The context, audience, what is working, what is not, and what a strong result would feel like…" /><span>{data.details.length}/5000</span></label><label className="consent"><input type="checkbox" checked={data.consent} onChange={(event) => update("consent", event.target.checked)} /><span>I agree that these details can be stored and used to respond to this inquiry. *</span></label></section>}

      {mode === "brief" && step === 8 && <section className="form-step summary-step"><p className="eyebrow">Review</p><h2>One last look.</h2><div className="summary-grid"><div><span>Project</span><p>{data.projectType}</p><button type="button" onClick={() => setStep(0)}>Edit</button></div><div><span>Goals</span><p>{data.goals.join(", ")}</p><button type="button" onClick={() => setStep(1)}>Edit</button></div><div><span>Deliverables</span><p>{data.deliverables.join(", ")}</p><button type="button" onClick={() => setStep(2)}>Edit</button></div><div><span>Timeline / budget</span><p>{data.timeline} · {data.budget}</p><button type="button" onClick={() => setStep(5)}>Edit</button></div><div><span>Contact</span><p>{data.name}<br />{data.email}</p><button type="button" onClick={() => setStep(7)}>Edit</button></div><div><span>Details</span><p>{data.details}</p><button type="button" onClick={() => setStep(7)}>Edit</button></div></div></section>}

      {error && <div className="form-error" role="alert">{error}</div>}
      {status === "error" && <div className="form-error" role="alert">{message}</div>}
      <div className="form-actions">
        {mode === "brief" && step > 0 && <button className="button button-ghost" type="button" onClick={back}><ArrowLeft aria-hidden="true" /> Back</button>}
        {mode === "brief" && step < totalSteps - 1 ? <button className="button button-accent" type="button" onClick={next}>Continue <ArrowRight aria-hidden="true" /></button> : <button className="button button-accent" type="submit" disabled={status === "sending"}>{status === "sending" ? <><LoaderCircle className="spin" aria-hidden="true" /> Saving securely…</> : <>Send project brief <ArrowRight aria-hidden="true" /></>}</button>}
      </div>
    </form>
  );
}
