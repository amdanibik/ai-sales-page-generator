import { SalesPageContent } from "@/types";

export function generateHtmlExport(
  productName: string,
  content: SalesPageContent,
  template: string
): string {
  const styles = getTemplateStyles(template);
  const body = getTemplateBody(productName, content, template);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${productName} — Sales Page</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
    .text-center { text-align: center; }
    ${styles}
  </style>
</head>
<body>
  ${body}
</body>
</html>`;
}

function getTemplateStyles(template: string): string {
  if (template === "bold") {
    return `
    body { background: #0f172a; color: #f8fafc; }
    .hero { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 80px 0; border-bottom: 2px solid #f59e0b; }
    .hero h1 { font-size: 3.5rem; font-weight: 900; color: #f59e0b; line-height: 1.1; margin-bottom: 24px; }
    .hero p { font-size: 1.25rem; color: #94a3b8; margin-bottom: 32px; }
    .btn-primary { background: #f59e0b; color: #0f172a; padding: 16px 40px; border-radius: 8px; font-weight: 800; font-size: 1.1rem; text-decoration: none; display: inline-block; border: none; cursor: pointer; margin: 8px; }
    .btn-secondary { background: transparent; color: #f59e0b; padding: 14px 40px; border-radius: 8px; font-weight: 700; font-size: 1rem; text-decoration: none; display: inline-block; border: 2px solid #f59e0b; cursor: pointer; margin: 8px; }
    .section { padding: 80px 0; }
    .section-alt { background: #1e293b; }
    .section h2 { font-size: 2.5rem; font-weight: 800; color: #f8fafc; margin-bottom: 16px; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 28px; }
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    @media (max-width: 768px) { .grid-2, .grid-3 { grid-template-columns: 1fr; } .hero h1 { font-size: 2.5rem; } }
    .icon { font-size: 2rem; margin-bottom: 12px; }
    .card h3 { font-size: 1.2rem; font-weight: 700; color: #f8fafc; margin-bottom: 8px; }
    .card p { color: #94a3b8; font-size: 0.95rem; }
    .stars { color: #f59e0b; font-size: 1.2rem; margin-bottom: 12px; }
    .testimonial-author strong { color: #f8fafc; }
    .testimonial-author span { color: #64748b; font-size: 0.875rem; }
    .pricing-card { background: linear-gradient(135deg, #f59e0b, #d97706); color: #0f172a; border-radius: 20px; padding: 48px; max-width: 480px; margin: 0 auto; }
    .price { font-size: 4rem; font-weight: 900; margin-bottom: 4px; }
    .period { font-size: 1rem; opacity: 0.7; margin-bottom: 24px; }
    .includes li { list-style: none; padding: 8px 0; font-weight: 600; }
    .includes li::before { content: "✓ "; }
    .guarantee { margin-top: 16px; font-size: 0.875rem; opacity: 0.8; }
    .final-cta { background: #f59e0b; padding: 80px 0; text-align: center; }
    .final-cta h2 { font-size: 2.5rem; font-weight: 800; color: #0f172a; margin-bottom: 16px; }
    `;
  }
  if (template === "classic") {
    return `
    body { background: #fff; color: #1a1a1a; }
    .hero { background: linear-gradient(180deg, #dc2626 0%, #b91c1c 100%); padding: 80px 0; }
    .hero h1 { font-size: 3rem; font-weight: 900; color: #fff; margin-bottom: 24px; }
    .hero p { font-size: 1.2rem; color: #fca5a5; margin-bottom: 32px; }
    .btn-primary { background: #fff; color: #dc2626; padding: 16px 40px; border-radius: 4px; font-weight: 800; font-size: 1.1rem; text-decoration: none; display: inline-block; border: none; cursor: pointer; margin: 8px; }
    .btn-secondary { background: transparent; color: #fff; padding: 14px 40px; border-radius: 4px; font-weight: 700; font-size: 1rem; text-decoration: none; display: inline-block; border: 2px solid #fff; cursor: pointer; margin: 8px; }
    .section { padding: 72px 0; border-bottom: 1px solid #e5e7eb; }
    .section-alt { background: #f9fafb; }
    .section h2 { font-size: 2.2rem; font-weight: 800; color: #1a1a1a; margin-bottom: 16px; }
    .card { border: 1px solid #e5e7eb; border-radius: 6px; padding: 24px; }
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    @media (max-width: 768px) { .grid-2, .grid-3 { grid-template-columns: 1fr; } .hero h1 { font-size: 2rem; } }
    .icon { font-size: 1.8rem; margin-bottom: 10px; }
    .card h3 { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; }
    .card p { color: #4b5563; font-size: 0.9rem; }
    .stars { color: #f59e0b; font-size: 1.2rem; margin-bottom: 12px; }
    .testimonial-author strong { color: #1a1a1a; display: block; }
    .testimonial-author span { color: #6b7280; font-size: 0.875rem; }
    .pricing-card { border: 3px solid #dc2626; border-radius: 8px; padding: 48px; max-width: 480px; margin: 0 auto; text-align: center; }
    .price { font-size: 4rem; font-weight: 900; color: #dc2626; margin-bottom: 4px; }
    .period { font-size: 1rem; color: #6b7280; margin-bottom: 24px; }
    .includes li { list-style: none; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .includes li::before { content: "✓ "; color: #dc2626; font-weight: 700; }
    .guarantee { margin-top: 16px; font-size: 0.875rem; color: #6b7280; }
    .final-cta { background: #dc2626; padding: 72px 0; text-align: center; }
    .final-cta h2 { font-size: 2.5rem; font-weight: 800; color: #fff; margin-bottom: 16px; }
    `;
  }
  // modern (default)
  return `
    body { background: #fff; color: #1a1a1a; }
    .hero { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%); padding: 96px 0; }
    .hero h1 { font-size: 3.5rem; font-weight: 800; color: #fff; line-height: 1.1; margin-bottom: 24px; }
    .hero p { font-size: 1.25rem; color: #c7d2fe; margin-bottom: 36px; }
    .btn-primary { background: #fff; color: #4f46e5; padding: 16px 40px; border-radius: 50px; font-weight: 800; font-size: 1.1rem; text-decoration: none; display: inline-block; border: none; cursor: pointer; margin: 8px; }
    .btn-secondary { background: transparent; color: #fff; padding: 14px 40px; border-radius: 50px; font-weight: 700; font-size: 1rem; text-decoration: none; display: inline-block; border: 2px solid #fff; cursor: pointer; margin: 8px; }
    .section { padding: 88px 0; }
    .section-alt { background: #f8fafc; }
    .section-indigo { background: #eef2ff; }
    .section h2 { font-size: 2.5rem; font-weight: 800; color: #0f172a; margin-bottom: 16px; }
    .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    @media (max-width: 768px) { .grid-2, .grid-3 { grid-template-columns: 1fr; } .hero h1 { font-size: 2.5rem; } }
    .icon { font-size: 2rem; margin-bottom: 12px; }
    .card h3 { font-size: 1.15rem; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
    .card p { color: #64748b; font-size: 0.95rem; line-height: 1.6; }
    .stars { color: #f59e0b; font-size: 1.2rem; margin-bottom: 12px; }
    .testimonial-author strong { color: #0f172a; display: block; }
    .testimonial-author span { color: #94a3b8; font-size: 0.875rem; }
    .pricing-card { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #fff; border-radius: 24px; padding: 48px; max-width: 480px; margin: 0 auto; text-align: center; }
    .price { font-size: 4rem; font-weight: 800; margin-bottom: 4px; }
    .period { font-size: 1rem; opacity: 0.7; margin-bottom: 24px; }
    .includes { list-style: none; text-align: left; margin-bottom: 32px; }
    .includes li { padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.15); }
    .includes li::before { content: "✓ "; color: #a3e635; font-weight: 700; }
    .guarantee { margin-top: 16px; font-size: 0.875rem; opacity: 0.75; }
    .final-cta { background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 88px 0; text-align: center; }
    .final-cta h2 { font-size: 2.5rem; font-weight: 800; color: #fff; margin-bottom: 16px; }
  `;
}

function getTemplateBody(
  productName: string,
  content: SalesPageContent,
  template: string
): string {
  const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);
  const ctaBg = template === "bold" ? "#f59e0b" : template === "classic" ? "#dc2626" : "#fff";
  const ctaColor = template === "bold" ? "#0f172a" : template === "classic" ? "#dc2626" : "#4f46e5";
  const btnClass = `style="background:${ctaBg};color:${ctaColor};padding:16px 48px;border-radius:${template === "classic" ? "4px" : "50px"};font-weight:800;font-size:1.1rem;text-decoration:none;display:inline-block;border:none;cursor:pointer;"`;

  return `
  <section class="hero">
    <div class="container text-center">
      <h1>${content.headline}</h1>
      <p>${content.subHeadline}</p>
      <div>
        <a href="#pricing" ${btnClass}>${content.cta.primary}</a>
        <a href="#features" class="btn-secondary">${content.cta.secondary}</a>
      </div>
      ${content.cta.urgency ? `<p style="margin-top:16px;opacity:0.75;font-size:0.9rem;">${content.cta.urgency}</p>` : ""}
    </div>
  </section>

  <section class="section">
    <div class="container" style="max-width:800px;">
      ${content.productDescription
        .split("\n\n")
        .map((p) => `<p style="font-size:1.1rem;line-height:1.8;color:#4b5563;margin-bottom:20px;">${p}</p>`)
        .join("")}
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <h2 class="text-center">Why Choose ${productName}?</h2>
      <p class="text-center" style="color:#64748b;margin-bottom:48px;">Everything you need to succeed</p>
      <div class="grid-2">
        ${content.benefits
          .map(
            (b) => `
        <div class="card">
          <div class="icon">${b.icon}</div>
          <h3>${b.title}</h3>
          <p>${b.description}</p>
        </div>`
          )
          .join("")}
      </div>
    </div>
  </section>

  <section class="section" id="features">
    <div class="container">
      <h2 class="text-center">Everything You Need</h2>
      <p class="text-center" style="color:#64748b;margin-bottom:48px;">Packed with powerful features</p>
      <div class="grid-3">
        ${content.features
          .map(
            (f) => `
        <div class="card">
          <div class="icon">${f.icon}</div>
          <h3>${f.title}</h3>
          <p>${f.description}</p>
        </div>`
          )
          .join("")}
      </div>
    </div>
  </section>

  <section class="section section-indigo">
    <div class="container">
      <h2 class="text-center">What Our Customers Say</h2>
      <p class="text-center" style="color:#64748b;margin-bottom:48px;">Join thousands of satisfied customers</p>
      <div class="grid-3">
        ${content.socialProof
          .map(
            (t) => `
        <div class="card">
          <div class="stars">${stars(t.rating)}</div>
          <p style="font-style:italic;margin-bottom:16px;">"${t.quote}"</p>
          <div class="testimonial-author">
            <strong>${t.name}</strong>
            <span>${t.role}, ${t.company}</span>
          </div>
        </div>`
          )
          .join("")}
      </div>
    </div>
  </section>

  <section class="section" id="pricing">
    <div class="container">
      <h2 class="text-center">Simple, Transparent Pricing</h2>
      <p class="text-center" style="color:#64748b;margin-bottom:48px;">${content.pricing.description}</p>
      <div class="pricing-card">
        <div class="price">${content.pricing.price}</div>
        <div class="period">${content.pricing.period}</div>
        <ul class="includes">
          ${content.pricing.includes.map((i) => `<li>${i}</li>`).join("")}
        </ul>
        <a href="#" ${btnClass}>${content.cta.primary}</a>
        ${content.pricing.guarantee ? `<p class="guarantee">🔒 ${content.pricing.guarantee}</p>` : ""}
      </div>
    </div>
  </section>

  <section class="final-cta">
    <div class="container">
      <h2>Ready to Get Started?</h2>
      ${content.cta.urgency ? `<p style="opacity:0.85;margin-bottom:24px;">${content.cta.urgency}</p>` : ""}
      <a href="#pricing" ${btnClass}>${content.cta.primary}</a>
    </div>
  </section>`;
}
