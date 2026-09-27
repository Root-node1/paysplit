# PaySplit Africa

Split-pay checkout for African creative and gig agencies working with international clients.

## Problem

Creative agencies and freelancers in Africa often collaborate on projects involving multiple contributors. When a client pays:

- Payments are typically sent to a single account
- Revenue sharing is handled manually afterward
- This leads to delays, disputes, and lack of transparency
- Cross-border payments increase friction and settlement time

There is no simple way to collect one payment and automatically split it across all stakeholders.

## How It Works

- An agency creates an invoice for a client
- The client is directed to a Payaza hosted checkout
- The client completes payment
- The backend verifies the transaction using the transaction_reference
- Once verified, the invoice is marked as paid
- Payaza split_accounts distributes funds automatically to:
  - Creator(s)
  - Agency
  - Platform

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Spring Boot (Java 21)
- PostgreSQL
- Maven
- Payaza Web SDK

## Project Structure


paysplit-africa/
│
├── apps/
│ ├── frontend/ # React + Vite + Tailwind
│ └── backend/ # Spring Boot API
│
├── run.sh
├── README.md
└── DOC.md


## Setup Instructions

### Clone the repository


git clone <your-repo-url>
cd paysplit-africa


### Install frontend dependencies


cd apps/frontend
npm install


### Install backend dependencies


cd apps/backend
mvn clean install


### Environment Variables

Frontend (.env):


VITE_API_BASE_URL=http://localhost:8080
VITE_PAYAZA_MERCHANT_KEY=your_merchant_key


Backend (application.properties or .env):


PAYAZA_MERCHANT_KEY=your_merchant_key
PAYAZA_SECRET_KEY=your_secret_key
DATABASE_URL=jdbc:postgresql://localhost:5432/paysplit
DATABASE_USER=your_user
DATABASE_PASSWORD=your_password


### Run the project

From the root directory:


chmod +x run.sh
./run.sh


Expected:

- Frontend: http://localhost:5173
- Backend: http://localhost:8080

## Current Status

Built:

- Monorepo structure initialized
- Frontend scaffolded with React, TypeScript, Vite, Tailwind CSS
- Backend Spring Boot project scaffold created

Not yet built:

- Invoice creation and storage
- Payaza hosted checkout integration
- Server-side payment verification using transaction_reference
- Webhook endpoint for Payaza
- split_accounts configuration
- Creator and agency dashboards
- End-to-end payment flow

## License

MIT License. See LICENSE file for details.