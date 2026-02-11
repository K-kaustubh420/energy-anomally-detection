# Energy Anomaly Detection

## Overview

This project is a full-stack application designed to detect anomalies in energy consumption data using machine learning. It analyzes real-time or windowed energy readings to identify irregularities such as spikes, hardware failures, or unusual usage patterns.

The system consists of:

- **Backend**: A Python/FastAPI server running a Scikit-learn model (`model.pkl`) for inference.
- **Frontend**: A Next.js web application for visualizing energy metrics and anomaly alerts.

## Prerequisites

- **Node.js** (v18+ recommended)
- **Python** (v3.9+ recommended)

## Setup & Run Instructions

### 1. Backend (Python/FastAPI)

1.  Navigate to the `backend` directory:

    ```bash
    cd backend
    ```

2.  Create and activate a virtual environment (optional but recommended):

    ```bash
    # Windows
    python -m venv venv
    .\venv\Scripts\activate

    # macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  Install dependencies:

    ```bash
    pip install -r requirements.txt
    # If not included in requirements.txt, install server dependencies manually:
    pip install fastapi uvicorn
    ```

4.  Start the backend server:

    ```bash
    uvicorn app.main:app --reload
    ```

    - The API will run at: `http://localhost:8000`
    - Interactive API Docs: `http://localhost:8000/docs`

### 2. Frontend (Next.js)

1.  Open a new terminal and navigate to the `frontend` directory:

    ```bash
    cd frontend
    ```

2.  Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3.  Run the development server:

    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Key Features

- **Real-time Anomaly Detection**: Submit energy readings to check for immediate anomalies.
- **Window Analysis**: Analyze a time-window of data (e.g., 30-60 seconds) to detect sustained issues like "Critical Sustained Anomaly" or "Unstable Load Pattern".
- **Diagnostic Insights**: Provides human-readable diagnostics and recommendations based on the anomaly ratio.
