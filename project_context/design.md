# Design System and UI Guidelines

**Status:** Initial visual direction; branding pending\
**Last updated:** 2026-11-06 20:55 IST

## 1. Design goals

Create a calm, professional, trustworthy healthcare experience. It
should feel reassuring, modern, clean, accessible, and easy for patients
of different ages and technical abilities. Avoid generic hospital
templates, clutter, loud gradients, and unsupported medical
imagery/claims.

## 2. Brand direction

No final brand name, logo, or palette has been supplied. Use a temporary
neutral identity and centralize tokens.

Suggested direction: - Deep teal / forest teal as primary - Muted sage
as secondary - Warm off-white background - White surfaces - Deep
charcoal text - Slate-grey secondary text - Restrained semantic
success/warning/error colours

Provisional tokens (validate contrast before production):

``` css
:root {
  --color-primary: #176B63;
  --color-primary-hover: #12574F;
  --color-primary-soft: #E8F3F1;
  --color-secondary: #8BA99B;
  --color-background: #F7F9F8;
  --color-surface: #FFFFFF;
  --color-text: #1F2D2A;
  --color-text-muted: #65736F;
  --color-border: #E1E9E6;
  --color-success: #247A52;
  --color-warning: #A96716;
  --color-danger: #B33A3A;
  --radius-card: 14px;
  --radius-control: 10px;
}
```

## 3. Typography

Recommended font: **Inter**. Fallback:
`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.

Principles: - Readable hierarchy and comfortable line-height. - Avoid
very light weights. - Use tabular numerals for dates, times, fees, and
vitals. - Never make critical medical information tiny.

Suggested scale: - Hero/display: 40--48 px desktop; 32--36 px mobile -
H1: 32--36 px - H2: 24--28 px - H3: 20--22 px - Body: 16 px - Secondary:
14 px - Caption: 12--13 px, not for critical instructions

Weights: 400 body, 500 labels, 600 headings, 700 sparingly.

## 4. Layout and spacing

-   4/8 px spacing scale.
-   Generous whitespace.
-   Consistent alignment/grid.
-   Mobile-first responsive layouts.
-   Public content max width roughly 1120--1240 px.
-   Forms roughly 560--720 px.
-   Dashboard uses stable sidebar on desktop and collapsible navigation
    on smaller screens.
-   Avoid excessive nested cards.

## 5. Patient website

Home page: - Clear hero with approved doctor name/specialization. -
Primary CTA: Book an Appointment. - Secondary CTA: How Online
Consultation Works. - Verified qualification/registration details. -
Clear consultation fee and process. - No unsupported outcome claims or
guarantees.

Booking: 1. Country/timezone 2. Date and slot 3. Patient details 4.
Payment 5. Confirmation

Show patient-local time and IST together, explicit timezone labels,
fee/currency, cancellation terms, payment state, and progress. Preserve
safe form input after validation errors.

Patient portal: - Simple navigation. - Upcoming appointment prominent. -
Previous consultations in chronological list/timeline. - Prescription
downloads clearly labelled. - Never show internal doctor notes.

## 6. Doctor dashboard

Navigation: - Overview - Calendar - Appointments - Patients -
Consultations - Prescriptions - Medicines - Payments - Settings

Use text plus colour for status: Confirmed, Pending payment, Completed,
Cancelled, No-show, Draft, Finalized, Email failed. Never rely on colour
alone.

## 7. Consultation workspace

Prioritize clinical workflow: - Patient identity and appointment summary
at top. - Previous history accessible in panel/tab. - Notes - Vitals -
Prescription builder - Follow-up - Save draft and finalize

Clearly distinguish internal notes. Show units beside measurements. Do
not show fake vitals in production. Warn on unsaved changes. Finalize
action must be distinct and confirmed.

## 8. Prescription PDF

-   White background and printable layout.
-   Doctor/clinic header.
-   Clear patient details.
-   Readable medicine table.
-   Dosage/timing columns must not wrap ambiguously.
-   Vitals with units and `—` for missing.
-   Prescription ID/date.
-   Advice/follow-up.
-   Approved contact/disclaimer.

Do not imitate government forms or imply endorsement. No uploaded
signature in initial scope, subject to compliance review.

## 9. Video application

Minimal interface. Participant video is primary. Clear camera/microphone
controls, connection status, waiting-room state, doctor admission,
end-call action, and visible no-recording statement. No recording
button, recording indicator, or transcript panel.

## 10. Reusable components

Buttons, fields, searchable selects, date picker, timezone selector,
slot cards, status badges, tables, empty/error/loading states,
confirmation dialogs, toasts, patient summary, vitals form, medicine
row, prescription preview, and file download item.

## 11. Interaction

-   Obvious primary actions.
-   Confirm destructive/high-impact actions.
-   Inline actionable validation.
-   Loading states for network actions.
-   Prevent duplicate submissions.
-   Clear payment pending/success/failure.
-   Never claim success until server confirms.
-   Avoid optimistic UI for payments or prescription finalization.
-   Keyboard navigation and visible focus.

## 12. Accessibility

Aim for WCAG 2.2 AA: contrast, keyboard access, focus indicators,
labels, clear errors, screen-reader semantics, no colour-only status,
reduced-motion support, and responsive reflow/zoom.

## 13. Imagery and content

Use actual doctor/clinic imagery only after approval. Do not use fake
doctor portraits as if they depict the practitioner. Avoid cure
guarantees and unsupported claims. Verify image licenses.

## 14. Pending design approvals

Brand name, logo, approved doctor photo, final palette, qualifications
wording, contact details, prescription footer, language support, and
content tone. Use clearly marked placeholders until supplied.
