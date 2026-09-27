# PaySplit Africa Technical Documentation

## Architecture Overview

The system follows a simple client-server architecture with third-party payment processing.

Components:

- Frontend (React):
  - Handles invoice creation UI
  - Initiates Payaza checkout
  - Displays payment status

- Backend (Spring Boot):
  - Manages invoices and transaction records
  - Verifies payments server-side
  - Handles webhook events from Payaza

- Database (PostgreSQL):
  - Stores invoices, splits, and transaction records

- Payaza:
  - Provides hosted checkout
  - Processes payments
  - Handles split_accounts distribution
  - Sends webhook notifications

High-level flow:

1. Frontend creates invoice via backend
2. Frontend initializes Payaza checkout
3. Client pays via Payaza hosted page
4. Backend verifies payment using transaction_reference
5. Payaza distributes funds via split_accounts
6. Backend updates invoice status

## Data Model

Conceptual models (not full schema):

### Invoice

- id
- client_name
- client_email
- amount
- currency
- status (pending, paid, failed)
- transaction_reference
- created_at
- updated_at

### Split Account

- id
- invoice_id
- recipient_type (creator, agency, platform)
- account_identifier (Payaza account reference)
- percentage or fixed_amount

### Transaction Record

- id
- invoice_id
- transaction_reference
- payment_status
- amount_paid
- currency
- raw_response (JSON from Payaza)
- verified (boolean)
- created_at

## Payment Flow (Detailed)

1. Invoice Creation
   - Agency creates an invoice via frontend
   - Frontend sends invoice data to backend
   - Backend stores invoice with status = pending
   - Backend generates a unique transaction_reference

2. Checkout Initialization
   - Frontend requests checkout details from backend
   - Backend returns:
     - transaction_reference
     - amount
     - currency
     - split_accounts configuration

3. Payaza Hosted Checkout
   - Frontend initializes Payaza Web SDK with:
     - merchant_key
     - checkout_amount
     - currency_code
     - transaction_reference
     - split_accounts
   - Client is redirected or shown hosted payment UI

4. Payment Completion
   - Client completes payment on Payaza
   - Payaza processes transaction

5. Webhook Notification
   - Payaza sends webhook to backend endpoint
   - Backend receives transaction data

6. Server-side Verification
   - Backend calls Payaza verification endpoint using transaction_reference
   - Confirms:
     - payment success
     - correct amount
     - correct currency

7. Invoice Update
   - If verification succeeds:
     - invoice status set to paid
     - transaction record stored with verified = true
   - If verification fails:
     - invoice remains pending or marked failed

8. Fund Distribution
   - Payaza automatically distributes funds using split_accounts:
     - creator(s)
     - agency
     - platform

## Payaza Integration Details

Fields used:

- merchant_key
- checkout_amount
- currency_code
- transaction_reference
- split_accounts

split_accounts structure:

- List of recipient accounts
- Each entry includes:
  - account reference
  - percentage or amount

Verification:

- Backend uses transaction_reference to query Payaza
- Webhook used for asynchronous confirmation
- Both webhook and direct verification are required for trust

## Current Implementation Status

Real / Working:

- Repository structure defined
- Frontend initialized with React, Vite, TypeScript, Tailwind
- Backend Spring Boot project scaffold created

Stubbed / Not Yet Implemented:

- Invoice persistence and APIs
- Payaza Web SDK integration in frontend
- split_accounts configuration logic
- Webhook endpoint and signature validation
- Server-side transaction verification
- Database schema and migrations
- Full end-to-end payment flow

## Known Limitations

- No real payment flow implemented yet
- No database schema enforced
- No authentication or role separation (agency vs creator)
- No error handling or retry logic for failed verifications
- No UI for managing splits or viewing payouts

## Next Steps

- Implement invoice API and persistence layer
- Integrate Payaza Web SDK in frontend
- Build backend verification service using transaction_reference
- Implement webhook endpoint with validation
- Define and store split_accounts per invoice
- Add dashboards for:
  - Agencies (invoice tracking)
  - Creators (earnings visibility)
- Add authentication and role-based access control
- Add logging and audit trail for transactions