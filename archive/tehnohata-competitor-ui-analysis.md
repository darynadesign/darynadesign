# Tehnohata Competitor UI Analysis Archive

Removed from the live Tehnohata case page on 2026-06-09. Keep this here in case the section needs to be restored later.

## HTML

```html
<!-- COMPETITOR UI ANALYSIS -->
<section class="case-competitor">
  <div class="case-competitor-top reveal-block">
    <div class="case-overview-label">
      <span class="case-label-dot"></span>
      <span>COMPETITOR UI ANALYSIS</span>
    </div>
    <p class="case-competitor-desc">
      I&nbsp;began by&nbsp;analysing competitor websites to&nbsp;understand
      how they structure user flows and present products. This helped identify
      both best practices and areas for improvement.
    </p>
  </div>
  <div class="case-competitor-cards">
    <div class="case-competitor-card">
      <div class="case-competitor-card-img">
        <img src="assets/Tehno/card%201.webp" alt="Competitor card 1" />
      </div>
      <p class="case-competitor-card-label">
        Not enough padding
        <span class="case-competitor-arrow">→</span>
        hard to scan
      </p>
    </div>
    <div class="case-competitor-card">
      <div class="case-competitor-card-img">
        <img src="assets/Tehno/card%202.webp" alt="Competitor card 2" />
      </div>
      <p class="case-competitor-card-label">
        Poor spacing in specs
        <span class="case-competitor-arrow">→</span>
        hard to read
      </p>
    </div>
    <div class="case-competitor-card">
      <div class="case-competitor-card-img">
        <img src="assets/Tehno/card%203.webp" alt="Competitor card 3" />
      </div>
      <p class="case-competitor-card-label">
        All info on the right
        <span class="case-competitor-arrow">→</span>
        too many CTA's
      </p>
    </div>
    <div class="case-competitor-card">
      <div class="case-competitor-card-img">
        <img src="assets/Tehno/card%204.webp" alt="Competitor card 4" />
      </div>
      <p class="case-competitor-card-label">
        Short checkout form
        <span class="case-competitor-arrow">→</span>
        faster to fill
      </p>
    </div>
    <div class="case-competitor-card">
      <div class="case-competitor-card-img">
        <img src="assets/Tehno/card%205.webp" alt="Competitor card 5" />
      </div>
      <p class="case-competitor-card-label">
        Multi-step form
        <span class="case-competitor-arrow">→</span>
        more drop off points
      </p>
    </div>
    <div class="case-competitor-card">
      <div class="case-competitor-card-img">
        <img src="assets/Tehno/card%206.webp" alt="Competitor card 6" />
      </div>
      <p class="case-competitor-card-label">
        Visual clutter
        <span class="case-competitor-arrow">→</span>
        CTA isn't clear
      </p>
    </div>
    <div class="case-competitor-card">
      <div class="case-competitor-card-img">
        <img src="assets/Tehno/card%207.webp" alt="Competitor card 7" />
      </div>
      <p class="case-competitor-card-label">
        Key info &amp; CTA fixed
        <span class="case-competitor-arrow">→</span>
        quick access
      </p>
    </div>
    <div class="case-competitor-card">
      <div class="case-competitor-card-img">
        <img src="assets/Tehno/card%208.webp" alt="Competitor card 8" />
      </div>
      <p class="case-competitor-card-label">
        Good spacing, less info
        <span class="case-competitor-arrow">→</span>
        easy to scan
      </p>
    </div>
    <div class="case-competitor-card">
      <div class="case-competitor-card-img">
        <img src="assets/Tehno/card%209.webp" alt="Competitor card 9" />
      </div>
      <p class="case-competitor-card-label">
        No "Place Order" CTA until form filled out
        <span class="case-competitor-arrow">→</span>
        user can't see the end goal
      </p>
    </div>
    <div class="case-competitor-card">
      <div class="case-competitor-card-img">
        <img src="assets/Tehno/card%2010.webp" alt="Competitor card 10" />
      </div>
      <p class="case-competitor-card-label">
        Chaotic form layout
        <span class="case-competitor-arrow">→</span>
        can miss sections
      </p>
    </div>
  </div>
  <div class="case-competitor-takeaways">
    <p class="case-competitor-takeaways-label">KEY TAKEAWAYS</p>
    <div class="case-competitor-takeaways-grid">
      <div class="case-competitor-takeaway">
        <p class="case-competitor-takeaway-num">/01</p>
        <p>
          Product card needs to&nbsp;be&nbsp;clean, easy to&nbsp;scan, and not
          overloaded; additional specs presented on&nbsp;hover.
        </p>
      </div>
      <div class="case-competitor-takeaway">
        <p class="case-competitor-takeaway-num">/02</p>
        <p>
          Product page needs to&nbsp;have key info like price, name, and CTA
          fixed and accessible while scrolling.
        </p>
      </div>
      <div class="case-competitor-takeaway">
        <p class="case-competitor-takeaway-num">/03</p>
        <p>
          Simple checkout forms should show all steps at&nbsp;once&nbsp;—
          it&nbsp;reduces clicks &amp;&nbsp;feels easier to&nbsp;complete.
        </p>
      </div>
    </div>
  </div>
</section>
```

## CSS

```css
/* ---- Competitor UI Analysis ---- */

.case-competitor {
  background: #f5f2f3;
  color: var(--black);
  padding: 24px var(--margin) 72px;
}

.case-competitor-top {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 560px;
}

.case-competitor-desc {
  font-family: var(--font);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.2;
  opacity: 0.6;
}

.case-competitor-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 48px;
}

.case-competitor-card {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
}

@media (min-width: 1024px) {
  .case-competitor {
    padding-bottom: 120px;
  }

  .case-competitor-cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    max-width: calc(254px * 5 + 12px * 4);
    margin-left: auto;
    margin-right: auto;
    margin-top: 100px;
  }

  .case-competitor-card {
    width: 254px;
    height: 317px;
    gap: 0;
  }
}

.case-competitor-card-img {
  border-radius: 4px;
  overflow: hidden;
}

.case-competitor-card-img img {
  display: block;
  width: 100%;
  height: auto;
}

.case-competitor-card-label {
  font-family: var(--font);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.2;
}

.case-competitor-arrow {
  opacity: 0.4;
}

.case-competitor-takeaways {
  margin-top: 80px;
  max-width: 1318px;
  margin-left: auto;
  margin-right: auto;
}

.case-competitor-takeaways-label {
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 400;
  text-transform: uppercase;
}

.case-competitor-takeaways-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 40px;
}

.case-competitor-takeaway {
  border-left: 1px solid rgba(0, 0, 0, 0.2);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 13px;
  font-family: var(--font);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.2;
  opacity: 0.8;
}

.case-competitor-takeaway-num {
  text-transform: uppercase;
  opacity: 0.5;
}

@media (min-width: 768px) {
  .case-competitor-takeaways-grid {
    flex-direction: row;
  }

  .case-competitor-takeaway {
    flex: 1;
  }
}
```
