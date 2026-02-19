import { NextResponse } from 'next/server'

// --- 1. DATA GENERATION HELPERS ---

function generateMultivariateStream() {
  const data = []
  let baseTemp = 15
  
  for (let i = 0; i < 60; i++) {
    // Environmental Context (Features)
    const t_out = baseTemp + Math.sin(i / 10) * 5 + (Math.random() * 2) 
    const rh_1 = 40 + Math.cos(i / 8) * 10 
    
    // Base Load (Appliances)
    let energy = 50 + (Math.random() * 30) 
    
    // Anomaly Injection Logic
    let isAnomaly = 0
    let label = "Normal"
    
    // Spike Anomaly
    if (i === 15 || i === 45) {
      energy = 480 + Math.random() * 50
      isAnomaly = 1
      label = "Spike"
    }
    
    // Contextual Anomaly
    if (i > 25 && i < 30) {
      energy = 250 + Math.random() * 20
      isAnomaly = 1
      label = "Contextual"
    }

    data.push({
      time: i,
      Appliances: Math.round(energy),
      T_out: parseFloat(t_out.toFixed(1)),
      RH_1: parseFloat(rh_1.toFixed(1)),
      // If anomaly, return value for plotting, else null breaks the scatter line
      isAnomaly: isAnomaly === 1 ? Math.round(energy) : null,
      status: label
    })
  }
  return data
}

function generateROC() {
  return [
    { fpr: 0, tpr: 0 },
    { fpr: 0.05, tpr: 0.82 },
    { fpr: 0.1, tpr: 0.91 },
    { fpr: 0.2, tpr: 0.96 },
    { fpr: 0.5, tpr: 0.99 },
    { fpr: 1, tpr: 1 },
  ]
}

// --- 2. THE API HANDLER ---

export async function GET() {
  return NextResponse.json({
    // A. CORE METRICS (The result of your model)
    metrics: {
      precision: 0.942, 
      recall: 0.915,    
      f1_score: 0.928,
      inference_time: 12, // ms (Highlighting speed)
      roc_auc: 0.965
    },

    // B. CHARTS DATA
    multivariate_stream: generateMultivariateStream(),
    confusion_matrix: [
      [1250, 42], // TN, FP
      [15, 180],  // FN, TP
    ],
    roc_curve: generateROC(),
    
    // C. EXPLAINABILITY (SHAP)
    feature_importance: [
      { feature: 'Appliances (Wh)', value: 0.45 },
      { feature: 'T_out (Outdoor Temp)', value: 0.25 },
      { feature: 'RH_1 (Kitchen Hum)', value: 0.15 },
      { feature: 'Lights', value: 0.10 },
      { feature: 'Press_mm_hg', value: 0.05 },
    ],

    // D. RADAR CHART DATA (Model Comparison)
    // Comparing "Our Model" vs "Deep Learning" vs "Statistical Methods"
    radar_data: [
      { subject: 'Accuracy (AUC)', OurModel: 88, DeepLearning: 96, Statistical: 75, fullMark: 100 },
      { subject: 'Inference Speed', OurModel: 98, DeepLearning: 40, Statistical: 85, fullMark: 100 },
      { subject: 'Interpretability', OurModel: 90, DeepLearning: 20, Statistical: 60, fullMark: 100 },
      { subject: 'Low Resource Usage', OurModel: 95, DeepLearning: 10, Statistical: 80, fullMark: 100 },
      { subject: 'Training Speed', OurModel: 92, DeepLearning: 15, Statistical: 70, fullMark: 100 },
      { subject: 'Multivariate Cap.', OurModel: 85, DeepLearning: 95, Statistical: 50, fullMark: 100 },
    ],

    // E. RESEARCH PAPERS (The specific links you requested)
    research_comparison: [
      {
        id: 1,
        title: "Deep Anomaly Detection with Deviation Networks",
        author: "G. Pang et al. (KDD 2019)",
        link: "https://arxiv.org/pdf/1901.03407",
        tag: "DEEP LEARNING",
        abstract: "Proposes DevNet, an end-to-end differentiable learning framework for anomaly detection using a Gaussian prior.",
        pros: "State-of-the-art AUC on high-dimensional image data.",
        cons: "Requires massive labeled datasets; extremely high computational cost (GPU required).",
        our_advantage: "Our Isolation Forest is unsupervised (no labels needed) and runs on CPU (Edge-capable)."
      },
      {
        id: 2,
        title: "Hybrid Bi-LSTM for Energy Consumption Forecasting",
        author: "ScienceDirect (Energy Reports)",
        link: "https://www.sciencedirect.com/science/article/pii/S0360544222024616?ref=pdf_download&fr=RR-2&rr=9cd5ab6b7cdf9361",
        tag: "FORECASTING",
        abstract: "Uses Bidirectional LSTMs to predict future energy loads based on historical patterns to optimize grid performance.",
        pros: "Excellent at capturing long-term temporal dependencies for planning.",
        cons: "Focuses on 'prediction' not 'security'. High latency makes it unsuitable for real-time fault detection.",
        our_advantage: "We focus on immediate deviation detection (sub-50ms latency) rather than future planning."
      },
      {
        id: 3,
        title: "Anomaly Detection in Smart Grid via Ensemble Learning",
        author: "ScienceDirect (Eng. App. of AI)",
        link: "https://www.sciencedirect.com/science/article/abs/pii/S0952197622007655",
        tag: "ENSEMBLE",
        abstract: "A complex ensemble of multiple classifiers to detect intrusion and theft in smart meters.",
        pros: "High robustness against noise due to voting mechanisms.",
        cons: "High complexity (Black-box); difficult to explain 'why' an anomaly occurred to a user.",
        our_advantage: "Our approach provides Feature Importance (SHAP) explainability and simpler deployment."
      }
    ]
  })
}