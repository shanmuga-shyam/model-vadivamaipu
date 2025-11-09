from typing import Dict, Any
import numpy as np
from sklearn.metrics import confusion_matrix, classification_report

def evaluate_model(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, Any]:
    """Evaluate model performance with detailed metrics."""
    conf_matrix = confusion_matrix(y_true, y_pred)
    class_report = classification_report(y_true, y_pred, output_dict=True)
    
    evaluation = {
        'confusion_matrix': conf_matrix.tolist(),
        'classification_report': class_report,
    }
    
    return evaluation