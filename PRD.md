# Product Requirements Document (PRD)

## SnifflesHealth - Telemedicine Platform

**Version:** 1.0.1  
**Date:** December 2025  
**Status:** Active Development  
**Product Manager:** [To be assigned]

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Overview](#product-overview)
3. [Target Users](#target-users)
4. [User Journey & Flow](#user-journey--flow)
5. [Feature Requirements](#feature-requirements)
6. [Technical Requirements](#technical-requirements)
7. [Design & UX Requirements](#design--ux-requirements)
8. [Compliance & Security](#compliance--security)
9. [Success Metrics](#success-metrics)
10. [Timeline & Milestones](#timeline--milestones)
11. [Assumptions & Constraints](#assumptions--constraints)

---

## Executive Summary

SnifflesHealth is a HIPAA-compliant telemedicine platform that connects patients with licensed healthcare providers in the United States. The platform enables users to receive medical consultations, prescriptions, and ongoing health management through text, voice, or video consultations—all without requiring insurance.

**Key Value Propositions:**

- Fast consultations (within 15 minutes)
- No insurance required
- Transparent pricing ($25 for text, $40 for voice/video)
- Same-day prescriptions sent directly to local pharmacies
- HIPAA-compliant secure platform
- Licensed doctors in user's state

---

## Product Overview

### Product Vision

To democratize access to quality healthcare by providing fast, affordable, and transparent telemedicine services that eliminate traditional barriers like insurance requirements and long wait times.

### Product Goals

1. **Accessibility**: Make healthcare accessible to anyone, regardless of insurance status
2. **Speed**: Connect patients with doctors within 15 minutes
3. **Transparency**: Clear pricing with no hidden fees
4. **Quality**: Connect users with top licensed doctors in their state
5. **Convenience**: Enable consultations from home with multiple communication options

### Current State

The platform is in active development with a feature-complete frontend implementation. Core user flows are implemented including symptom selection, medical profile creation, doctor matching, consultation, and prescription management.

---

## Target Users

### Primary User Personas

#### 1. **Uninsured Patients**

- **Demographics**: Adults 18-65, no health insurance or high-deductible plans
- **Needs**: Affordable, accessible healthcare for non-emergency conditions
- **Pain Points**: High costs, long wait times, insurance complexity
- **Goals**: Quick, affordable medical advice and prescriptions

#### 2. **Busy Professionals**

- **Demographics**: Working adults 25-50, limited time availability
- **Needs**: Convenient, time-efficient healthcare solutions
- **Pain Points**: Difficulty scheduling appointments, long wait times
- **Goals**: Quick consultations that fit into busy schedules

#### 3. **Rural/Remote Patients**

- **Demographics**: Patients in areas with limited healthcare access
- **Needs**: Access to quality healthcare without travel
- **Pain Points**: Limited local providers, long travel distances
- **Goals**: Quality care from home

#### 4. **Tech-Savvy Health Consumers**

- **Demographics**: Adults comfortable with digital platforms
- **Needs**: Modern, efficient healthcare experience
- **Pain Points**: Outdated healthcare systems, poor user experience
- **Goals**: Seamless digital health management

---

## User Journey & Flow

### Complete User Flow

```
1. Landing Page (Index)
   ↓
2. Symptom Selection (/symptoms)
   ↓
3. Medical Profile Creation (/medical-profile)
   ↓
4. Consultation Summary (/summary)
   ↓
5. Consultation Type Selection (/select-consultation-type)
   ↓
6. Payment Confirmation (/payment-confirmation)
   ↓
7. HIPAA Compliance Agreement (/hipaa-compliance)
   ↓
8. KYC Verification (/kyc)
   ↓
9. Address Details (/address-details)
   ↓
10. Doctor Matching (/finding-doctor)
   ↓
11. Doctor Consultation (/doctor-chat)
   ↓
12. Prescription Viewing (/prescription)
   ↓
13. Dashboard (/dashboard)
```

### Detailed Flow Descriptions

#### Phase 1: Initial Consultation Setup

1. **Landing Page**: User searches by name/keyword or selects health concern category
2. **Symptom Selection**: User selects symptoms from predefined list or adds custom symptoms
3. **Medical Profile**: AI-assisted chat collects medical history (age, sex, weight, height, allergies, chronic conditions, surgical history, social history, family history)
4. **Summary**: Brief transition screen preparing consultation summary

#### Phase 2: Consultation Booking

5. **Consultation Type**: User selects text-based ($25) or voice/video ($40) consultation
6. **Payment**: User confirms payment for selected consultation type
7. **HIPAA Compliance**: User reads and accepts HIPAA privacy policy (must scroll to end)
8. **KYC**: User completes Know Your Customer verification
9. **Address Details**: User provides contact and address information

#### Phase 3: Consultation

10. **Finding Doctor**: System matches user with available doctor (shows loading state)
11. **Doctor Chat**: Real-time consultation with matched doctor via selected communication method
12. **Prescription**: Doctor provides prescription, viewable and downloadable

#### Phase 4: Post-Consultation

13. **Dashboard**: User accesses consultation history, prescriptions, medical profile, and booking management

---

## Feature Requirements

### 1. Landing Page & Search

#### 1.1 Home Page Features

- **FR-1.1.1**: Display hero section with value proposition
- **FR-1.1.2**: Location selector (default: New York) with online status indicator
- **FR-1.1.3**: Search bar with voice input capability
- **FR-1.1.4**: Health concern category cards (Fever and Flu, Skin Issues, Infections, Sexual Health)
- **FR-1.1.5**: HIPAA compliance badges
- **FR-1.1.6**: Features section highlighting key benefits
- **FR-1.1.7**: "What we treat" section with condition list
- **FR-1.1.8**: "What we don't treat" section with exclusions and narcotics policy

**Acceptance Criteria:**

- All health concern cards link to symptom selection page
- Search functionality supports debounced input (300ms delay)
- Location selector shows current location with green status indicator
- All sections are responsive and accessible

### 2. Symptom Selection

#### 2.1 Symptom Selection Features

- **FR-2.1.1**: Display categorized symptom lists (Common symptoms, Stomach & Digestion)
- **FR-2.1.2**: Allow multiple symptom selection via toggle buttons
- **FR-2.1.3**: Custom symptom input field with voice input option
- **FR-2.1.4**: Continue button (enabled when at least one symptom selected)
- **FR-2.1.5**: Step indicator showing progress (e.g., "Step 1 of 4")
- **FR-2.1.6**: Back navigation to home page

**Acceptance Criteria:**

- Selected symptoms persist across navigation
- Custom symptoms can be added and saved
- Minimum one symptom required to proceed
- UI clearly indicates selected vs. unselected symptoms

### 3. Medical Profile Creation

#### 3.1 Medical Profile Features

- **FR-3.1.1**: AI-assisted chat interface for collecting medical information
- **FR-3.1.2**: Real-time medical profile summary panel showing:
  - Personal details (age, sex, weight, height)
  - Allergies
  - Chronic conditions
  - Past surgical history
  - Social history (smoking, alcohol, drug use)
  - Family history
- **FR-3.1.3**: Editable medical data with ability to remove items
- **FR-3.1.4**: "Continue with consultation" button
- **FR-3.1.5**: "I have to share more information" option
- **FR-3.1.6**: Auto-scroll to latest message in chat

**Data Collected:**

- Age and sex assigned at birth
- Height and weight
- Medication allergies
- Chronic medical conditions
- Past surgical procedures
- Social history (smoking, alcohol, illicit drug use)
- Family medical history

**Acceptance Criteria:**

- Chat interface is responsive and accessible
- Medical profile updates in real-time as user provides information
- All data fields are properly validated
- User can edit or remove any medical information
- Profile summary is always visible and scrollable

### 4. Consultation Summary

#### 4.1 Summary Features

- **FR-4.1.1**: Transition screen showing "Preparing your summary..."
- **FR-4.1.2**: Auto-navigation to consultation type selection after 1.5 seconds
- **FR-4.1.3**: Loading spinner during transition

**Acceptance Criteria:**

- Smooth transition between medical profile and consultation type selection
- User can navigate back if needed

### 5. Consultation Type Selection

#### 5.1 Consultation Type Features

- **FR-5.1.1**: Display two consultation type options:
  - Single Text Based Consultation ($25)
  - Voice or Video call consultation ($40)
- **FR-5.1.2**: Visual selection state (border highlight, color change)
- **FR-5.1.3**: Price display for each option
- **FR-5.1.4**: Icon indicators (MessageSquare for text, Video/Mic for voice/video)
- **FR-5.1.5**: "Continue with payment" button

**Acceptance Criteria:**

- Only one consultation type can be selected at a time
- Selected type is clearly indicated visually
- Price is prominently displayed
- User must select a type before proceeding

### 6. Payment Confirmation

#### 6.1 Payment Features

- **FR-6.1.1**: Display selected consultation type and price
- **FR-6.1.2**: Payment processing interface
- **FR-6.1.3**: Confirmation before proceeding to HIPAA compliance

**Acceptance Criteria:**

- Payment amount matches selected consultation type
- Secure payment processing (integration required)
- Clear confirmation of payment status

### 7. HIPAA Compliance

#### 7.1 Compliance Features

- **FR-7.1.1**: Display HIPAA compliance information
- **FR-7.1.2**: Scrollable HIPAA guidelines text
- **FR-7.1.3**: "Accept and Continue" button (disabled until user scrolls to end)
- **FR-7.1.4**: Visual indicator prompting user to scroll to end
- **FR-7.1.5**: Scroll detection to enable accept button

**Acceptance Criteria:**

- User must scroll to bottom of guidelines before accepting
- Accept button is disabled until scroll requirement is met
- Clear visual feedback when scroll requirement is satisfied
- HIPAA text is readable and properly formatted

### 8. KYC Verification

#### 8.1 KYC Features

- **FR-8.1.1**: Identity verification form
- **FR-8.1.2**: Document upload capability
- **FR-8.1.3**: Verification status tracking

**Acceptance Criteria:**

- All required KYC fields are validated
- Document uploads are secure and properly stored
- Verification status is clearly communicated

### 9. Address Details

#### 9.1 Address Features

- **FR-9.1.1**: Contact information form (email, phone)
- **FR-9.1.2**: Address form (address line 1, address line 2, pincode, city)
- **FR-9.1.3**: Form validation
- **FR-9.1.4**: Save and continue functionality

**Acceptance Criteria:**

- All required fields are validated
- Email format validation
- Phone number format validation
- Address data is properly formatted and stored

### 10. Doctor Matching

#### 10.1 Matching Features

- **FR-10.1.1**: Loading state with spinner and "Finding your doctor" message
- **FR-10.1.2**: AI preliminary assessment display panel
- **FR-10.1.3**: Reported symptoms display
- **FR-10.1.4**: Additional information input field
- **FR-10.1.5**: Tabs for AI Summary and Medical Summary
- **FR-10.1.6**: Auto-navigation to doctor chat after matching (3 seconds)

**Doctor Matching Logic:**

- Match based on user's state location
- Consider doctor availability
- Match based on specialty if applicable
- Consider doctor experience and ratings

**Acceptance Criteria:**

- Matching process shows clear loading state
- User can add additional information while waiting
- AI assessment is visible and informative
- Smooth transition to doctor chat upon match

### 11. Doctor Consultation

#### 11.1 Consultation Features

- **FR-11.1.1**: Real-time chat interface with matched doctor
- **FR-11.1.2**: Doctor information display (name, title, specialty, experience, location)
- **FR-11.1.3**: Connection status indicator (green dot for connected)
- **FR-11.1.4**: Message history with timestamps
- **FR-11.1.5**: Chat input with send functionality
- **FR-11.1.6**: AI Summary panel showing:
  - AI preliminary assessment
  - Reported symptoms
  - Tabs for AI Summary and Medical Summary
- **FR-11.1.7**: Prescription link/button when provided by doctor
- **FR-11.1.8**: Auto-scroll to latest message

**Communication Methods:**

- Text-based: Real-time messaging interface
- Voice/Video: Integration with video calling service (to be implemented)

**Acceptance Criteria:**

- Chat messages are sent and received in real-time
- Doctor information is clearly displayed
- Connection status is accurate
- Prescription link appears when doctor provides prescription
- All messages are properly formatted and timestamped

### 12. Prescription Management

#### 12.1 Prescription Features

- **FR-12.1.1**: Display prescription details
- **FR-12.1.2**: Download prescription as PDF
- **FR-12.1.3**: Share prescription functionality
- **FR-12.1.4**: Pharmacy information
- **FR-12.1.5**: Medication details and instructions

**Acceptance Criteria:**

- Prescription is clearly formatted and readable
- Download functionality works correctly
- Pharmacy information is accurate
- All medication details are present

### 13. User Dashboard

#### 13.1 Dashboard Features

- **FR-13.1.1**: Sidebar navigation with:
  - My Dashboard
  - My Consultations
  - My Prescriptions
  - My Medical Profile
  - My Profile
  - Subscriptions
- **FR-13.1.2**: Welcome section with user name
- **FR-13.1.3**: Feature cards:
  - My Consultations
  - My Orders
  - My Medical Profile
  - Subscribe now
- **FR-13.1.4**: My Consultations section:
  - Consultation history cards
  - Status indicators (Completed, In Progress, etc.)
  - Actions: Refill Medicine, Book Consultation, Print Prescription
- **FR-13.1.5**: My Bookings section:
  - Pharmacy pickup information
  - QR code for pickup
  - Medication list
  - Share Receipt functionality
- **FR-13.1.6**: Footer with About Us, Privacy Policy, HIPAA Compliant badge

**Acceptance Criteria:**

- All navigation links work correctly
- Consultation history is accurate and up-to-date
- Booking information is current
- QR codes are scannable
- All action buttons function properly

### 14. Common Features

#### 14.1 Navigation & Layout

- **FR-14.1.1**: Page header with back button, step indicator, and title
- **FR-14.1.2**: App footer on all pages
- **FR-14.1.3**: Logo component (multiple sizes: sm, md, lg)
- **FR-14.1.4**: Consistent step indicators throughout flow

#### 14.2 State Management

- **FR-14.2.1**: Consultation state persistence (symptoms, medical data, AI assessment)
- **FR-14.2.2**: Chat message state management
- **FR-14.2.3**: User profile state management
- **FR-14.2.4**: Doctor selection state management

#### 14.3 Error Handling

- **FR-14.3.1**: Error display components
- **FR-14.3.2**: Loading states for async operations
- **FR-14.3.3**: Form validation and error messages
- **FR-14.3.4**: Network error handling

---

## Technical Requirements

### Technology Stack

#### Frontend

- **Framework**: React 18 with TypeScript
- **Routing**: React Router 6 (SPA mode)
- **Build Tool**: Vite
- **Styling**: TailwindCSS 3
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Form Handling**: React Hook Form (available)
- **Validation**: Zod (available)

#### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Integration**: Integrated with Vite dev server
- **API Prefix**: `/api/`

#### Development Tools

- **Package Manager**: PNPM (preferred)
- **Testing**: Vitest
- **Type Checking**: TypeScript

### Architecture

#### Project Structure

```
client/              # React SPA frontend
├── pages/          # Route components
├── components/     # Reusable components
│   ├── ui/         # UI component library
│   ├── chat/       # Chat components
│   ├── layout/     # Layout components
│   └── common/     # Common components
├── features/       # Feature-based organization
│   ├── consultation/
│   ├── doctor/
│   ├── payment/
│   └── user/
├── stores/         # Zustand state stores
├── hooks/          # Custom React hooks
├── constants/      # App constants
└── lib/            # Utility functions

server/             # Express API backend
├── index.ts       # Server setup
└── routes/        # API route handlers

shared/            # Shared types and utilities
└── types/         # TypeScript type definitions
```

### API Requirements

#### Endpoints (To be implemented)

- `GET /api/ping` - Health check
- `GET /api/demo` - Demo endpoint
- `POST /api/symptoms` - Submit symptoms
- `POST /api/medical-profile` - Save medical profile
- `GET /api/doctors/match` - Match doctor
- `POST /api/consultation/start` - Start consultation
- `GET /api/consultation/:id` - Get consultation details
- `POST /api/consultation/:id/message` - Send message
- `GET /api/prescription/:id` - Get prescription
- `POST /api/payment/process` - Process payment
- `POST /api/user/kyc` - Submit KYC
- `GET /api/user/profile` - Get user profile

### Performance Requirements

- **Page Load Time**: < 2 seconds for initial load
- **Time to Interactive**: < 3 seconds
- **API Response Time**: < 500ms for standard requests
- **Chat Message Delivery**: < 100ms latency
- **Doctor Matching**: < 30 seconds

### Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### Responsive Design

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

---

## Design & UX Requirements

### Design System

#### Color Palette

- **Primary Cyan**: #0891B2, #06B6D4, #164E63, #0E3240
- **Background**: #FCFAF8, #F3F4F6, #FFFFFF
- **Text**: #1F2937, #1C1917, #4B5563, #78716C
- **Borders**: #D6D3D1, #D1D5DB, #E5E7EB
- **Success**: #00C950, #0D9488
- **Error**: #7F1D1D, #AD6767

#### Typography

- **Display Font**: Inter Display, Quincy CF
- **Body Font**: Inter, SF Pro
- **Font Sizes**: 12px, 14px, 16px, 19px, 23px, 32px, 34px, 40px, 44px, 52px, 72px

#### Spacing

- Consistent spacing scale: 2px, 3px, 4px, 5px, 6px, 8px, 10px, 12px, 18px, 22px, 24px, 30px, 40px, 60px

#### Border Radius

- Small: 12px, 18px
- Medium: 24px, 30px
- Large: 40px

### UX Principles

1. **Clarity**: Clear labels, instructions, and feedback
2. **Consistency**: Consistent patterns and components throughout
3. **Accessibility**: WCAG 2.1 AA compliance
4. **Feedback**: Loading states, success messages, error handling
5. **Progressive Disclosure**: Show information as needed
6. **Error Prevention**: Validation, confirmations, clear requirements

### Key UX Patterns

#### Chat Interface

- AI messages: Left-aligned, light background
- User messages: Right-aligned, dark background
- Timestamps on messages
- Auto-scroll to latest message
- Input field with send button

#### Form Design

- Clear labels
- Inline validation
- Error messages below fields
- Required field indicators
- Helpful placeholder text

#### Navigation

- Breadcrumb-style step indicators
- Back button on all pages
- Clear page titles
- Progress indicators for multi-step flows

---

## Compliance & Security

### HIPAA Compliance

#### Requirements

- **FR-COMP-1**: All PHI (Protected Health Information) must be encrypted in transit and at rest
- **FR-COMP-2**: User authentication and authorization
- **FR-COMP-3**: Audit logs for all PHI access
- **FR-COMP-4**: Business Associate Agreements (BAAs) with all third-party services
- **FR-COMP-5**: User consent and privacy policy acceptance
- **FR-COMP-6**: Secure data storage and backup
- **FR-COMP-7**: Data breach notification procedures

#### Implementation

- SSL/TLS encryption for all communications
- Encrypted database storage
- Secure API endpoints with authentication
- Session management and timeout
- Regular security audits

### Data Privacy

- **FR-PRIV-1**: User data collection transparency
- **FR-PRIV-2**: User consent for data usage
- **FR-PRIV-3**: Right to access and delete data
- **FR-PRIV-4**: Data retention policies
- **FR-PRIV-5**: Third-party data sharing disclosure

### Security Requirements

- **FR-SEC-1**: Secure authentication (password requirements, 2FA option)
- **FR-SEC-2**: Input validation and sanitization
- **FR-SEC-3**: Protection against common vulnerabilities (XSS, CSRF, SQL injection)
- **FR-SEC-4**: Regular security updates
- **FR-SEC-5**: Secure payment processing (PCI DSS compliance)

---

## Success Metrics

### Key Performance Indicators (KPIs)

#### User Acquisition

- **New user registrations per month**
- **Conversion rate from landing page to consultation**
- **User acquisition cost (CAC)**

#### Engagement

- **Daily Active Users (DAU)**
- **Monthly Active Users (MAU)**
- **Consultation completion rate**
- **Average consultations per user**

#### Business Metrics

- **Revenue per user**
- **Average consultation value**
- **Payment success rate**
- **Customer Lifetime Value (CLV)**

#### Quality Metrics

- **Doctor response time**
- **User satisfaction score (NPS)**
- **Consultation quality ratings**
- **Prescription accuracy rate**

#### Technical Metrics

- **Page load time**
- **API response time**
- **Error rate**
- **Uptime percentage (target: 99.9%)**

### Success Criteria

- **Month 1**: 1,000 registered users, 500 completed consultations
- **Month 3**: 5,000 registered users, 2,500 completed consultations, 4.5+ star rating
- **Month 6**: 15,000 registered users, 10,000 completed consultations, < 2s page load time

---

## Timeline & Milestones

### Phase 1: Foundation (Completed)

- ✅ Project setup and architecture
- ✅ Shared types and constants
- ✅ State management implementation
- ✅ Core UI components
- ✅ Basic routing structure

### Phase 2: Core Features (Completed)

- ✅ Landing page
- ✅ Symptom selection
- ✅ Medical profile creation
- ✅ Consultation type selection
- ✅ HIPAA compliance page
- ✅ Doctor matching flow
- ✅ Doctor chat interface
- ✅ Dashboard

### Phase 3: Backend Integration (In Progress)

- 🔄 API endpoint development
- 🔄 Database setup
- 🔄 Authentication implementation
- 🔄 Payment integration
- 🔄 Real-time chat implementation
- 🔄 Doctor matching algorithm

### Phase 4: Advanced Features (Planned)

- ⏳ Video/voice call integration
- ⏳ Prescription management system
- ⏳ Pharmacy integration
- ⏳ Notification system
- ⏳ Advanced analytics
- ⏳ Mobile app (future consideration)

### Phase 5: Launch Preparation (Planned)

- ⏳ Security audit
- ⏳ Performance optimization
- ⏳ User acceptance testing
- ⏳ HIPAA compliance audit
- ⏳ Marketing materials
- ⏳ Beta testing program

---

## Assumptions & Constraints

### Assumptions

1. Users have reliable internet connection
2. Users are comfortable with digital platforms
3. Doctors are available for matching within reasonable time
4. Payment processing services are available and reliable
5. Users provide accurate medical information
6. Platform operates within US healthcare regulations
7. Sufficient doctor network exists in target states

### Constraints

1. **Regulatory**: Must comply with state-specific telemedicine regulations
2. **Technical**: Limited to web platform initially (no native mobile apps)
3. **Geographic**: Currently focused on US market
4. **Medical**: Cannot treat emergency conditions or prescribe controlled substances
5. **Payment**: Must support major credit cards and digital payment methods
6. **Scalability**: Architecture must support growth from hundreds to thousands of concurrent users

### Dependencies

1. Payment processing service (Stripe, PayPal, etc.)
2. Video calling service (Twilio, Zoom, etc.)
3. HIPAA-compliant hosting infrastructure
4. Doctor network and licensing verification
5. Pharmacy integration for prescription fulfillment
6. Email/SMS service for notifications

### Risks & Mitigations

#### Risk 1: HIPAA Compliance Violations

- **Mitigation**: Regular compliance audits, legal review, security best practices

#### Risk 2: Doctor Availability

- **Mitigation**: Build sufficient doctor network, implement waitlist, set expectations

#### Risk 3: Payment Processing Issues

- **Mitigation**: Multiple payment providers, fallback options, clear error handling

#### Risk 4: Technical Scalability

- **Mitigation**: Cloud infrastructure, load testing, monitoring, auto-scaling

#### Risk 5: User Adoption

- **Mitigation**: Marketing, user education, referral programs, competitive pricing

---

## Appendix

### A. User Stories

#### Epic 1: Initial Consultation

- **As a** patient, **I want to** select my symptoms **so that** I can start a consultation
- **As a** patient, **I want to** provide my medical history via chat **so that** the doctor has context
- **As a** patient, **I want to** see my medical profile summary **so that** I can verify the information

#### Epic 2: Consultation Booking

- **As a** patient, **I want to** choose between text or video consultation **so that** I can select my preferred method
- **As a** patient, **I want to** see clear pricing **so that** I know what I'm paying
- **As a** patient, **I want to** accept HIPAA compliance **so that** I understand my privacy rights

#### Epic 3: Doctor Consultation

- **As a** patient, **I want to** be matched with a doctor quickly **so that** I can get help fast
- **As a** patient, **I want to** chat with my doctor in real-time **so that** I can communicate effectively
- **As a** patient, **I want to** receive my prescription **so that** I can get my medication

#### Epic 4: Post-Consultation

- **As a** patient, **I want to** view my consultation history **so that** I can track my health
- **As a** patient, **I want to** access my prescriptions **so that** I can manage my medications
- **As a** patient, **I want to** see pharmacy pickup information **so that** I know where to get my medication

### B. Glossary

- **PHI**: Protected Health Information
- **HIPAA**: Health Insurance Portability and Accountability Act
- **KYC**: Know Your Customer
- **Telemedicine**: Remote delivery of healthcare services
- **Consultation**: Medical appointment with healthcare provider
- **Prescription**: Written order for medication from licensed doctor

### C. References

- HIPAA Compliance Guidelines: https://www.hhs.gov/hipaa
- Telemedicine Regulations by State: [State-specific resources]
- WCAG 2.1 Accessibility Guidelines: https://www.w3.org/WAI/WCAG21/quickref/

---

**Document Status**: Active  
**Last Updated**: December 2024  
**Next Review**: [To be scheduled]  
**Approved By**: [To be assigned]
