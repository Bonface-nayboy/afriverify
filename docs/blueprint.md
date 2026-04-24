# **App Name**: AfriVerify Hub

## Core Features:

- SaaS Landing Page: A clean and bold landing page for AfriVerify, featuring a hero section, overview of key features (KYC, Fraud, Liveness), step-by-step 'how it works' guide, and a clear call to action for the demo.
- Interactive Dashboard Overview: A dashboard interface providing key metrics such as total verifications, success rate, and fraud alerts. Includes an activity log (mock or API-driven) and quick actions to start demo flows.
- KYC Identity Verification Demo: A step-by-step demo showcasing identity verification. Users can upload ID documents (front/back), capture a selfie via camera or upload, submit data to the backend via /verify-identity, and view results including OCR-extracted data, face match score, liveness score, and final verification status.
- Liveness Detection Demo: An interactive demo for liveness detection, guiding users through a session to capture frames via their camera. The frontend manages sending frames to /submit-liveness-frame and fetching results, displaying instructions, live camera feed, progress indicators, and the final liveness status.
- Face Recognition (Attendance) Demo: A simplified demo for face recognition, allowing users to capture their face via camera. The captured image is sent to the /recognize-face endpoint, and the interface displays the recognized user, confidence score, and timestamp.
- Robust API Client & Backend Connectivity: A centralized API service (lib/api.ts) for seamless interaction with the FastAPI backend, handling various endpoints for enrollment, verification, and liveness. Includes error handling, loading states (spinners, skeletons), and mock fallbacks for demo reliability.
- Dynamic Demo Feedback & Visuals: Enhanced UI/UX features for a compelling demo experience, including visual 'confidence score' bars, clear color-coding for verification results (Green: verified, Yellow: suspicious, Red: failed), and a timeline of verification steps for user feedback.

## Style Guidelines:

- Primary color: A modern, vibrant blue (#1C8AFF) reflecting trust and technological precision, suitable for key actions and branding accents.
- Background color: A very light, desaturated blue (#F0F5FA) providing a clean, spacious canvas that complements the primary blue and maintains visual calm.
- Accent color: A fresh, analogous cyan (#17A9A9) to introduce a dynamic visual contrast and highlight secondary important elements without overpowering the primary palette.
- Body and headline font: 'Inter' (sans-serif) for its modern, neutral, and highly readable characteristics, fitting a data-rich dashboard and aligning with shadcn/ui defaults.
- Use clean, outlined vector icons (e.g., from Lucide or a similar library) that align with a modern, minimalistic aesthetic, consistent with Stripe/Vercel dashboards.
- Implement a minimal, modern UI with generous clean spacing, soft shadows, and consistently rounded corners, inspired by leading SaaS product dashboards like Stripe and Vercel. Ensure full responsiveness across all devices and native dark/light mode support.
- Subtle, professional transitions and animations for state changes (e.g., loading, success, error) to provide clear user feedback and enhance perceived performance, adhering to 'shadcn/ui' principles.